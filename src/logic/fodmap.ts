import {
  FODMAP_AUMENTO_CLARO,
  FODMAP_AUMENTO_LEVE,
  FODMAP_QUEDA_PONTOS,
  FODMAP_QUEDA_PROPORCAO,
} from '../config';
import { PORCOES_TEMPERO, TABELA_TESTE } from '../content/fodmap';
import type {
  DayKey,
  DayRecord,
  FodmapGroup,
  FodmapProtocol,
  FodmapSuggestion,
  FodmapTest,
} from '../types';
import { addDays, daysBetween, diffDays } from './dates';
import { dayScore, indexByDate } from './records';
import { average } from './symptoms';

/** Protocolo low FODMAP (seções 6.13 e 7.9). */

const EPS = 1e-9;

/** Avaliação da fase 1: padrão no fim da semana 4; permitido entre a semana 2 e a 6. */
export function defaultEvaluationDate(start: DayKey): DayKey {
  return addDays(start, 27);
}

export function evaluationRange(start: DayKey): { min: DayKey; max: DayKey } {
  return { min: addDays(start, 13), max: addDays(start, 41) };
}

/** Média das notas diárias dos dias com nota no período. */
export function averageScores(
  records: DayRecord[],
  start: DayKey,
  end: DayKey,
): number | undefined {
  const map = indexByDate(records);
  return average(
    daysBetween(start, end)
      .map((d) => dayScore(map.get(d)))
      .filter((n): n is number => n !== undefined),
  );
}

/** Linha de base: os 7 dias antes do início; sem eles, os 3 primeiros dias da fase 1. */
export function phase1Baseline(records: DayRecord[], start: DayKey): number | undefined {
  return (
    averageScores(records, addDays(start, -7), addDays(start, -1)) ??
    averageScores(records, start, addDays(start, 2))
  );
}

/** Média dos últimos 7 dias, terminando em `end`. */
export function last7Average(records: DayRecord[], end: DayKey): number | undefined {
  return averageScores(records, addDays(end, -6), end);
}

/** "Sim, caíram de forma clara" ou "Não ficou claro". */
export function phase1Evaluation(baseline?: number, current?: number): 'sim' | 'nao' {
  if (baseline === undefined || current === undefined) return 'nao';
  const dropped = baseline - current >= FODMAP_QUEDA_PONTOS - EPS;
  const proportional = current <= baseline * FODMAP_QUEDA_PROPORCAO + EPS;
  return dropped && proportional ? 'sim' : 'nao';
}

/** "Fase 1 · dia 9 de 28". */
export function phase1Day(
  p: Pick<FodmapProtocol, 'phase1Start' | 'evaluationDate'>,
  today: DayKey,
): { day: number; total: number } | undefined {
  if (!p.phase1Start) return undefined;
  const total =
    diffDays(p.evaluationDate ?? defaultEvaluationDate(p.phase1Start), p.phase1Start) + 1;
  return { day: diffDays(today, p.phase1Start) + 1, total };
}

/** Os testes da fase 2, na ordem sugerida, com as porções da tabela. */
export function planTests(foods: Partial<Record<FodmapGroup, string>>): FodmapTest[] {
  return TABELA_TESTE.map((t) => {
    const food = foods[t.group] ?? t.foods[0] ?? '';
    // Alho e cebola: aumento pequeno, até a quantidade de um refogado comum (definido pela Jéssica).
    const portions = PORCOES_TEMPERO[food] ?? t.portions;
    return {
      group: t.group,
      food,
      pauseDays: 3 as const,
      days: portions.map((portion) => ({ portion })),
    };
  });
}

export function testDays(t: Pick<FodmapTest, 'start'>): DayKey[] {
  return t.start ? [0, 1, 2].map((i) => addDays(t.start as DayKey, i)) : [];
}

/** Último dia da pausa depois do teste. */
export function pauseEnd(t: Pick<FodmapTest, 'start' | 'pauseDays'>): DayKey | undefined {
  return t.start ? addDays(t.start, 2 + t.pauseDays) : undefined;
}

/**
 * Linha de base de um teste: os dias de pausa antes dele (para o primeiro grupo, os 3
 * últimos dias da fase 1), contados para trás a partir do início do teste.
 */
export function testBaseline(
  records: DayRecord[],
  start: DayKey,
  previous?: Pick<FodmapTest, 'pauseDays'>,
): number | undefined {
  const n = previous ? previous.pauseDays : 3;
  return averageScores(records, addDays(start, -n), addDays(start, -1));
}

/** Nota de cada dia de teste (o maior sintoma registrado no dia). */
export function testScores(
  records: DayRecord[],
  t: Pick<FodmapTest, 'start'>,
): (number | undefined)[] {
  const map = indexByDate(records);
  return testDays(t).map((d) => dayScore(map.get(d)));
}

/** Conclusão sugerida (seção 7.9). */
export function suggestTestResult(
  scores: (number | undefined)[],
  baseline: number | undefined,
  atypical = false,
): FodmapSuggestion {
  if (atypical || baseline === undefined || scores.length < 3) return 'inconclusivo';
  if (scores.some((s) => s === undefined)) return 'inconclusivo';
  const [d1, d2, d3] = (scores as number[]).map((s) => s - baseline) as [number, number, number];
  if (d1 >= FODMAP_AUMENTO_CLARO - EPS || d2 >= FODMAP_AUMENTO_CLARO - EPS) return 'gatilho';
  if (
    d1 <= FODMAP_AUMENTO_LEVE + EPS &&
    d2 <= FODMAP_AUMENTO_LEVE + EPS &&
    d3 >= FODMAP_AUMENTO_LEVE - EPS
  )
    return 'quantidade';
  if (d1 <= 1 + EPS && d2 <= 1 + EPS && d3 <= 1 + EPS) return 'liberado';
  return 'inconclusivo';
}

/** Índice do teste atual (o primeiro sem conclusão); -1 quando todos terminaram. */
export function currentTestIndex(tests: FodmapTest[]): number {
  return tests.findIndex((t) => !t.result);
}

/** Data mais cedo para começar o próximo teste: depois da pausa do anterior. */
export function earliestNextStart(tests: FodmapTest[], index: number): DayKey | undefined {
  const prev = index > 0 ? tests[index - 1] : undefined;
  const end = prev ? pauseEnd(prev) : undefined;
  const afterPrev = end ? addDays(end, 1) : undefined;
  const own = tests[index]?.notBefore;
  if (afterPrev && own) return afterPrev > own ? afterPrev : own;
  return afterPrev ?? own;
}
