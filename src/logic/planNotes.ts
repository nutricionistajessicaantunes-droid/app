import { PLANO_DIAS_SEM_REGISTRO_RETOMAR } from '../config';
import { PLAN_THEMES, RECADO_DIA4 } from '../content/plano';
import type { DayKey, DayRecord, PlanState } from '../types';
import { addDays } from './dates';
import { blockIndexOn, dayInBlock, effectiveStatus, hasStarted, planStart } from './plan';
import { indexByDate, isRegistered, lastRegisteredOnOrBefore } from './records';

/** Recados do plano (seções 6.7 e 9.6): cada um aparece uma vez, até "Entendi". */

export type PlanNoteId = 'semana1' | 'dia4' | 'tema2' | 'tema3';

export interface PlanNote {
  id: PlanNoteId;
  title: string;
  text: string;
}

export function planNotesFor(plan: PlanState | undefined, today: DayKey): PlanNote[] {
  if (!plan || effectiveStatus(plan, today) !== 'ativo' || !hasStarted(plan, today)) return [];
  const idx = blockIndexOn(plan.blocks, today);
  const block = plan.blocks[idx];
  if (idx < 0 || !block) return [];
  const seen = new Set(plan.seenNotes ?? []);
  const out: PlanNote[] = [];
  if (idx === 0 && !seen.has('semana1'))
    out.push({ id: 'semana1', title: 'O que esperar desta semana', text: PLAN_THEMES[1].expect });
  if (idx === 0 && dayInBlock(block, today) >= 4 && !seen.has('dia4'))
    out.push({ id: 'dia4', title: 'O quarto dia', text: RECADO_DIA4 });
  if (block.theme === 2 && !seen.has('tema2'))
    out.push({ id: 'tema2', title: 'O que esperar desta semana', text: PLAN_THEMES[2].expect });
  if (block.theme === 3 && !seen.has('tema3'))
    out.push({ id: 'tema3', title: 'O que esperar desta semana', text: PLAN_THEMES[3].expect });
  return out;
}

/**
 * 5 dias ou mais sem registrar durante o plano: ao voltar, "Retome hoje".
 * `since` identifica a ausência (para o "Entendi" valer só para ela).
 */
export function planAbsence(
  plan: PlanState | undefined,
  records: DayRecord[],
  today: DayKey,
): { since: DayKey } | undefined {
  if (!plan || effectiveStatus(plan, today) !== 'ativo' || !hasStarted(plan, today))
    return undefined;
  const start = planStart(plan.blocks);
  const from = addDays(today, -PLANO_DIAS_SEM_REGISTRO_RETOMAR);
  if (!start || from < start) return undefined;
  const map = indexByDate(records);
  for (let d = from; d < today; d = addDays(d, 1)) if (isRegistered(map.get(d))) return undefined;
  return { since: lastRegisteredOnOrBefore(records, addDays(today, -1)) ?? start };
}
