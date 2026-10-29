import type { Bristol, DayKey, DayRecord } from '../types';
import { addDays, daysBetween } from './dates';
import type { ActiveHabit } from './habits';
import { bristolOf, indexByDate } from './records';
import { summarizeWeek, type WeekSummary } from './week';
import { currentFreeWeek, shiftWeek } from './weeks';

/** Dados dos gráficos de Resultados (seção 6.10). */

/** Bristol por dia: um ponto por dia na altura do tipo; dia sem registro fica vazio. */
export function bristolByDay(
  records: DayRecord[],
  end: DayKey,
  days = 28,
): { date: DayKey; type?: Bristol }[] {
  const map = indexByDate(records);
  return daysBetween(addDays(end, -(days - 1)), end).map((date) => ({
    date,
    type: bristolOf(map.get(date)),
  }));
}

/**
 * As últimas semanas (até 8), alinhadas ao dia da leitura, a mais antiga primeiro.
 * A semana em andamento conta só até hoje.
 */
export function weeklySummaries(
  records: DayRecord[],
  habits: ActiveHabit[],
  today: DayKey,
  readingWeekday: number,
  weeks = 8,
): WeekSummary[] {
  const base = currentFreeWeek(today, readingWeekday);
  return Array.from({ length: weeks }, (_, i) => shiftWeek(base, i - (weeks - 1))).map((w) =>
    summarizeWeek({ records, habits, start: w.start, end: w.end > today ? today : w.end }),
  );
}

/** Escala "agradável" para o eixo: o maior valor arredondado para cima. */
export function niceMax(values: number[], min = 1): number {
  const m = Math.max(min, ...values);
  if (m <= 5) return Math.ceil(m);
  if (m <= 10) return 10;
  return Math.ceil(m / 5) * 5;
}
