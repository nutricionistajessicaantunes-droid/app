import type { Bristol, DayKey, DayRecord, SymptomId } from '../types';
import { addDays, daysBetween } from './dates';

/** O dia conta como registrado quando "Você evacuou?" foi respondida (seção 6.4). */
export function isRegistered(r: DayRecord | undefined): boolean {
  return r !== undefined && typeof r.evacuated === 'boolean';
}

/** Mapa por data, só com os registros dentro do período. */
export function indexByDate(records: DayRecord[]): Map<DayKey, DayRecord> {
  const map = new Map<DayKey, DayRecord>();
  for (const r of records) map.set(r.date, r);
  return map;
}

export function recordsInRange(records: DayRecord[], start: DayKey, end: DayKey): DayRecord[] {
  return records
    .filter((r) => r.date >= start && r.date <= end)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** Evacuações do dia. "Sim" sem quantidade conta 1. Dia sem registro conta 0. */
export function evacuationsOf(r: DayRecord | undefined): number {
  if (!r || r.evacuated !== true) return 0;
  return r.evacuationCount ?? 1;
}

/** Tipo de Bristol do dia, só quando evacuou. */
export function bristolOf(r: DayRecord | undefined): Bristol | undefined {
  if (!r || r.evacuated !== true) return undefined;
  return r.bristol;
}

/** Nota do dia: o maior valor entre os sintomas registrados (seção 7.3). */
export function dayScore(r: Pick<DayRecord, 'symptoms'> | undefined): number | undefined {
  if (!r?.symptoms) return undefined;
  let max: number | undefined;
  for (const v of Object.values(r.symptoms)) {
    if (typeof v === 'number' && !Number.isNaN(v)) max = max === undefined ? v : Math.max(max, v);
  }
  return max;
}

export function symptomValue(r: DayRecord | undefined, id: SymptomId): number | undefined {
  const v = r?.symptoms?.[id];
  return typeof v === 'number' ? v : undefined;
}

/** Dia tem algum dado que conta para as leituras: registrado ou com nota de sintoma. */
export function hasData(r: DayRecord | undefined): boolean {
  return isRegistered(r) || dayScore(r) !== undefined;
}

/**
 * Maior sequência de dias registrados seguidos com "Não" evacuou, terminando em `end`.
 * Dia sem registro quebra a sequência (seção 7.2).
 */
export function noEvacuationStreakEndingAt(records: DayRecord[], end: DayKey): number {
  const map = indexByDate(records);
  let n = 0;
  let day = end;
  for (;;) {
    const r = map.get(day);
    if (!r || r.evacuated !== false) break;
    n++;
    day = addDays(day, -1);
  }
  return n;
}

/** Dias registrados seguidos (terminando em `end`) com tipo 6 ou 7. */
export function looseStreakEndingAt(records: DayRecord[], end: DayKey): number {
  const map = indexByDate(records);
  let n = 0;
  let day = end;
  for (;;) {
    const r = map.get(day);
    const t = bristolOf(r);
    if (t === undefined || t < 6) break;
    n++;
    day = addDays(day, -1);
  }
  return n;
}

/** Dias do período que têm registro. */
export function registeredDaysIn(records: DayRecord[], start: DayKey, end: DayKey): number {
  const map = indexByDate(records);
  return daysBetween(start, end).filter((d) => isRegistered(map.get(d))).length;
}

/** Último dia registrado até `end` (inclusive). */
export function lastRegisteredOnOrBefore(records: DayRecord[], end: DayKey): DayKey | undefined {
  let best: DayKey | undefined;
  for (const r of records) {
    if (r.date <= end && isRegistered(r) && (best === undefined || r.date > best)) best = r.date;
  }
  return best;
}
