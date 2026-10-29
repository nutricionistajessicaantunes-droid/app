import type { DayKey } from '../types';
import { addDays, weekdayOf } from './dates';

/**
 * Semana livre (seção 7.1): os 7 dias que terminam no dia da leitura.
 * Com domingo, vai de segunda a domingo.
 */
export function freeWeekEndingOn(readingDay: DayKey): { start: DayKey; end: DayKey } {
  return { start: addDays(readingDay, -6), end: readingDay };
}

/** A semana em andamento: termina no próximo dia de leitura (hoje incluído). */
export function currentFreeWeek(
  today: DayKey,
  readingWeekday: number,
): { start: DayKey; end: DayKey } {
  const ahead = (readingWeekday - weekdayOf(today) + 7) % 7;
  return freeWeekEndingOn(addDays(today, ahead));
}

/** Semana deslocada em n semanas (n negativo = semanas anteriores). */
export function shiftWeek(
  w: { start: DayKey; end: DayKey },
  n: number,
): { start: DayKey; end: DayKey } {
  return { start: addDays(w.start, n * 7), end: addDays(w.end, n * 7) };
}

/** Os últimos 7 dias completos, terminando ontem (leitura aberta à mão). */
export function lastCompleteWeek(today: DayKey): { start: DayKey; end: DayKey } {
  return { start: addDays(today, -7), end: addDays(today, -1) };
}
