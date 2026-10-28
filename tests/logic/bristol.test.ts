import { describe, expect, it } from 'vitest';
import {
  bandOf,
  bandOfModes,
  bristolDistribution,
  bristolModes,
  hasAlternation,
  isBristol,
  isHealthy,
  modesDistanceTo4,
  modesHealthy,
} from '../../src/logic/bristol';
import type { Bristol } from '../../src/types';

describe('Bristol', () => {
  it('faixas', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map((t) => bandOf(t as Bristol))).toEqual([
      'lenta',
      'lenta',
      'saudavel',
      'saudavel',
      'saudavel',
      'rapida',
      'rapida',
    ]);
    expect(isHealthy(3)).toBe(true);
    expect(isHealthy(6)).toBe(false);
  });

  it('semana [4, 4, 2, 4, 6, sem registro, 3]: moda 4, faixa saudável, alternância, 6 dias com tipo', () => {
    const types: Bristol[] = [4, 4, 2, 4, 6, 3];
    expect(bristolModes(types)).toEqual([4]);
    expect(bandOfModes(bristolModes(types))).toBe('saudavel');
    expect(hasAlternation(types)).toBe(true);
    expect(types.length).toBe(6);
    expect(bristolDistribution(types)).toEqual([0, 1, 1, 3, 0, 1, 0]);
  });

  it('[2, 2, 4, 4] tem duas modas', () => {
    expect(bristolModes([2, 2, 4, 4])).toEqual([2, 4]);
    expect(bandOfModes([2, 4])).toBeUndefined();
    expect(bandOfModes([3, 4])).toBe('saudavel');
  });

  it('sem tipos', () => {
    expect(bristolModes([])).toEqual([]);
    expect(bandOfModes([])).toBeUndefined();
    expect(hasAlternation([])).toBe(false);
    expect(modesHealthy([])).toBe(false);
    expect(modesDistanceTo4([])).toBeUndefined();
  });

  it('alternância precisa dos dois lados', () => {
    expect(hasAlternation([1, 4, 4])).toBe(false);
    expect(hasAlternation([7, 4])).toBe(false);
    expect(hasAlternation([1, 7])).toBe(true);
  });

  it('modas saudáveis e distância até o 4', () => {
    expect(modesHealthy([3, 5])).toBe(true);
    expect(modesHealthy([2, 4])).toBe(false);
    expect(modesDistanceTo4([2])).toBe(2);
    expect(modesDistanceTo4([2, 4])).toBe(1);
  });

  it('isBristol', () => {
    expect(isBristol(4)).toBe(true);
    expect(isBristol(0)).toBe(false);
    expect(isBristol(8)).toBe(false);
    expect(isBristol(4.5)).toBe(false);
    expect(isBristol('4')).toBe(false);
  });
});
