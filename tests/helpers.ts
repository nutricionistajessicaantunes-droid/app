import type { DayRecord } from '../src/types';

const STAMP = '2026-11-01T12:00:00.000Z';

/** Registro de teste: só o que importa para o caso. */
export function rec(date: string, data: Partial<DayRecord> = {}): DayRecord {
  return { date, createdAt: STAMP, updatedAt: STAMP, ...data };
}

/** Uma semana de registros a partir de `start`, um por item (null = sem registro). */
export function week(start: string, items: (Partial<DayRecord> | null)[]): DayRecord[] {
  const [y, m, d] = start.split('-').map(Number) as [number, number, number];
  const out: DayRecord[] = [];
  items.forEach((it, i) => {
    if (it === null) return;
    const date = new Date(y, m - 1, d + i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    out.push(rec(key, it));
  });
  return out;
}
