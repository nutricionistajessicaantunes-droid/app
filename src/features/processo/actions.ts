import { getDb } from '../../db/index';
import { nowIso, saveCrisis, saveLesson, savePlan, saveProfile, setDismissed } from '../../db/repo';
import { automaticNotices } from '../../logic/checks';
import { crisisPatchForRecord, startCrisis } from '../../logic/crisis';
import { addDays, toDayKey } from '../../logic/dates';
import { reviewKey } from '../../logic/monthly';
import { blockIndexOn, createBlocks, repeatBlock } from '../../logic/plan';
import { planPatchForDecision, readingId, type ReadingPeriod } from '../../logic/readings';
import { taskDays, taskHabitId } from '../../logic/tasks';
import type { WeekSummary } from '../../logic/week';
import type {
  DayKey,
  Habit,
  HabitSource,
  LessonProgress,
  Scenario,
  WeeklyReading,
} from '../../types';

/**
 * Ações da Fase 2 (plano, tarefas, leitura da semana, reavaliação, modo crise).
 * Tudo grava direto no IndexedDB; as telas reagem pelo useLiveQuery.
 */

export interface HabitChoice {
  label: string;
  isWater?: boolean;
  trigger?: string;
  whereWritten?: string;
}

const TASK_SOURCE: Record<number, HabitSource> = { 5: 'aula5', 8: 'aula8', 13: 'aula13' };

// Verificações automáticas ---------------------------------------------------

/** Roda ao abrir o app e depois de "Pronto" no registro (seção 7.13). */
export async function runAutomaticChecks(today: DayKey = toDayKey(new Date())): Promise<void> {
  const db = getDb();
  const [records, profile, plan, notices, crisis] = await Promise.all([
    db.days.where('date').between(addDays(today, -60), today, true, true).toArray(),
    db.profile.get('me'),
    db.plan.get('plan'),
    db.notices.toArray(),
    db.crisis.get('crisis'),
  ]);
  if (!profile) return;
  const drafts = automaticNotices({ records, today, profile, plan, notices });
  for (const d of drafts) await db.notices.put({ ...d, updatedAt: nowIso() });
  // Modo crise: melhora e recaída a partir dos registros desde o início.
  if (crisis?.active && crisis.startedAt) {
    let state = crisis;
    let changed = false;
    for (const r of records.filter((x) => x.date >= (crisis.startedAt as DayKey))) {
      const patch = crisisPatchForRecord(state, r);
      if (patch) {
        state = { ...state, ...patch };
        changed = true;
      }
    }
    if (changed) await saveCrisis(state);
  }
}

// Plano de 21 dias -------------------------------------------------------------

export async function openSemanaZero(): Promise<void> {
  const plan = await getDb().plan.get('plan');
  if (!plan || plan.status === 'nao_iniciado') await savePlan({ status: 'semana_zero' });
  await saveLesson(15, (c) =>
    c.task.status === 'nao_iniciada' ? { ...c, task: { ...c.task, status: 'em_andamento' } } : c,
  );
}

export async function setSemanaZeroItem(id: string, done: boolean): Promise<void> {
  const plan = await getDb().plan.get('plan');
  await savePlan({ semanaZero: { ...(plan?.semanaZero ?? {}), [id]: done } });
}

export async function startPlan(day1: DayKey): Promise<void> {
  await savePlan({ status: 'ativo', day1, blocks: createBlocks(day1), seenNotes: [] });
  await saveLesson(15, (c) => ({
    ...c,
    task: { ...c.task, status: 'concluida', completedAt: nowIso() },
  }));
}

export async function markNoteSeen(id: string): Promise<void> {
  const plan = await getDb().plan.get('plan');
  const seen = new Set(plan?.seenNotes ?? []);
  seen.add(id);
  await savePlan({ seenNotes: [...seen] });
}

/** "Repetir esta semana", depois de 5 dias sem registro. */
export async function repeatCurrentWeek(today: DayKey): Promise<void> {
  const plan = await getDb().plan.get('plan');
  if (!plan) return;
  const idx = blockIndexOn(plan.blocks, today);
  if (idx >= 0) await savePlan({ blocks: repeatBlock(plan.blocks, idx) });
}

// Leitura da semana ------------------------------------------------------------

export interface ReadingAnswers {
  commonNotes: string;
  keep: string;
  adjust: string;
  decision?: 'avancar' | 'repetir';
}

export async function saveReading(
  period: ReadingPeriod,
  computed: WeekSummary,
  answers: ReadingAnswers,
): Promise<void> {
  const db = getDb();
  const id = readingId(period);
  const previous = await db.readings.get(id);
  const now = nowIso();
  const reading: WeeklyReading = {
    id,
    start: period.start,
    end: period.end,
    context: period.context,
    planBlockIndex: period.planBlockIndex,
    computed,
    ...answers,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
  await db.readings.put(reading);
  const plan = await db.plan.get('plan');
  if (plan && answers.decision === 'repetir' && previous?.decision !== 'repetir') {
    const patch = planPatchForDecision(plan, period, 'repetir');
    if (patch) await savePlan(patch);
  }
  // Aula 16: conclui com a primeira leitura salva.
  await saveLesson(16, (c) =>
    c.task.status === 'em_andamento'
      ? { ...c, task: { ...c.task, status: 'concluida', completedAt: now } }
      : c,
  );
}

// Reavaliação, plano mínimo, revisão do mês e novo ciclo -----------------------

export async function concludeReevaluation(
  today: DayKey,
  suggested: Scenario,
  chosen: Scenario,
): Promise<void> {
  const now = nowIso();
  await savePlan({
    status: 'concluido',
    concludedOn: today,
    reevaluation: { computedAt: now, suggested, chosen, completedAt: now },
  });
  await saveLesson(17, (c) => ({
    ...c,
    task: { ...c.task, status: 'concluida', completedAt: now },
  }));
  await runAutomaticChecks(today);
}

async function replaceHabits(
  source: HabitSource,
  choices: HabitChoice[],
  from: DayKey,
  idPrefix: string,
): Promise<string[]> {
  const db = getDb();
  const now = nowIso();
  const yesterday = addDays(from, -1);
  await db.transaction('rw', db.habits, async () => {
    for (const h of await db.habits.where('source').equals(source).toArray()) {
      if (h.activeTo !== undefined && h.activeTo < from) continue;
      if (h.activeFrom >= from) await db.habits.delete(h.id);
      else await db.habits.put({ ...h, activeTo: yesterday, updatedAt: now });
    }
  });
  const ids: string[] = [];
  for (const [i, c] of choices.entries()) {
    const id = `${idPrefix}-${from}-${i + 1}`;
    ids.push(id);
    await db.habits.put({
      id,
      label: c.label,
      source,
      activeFrom: from,
      isWater: c.isWater,
      trigger: c.trigger,
      createdAt: now,
      updatedAt: now,
    });
  }
  return ids;
}

export async function saveMinimumPlan(
  today: DayKey,
  choices: HabitChoice[],
  reviewDay: number | undefined,
): Promise<void> {
  const ids = await replaceHabits('plano_minimo', choices, today, 'minimo');
  await savePlan({ minimumPlan: ids });
  await saveProfile({ monthlyReviewDay: reviewDay });
}

export async function completeMonthlyReview(today: DayKey): Promise<void> {
  await setDismissed(reviewKey(today), nowIso());
}

/** Novo ciclo: no máximo dois hábitos novos, com blocos de 7 dias e leitura da semana. */
export async function startCycle(today: DayKey, choices: HabitChoice[]): Promise<void> {
  const db = getDb();
  const now = nowIso();
  const ids: string[] = [];
  for (const [i, c] of choices.slice(0, 2).entries()) {
    const id = `ciclo-${today}-${i + 1}`;
    ids.push(id);
    await db.habits.put({
      id,
      label: c.label,
      source: 'ciclo',
      activeFrom: today,
      isWater: c.isWater,
      trigger: c.trigger,
      createdAt: now,
      updatedAt: now,
    });
  }
  const plan = await db.plan.get('plan');
  await savePlan({ cycles: [...(plan?.cycles ?? []), { start: today, habitIds: ids, weeks: 1 }] });
}

// Tarefas das aulas ------------------------------------------------------------

async function createTaskHabits(lessonId: number, start: DayKey, choices: HabitChoice[]) {
  const source = TASK_SOURCE[lessonId];
  const days = taskDays(lessonId);
  if (!source || !days) return;
  const now = nowIso();
  const end = addDays(start, days - 1);
  await getDb().habits.bulkPut(
    choices.map((c, i): Habit => ({
      id: taskHabitId(lessonId, start, i),
      label: c.label,
      source,
      activeFrom: start,
      activeTo: end,
      isWater: c.isWater,
      trigger: c.trigger,
      whereWritten: c.whereWritten,
      createdAt: now,
      updatedAt: now,
    })),
  );
}

/** Encerra os hábitos da tarefa a partir de `from` (pausa). */
async function stopTaskHabits(lessonId: number, from: DayKey) {
  const source = TASK_SOURCE[lessonId];
  if (!source) return;
  const db = getDb();
  const now = nowIso();
  for (const h of await db.habits.where('source').equals(source).toArray()) {
    if (h.activeTo !== undefined && h.activeTo < from) continue;
    if (h.activeFrom >= from) await db.habits.delete(h.id);
    else await db.habits.put({ ...h, activeTo: addDays(from, -1), updatedAt: now });
  }
}

export async function startTask(
  lessonId: number,
  today: DayKey,
  data: Record<string, unknown> = {},
  habits: HabitChoice[] = [],
): Promise<void> {
  await saveLesson(lessonId, (c) => ({
    ...c,
    watched: true,
    watchedAt: c.watchedAt ?? nowIso(),
    task: {
      ...c.task,
      status: 'em_andamento',
      startDate: today,
      data: { ...c.task.data, ...data, habits, dispensada: undefined },
    },
  }));
  await createTaskHabits(lessonId, today, habits);
}

export async function pauseTask(lessonId: number, today: DayKey): Promise<void> {
  await saveLesson(lessonId, (c) => ({ ...c, task: { ...c.task, status: 'pausada' } }));
  await stopTaskHabits(lessonId, today);
}

/** Retomar recomeça a contagem hoje, com a mesma configuração. */
export async function resumeTask(p: LessonProgress, today: DayKey): Promise<void> {
  const habits = (p.task.data.habits as HabitChoice[] | undefined) ?? [];
  await startTask(p.lessonId, today, {}, habits);
}

export async function setTaskData(lessonId: number, patch: Record<string, unknown>): Promise<void> {
  await saveLesson(lessonId, (c) => ({
    ...c,
    task: {
      ...c.task,
      status: c.task.status === 'nao_iniciada' ? 'em_andamento' : c.task.status,
      data: { ...c.task.data, ...patch },
    },
  }));
}

export async function concludeTask(
  lessonId: number,
  patch: Record<string, unknown> = {},
): Promise<void> {
  await saveLesson(lessonId, (c) => ({
    ...c,
    task: {
      ...c.task,
      status: 'concluida',
      completedAt: nowIso(),
      data: { ...c.task.data, ...patch },
    },
  }));
}

/** Volta a tarefa para "não iniciada" (para refazer). */
export async function resetTask(lessonId: number, today: DayKey): Promise<void> {
  await stopTaskHabits(lessonId, today);
  await saveLesson(lessonId, (c) => ({ ...c, task: { status: 'nao_iniciada', data: {} } }));
}

/** "Ir para a próxima aula": o próximo passo deixa de sugerir esta tarefa. */
export async function skipTaskSuggestion(lessonId: number): Promise<void> {
  await saveLesson(lessonId, (c) => ({
    ...c,
    task: { ...c.task, data: { ...c.task.data, dispensada: true } },
  }));
}

// Modo crise -------------------------------------------------------------------

export async function turnOnCrisis(today: DayKey): Promise<void> {
  await getDb().crisis.put(startCrisis(today, nowIso()));
}

export async function markImproved(today: DayKey): Promise<void> {
  const c = await getDb().crisis.get('crisis');
  if (c?.active && !c.improvedAt) await saveCrisis({ improvedAt: today });
}

export async function endCrisis(): Promise<void> {
  await saveCrisis({ active: false });
}

export async function snoozeCrisisSuggestion(today: DayKey): Promise<void> {
  await setDismissed('crise_sugestao', addDays(today, 3));
}

// Diário de sintomas (aula 7) --------------------------------------------------

export async function addDiaryEntry(
  entry: Omit<import('../../types').DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<void> {
  const now = nowIso();
  await getDb().diary.put({
    ...entry,
    id: `${entry.date}-${entry.time}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  });
}

export async function deleteDiaryEntry(id: string): Promise<void> {
  await getDb().diary.delete(id);
}
