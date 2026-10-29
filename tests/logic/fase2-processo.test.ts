import { describe, expect, it } from 'vitest';
import {
  crisisNoImprovement,
  crisisPatchForRecord,
  crisisStage,
  shouldSuggestCrisis,
  stageForDay,
} from '../../src/logic/crisis';
import { addDays } from '../../src/logic/dates';
import { monthlyReviewDue, monthlyWeeks } from '../../src/logic/monthly';
import { nextLesson, nextSteps, semanaZeroMissing } from '../../src/logic/nextStep';
import { createBlocks, reevaluationFrom } from '../../src/logic/plan';
import { planAbsence, planNotesFor } from '../../src/logic/planNotes';
import {
  cycleBlock,
  manualReadingPeriod,
  pendingCycleReading,
  pendingFreeReading,
  pendingPlanReading,
  planPatchForDecision,
  readingId,
} from '../../src/logic/readings';
import type { CrisisState, LessonProgress, PlanState, WeeklyReading } from '../../src/types';
import { rec, week } from '../helpers';

const D1 = '2026-11-02'; // segunda-feira
const plan = (over: Partial<PlanState> = {}): PlanState => ({
  id: 'plan',
  status: 'ativo',
  semanaZero: {},
  day1: D1,
  blocks: createBlocks(D1),
  updatedAt: '',
  ...over,
});
const reading = (over: Partial<WeeklyReading>): WeeklyReading => ({
  id: 'x',
  start: D1,
  end: addDays(D1, 6),
  context: 'plano',
  computed: {},
  commonNotes: '',
  keep: '',
  adjust: '',
  createdAt: '',
  updatedAt: '',
  ...over,
});
const lesson = (lessonId: number, over: Partial<LessonProgress['task']> = {}, watched = true): LessonProgress => ({
  lessonId,
  watched,
  task: { status: 'nao_iniciada', data: {}, ...over },
  updatedAt: '',
});

describe('leitura da semana', () => {
  it('fica pendente no último dia do bloco e some depois de feita', () => {
    expect(pendingPlanReading(plan(), [], addDays(D1, 5))).toBeUndefined();
    const p = pendingPlanReading(plan(), [], addDays(D1, 6));
    expect(p).toEqual({ context: 'plano', start: D1, end: addDays(D1, 6), planBlockIndex: 0 });
    expect(pendingPlanReading(plan(), [reading({})], addDays(D1, 6))).toBeUndefined();
  });

  it('atrasada continua pendente enquanto o bloco seguinte não termina', () => {
    expect(pendingPlanReading(plan(), [], addDays(D1, 10))?.planBlockIndex).toBe(0);
    expect(pendingPlanReading(plan(), [], addDays(D1, 13))?.planBlockIndex).toBe(1);
  });

  it('repetir a semana do tema 1 empurra os blocos (seção 7.15)', () => {
    const p = plan();
    const patch = planPatchForDecision(p, { context: 'plano', start: D1, end: addDays(D1, 6), planBlockIndex: 0 }, 'repetir');
    const blocks = patch?.blocks ?? [];
    expect(blocks.map((b) => [b.theme, b.start])).toEqual([
      [1, '2026-11-02'],
      [1, '2026-11-09'],
      [2, '2026-11-16'],
      [3, '2026-11-23'],
    ]);
    expect(reevaluationFrom(blocks)).toBe('2026-11-30');
    expect(planPatchForDecision(p, { context: 'plano', start: D1, end: D1, planBlockIndex: 0 }, 'avancar')).toBeUndefined();
  });

  it('ciclo: lê no fim de cada semana e repetir soma uma semana', () => {
    const p = plan({ status: 'concluido', cycles: [{ start: '2026-12-01', habitIds: ['c1'] }] });
    expect(cycleBlock({ start: '2026-12-01', weeks: 2 })).toEqual({ start: '2026-12-08', end: '2026-12-14' });
    expect(pendingCycleReading(p, [], '2026-12-06')).toBeUndefined();
    const pend = pendingCycleReading(p, [], '2026-12-07');
    expect(pend).toMatchObject({ context: 'ciclo', start: '2026-12-01', cycleIndex: 0 });
    expect(planPatchForDecision(p, pend!, 'repetir')?.cycles?.[0]?.weeks).toBe(2);
    expect(pendingCycleReading(p, [reading({ context: 'ciclo', start: '2026-12-01' })], '2026-12-07')).toBeUndefined();
  });

  it('fora do plano, só depois de começar a tarefa da aula 16', () => {
    const profile = { readingWeekday: 0 };
    const today = '2026-11-09'; // segunda; a leitura é no domingo 08/11
    expect(pendingFreeReading(profile, [], undefined, [], today)).toBeUndefined();
    const l16 = [lesson(16, { status: 'em_andamento', startDate: '2026-11-03' })];
    expect(pendingFreeReading(profile, l16, undefined, [], today)).toEqual({
      context: 'livre',
      start: '2026-11-02',
      end: '2026-11-08',
    });
    expect(pendingFreeReading(profile, l16, undefined, [reading({ context: 'livre', end: '2026-11-08' })], today)).toBeUndefined();
    expect(pendingFreeReading(profile, l16, plan(), [], today)).toBeUndefined();
  });

  it('aberta à mão: os últimos 7 dias completos; id estável por contexto e início', () => {
    expect(manualReadingPeriod('2026-11-09')).toEqual({ context: 'livre', start: '2026-11-02', end: '2026-11-08' });
    expect(readingId({ context: 'plano', start: D1 })).toBe('leitura-plano-2026-11-02');
  });
});

describe('recados e ausência no plano', () => {
  it('semana 1, dia 4 e começo dos temas 2 e 3, uma vez cada', () => {
    expect(planNotesFor(plan(), D1).map((n) => n.id)).toEqual(['semana1']);
    expect(planNotesFor(plan({ seenNotes: ['semana1'] }), addDays(D1, 3)).map((n) => n.id)).toEqual(['dia4']);
    expect(planNotesFor(plan({ seenNotes: ['semana1', 'dia4'] }), addDays(D1, 7)).map((n) => n.id)).toEqual(['tema2']);
    expect(planNotesFor(plan({ seenNotes: ['tema2'] }), addDays(D1, 15)).map((n) => n.id)).toEqual(['tema3']);
    expect(planNotesFor(plan(), addDays(D1, -1))).toEqual([]);
  });

  it('5 dias sem registrar durante o plano pede "Retome hoje"', () => {
    const records = [rec(addDays(D1, 1), { evacuated: true })];
    expect(planAbsence(plan(), records, addDays(D1, 6))).toBeUndefined();
    expect(planAbsence(plan(), records, addDays(D1, 7))).toEqual({ since: addDays(D1, 1) });
    expect(planAbsence(plan(), [...records, rec(addDays(D1, 5), { evacuated: false })], addDays(D1, 7))).toBeUndefined();
    expect(planAbsence(plan(), [], addDays(D1, 4))).toBeUndefined();
  });
});

describe('modo crise e a volta', () => {
  const base: CrisisState = { id: 'crisis', active: true, startedAt: '2026-11-02', updatedAt: '' };

  it('etapas por dia desde a melhora', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 12].map(stageForDay)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
  });

  it('Bristol 5 ou menos marca a melhora; 6 ou 7 antes disso não muda nada', () => {
    expect(crisisPatchForRecord(base, rec('2026-11-03', { evacuated: true, bristol: 7 }))).toBeUndefined();
    expect(crisisPatchForRecord(base, rec('2026-11-04', { evacuated: true, bristol: 5 }))).toEqual({ improvedAt: '2026-11-04' });
    expect(crisisPatchForRecord(base, rec('2026-11-01', { evacuated: true, bristol: 4 }))).toBeUndefined();
  });

  it('tipo 6 ou 7 depois de começar uma etapa segura por 2 dias e retoma do começo dela', () => {
    const c: CrisisState = { ...base, improvedAt: '2026-11-04' };
    expect(crisisStage(c, '2026-11-07')).toEqual({ stage: 2, day: 4, holding: false });
    const patch = crisisPatchForRecord(c, rec('2026-11-07', { evacuated: true, bristol: 6 }));
    expect(patch).toMatchObject({ holdUntil: '2026-11-09', heldStage: 2, lastRelapseDay: '2026-11-07' });
    const held = { ...c, ...patch };
    expect(crisisStage(held, '2026-11-08')).toEqual({ stage: 2, day: 3, holding: true });
    expect(crisisStage(held, '2026-11-09')?.holding).toBe(true);
    expect(crisisStage(held, '2026-11-10')).toEqual({ stage: 2, day: 3, holding: false });
    expect(crisisStage(held, '2026-11-12')).toEqual({ stage: 3, day: 5, holding: false });
    // O mesmo registro salvo de novo não conta duas vezes.
    expect(crisisPatchForRecord(held, rec('2026-11-07', { evacuated: true, bristol: 6 }))).toBeUndefined();
  });

  it('sem melhora em 2 dias pede atendimento', () => {
    expect(crisisNoImprovement(base, '2026-11-03')).toBe(false);
    expect(crisisNoImprovement(base, '2026-11-04')).toBe(true);
    expect(crisisNoImprovement({ ...base, improvedAt: '2026-11-03' }, '2026-11-05')).toBe(false);
  });

  it('sugere o modo crise com 2 dias seguidos de tipo 6 ou 7', () => {
    const r = week('2026-11-02', [{ evacuated: true, bristol: 6 }, { evacuated: true, bristol: 7 }]);
    expect(shouldSuggestCrisis(r, '2026-11-03', false)).toBe(true);
    expect(shouldSuggestCrisis(r, '2026-11-04', false)).toBe(true);
    expect(shouldSuggestCrisis(r, '2026-11-03', true)).toBe(false);
    expect(shouldSuggestCrisis(r, '2026-11-03', false, '2026-11-05')).toBe(false);
    expect(shouldSuggestCrisis([...r, rec('2026-11-04', { evacuated: true, bristol: 4 })], '2026-11-04', false)).toBe(false);
  });
});

describe('revisão do mês', () => {
  const p = plan({ status: 'concluido', concludedOn: '2026-11-25' });
  it('a partir do dia escolhido, depois do fim do plano, até ser feita', () => {
    expect(monthlyReviewDue({ monthlyReviewDay: 10 }, p, '2026-11-26')).toBe(false);
    expect(monthlyReviewDue({ monthlyReviewDay: 10 }, p, '2026-12-09')).toBe(false);
    expect(monthlyReviewDue({ monthlyReviewDay: 10 }, p, '2026-12-10')).toBe(true);
    expect(monthlyReviewDue({ monthlyReviewDay: 10 }, p, '2026-12-15', { dismissed: { 'revisao:2026-12': 'x' } })).toBe(false);
    expect(monthlyReviewDue({}, p, '2026-12-10')).toBe(false);
  });
  it('quatro semanas terminando hoje', () => {
    const w = monthlyWeeks('2026-11-28');
    expect(w[0]).toEqual({ start: '2026-11-01', end: '2026-11-07' });
    expect(w[3]).toEqual({ start: '2026-11-22', end: '2026-11-28' });
  });
});

describe('teu próximo passo', () => {
  const profile = { readingWeekday: 0 };
  it('sem nada feito: a aula 1', () => {
    expect(nextSteps({ today: D1, profile, lessons: [], readings: [] })[0]).toEqual({ kind: 'aula', lessonId: 1, watched: false });
  });
  it('aula assistida com tarefa por começar; dispensada passa para a próxima', () => {
    expect(nextLesson([lesson(1)])).toEqual({ lessonId: 1, watched: true });
    expect(nextLesson([lesson(1, { data: { dispensada: true } })])).toEqual({ lessonId: 2, watched: false });
    expect(nextLesson([lesson(1, { status: 'concluida' })])).toEqual({ lessonId: 2, watched: false });
  });
  it('tarefa em andamento vem antes da próxima aula', () => {
    const lessons = [lesson(1, { status: 'em_andamento', startDate: D1 })];
    expect(nextSteps({ today: addDays(D1, 1), profile, lessons, readings: [] })[0]).toEqual({ kind: 'tarefa', lessonId: 1, day: 2, total: 3, ready: false });
    expect(nextSteps({ today: addDays(D1, 3), profile, lessons, readings: [] })[0]).toMatchObject({ kind: 'tarefa', ready: true });
  });
  it('ordem: crise, reavaliação, leitura, plano', () => {
    const crisis: CrisisState = { id: 'crisis', active: true, updatedAt: '' };
    const kinds = nextSteps({ today: addDays(D1, 21), profile, plan: plan(), lessons: [], readings: [], crisis }).map((s) => s.kind);
    expect(kinds.slice(0, 3)).toEqual(['crise', 'reavaliacao', 'leitura']);
    expect(nextSteps({ today: addDays(D1, 2), profile, plan: plan(), lessons: [], readings: [] })[0]).toEqual({ kind: 'plano_hoje', day: 3, blockIndex: 0 });
    expect(nextSteps({ today: addDays(D1, -2), profile, plan: plan(), lessons: [], readings: [] })[0]).toEqual({ kind: 'plano_comeca', start: D1 });
  });
  it('semana zero, preparar a semana zero e manutenção', () => {
    const sz = plan({ status: 'semana_zero', blocks: [], semanaZero: { compra: true } });
    expect(semanaZeroMissing(sz)).toBe(5);
    expect(nextSteps({ today: D1, profile, plan: sz, lessons: [], readings: [] })[0]).toEqual({ kind: 'semana_zero', missing: 5 });
    const all = Array.from({ length: 17 }, (_, i) => lesson(i + 1, { status: 'concluida' }));
    expect(nextSteps({ today: D1, profile, lessons: all, readings: [] }).map((s) => s.kind)).toContain('preparar_semana_zero');
    const done = plan({ status: 'concluido', concludedOn: '2026-11-25' });
    expect(nextSteps({ today: '2026-11-27', profile, plan: done, lessons: all, readings: [] })[0]).toEqual({ kind: 'plano_minimo' });
    expect(nextSteps({ today: '2026-12-10', profile: { ...profile, monthlyReviewDay: 10 }, plan: done, lessons: all, readings: [] })[0]).toEqual({ kind: 'revisao_mes' });
  });
});
