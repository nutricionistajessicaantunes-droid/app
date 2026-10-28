import { PLAN_HABITS, PLAN_THEMES } from '../content/plano';
import type { DayKey, PlanBlock, PlanState, PlanStatus, PlanTheme } from '../types';
import { addDays, diffDays } from './dates';
import type { ActiveHabit } from './habits';

/** Plano de 21 dias (seção 6.7): uma lista de blocos de 7 dias. */

export const BLOCK_DAYS = 7;

export function createBlocks(day1: DayKey): PlanBlock[] {
  return ([1, 2, 3] as PlanTheme[]).map((theme, i) => ({
    theme,
    start: addDays(day1, i * BLOCK_DAYS),
    repeated: false,
  }));
}

export function blockEnd(block: PlanBlock): DayKey {
  return addDays(block.start, BLOCK_DAYS - 1);
}

export function planStart(blocks: PlanBlock[]): DayKey | undefined {
  return blocks[0]?.start;
}

export function planEnd(blocks: PlanBlock[]): DayKey | undefined {
  const last = blocks[blocks.length - 1];
  return last ? blockEnd(last) : undefined;
}

export function planTotalDays(blocks: PlanBlock[]): number {
  return blocks.length * BLOCK_DAYS;
}

/** Índice do bloco que contém o dia; -1 antes do início, -2 depois do fim. */
export function blockIndexOn(blocks: PlanBlock[], day: DayKey): number {
  const start = planStart(blocks);
  if (start === undefined || day < start) return -1;
  const idx = Math.floor(diffDays(day, start) / BLOCK_DAYS);
  return idx < blocks.length ? idx : -2;
}

/** Dia N do plano (1 = dia 1). */
export function planDayNumber(blocks: PlanBlock[], day: DayKey): number | undefined {
  const start = planStart(blocks);
  if (start === undefined) return undefined;
  return diffDays(day, start) + 1;
}

/** Dia dentro do bloco (1 a 7). */
export function dayInBlock(block: PlanBlock, day: DayKey): number {
  return diffDays(day, block.start) + 1;
}

/**
 * Repetir a semana: insere um bloco do mesmo tema logo depois do bloco `index`
 * e empurra os seguintes em 7 dias (seção 6.7).
 */
export function repeatBlock(blocks: PlanBlock[], index: number): PlanBlock[] {
  const target = blocks[index];
  if (!target) return blocks;
  const inserted: PlanBlock = {
    theme: target.theme,
    start: addDays(target.start, BLOCK_DAYS),
    repeated: true,
  };
  return [
    ...blocks.slice(0, index + 1),
    inserted,
    ...blocks.slice(index + 1).map((b) => ({ ...b, start: addDays(b.start, BLOCK_DAYS) })),
  ];
}

/** Dia em que a reavaliação fica disponível: o dia seguinte ao último bloco. */
export function reevaluationFrom(blocks: PlanBlock[]): DayKey | undefined {
  const end = planEnd(blocks);
  return end ? addDays(end, 1) : undefined;
}

/**
 * Situação do plano no dia. Um plano ativo cujo último bloco já terminou entra em
 * reavaliação pela data.
 */
export function effectiveStatus(plan: PlanState | undefined, today: DayKey): PlanStatus {
  if (!plan) return 'nao_iniciado';
  if (plan.status === 'ativo') {
    const end = planEnd(plan.blocks);
    if (end !== undefined && today > end) return 'reavaliacao';
  }
  return plan.status;
}

/** O plano começou (dia 1 já chegou)? */
export function hasStarted(plan: PlanState | undefined, today: DayKey): boolean {
  const start = plan ? planStart(plan.blocks) : undefined;
  return start !== undefined && today >= start;
}

/** Hábitos do plano com o período em que ficam ativos. */
export function planHabits(plan: PlanState | undefined): ActiveHabit[] {
  if (!plan || plan.blocks.length === 0) return [];
  if (plan.status === 'nao_iniciado' || plan.status === 'semana_zero') return [];
  const out: ActiveHabit[] = [];
  for (const h of PLAN_HABITS) {
    const first = plan.blocks.find((b) => b.theme >= h.theme);
    if (!first) continue;
    out.push({
      id: h.id,
      label: h.label,
      detail: h.text,
      source: 'plano',
      activeFrom: first.start,
      activeTo: plan.concludedOn,
      isWater: h.isWater,
    });
  }
  return out;
}

/** Hábitos de semanas futuras, com cadeado (seção 6.7). */
export function lockedPlanHabits(plan: PlanState | undefined, day: DayKey): typeof PLAN_HABITS {
  if (!plan) return [];
  const idx = blockIndexOn(plan.blocks, day);
  const current =
    idx >= 0 ? plan.blocks[idx] : idx === -1 ? undefined : plan.blocks[plan.blocks.length - 1];
  const theme = current?.theme ?? 0;
  return PLAN_HABITS.filter((h) => h.theme > theme);
}

/** Primeiro bloco do tema 1 (S1) e último do tema 3 (S3), para a reavaliação (seção 7.7). */
export function s1Block(blocks: PlanBlock[]): PlanBlock | undefined {
  return blocks.find((b) => b.theme === 1);
}

export function s3Block(blocks: PlanBlock[]): PlanBlock | undefined {
  return [...blocks].reverse().find((b) => b.theme === 3);
}

/** Último bloco do tema 2, usado para os hábitos da semana 2. */
export function s2Block(blocks: PlanBlock[]): PlanBlock | undefined {
  return [...blocks].reverse().find((b) => b.theme === 2);
}

export function themeName(theme: PlanTheme): string {
  return PLAN_THEMES[theme].name;
}

/** "Plano · dia 5 de 21 · semana 1, base" */
export function planBadge(plan: PlanState, day: DayKey): string | undefined {
  const idx = blockIndexOn(plan.blocks, day);
  const n = planDayNumber(plan.blocks, day);
  if (idx < 0 || n === undefined) return undefined;
  const block = plan.blocks[idx];
  if (!block) return undefined;
  const total = planTotalDays(plan.blocks);
  return `Plano · dia ${n} de ${total} · semana ${idx + 1}, ${themeName(block.theme)}`;
}
