import { useLiveQuery } from 'dexie-react-hooks';
import { getDb } from '../db/index';
import { activeHabitsOn } from '../logic/activeHabits';
import type { ActiveHabit } from '../logic/habits';
import type {
  ConsultForm,
  CrisisState,
  DayKey,
  DayRecord,
  DiaryEntry,
  FodmapProtocol,
  Habit,
  LessonProgress,
  Meta,
  Notice,
  PlanState,
  Profile,
  WeeklyReading,
} from '../types';

/**
 * Leituras do banco para as telas. Tudo vem do IndexedDB (useLiveQuery), que é a única
 * fonte de dados. `undefined` = ainda carregando; `null` = não existe.
 */

export function useProfile(): Profile | null | undefined {
  return useLiveQuery(async () => (await getDb().profile.get('me')) ?? null, []);
}

export function useMeta(): Meta | undefined {
  return useLiveQuery(
    async () => (await getDb().meta.get('meta')) ?? { id: 'meta' as const, schemaVersion: 1 },
    [],
  );
}

export function usePlan(): PlanState | null | undefined {
  return useLiveQuery(async () => (await getDb().plan.get('plan')) ?? null, []);
}

export function useCrisis(): CrisisState | null | undefined {
  return useLiveQuery(async () => (await getDb().crisis.get('crisis')) ?? null, []);
}

export function useStoredHabits(): Habit[] | undefined {
  return useLiveQuery(() => getDb().habits.toArray(), []);
}

export function useLessons(): LessonProgress[] | undefined {
  return useLiveQuery(() => getDb().lessons.toArray(), []);
}

export function useNotices(): Notice[] | undefined {
  return useLiveQuery(() => getDb().notices.toArray(), []);
}

export function useDay(date: DayKey): DayRecord | null | undefined {
  return useLiveQuery(async () => (await getDb().days.get(date)) ?? null, [date]);
}

export function useDays(start: DayKey, end: DayKey): DayRecord[] | undefined {
  return useLiveQuery(
    () => getDb().days.where('date').between(start, end, true, true).toArray(),
    [start, end],
  );
}

export function useAllDays(): DayRecord[] | undefined {
  return useLiveQuery(() => getDb().days.orderBy('date').toArray(), []);
}

export function useRegisteredCount(): number | undefined {
  return useLiveQuery(
    async () =>
      (await getDb()
        .days.filter((d) => typeof d.evacuated === 'boolean')
        .count()) ?? 0,
    [],
  );
}

/** Hábitos ativos no dia (plano, tarefas, plano mínimo, ciclos). */
export function useActiveHabits(day: DayKey): ActiveHabit[] | undefined {
  const plan = usePlan();
  const stored = useStoredHabits();
  if (plan === undefined || stored === undefined) return undefined;
  return activeHabitsOn(day, plan ?? undefined, stored);
}

export function useReadings(): WeeklyReading[] | undefined {
  return useLiveQuery(() => getDb().readings.toArray(), []);
}

export function useDiary(start: DayKey, end: DayKey): DiaryEntry[] | undefined {
  return useLiveQuery(
    () => getDb().diary.where('date').between(start, end, true, true).toArray(),
    [start, end],
  );
}

export function useFodmap(): FodmapProtocol | null | undefined {
  return useLiveQuery(async () => (await getDb().fodmap.get('fodmap')) ?? null, []);
}

export function useConsult(): ConsultForm | null | undefined {
  return useLiveQuery(async () => (await getDb().consult.get('consult')) ?? null, []);
}
