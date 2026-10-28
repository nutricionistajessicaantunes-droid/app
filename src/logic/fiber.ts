import { FIBRA_META_MAX, FIBRA_META_MIN } from '../config';
import { round1 } from './format';

export interface FiberEntry {
  per100: number;
  grams: number;
}

/** Gramas de fibra = valor por 100 g x gramas do alimento / 100 (seção 7.14). */
export function fiberOf(entry: FiberEntry): number {
  if (!Number.isFinite(entry.per100) || !Number.isFinite(entry.grams) || entry.grams <= 0) return 0;
  return (entry.per100 * entry.grams) / 100;
}

/** Valor do item, com uma casa decimal. */
export function fiberItemDisplay(entry: FiberEntry): number {
  return round1(fiberOf(entry));
}

/** Total do dia, arredondado para inteiro, somando os valores sem arredondar. */
export function fiberTotal(entries: FiberEntry[]): number {
  return Math.round(entries.reduce((s, e) => s + fiberOf(e), 0) + Number.EPSILON);
}

export type FiberBand = 'abaixo' | 'meta' | 'acima';

export function fiberBand(totalGrams: number): FiberBand {
  if (totalGrams < FIBRA_META_MIN) return 'abaixo';
  if (totalGrams <= FIBRA_META_MAX) return 'meta';
  return 'acima';
}
