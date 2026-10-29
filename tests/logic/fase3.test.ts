import { describe, expect, it } from 'vitest';
import { bristolByDay, niceMax, weeklySummaries } from '../../src/logic/charts';
import { bristolText, consultAutofill, patternText } from '../../src/logic/consult';
import { addDays, daysBetween } from '../../src/logic/dates';
import {
  currentTestIndex,
  defaultEvaluationDate,
  earliestNextStart,
  evaluationRange,
  pauseEnd,
  phase1Baseline,
  phase1Day,
  phase1Evaluation,
  planTests,
  suggestTestResult,
  testBaseline,
  testScores,
} from '../../src/logic/fodmap';
import type { LessonProgress } from '../../src/types';
import { rec, week } from '../helpers';

const D1 = '2026-11-02';

describe('protocolo low FODMAP (seção 7.15)', () => {
  it('conclusão sugerida com linha de base 2', () => {
    expect(suggestTestResult([2, 3, 7], 2)).toBe('quantidade');
    expect(suggestTestResult([6, 7, 8], 2)).toBe('gatilho');
    expect(suggestTestResult([2, 2, 3], 2)).toBe('liberado');
    expect(suggestTestResult([4, 2, 2], 2)).toBe('inconclusivo');
  });
  it('dia atípico ou sem dado dá inconclusivo', () => {
    expect(suggestTestResult([2, 2, 3], 2, true)).toBe('inconclusivo');
    expect(suggestTestResult([2, undefined, 3], 2)).toBe('inconclusivo');
    expect(suggestTestResult([2, 2, 3], undefined)).toBe('inconclusivo');
  });
  it('avaliação da fase 1', () => {
    expect(phase1Evaluation(6, 3.5)).toBe('sim');
    expect(phase1Evaluation(6, 5)).toBe('nao');
    expect(phase1Evaluation(undefined, 3)).toBe('nao');
  });
  it('linha de base da fase 1: 7 dias antes; sem eles, os 3 primeiros dias', () => {
    const antes = week(
      addDays(D1, -7),
      Array.from({ length: 7 }, () => ({ symptoms: { gases: 6 } })),
    );
    expect(phase1Baseline(antes, D1)).toBe(6);
    const depois = week(D1, [
      { symptoms: { gases: 5 } },
      { symptoms: { gases: 3 } },
      { symptoms: { dor: 4 } },
    ]);
    expect(phase1Baseline(depois, D1)).toBe(4);
  });
  it('datas da fase 1 e da fase 2', () => {
    expect(defaultEvaluationDate(D1)).toBe('2026-11-29');
    expect(evaluationRange(D1)).toEqual({ min: '2026-11-15', max: '2026-12-13' });
    expect(phase1Day({ phase1Start: D1 }, addDays(D1, 8))).toEqual({ day: 9, total: 28 });
    const tests = planTests({ lactose: 'Leite' });
    expect(tests.map((t) => t.group)).toEqual([
      'lactose',
      'frutose',
      'sorbitol',
      'manitol',
      'frutanos',
      'galactanos',
    ]);
    expect(tests[0]?.food).toBe('Leite');
    expect(tests[0]?.days).toHaveLength(3);
    const started = [{ ...tests[0]!, start: D1, result: 'liberado' as const }, ...tests.slice(1)];
    expect(pauseEnd(started[0]!)).toBe('2026-11-07');
    expect(earliestNextStart(started, 1)).toBe('2026-11-08');
    expect(currentTestIndex(started)).toBe(1);
  });
  it('linha de base e notas de cada teste', () => {
    const r = week(addDays(D1, -3), [
      { symptoms: { gases: 2 } },
      { symptoms: { gases: 2 } },
      { symptoms: { gases: 2 } },
      { symptoms: { gases: 6 } },
      null,
      { symptoms: { dor: 8 } },
    ]);
    expect(testBaseline(r, D1)).toBe(2);
    expect(testScores(r, { start: D1 })).toEqual([6, undefined, 8]);
    expect(testBaseline(r, D1, { pauseDays: 2 })).toBe(2);
  });
});

describe('gráficos de Resultados', () => {
  it('Bristol por dia: dia sem registro fica vazio', () => {
    const r = [rec(D1, { evacuated: true, bristol: 4 }), rec(addDays(D1, 1), { evacuated: false })];
    const pts = bristolByDay(r, addDays(D1, 2), 3);
    expect(pts).toEqual([
      { date: D1, type: 4 },
      { date: addDays(D1, 1), type: undefined },
      { date: addDays(D1, 2), type: undefined },
    ]);
  });
  it('semanas alinhadas ao dia da leitura, a em andamento até hoje', () => {
    const w = weeklySummaries([], [], '2026-11-04', 0, 3);
    expect(w.map((s) => [s.start, s.end])).toEqual([
      ['2026-10-19', '2026-10-25'],
      ['2026-10-26', '2026-11-01'],
      ['2026-11-02', '2026-11-04'],
    ]);
  });
  it('escala do eixo', () => {
    expect(niceMax([3])).toBe(3);
    expect(niceMax([7])).toBe(10);
    expect(niceMax([12])).toBe(15);
    expect(niceMax([])).toBe(1);
  });
});

describe('ficha para a consulta', () => {
  it('Bristol, padrão, sintomas e alertas das últimas 3 semanas', () => {
    const today = addDays(D1, 20);
    const records = daysBetween(D1, today).map((d, i) =>
      rec(d, {
        evacuated: true,
        bristol: i % 3 === 0 ? 2 : 4,
        effort: i % 3 === 0,
        symptoms: { estufamento: i % 7 === 0 ? 6 : 0 },
        redFlags: i === 4 ? ['febre'] : undefined,
      }),
    );
    const lessons: LessonProgress[] = [
      {
        lessonId: 5,
        watched: true,
        task: { status: 'concluida', data: { resposta: 'Água distribuída' } },
        updatedAt: '',
      },
    ];
    const f = consultAutofill({ records, today, lessons, diary: [] });
    expect(f.bristol).toBe('Tipo 4');
    expect(f.padrao).toBe('Varia, sem alternar entre preso e solto');
    expect(f.sintomas.estufamento).toEqual({ timesPerWeek: 1, intensity: 6 });
    expect(f.sintomas.esforco?.timesPerWeek).toBe(2.3);
    expect(f.alertas).toBe('Febre junto com alteração intestinal (marcado em 6 de novembro)');
    expect(f.testado).toBe('Aula 5, 3 mudanças por 7 dias: Água distribuída');
    expect(f.weeks).toHaveLength(3);
  });
  it('textos do padrão', () => {
    expect(bristolText([2, 4])).toBe('Tipos 2 e 4');
    expect(patternText([1, 6])).toBe('Há alternância entre tipos');
    expect(patternText([4, 4, 3])).toBe('O padrão é sempre o mesmo');
    expect(patternText([])).toBe('');
  });
});
