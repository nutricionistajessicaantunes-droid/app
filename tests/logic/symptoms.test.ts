import { describe, expect, it } from 'vitest';
import {
  average,
  averageEnergy,
  averageScore,
  consultSymptomStat,
  isMildSymptomDay,
  isSymptomDay,
  mildSymptomDays,
  perSymptomAverage,
  symptomDays,
  symptomGetter,
} from '../../src/logic/symptoms';
import { rec, week } from '../helpers';

describe('sintomas', () => {
  it('notas da semana [5, sem nota, 3, 4] dão média 4,0', () => {
    const rs = week('2026-11-02', [
      { evacuated: true, symptoms: { estufamento: 5 } },
      { evacuated: true },
      { evacuated: true, symptoms: { gases: 3 } },
      { evacuated: true, symptoms: { dor: 4, gases: 1 } },
    ]);
    expect(averageScore(rs)).toBe(4);
  });

  it('notas [5, 2, 4, 0, 7]: dias com sintoma nas posições 1, 3 e 5', () => {
    const rs = week(
      '2026-11-02',
      [5, 2, 4, 0, 7].map((n) => ({ evacuated: true, symptoms: { dor: n } })),
    );
    const days = symptomDays(rs);
    expect(days.map((d) => d.date)).toEqual(['2026-11-02', '2026-11-04', '2026-11-06']);
    expect(days.map((d) => d.score)).toEqual([5, 4, 7]);
  });

  it('sem nenhum dia acima do limiar, mostra os dias com sintoma leve', () => {
    const rs = week('2026-11-02', [
      { symptoms: { dor: 2 }, tags: ['dormi_mal'], note: '  dia corrido  ' },
      { symptoms: { dor: 0 } },
      { symptoms: { gases: 3 } },
    ]);
    expect(symptomDays(rs)).toEqual([]);
    const mild = mildSymptomDays(rs);
    expect(mild.map((d) => d.date)).toEqual(['2026-11-02', '2026-11-04']);
    expect(mild[0]?.note).toBe('dia corrido');
    expect(mild[0]?.tags).toEqual(['dormi_mal']);
    expect(isMildSymptomDay(0)).toBe(false);
    expect(isMildSymptomDay(undefined)).toBe(false);
    expect(isSymptomDay(4)).toBe(true);
    expect(isSymptomDay(undefined)).toBe(false);
  });

  it('média vazia', () => {
    expect(average([])).toBeUndefined();
    expect(averageScore([rec('d')])).toBeUndefined();
    expect(averageEnergy([rec('d')])).toBeUndefined();
  });

  it('média com uma casa', () => {
    const rs = week('2026-11-02', [
      { symptoms: { dor: 6 } },
      { symptoms: { dor: 6 } },
      { symptoms: { dor: 7 } },
    ]);
    expect(averageScore(rs)).toBe(6.3);
  });

  it('média por sintoma e de energia', () => {
    const rs = week('2026-11-02', [
      { symptoms: { estufamento: 4, gases: 2 }, energy: 6 },
      { symptoms: { estufamento: 6 }, energy: 7 },
      { energy: 5 },
    ]);
    expect(perSymptomAverage(rs)).toEqual({ estufamento: 5, gases: 2 });
    expect(averageEnergy(rs)).toBe(6);
  });

  it('para a ficha: vezes por semana e intensidade dos valores maiores que zero', () => {
    // 14 dias, estufamento em 4 dias (6, 4, 5, 7) e zero em 2.
    const items = Array.from({ length: 14 }, (_, i) => {
      if (i === 0) return { symptoms: { estufamento: 6 } };
      if (i === 3) return { symptoms: { estufamento: 4 } };
      if (i === 8) return { symptoms: { estufamento: 5 } };
      if (i === 12) return { symptoms: { estufamento: 7 } };
      if (i === 5 || i === 6) return { symptoms: { estufamento: 0 } };
      return null;
    });
    const rs = week('2026-11-02', items);
    const stat = consultSymptomStat(rs, symptomGetter('estufamento'), '2026-11-02', '2026-11-15');
    expect(stat).toEqual({ timesPerWeek: 2, intensity: 5.5 });
    expect(consultSymptomStat(rs, symptomGetter('dor'), '2026-11-02', '2026-11-15')).toEqual({});
    const zeros = week('2026-11-02', [{ symptoms: { dor: 0 } }]);
    expect(consultSymptomStat(zeros, symptomGetter('dor'), '2026-11-02', '2026-11-08')).toEqual({
      timesPerWeek: 0,
      intensity: undefined,
    });
  });
});
