import { describe, expect, it } from 'vitest';
import {
  commonFactors,
  commonFactorsSentence,
  commonFactorsSuggestion,
} from '../../src/logic/commonFactors';
import type { ActiveHabit } from '../../src/logic/habits';
import { averageHabitDays, dayFactors, summarizeWeek } from '../../src/logic/week';
import type { DiaryEntry } from '../../src/types';
import { rec, week } from '../helpers';

const habits: ActiveHabit[] = [
  { id: 'p1', label: 'Água distribuída no dia', source: 'plano', activeFrom: '2026-11-02' },
  {
    id: 'p2',
    label: 'Rotina de banheiro depois do café',
    source: 'plano',
    activeFrom: '2026-11-02',
  },
];

describe('summarizeWeek', () => {
  it('semana completa', () => {
    const rs = week('2026-11-02', [
      {
        evacuated: true,
        evacuationCount: 2,
        bristol: 4,
        symptoms: { estufamento: 5 },
        energy: 6,
        habits: { p1: true, p2: true },
        tags: ['dormi_mal'],
      },
      {
        evacuated: true,
        bristol: 4,
        symptoms: { estufamento: 2 },
        energy: 7,
        habits: { p1: true },
      },
      {
        evacuated: true,
        bristol: 2,
        effort: true,
        incomplete: true,
        symptoms: { estufamento: 6 },
        energy: 4,
        habits: { p1: true, p2: true },
        tags: ['dormi_mal', 'comi_correndo'],
      },
      {
        evacuated: true,
        bristol: 4,
        symptoms: { estufamento: 1 },
        energy: 7,
        habits: { p1: true },
      },
      {
        evacuated: true,
        bristol: 6,
        symptoms: { estufamento: 4 },
        energy: 5,
        habits: { p1: true, p2: true },
        tags: ['comi_correndo'],
      },
      null,
      {
        evacuated: true,
        bristol: 3,
        symptoms: { estufamento: 0 },
        energy: 8,
        habits: { p2: true },
      },
    ]);
    const s = summarizeWeek({ records: rs, habits, start: '2026-11-02', end: '2026-11-08' });
    expect(s.registeredDays).toBe(6);
    expect(s.weak).toBe(false);
    expect(s.bristol.modes).toEqual([4]);
    expect(s.bristol.band).toBe('saudavel');
    expect(s.bristol.alternation).toBe(true);
    expect(s.bristol.daysWithType).toBe(6);
    expect(s.evacuations).toEqual({ days: 6, total: 7 });
    expect(s.effortDays).toBe(1);
    expect(s.incompleteDays).toBe(1);
    expect(s.symptomAverage).toBe(3);
    expect(s.symptomDays.map((d) => d.date)).toEqual(['2026-11-02', '2026-11-04', '2026-11-06']);
    expect(s.mildSymptomDays).toEqual([]);
    expect(s.energyAverage).toBe(6.2);
    expect(s.habits.map((h) => [h.id, h.done, h.reached])).toEqual([
      ['p1', 5, true],
      ['p2', 4, false],
    ]);
    expect(s.habitsBelowGoal).toEqual(['p2']);
    // dormi mal: 2 de 3 dias com sintoma, 0 dos outros 3.
    expect(s.commonFactors.map((f) => [f.label, f.count, f.total])).toEqual([
      ['comi correndo', 2, 3],
      ['dormi mal', 2, 3],
    ]);
  });

  it('dia sem registro nunca vira "não evacuou" nem nota zero', () => {
    const rs = week('2026-11-02', [{ evacuated: true, bristol: 4, symptoms: { dor: 6 } }]);
    const s = summarizeWeek({ records: rs, habits: [], start: '2026-11-02', end: '2026-11-08' });
    expect(s.registeredDays).toBe(1);
    expect(s.weak).toBe(true);
    expect(s.symptomAverage).toBe(6);
    expect(s.evacuations).toEqual({ days: 1, total: 1 });
  });

  it('semana vazia', () => {
    const s = summarizeWeek({ records: [], habits, start: '2026-11-02', end: '2026-11-08' });
    expect(s.registeredDays).toBe(0);
    expect(s.bristol.modes).toEqual([]);
    expect(s.symptomAverage).toBeUndefined();
    expect(s.energyAverage).toBeUndefined();
    expect(s.commonFactors).toEqual([]);
    expect(s.habits.every((h) => h.done === 0)).toBe(true);
  });

  it('ignora registros fora do período', () => {
    const rs = [
      rec('2026-11-01', { evacuated: true, bristol: 1 }),
      rec('2026-11-09', { evacuated: true, bristol: 1 }),
    ];
    const s = summarizeWeek({ records: rs, habits: [], start: '2026-11-02', end: '2026-11-08' });
    expect(s.registeredDays).toBe(0);
  });

  it('dias leves quando nenhum chega no limiar', () => {
    const rs = week('2026-11-02', [
      { evacuated: true, symptoms: { dor: 2 } },
      { evacuated: true, symptoms: { dor: 3 } },
    ]);
    const s = summarizeWeek({ records: rs, habits: [], start: '2026-11-02', end: '2026-11-08' });
    expect(s.symptomDays).toEqual([]);
    expect(s.mildSymptomDays).toHaveLength(2);
  });

  it('alimentos do diário entram como fatores', () => {
    const rs = week('2026-11-02', [
      { evacuated: true, symptoms: { gases: 6 } },
      { evacuated: true, symptoms: { gases: 7 } },
      { evacuated: true, symptoms: { gases: 1 } },
    ]);
    const meal = (date: string, foods: string[]): DiaryEntry => ({
      id: date + foods.join(),
      date,
      time: '12:00',
      kind: 'refeicao',
      foods,
      createdAt: '',
      updatedAt: '',
    });
    const diary = [
      meal('2026-11-02', ['Feijão', 'arroz']),
      meal('2026-11-03', ['feijões']),
      meal('2026-11-04', ['arroz']),
    ];
    const s = summarizeWeek({
      records: rs,
      habits: [],
      start: '2026-11-02',
      end: '2026-11-08',
      diary,
    });
    expect(s.commonFactors.map((f) => [f.kind, f.label, f.count])).toEqual([['food', 'feijão', 2]]);
    expect(dayFactors(rec('2026-11-05'), diary)).toEqual({
      date: '2026-11-05',
      tags: [],
      foods: [],
    });
  });
});

describe('fatores em comum', () => {
  const d = (date: string, tags: string[]) => ({ date, tags: tags as never[], foods: [] });

  it('precisa de pelo menos 2 dias e diferença de 30 pontos', () => {
    const symptom = [
      d('a', ['dormi_mal', 'treinei']),
      d('b', ['dormi_mal', 'treinei']),
      d('c', ['dormi_mal']),
      d('d', []),
    ];
    const others = [d('e', ['treinei']), d('f', ['treinei']), d('g', [])];
    const f = commonFactors(symptom, others);
    // dormi mal: 3/4 contra 0/3. treinei: 2/4 = 0,5 contra 2/3: não aparece.
    expect(f.map((x) => [x.label, x.count, x.total, x.otherCount, x.otherTotal])).toEqual([
      ['dormi mal', 3, 4, 0, 3],
    ]);
    expect(commonFactorsSentence(f)).toBe(
      'Nos dias com sintoma, apareceu mais: dormi mal (3 de 4 dias).',
    );
  });

  it('sem outros dias, basta aparecer em 2', () => {
    const f = commonFactors(
      [d('a', ['viagem']), d('b', ['viagem']), d('c', ['estresse_alto'])],
      [],
    );
    expect(f.map((x) => x.label)).toEqual(['viagem']);
  });

  it('exatamente 30 pontos de diferença conta', () => {
    // 4/5 = 0,8 contra 1/2 = 0,5.
    const symptom = ['a', 'b', 'c', 'd', 'e'].map((x, i) => d(x, i < 4 ? ['dia_corrido'] : []));
    const others = [d('f', ['dia_corrido']), d('g', [])];
    expect(commonFactors(symptom, others).map((x) => x.label)).toEqual(['dia corrido']);
  });

  it('frase e sugestão com vários fatores', () => {
    const symptom = [
      d('a', ['dormi_mal', 'comi_correndo']),
      d('b', ['dormi_mal', 'comi_correndo']),
      d('c', ['dormi_mal']),
      d('d', []),
    ];
    const f = commonFactors(symptom, [d('e', [])]);
    expect(commonFactorsSentence(f)).toBe(
      'Nos dias com sintoma, apareceu mais: dormi mal (3 de 4 dias), comi correndo (2 de 4).',
    );
    expect(commonFactorsSuggestion(f)).toBe('dormi mal e comi correndo');
    expect(commonFactorsSentence([])).toBe('');
    expect(commonFactorsSuggestion([])).toBe('');
    expect(commonFactors([], [])).toEqual([]);
  });

  it('média de dias por hábito: 6, 5, 3 e 4 dão 4,5', () => {
    const stat = (done: number) => ({
      id: String(done),
      label: '',
      done,
      activeDays: 7,
      goal: 5,
      reached: done >= 5,
    });
    expect(averageHabitDays([stat(6), stat(5), stat(3), stat(4)])).toBe(4.5);
    expect(averageHabitDays([])).toBeUndefined();
  });
});
