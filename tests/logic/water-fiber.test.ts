import { describe, expect, it } from 'vitest';
import { getFiberFood, DIA_MODELO_FIBRAS } from '../../src/content/agua-fibras';
import { fiberBand, fiberItemDisplay, fiberOf, fiberTotal } from '../../src/logic/fiber';
import { formatInt } from '../../src/logic/format';
import { isValidWeight, parseWeight, reachedCupGoal, waterGoal } from '../../src/logic/water';

describe('água', () => {
  it('60 kg dá 2.100 ml e copo de 260 ml', () => {
    const g = waterGoal(60);
    expect(g?.ml).toBe(2100);
    expect(g?.cupMl).toBe(260);
    expect(formatInt(g?.ml ?? 0)).toBe('2.100');
  });

  it('65 kg dá 2.275 ml e copo de 280 ml', () => {
    const g = waterGoal(65);
    expect(g?.ml).toBe(2275);
    expect(g?.cupMl).toBe(280);
    expect(g?.distribution).toEqual([3, 3, 2]);
    expect(g?.cups).toBe(8);
  });

  it('não arredonda a meta', () => {
    expect(waterGoal(65.5)?.ml).toBe(2292.5);
  });

  it('peso entre 30 e 300 kg', () => {
    expect(waterGoal(29.9)).toBeUndefined();
    expect(waterGoal(301)).toBeUndefined();
    expect(waterGoal(30)?.ml).toBe(1050);
    expect(waterGoal(300)?.ml).toBe(10500);
    expect(isValidWeight(Number.NaN)).toBe(false);
    expect(isValidWeight('60')).toBe(false);
  });

  it('lê o peso digitado', () => {
    expect(parseWeight('65')).toBe(65);
    expect(parseWeight(' 65,5 ')).toBe(65.5);
    expect(parseWeight('65.25')).toBe(65.25);
    expect(parseWeight('abc')).toBeUndefined();
    expect(parseWeight('')).toBeUndefined();
  });

  it('marca o hábito só na passagem pela meta', () => {
    expect(reachedCupGoal(7, 8)).toBe(true);
    expect(reachedCupGoal(8, 9)).toBe(false);
    expect(reachedCupGoal(6, 7)).toBe(false);
  });
});

describe('fibra', () => {
  it('dia modelo calculado pela tabela por 100 g dá 27 g', () => {
    const entries = DIA_MODELO_FIBRAS.map((it) => ({
      per100: getFiberFood(it.foodId)?.per100 ?? 0,
      grams: it.grams,
    }));
    expect(fiberTotal(entries)).toBe(27);
    expect(entries.map(fiberItemDisplay)).toEqual([2.7, 5, 2, 8.5, 1.6, 2.4, 1.7, 3.3]);
  });

  it('conta de cada item', () => {
    expect(fiberOf({ per100: 33.5, grams: 15 })).toBeCloseTo(5.025);
    expect(fiberOf({ per100: 10, grams: 0 })).toBe(0);
    expect(fiberOf({ per100: Number.NaN, grams: 10 })).toBe(0);
  });

  it('faixas', () => {
    expect(fiberBand(24)).toBe('abaixo');
    expect(fiberBand(25)).toBe('meta');
    expect(fiberBand(30)).toBe('meta');
    expect(fiberBand(31)).toBe('acima');
  });
});
