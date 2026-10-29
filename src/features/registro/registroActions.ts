import { getDb } from '../../db/index';
import { nowIso } from '../../db/repo';
import type { DayKey, RedFlagId } from '../../types';

/** Cria o cartão de alerta para sinais recém-marcados no registro (seção 6.15). */
export async function addRedFlagNotice(day: DayKey, flags: RedFlagId[]): Promise<void> {
  if (flags.length === 0) return;
  await getDb().notices.put({
    id: `alerta-${day}-${Date.now()}`,
    kind: 'alerta',
    reason: flags.join(','),
    detectedAt: day,
    updatedAt: nowIso(),
  });
}
