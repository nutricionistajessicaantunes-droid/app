import { CRISE_SEM_MELHORA_DIAS, CRISE_SUGERIR_DIAS } from '../config';
import { VOLTA_ETAPAS } from '../content/diarreia';
import type { CrisisState, DayKey, DayRecord } from '../types';
import { addDays, diffDays } from './dates';
import { bristolOf, indexByDate, looseStreakEndingAt } from './records';

/** Modo crise e a volta depois da crise (seções 6.12 e 9.13). */

export const ULTIMA_ETAPA = VOLTA_ETAPAS.length;

/** Etapa do dia N desde a melhora: 1 e 2, 3 e 4, 5 e 6, 7 e 8, e "por último" a partir do 9. */
export function stageForDay(day: number): number {
  let stage = 1;
  for (const e of VOLTA_ETAPAS) if (day >= e.deDia) stage = e.id;
  return stage;
}

function firstDayOf(stage: number): number {
  return VOLTA_ETAPAS.find((e) => e.id === stage)?.deDia ?? 1;
}

export interface CrisisStage {
  stage: number;
  /** Dia da volta, já descontadas as pausas. */
  day: number;
  /** Parada por 2 dias depois de um tipo 6 ou 7. */
  holding: boolean;
}

export function crisisStage(
  c: CrisisState | null | undefined,
  today: DayKey,
): CrisisStage | undefined {
  if (!c?.active || !c.improvedAt || today < c.improvedAt) return undefined;
  if (c.holdUntil && c.heldStage && today <= c.holdUntil)
    return { stage: c.heldStage, day: firstDayOf(c.heldStage), holding: true };
  const day = Math.max(1, diffDays(today, c.improvedAt) + 1 - (c.offsetDays ?? 0));
  return { stage: stageForDay(day), day, holding: false };
}

/**
 * O que muda no modo crise quando um registro é salvo: Bristol 5 ou menos marca a melhora;
 * tipo 6 ou 7 depois dela segura a etapa por 2 dias e depois retoma do começo da etapa.
 */
export function crisisPatchForRecord(
  c: CrisisState | null | undefined,
  r: DayRecord,
): Partial<CrisisState> | undefined {
  if (!c?.active || !c.startedAt || r.date < c.startedAt) return undefined;
  const t = bristolOf(r);
  if (t === undefined) return undefined;
  if (!c.improvedAt) return t <= 5 ? { improvedAt: r.date } : undefined;
  if (t < 6 || r.date < c.improvedAt) return undefined;
  if (c.lastRelapseDay && r.date <= c.lastRelapseDay) return undefined;
  const stage = crisisStage(c, r.date)?.stage ?? 1;
  const resume = addDays(r.date, 3);
  return {
    lastRelapseDay: r.date,
    holdUntil: addDays(r.date, 2),
    heldStage: stage,
    offsetDays: diffDays(resume, c.improvedAt) + 1 - firstDayOf(stage),
  };
}

/** Modo crise ligado há 2 dias ou mais sem melhora (seção 7.13). */
export function crisisNoImprovement(c: CrisisState | null | undefined, today: DayKey): boolean {
  return (
    !!c?.active &&
    !c.improvedAt &&
    !!c.startedAt &&
    diffDays(today, c.startedAt) >= CRISE_SEM_MELHORA_DIAS
  );
}

/** Tipo 6 ou 7 em 2 dias registrados seguidos, com o modo crise desligado. */
export function shouldSuggestCrisis(
  records: DayRecord[],
  today: DayKey,
  crisisActive: boolean,
  snoozedUntil?: string,
): boolean {
  if (crisisActive || (snoozedUntil && today < snoozedUntil)) return false;
  const end = bristolOf(indexByDate(records).get(today)) === undefined ? addDays(today, -1) : today;
  return looseStreakEndingAt(records, end) >= CRISE_SUGERIR_DIAS;
}

/** Estado novo ao ligar o modo crise. */
export function startCrisis(today: DayKey, now: string): CrisisState {
  return { id: 'crisis', active: true, startedAt: today, updatedAt: now };
}
