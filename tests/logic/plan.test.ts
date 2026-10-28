import { describe, expect, it } from 'vitest';
import {
  blockEnd,
  blockIndexOn,
  createBlocks,
  dayInBlock,
  effectiveStatus,
  hasStarted,
  lockedPlanHabits,
  planBadge,
  planDayNumber,
  planEnd,
  planHabits,
  planStart,
  planTotalDays,
  reevaluationFrom,
  repeatBlock,
  s1Block,
  s2Block,
  s3Block,
  themeName,
} from '../../src/logic/plan';
import type { PlanState } from '../../src/types';

const plan = (over: Partial<PlanState> = {}): PlanState => ({
  id: 'plan',
  status: 'ativo',
  semanaZero: {},
  day1: '2026-11-02',
  blocks: createBlocks('2026-11-02'),
  updatedAt: '',
  ...over,
});

describe('plano de 21 dias', () => {
  it('três blocos a partir do dia 1', () => {
    const b = createBlocks('2026-11-02');
    expect(b).toEqual([
      { theme: 1, start: '2026-11-02', repeated: false },
      { theme: 2, start: '2026-11-09', repeated: false },
      { theme: 3, start: '2026-11-16', repeated: false },
    ]);
    expect(blockEnd(b[0]!)).toBe('2026-11-08');
    expect(planEnd(b)).toBe('2026-11-22');
    expect(planTotalDays(b)).toBe(21);
    expect(planStart(b)).toBe('2026-11-02');
  });

  it('dia 1 em 02/11 com repetição do tema 1: blocos em 02, 09, 16 e 23/11; reavaliação em 30/11', () => {
    const b = repeatBlock(createBlocks('2026-11-02'), 0);
    expect(b.map((x) => [x.theme, x.start])).toEqual([
      [1, '2026-11-02'],
      [1, '2026-11-09'],
      [2, '2026-11-16'],
      [3, '2026-11-23'],
    ]);
    expect(b[1]?.repeated).toBe(true);
    expect(reevaluationFrom(b)).toBe('2026-11-30');
    expect(planTotalDays(b)).toBe(28);
  });

  it('repetir um índice que não existe não muda nada', () => {
    const b = createBlocks('2026-11-02');
    expect(repeatBlock(b, 5)).toBe(b);
  });

  it('em que bloco está o dia', () => {
    const b = createBlocks('2026-11-02');
    expect(blockIndexOn(b, '2026-11-01')).toBe(-1);
    expect(blockIndexOn(b, '2026-11-02')).toBe(0);
    expect(blockIndexOn(b, '2026-11-08')).toBe(0);
    expect(blockIndexOn(b, '2026-11-09')).toBe(1);
    expect(blockIndexOn(b, '2026-11-22')).toBe(2);
    expect(blockIndexOn(b, '2026-11-23')).toBe(-2);
    expect(blockIndexOn([], '2026-11-23')).toBe(-1);
    expect(planDayNumber(b, '2026-11-06')).toBe(5);
    expect(planDayNumber([], '2026-11-06')).toBeUndefined();
    expect(dayInBlock(b[1]!, '2026-11-11')).toBe(3);
  });

  it('entra em reavaliação depois do último bloco', () => {
    expect(effectiveStatus(plan(), '2026-11-22')).toBe('ativo');
    expect(effectiveStatus(plan(), '2026-11-23')).toBe('reavaliacao');
    expect(effectiveStatus(undefined, '2026-11-23')).toBe('nao_iniciado');
    expect(effectiveStatus(plan({ status: 'concluido' }), '2026-12-23')).toBe('concluido');
    expect(hasStarted(plan(), '2026-11-01')).toBe(false);
    expect(hasStarted(plan(), '2026-11-02')).toBe(true);
    expect(hasStarted(undefined, '2026-11-02')).toBe(false);
  });

  it('hábitos acumulam por tema', () => {
    const hs = planHabits(plan());
    expect(hs.map((h) => [h.id, h.activeFrom])).toEqual([
      ['p1', '2026-11-02'],
      ['p2', '2026-11-02'],
      ['p3', '2026-11-09'],
      ['p4', '2026-11-09'],
      ['p5', '2026-11-16'],
      ['p6', '2026-11-16'],
    ]);
    expect(hs[0]?.isWater).toBe(true);
    // Com a semana 1 repetida, os hábitos 3 e 4 só entram em 16/11.
    const rep = planHabits(plan({ blocks: repeatBlock(createBlocks('2026-11-02'), 0) }));
    expect(rep.find((h) => h.id === 'p3')?.activeFrom).toBe('2026-11-16');
    expect(planHabits(plan({ status: 'semana_zero', blocks: [] }))).toEqual([]);
    expect(planHabits(undefined)).toEqual([]);
    expect(planHabits(plan({ status: 'semana_zero' }))).toEqual([]);
    expect(planHabits(plan({ concludedOn: '2026-11-24' }))[0]?.activeTo).toBe('2026-11-24');
  });

  it('hábitos com cadeado', () => {
    expect(lockedPlanHabits(plan(), '2026-11-03').map((h) => h.id)).toEqual([
      'p3',
      'p4',
      'p5',
      'p6',
    ]);
    expect(lockedPlanHabits(plan(), '2026-11-17').map((h) => h.id)).toEqual([]);
    expect(lockedPlanHabits(plan(), '2026-10-30').map((h) => h.id)).toHaveLength(6);
    expect(lockedPlanHabits(plan(), '2026-12-30')).toEqual([]);
    expect(lockedPlanHabits(undefined, '2026-12-30')).toEqual([]);
  });

  it('S1, S2 e S3', () => {
    const b = repeatBlock(repeatBlock(createBlocks('2026-11-02'), 0), 2);
    expect(s1Block(b)?.start).toBe('2026-11-02');
    expect(s2Block(b)?.start).toBe('2026-11-23');
    expect(s3Block(b)?.start).toBe('2026-11-30');
  });

  it('selo do contexto', () => {
    expect(planBadge(plan(), '2026-11-06')).toBe('Plano · dia 5 de 21 · semana 1, base');
    expect(planBadge(plan(), '2026-11-10')).toBe('Plano · dia 9 de 21 · semana 2, alimentação');
    expect(planBadge(plan(), '2026-11-01')).toBeUndefined();
    expect(themeName(3)).toBe('ajuste fino');
  });
});
