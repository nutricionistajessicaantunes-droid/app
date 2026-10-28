import { getDb } from '../../db/index';
import { nowIso } from '../../db/repo';
import type { DayKey, DayRecord, RedFlagId } from '../../types';

/**
 * Marca sinais de alerta no registro do dia e cria o cartão de alerta.
 * Um sinal marcado de novo faz o cartão voltar (seção 6.15).
 */
export async function saveRedFlags(day: DayKey, flags: RedFlagId[]): Promise<void> {
  const db = getDb();
  await db.transaction('rw', [db.days, db.notices], async () => {
    const existing = await db.days.get(day);
    const now = nowIso();
    const before = new Set(existing?.redFlags ?? []);
    const added = flags.filter((f) => !before.has(f));
    const record: DayRecord = {
      ...(existing ?? { date: day, createdAt: now }),
      date: day,
      redFlags: flags,
      updatedAt: now,
    } as DayRecord;
    if (flags.length === 0) delete record.redFlags;
    await db.days.put(record);
    if (added.length > 0) {
      await db.notices.put({
        id: `alerta-${day}-${Date.now()}`,
        kind: 'alerta',
        reason: added.join(','),
        detectedAt: day,
        updatedAt: now,
      });
    }
  });
}
