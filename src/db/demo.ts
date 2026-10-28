import { DEFAULT_SYMPTOMS_BY_PATH } from '../content/registro';
import { allHabits } from '../logic/activeHabits';
import { addDays, diffDays, toDayKey } from '../logic/dates';
import { createBlocks, blockEnd } from '../logic/plan';
import { summarizeWeek } from '../logic/week';
import { waterGoal } from '../logic/water';
import type {
  Bristol,
  DayKey,
  DayRecord,
  Habit,
  LessonProgress,
  PlanState,
  Profile,
  TagId,
  WeeklyReading,
} from '../types';
import type { DemoScenario } from './index';
import type { AppDB } from './schema';
import { CURRENT_SCHEMA_VERSION } from './schema';

/**
 * Modo demonstração (seção 3.3): dados realistas num banco separado (modulacao-demo),
 * para mostrar o app e conferir os resultados. Nunca mistura com os dados reais.
 *
 * Cenários:
 * - 'completo' (?demo=1): 24 dias, plano de 21 dias concluído, leituras, uma tarefa
 *   concluída e a reavaliação.
 * - 'plano' (?demo=plano): plano em andamento, na semana 3.
 */

/** Gerador pseudoaleatório com semente, para os dados serem sempre os mesmos. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAMP = (day: DayKey, h = 21) =>
  new Date(`${day}T${String(h).padStart(2, '0')}:30:00`).toISOString();

interface PhaseShape {
  bristol: Bristol[];
  evacChance: number;
  symptom: [number, number];
  energy: [number, number];
  habitChance: number;
}

/** Como uma aluna com intestino preso costuma evoluir nas três semanas. */
const FASES: PhaseShape[] = [
  {
    bristol: [2, 2, 2, 1, 3, 2, 3],
    evacChance: 0.62,
    symptom: [4, 7],
    energy: [3, 5],
    habitChance: 0.78,
  },
  {
    bristol: [3, 3, 2, 3, 4, 3, 4],
    evacChance: 0.8,
    symptom: [3, 5],
    energy: [4, 6],
    habitChance: 0.76,
  },
  {
    bristol: [4, 4, 3, 4, 4, 5, 4],
    evacChance: 0.95,
    symptom: [1, 3],
    energy: [6, 8],
    habitChance: 0.82,
  },
];

function between(r: () => number, [lo, hi]: [number, number]): number {
  return Math.round(lo + r() * (hi - lo));
}

function makeDay(
  r: () => number,
  day: DayKey,
  phase: PhaseShape,
  habitIds: string[],
  index: number,
): DayRecord {
  const tags: TagId[] = [];
  if (r() < 0.18) tags.push('dormi_mal');
  if (r() < 0.15) tags.push('comi_correndo');
  if (r() < 0.12) tags.push('estresse_alto');
  if (r() < 0.2) tags.push('treinei');
  if (r() < 0.1) tags.push('dia_corrido');
  const evacuated = r() < phase.evacChance;
  const base = between(r, phase.symptom);
  const habits: Record<string, boolean> = {};
  for (const id of habitIds) habits[id] = r() < phase.habitChance;
  const rec: DayRecord = {
    date: day,
    evacuated,
    symptoms: {
      estufamento: Math.min(10, base + (tags.includes('comi_correndo') ? 2 : 0)),
      gases: Math.max(0, base - 1 - Math.round(r())),
      dor: Math.max(0, base - 2 - Math.round(r() * 2)),
    },
    energy: Math.max(
      0,
      Math.min(10, between(r, phase.energy) - (tags.includes('dormi_mal') ? 1 : 0)),
    ),
    habits,
    waterCups: habits.p1 ? 8 : Math.round(3 + r() * 4),
    tags,
    createdAt: STAMP(day),
    updatedAt: STAMP(day),
  };
  if (evacuated) {
    rec.evacuationCount = r() < 0.15 ? 2 : 1;
    rec.bristol = phase.bristol[index % phase.bristol.length] as Bristol;
    if ((rec.bristol ?? 4) <= 2 && r() < 0.7) rec.effort = true;
    if ((rec.bristol ?? 4) <= 2 && r() < 0.5) rec.incomplete = true;
  }
  if (index % 6 === 2) rec.note = 'Almocei correndo no trabalho.';
  return rec;
}

export async function seedDemo(
  db: AppDB,
  scenario: DemoScenario,
  today: DayKey = toDayKey(new Date()),
) {
  const r = random(21581);
  const now = new Date().toISOString();
  const completo = scenario === 'completo';
  const day1 = addDays(today, completo ? -23 : -16);
  const blocks = createBlocks(day1);
  const kg = 65;
  const goal = waterGoal(kg);

  const profile: Profile = {
    id: 'me',
    name: 'Ana',
    path: 'preso',
    careFlags: {},
    weightKg: kg,
    waterGoalMl: goal?.ml,
    registerTime: '21:30',
    readingWeekday: 0,
    simpleMode: false,
    trackedSymptoms: [...DEFAULT_SYMPTOMS_BY_PATH.preso],
    showCycleTags: true,
    theme: 'auto',
    monthlyReviewDay: completo ? Number(addDays(today, 5).slice(8, 10)) || 10 : undefined,
    abdominal: [{ date: day1, cm: 84 }, ...(completo ? [{ date: addDays(day1, 20), cm: 81 }] : [])],
    courseStage: 'plano',
    createdAt: STAMP(addDays(day1, -7)),
    updatedAt: now,
  };

  const concludedOn = completo ? addDays(today, -2) : undefined;
  const plan: PlanState = {
    id: 'plan',
    status: completo ? 'concluido' : 'ativo',
    semanaZero: {
      onde_registrar: true,
      meta_agua: true,
      compra: true,
      preparos: true,
      horario_banheiro: true,
      calendario: true,
    },
    day1,
    blocks,
    concludedOn,
    reevaluation: completo
      ? {
          computedAt: STAMP(concludedOn as DayKey),
          suggested: 'bastante',
          chosen: 'bastante',
          completedAt: STAMP(concludedOn as DayKey),
        }
      : undefined,
    minimumPlan: completo ? ['min_1', 'min_2', 'min_3'] : undefined,
    seenNotes: ['dia4', 'tema2', 'tema3'],
    updatedAt: now,
  };

  const stored: Habit[] = completo
    ? [
        {
          id: 'min_1',
          label: 'Água distribuída no dia',
          source: 'plano_minimo',
          activeFrom: addDays(today, -1),
          isWater: true,
        },
        {
          id: 'min_2',
          label: 'Uma leguminosa e uma fonte de fibra',
          source: 'plano_minimo',
          activeFrom: addDays(today, -1),
        },
        {
          id: 'min_3',
          label: 'Rotina de banheiro depois do café',
          source: 'plano_minimo',
          activeFrom: addDays(today, -1),
        },
      ]
    : [];
  const habits = allHabits(plan, stored);

  // Registros: um por dia, com dois dias em branco (sem cobrança).
  const firstDay = completo ? addDays(today, -24) : addDays(today, -21);
  const records: DayRecord[] = [];
  let d = firstDay;
  let i = 0;
  while (d < today) {
    const skip = i === 5 || i === 13;
    if (!skip) {
      const planDay = diffDays(d, day1);
      const phase = FASES[Math.max(0, Math.min(2, Math.floor(planDay / 7)))] as PhaseShape;
      const active = habits
        .filter((h) => d >= h.activeFrom && (h.activeTo === undefined || d <= h.activeTo))
        .map((h) => h.id);
      records.push(makeDay(r, d, phase, active, i));
    }
    d = addDays(d, 1);
    i++;
  }

  // Leituras da semana do plano (uma por bloco já terminado).
  const readings: WeeklyReading[] = blocks
    .filter((b) => blockEnd(b) < today)
    .map((b, idx) => {
      const computed = summarizeWeek({ records, habits, start: b.start, end: blockEnd(b) });
      return {
        id: `leitura-${b.start}`,
        start: b.start,
        end: blockEnd(b),
        context: 'plano' as const,
        planBlockIndex: idx,
        computed,
        commonNotes: idx === 0 ? 'Dormi mal e comi correndo.' : 'Dias corridos no trabalho.',
        keep: computed.habits
          .filter((h) => h.reached)
          .map((h) => h.label)
          .join(', '),
        adjust: idx === 0 ? 'Deixar a garrafa de água na mesa do trabalho.' : 'Almoçar sem pressa.',
        decision: 'avancar' as const,
        createdAt: STAMP(blockEnd(b), 22),
        updatedAt: STAMP(blockEnd(b), 22),
      };
    });

  const lessons: LessonProgress[] = Array.from({ length: completo ? 17 : 15 }, (_, k) => {
    const id = k + 1;
    const doneTask = id === 3 || (completo && id === 15);
    return {
      lessonId: id,
      watched: true,
      watchedAt: STAMP(addDays(day1, -14 + k)),
      task: doneTask
        ? {
            status: 'concluida' as const,
            startDate: addDays(day1, -14),
            data: id === 3 ? { commonNotes: 'Dias com sono ruim.' } : {},
            completedAt: STAMP(addDays(day1, -7)),
          }
        : { status: 'nao_iniciada' as const, data: {} },
      updatedAt: now,
    };
  });

  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) await t.clear();
    await db.profile.put(profile);
    await db.meta.put({
      id: 'meta',
      schemaVersion: CURRENT_SCHEMA_VERSION,
      unlocked: true,
      onboardingDone: true,
      installSkipped: true,
      installPromptDismissedAt: now,
      lastBackupAt: STAMP(addDays(today, -2)),
      updatedAt: now,
    });
    await db.plan.put(plan);
    await db.days.bulkPut(records);
    await db.lessons.bulkPut(lessons);
    if (stored.length > 0)
      await db.habits.bulkPut(stored.map((h) => ({ ...h, createdAt: now, updatedAt: now })));
    if (readings.length > 0) await db.readings.bulkPut(readings);
  });
}

/** Semeia o banco de demonstração só quando ele está vazio. */
export async function seedDemoIfEmpty(db: AppDB, scenario: DemoScenario): Promise<void> {
  const meta = await db.meta.get('meta');
  if (meta?.onboardingDone) return;
  await seedDemo(db, scenario);
}
