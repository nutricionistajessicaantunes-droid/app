import { getLesson } from '../content/curso';
import type { Bristol, DayKey, DayRecord, LessonProgress } from '../types';
import { addDays, daysBetween, diffDays } from './dates';
import { habitStat, type ActiveHabit, type HabitStat } from './habits';
import { bristolModes } from './bristol';
import { bristolOf, indexByDate, isRegistered } from './records';
import { foodsBeforeSymptoms } from './suspects';
import { joinPt } from './format';

/** Tarefas das aulas (seção 6.6). */

/** Campos diários das tarefas, guardados em DayRecord.taskFields. */
export const TASK_FIELD = {
  sono: 'a1_sono',
  estresse: 'a1_estresse',
  comi: 'a1_comi',
  sentei: 'a2_sentei',
  fibra: 'a4_fibra',
  teveSintoma: 'a8_sintoma',
  comiAntes: 'a8_comi',
  prebiotico: 'a11_prebiotico',
  fermentado: 'a11_fermentado',
} as const;
export type TaskFieldKey = (typeof TASK_FIELD)[keyof typeof TASK_FIELD];

export function fieldNumber(r: DayRecord | undefined, key: TaskFieldKey): number | undefined {
  const v = r?.taskFields?.[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

export function fieldText(r: DayRecord | undefined, key: TaskFieldKey): string | undefined {
  const v = r?.taskFields?.[key];
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;
}

export function fieldBool(r: DayRecord | undefined, key: TaskFieldKey): boolean | undefined {
  const v = r?.taskFields?.[key];
  return typeof v === 'boolean' ? v : undefined;
}

/** Duração em dias, só para as tarefas com prazo. */
export function taskDays(lessonId: number): number | undefined {
  const d = getLesson(lessonId)?.task.durationDays;
  return typeof d === 'number' ? d : undefined;
}

export interface TaskWindow {
  start: DayKey;
  end: DayKey;
  days: number;
}

export function taskWindow(p: LessonProgress | undefined): TaskWindow | undefined {
  if (!p?.task.startDate) return undefined;
  const days = taskDays(p.lessonId);
  if (days === undefined) return undefined;
  return { start: p.task.startDate, end: addDays(p.task.startDate, days - 1), days };
}

/** Tarefa em andamento e o dia dentro do prazo (os campos aparecem no Registro). */
export function isTaskActiveOn(p: LessonProgress | undefined, day: DayKey): boolean {
  if (p?.task.status !== 'em_andamento') return false;
  const w = taskWindow(p);
  return w !== undefined && day >= w.start && day <= w.end;
}

/** O prazo terminou e a tarefa ainda não foi concluída: hora de ver o resultado. */
export function isTaskResultReady(p: LessonProgress | undefined, today: DayKey): boolean {
  if (p?.task.status !== 'em_andamento') return false;
  const w = taskWindow(p);
  return w !== undefined && today > w.end;
}

/** "Dia 2 de 7". */
export function taskProgress(
  p: LessonProgress | undefined,
  today: DayKey,
): { day: number; total: number } | undefined {
  const w = taskWindow(p);
  if (!w) return undefined;
  return { day: Math.min(w.days, Math.max(1, diffDays(today, w.start) + 1)), total: w.days };
}

/** Aulas com campos diários ativos no dia, em ordem. */
export function dailyTaskIds(lessons: LessonProgress[], day: DayKey): number[] {
  return lessons
    .filter((p) => getLesson(p.lessonId)?.task.hasDailyFields && isTaskActiveOn(p, day))
    .map((p) => p.lessonId)
    .sort((a, b) => a - b);
}

/** Outra tarefa de vários dias em andamento hoje (aviso de "duas coisas novas por vez"). */
export function otherRunningTask(
  lessons: LessonProgress[],
  lessonId: number,
  today: DayKey,
): number | undefined {
  return lessons.find((p) => p.lessonId !== lessonId && isTaskActiveOn(p, today))?.lessonId;
}

/** Hábitos criados por uma tarefa ficam ativos só no prazo dela. */
export function taskHabitId(lessonId: number, start: DayKey, i: number): string {
  return `aula${lessonId}-${start}-${i + 1}`;
}

// Resultados -----------------------------------------------------------------

export interface Aula1Day {
  date: DayKey;
  registered: boolean;
  evacuated?: boolean;
  bristol?: Bristol;
  sleep?: number;
  stress?: number;
  water?: number;
  food?: string;
}

export function aula1Days(records: DayRecord[], w: TaskWindow): Aula1Day[] {
  const map = indexByDate(records);
  return daysBetween(w.start, w.end).map((date) => {
    const r = map.get(date);
    return {
      date,
      registered: isRegistered(r),
      evacuated: r?.evacuated,
      bristol: bristolOf(r),
      sleep: fieldNumber(r, TASK_FIELD.sono),
      stress: fieldNumber(r, TASK_FIELD.estresse),
      water: r?.waterCups,
      food: fieldText(r, TASK_FIELD.comi),
    };
  });
}

/** O que se repetiu nos 3 dias (aparece em pelo menos 2). */
export function aula1Highlights(days: Aula1Day[]): string[] {
  const out: string[] = [];
  const count = (pred: (d: Aula1Day) => boolean) => days.filter(pred).length;
  const sono = count((d) => d.sleep !== undefined && d.sleep < 6);
  if (sono >= 2) out.push(`Sono abaixo de 6 horas em ${sono} dias.`);
  const estresse = count((d) => d.stress !== undefined && d.stress >= 7);
  if (estresse >= 2) out.push(`Estresse 7 ou mais em ${estresse} dias.`);
  const semEvacuar = count((d) => d.evacuated === false);
  if (semEvacuar >= 2) out.push(`${semEvacuar} dias sem evacuar.`);
  const tipos = new Map<Bristol, number>();
  for (const d of days) if (d.bristol) tipos.set(d.bristol, (tipos.get(d.bristol) ?? 0) + 1);
  const [tipo, vezes] = [...tipos.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0] ?? [];
  if (tipo && vezes && vezes >= 2) out.push(`Fezes do tipo ${tipo} em ${vezes} dias.`);
  const comidas = foodsBeforeSymptoms(
    days.map((d) => ({ date: d.date, symptom: true, text: d.food })),
  );
  if (comidas.length > 0)
    out.push(
      `No que você comeu, apareceu em mais de um dia: ${joinPt(comidas.map((c) => c.label))}.`,
    );
  return out;
}

export interface Aula2Result {
  total: number;
  satDays: number;
  evacuatedDays: number;
  types: Bristol[];
}

export function aula2Result(records: DayRecord[], w: TaskWindow): Aula2Result {
  const map = indexByDate(records);
  const out: Aula2Result = { total: w.days, satDays: 0, evacuatedDays: 0, types: [] };
  for (const d of daysBetween(w.start, w.end)) {
    const r = map.get(d);
    if (fieldBool(r, TASK_FIELD.sentei) === true) out.satDays++;
    if (r?.evacuated === true) out.evacuatedDays++;
    const t = bristolOf(r);
    if (t !== undefined) out.types.push(t);
  }
  return out;
}

export interface FiberDays {
  fiber: string;
  days: number;
  types: Bristol[];
}

/** Para cada fibra escolhida, os tipos de Bristol dos dias em que ela entrou (aula 4). */
export function aula4Result(records: DayRecord[], w: TaskWindow, fibers: string[]): FiberDays[] {
  const map = indexByDate(records);
  return fibers.map((fiber) => {
    const res: FiberDays = { fiber, days: 0, types: [] };
    for (const d of daysBetween(w.start, w.end)) {
      const r = map.get(d);
      if (fieldText(r, TASK_FIELD.fibra) !== fiber) continue;
      res.days++;
      const t = bristolOf(r);
      if (t !== undefined) res.types.push(t);
    }
    return res;
  });
}

export interface HabitsResult {
  modes: Bristol[];
  stats: HabitStat[];
  /** A que teve mais dias (aula 5: "a mudança mais fácil de manter"). */
  easiest?: HabitStat;
}

export function habitsTaskResult(
  records: DayRecord[],
  w: TaskWindow,
  habits: ActiveHabit[],
): HabitsResult {
  const map = indexByDate(records);
  const types = daysBetween(w.start, w.end)
    .map((d) => bristolOf(map.get(d)))
    .filter((t): t is Bristol => t !== undefined);
  const stats = habits.map((h) => habitStat(records, h, w.start, w.end));
  const easiest = [...stats].sort((a, b) => b.done - a.done)[0];
  return {
    modes: bristolModes(types),
    stats,
    easiest: easiest && easiest.done > 0 ? easiest : undefined,
  };
}

/** Aula 8: "O que comi antes" nos dias com sintoma. */
export function aula8Foods(records: DayRecord[], w: TaskWindow) {
  const map = indexByDate(records);
  return foodsBeforeSymptoms(
    daysBetween(w.start, w.end).map((date) => {
      const r = map.get(date);
      return {
        date,
        symptom: fieldBool(r, TASK_FIELD.teveSintoma) === true,
        text: fieldText(r, TASK_FIELD.comiAntes),
      };
    }),
  );
}

export interface Aula11Day {
  date: DayKey;
  gases?: number;
  estufamento?: number;
  prebiotico?: string;
  fermentado?: string;
}

export function aula11Days(records: DayRecord[], w: TaskWindow): Aula11Day[] {
  const map = indexByDate(records);
  return daysBetween(w.start, w.end).map((date) => {
    const r = map.get(date);
    return {
      date,
      gases: r?.symptoms?.gases,
      estufamento: r?.symptoms?.estufamento,
      prebiotico: fieldText(r, TASK_FIELD.prebiotico),
      fermentado: fieldText(r, TASK_FIELD.fermentado),
    };
  });
}

/** Combinações usadas na aula 11, com o número de dias. */
export function aula11Combinations(days: Aula11Day[]): { label: string; days: number }[] {
  const counts = new Map<string, number>();
  for (const d of days) {
    const parts = [d.prebiotico, d.fermentado].filter((x): x is string => Boolean(x));
    if (parts.length === 0) continue;
    const label = parts.join(' + ');
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, n]) => ({ label, days: n }))
    .sort((a, b) => b.days - a.days || a.label.localeCompare(b.label, 'pt-BR'));
}
