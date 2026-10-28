import { LIMIAR_DIA_COM_SINTOMA } from '../config';
import type { DayKey, DayRecord, SymptomId, TagId } from '../types';
import { daysBetween, diffDays } from './dates';
import { round1 } from './format';
import { dayScore, indexByDate, symptomValue } from './records';

export function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

/** Média das notas dos dias com nota, com uma casa decimal (seção 7.3). */
export function averageScore(records: DayRecord[]): number | undefined {
  const scores = records.map(dayScore).filter((s): s is number => s !== undefined);
  const avg = average(scores);
  return avg === undefined ? undefined : round1(avg);
}

export function isSymptomDay(score: number | undefined): boolean {
  return score !== undefined && score >= LIMIAR_DIA_COM_SINTOMA;
}

export function isMildSymptomDay(score: number | undefined): boolean {
  return score !== undefined && score >= 1 && score < LIMIAR_DIA_COM_SINTOMA;
}

export interface SymptomDay {
  date: DayKey;
  score: number;
  tags: TagId[];
  note?: string;
}

function toSymptomDay(r: DayRecord, score: number): SymptomDay {
  return { date: r.date, score, tags: r.tags ?? [], note: r.note?.trim() || undefined };
}

/** Dias com nota igual ou maior que o limiar, em ordem de data. */
export function symptomDays(records: DayRecord[]): SymptomDay[] {
  const out: SymptomDay[] = [];
  for (const r of [...records].sort((a, b) => (a.date < b.date ? -1 : 1))) {
    const s = dayScore(r);
    if (s !== undefined && isSymptomDay(s)) out.push(toSymptomDay(r, s));
  }
  return out;
}

/** Dias com sintoma leve (notas de 1 a 3). */
export function mildSymptomDays(records: DayRecord[]): SymptomDay[] {
  const out: SymptomDay[] = [];
  for (const r of [...records].sort((a, b) => (a.date < b.date ? -1 : 1))) {
    const s = dayScore(r);
    if (s !== undefined && isMildSymptomDay(s)) out.push(toSymptomDay(r, s));
  }
  return out;
}

/** Média de cada sintoma nos dias em que ele foi registrado. */
export function perSymptomAverage(records: DayRecord[]): Partial<Record<SymptomId, number>> {
  const sums = new Map<SymptomId, number[]>();
  for (const r of records) {
    if (!r.symptoms) continue;
    for (const [k, v] of Object.entries(r.symptoms)) {
      if (typeof v !== 'number') continue;
      const id = k as SymptomId;
      const list = sums.get(id) ?? [];
      list.push(v);
      sums.set(id, list);
    }
  }
  const out: Partial<Record<SymptomId, number>> = {};
  for (const [id, list] of sums) {
    const avg = average(list);
    if (avg !== undefined) out[id] = round1(avg);
  }
  return out;
}

/** Média de energia dos dias registrados. */
export function averageEnergy(records: DayRecord[]): number | undefined {
  const values = records.map((r) => r.energy).filter((e): e is number => typeof e === 'number');
  const avg = average(values);
  return avg === undefined ? undefined : round1(avg);
}

export interface ConsultSymptomStat {
  /** Vezes por semana: média, por semana, dos dias com o sintoma maior que zero. */
  timesPerWeek?: number;
  /** Intensidade: média dos valores maiores que zero. */
  intensity?: number;
}

/**
 * Para a ficha da consulta (seção 7.3). O período é dividido em semanas de 7 dias
 * a partir de `start`; a última semana incompleta conta proporcionalmente.
 */
export function consultSymptomStat(
  records: DayRecord[],
  value: (r: DayRecord) => number | undefined,
  start: DayKey,
  end: DayKey,
): ConsultSymptomStat {
  const map = indexByDate(records);
  const days = daysBetween(start, end);
  const positives: number[] = [];
  let anyData = false;
  for (const d of days) {
    const r = map.get(d);
    if (!r) continue;
    const v = value(r);
    if (v === undefined) continue;
    anyData = true;
    if (v > 0) positives.push(v);
  }
  if (!anyData) return {};
  const weeks = (diffDays(end, start) + 1) / 7;
  const avg = average(positives);
  return {
    timesPerWeek: round1(positives.length / weeks),
    intensity: avg === undefined ? undefined : round1(avg),
  };
}

export function symptomGetter(id: SymptomId): (r: DayRecord) => number | undefined {
  return (r) => symptomValue(r, id);
}
