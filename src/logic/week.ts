import { MIN_DIAS_LEITURA } from '../config';
import type { Bristol, BristolBand, DayKey, DayRecord, DiaryEntry, SymptomId } from '../types';
import { bandOfModes, bristolDistribution, bristolModes, hasAlternation } from './bristol';
import { commonFactors, type CommonFactor, type DayFactors } from './commonFactors';
import { daysBetween } from './dates';
import { habitStat, habitsActiveInRange, type ActiveHabit, type HabitStat } from './habits';
import {
  bristolOf,
  dayScore,
  evacuationsOf,
  hasData,
  indexByDate,
  isRegistered,
  recordsInRange,
} from './records';
import {
  averageEnergy,
  averageScore,
  isSymptomDay,
  mildSymptomDays,
  perSymptomAverage,
  symptomDays,
  type SymptomDay,
} from './symptoms';
import { normalizeFood } from './text';

export interface WeekSummary {
  start: DayKey;
  end: DayKey;
  totalDays: number;
  registeredDays: number;
  weak: boolean;
  habits: HabitStat[];
  habitsBelowGoal: string[];
  bristol: {
    modes: Bristol[];
    distribution: number[];
    band?: BristolBand;
    alternation: boolean;
    daysWithType: number;
  };
  evacuations: { days: number; total: number };
  effortDays: number;
  incompleteDays: number;
  symptomAverage?: number;
  symptomDays: SymptomDay[];
  mildSymptomDays: SymptomDay[];
  perSymptom: Partial<Record<SymptomId, number>>;
  energyAverage?: number;
  commonFactors: CommonFactor[];
}

export interface SummarizeInput {
  records: DayRecord[];
  habits: ActiveHabit[];
  start: DayKey;
  end: DayKey;
  diary?: DiaryEntry[];
}

/** Fatores do dia para a seção 7.5: chips e alimentos do diário com horário. */
export function dayFactors(r: DayRecord, diary: DiaryEntry[] = []): DayFactors {
  const foods = new Map<string, string>();
  for (const e of diary) {
    if (e.date !== r.date || e.kind !== 'refeicao') continue;
    for (const f of e.foods ?? []) {
      const key = normalizeFood(f);
      if (key && !foods.has(key)) foods.set(key, f.trim().toLowerCase());
    }
  }
  return {
    date: r.date,
    tags: r.tags ?? [],
    foods: [...foods.entries()].map(([key, label]) => ({ key, label })),
  };
}

/** Resumo da semana (seção 7.4). */
export function summarizeWeek({
  records,
  habits,
  start,
  end,
  diary = [],
}: SummarizeInput): WeekSummary {
  const inRange = recordsInRange(records, start, end);
  const map = indexByDate(inRange);
  const days = daysBetween(start, end);

  const registered = days.filter((d) => isRegistered(map.get(d)));
  const types: Bristol[] = [];
  let evacDays = 0;
  let evacTotal = 0;
  let effortDays = 0;
  let incompleteDays = 0;
  for (const d of days) {
    const r = map.get(d);
    const t = bristolOf(r);
    if (t !== undefined) types.push(t);
    const n = evacuationsOf(r);
    if (n > 0) {
      evacDays++;
      evacTotal += n;
    }
    if (r?.evacuated === true && r.effort) effortDays++;
    if (r?.evacuated === true && r.incomplete) incompleteDays++;
  }

  const modes = bristolModes(types);
  const habitStats = habitsActiveInRange(habits, start, end).map((h) =>
    habitStat(inRange, h, start, end),
  );

  const withData = inRange.filter(hasData);
  const sDays = symptomDays(withData);
  const sDaySet = new Set(sDays.map((s) => s.date));
  const symptomFactors = withData
    .filter((r) => sDaySet.has(r.date))
    .map((r) => dayFactors(r, diary));
  const otherFactors = withData
    .filter((r) => !sDaySet.has(r.date) && !isSymptomDay(dayScore(r)))
    .map((r) => dayFactors(r, diary));

  return {
    start,
    end,
    totalDays: days.length,
    registeredDays: registered.length,
    weak: registered.length < MIN_DIAS_LEITURA,
    habits: habitStats,
    habitsBelowGoal: habitStats.filter((h) => !h.reached).map((h) => h.id),
    bristol: {
      modes,
      distribution: bristolDistribution(types),
      band: bandOfModes(modes),
      alternation: hasAlternation(types),
      daysWithType: types.length,
    },
    evacuations: { days: evacDays, total: evacTotal },
    effortDays,
    incompleteDays,
    symptomAverage: averageScore(withData),
    symptomDays: sDays,
    mildSymptomDays: sDays.length === 0 ? mildSymptomDays(withData) : [],
    perSymptom: perSymptomAverage(withData),
    energyAverage: averageEnergy(withData),
    commonFactors: commonFactors(symptomFactors, otherFactors),
  };
}

/** Média de dias cumpridos por hábito (ex.: 6, 5, 3 e 4 dão 4,5). */
export function averageHabitDays(stats: HabitStat[]): number | undefined {
  if (stats.length === 0) return undefined;
  return stats.reduce((s, h) => s + h.done, 0) / stats.length;
}
