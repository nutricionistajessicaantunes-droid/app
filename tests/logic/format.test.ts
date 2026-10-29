import { describe, expect, it } from 'vitest';
import {
  capitalize,
  deTotal,
  formatCompact,
  formatDecimal,
  formatInt,
  joinPt,
  round1,
} from '../../src/logic/format';

describe('formatação de números', () => {
  it('vírgula decimal e ponto de milhar', () => {
    expect(formatDecimal(4)).toBe('4,0');
    expect(formatDecimal(6.15)).toBe('6,2');
    expect(formatInt(2275)).toBe('2.275');
    expect(formatInt(2100.4)).toBe('2.100');
    expect(formatCompact(5)).toBe('5');
    expect(formatCompact(2.73)).toBe('2,7');
  });

  it('arredonda meio para cima', () => {
    expect(round1(1.55)).toBe(1.6);
    expect(round1(2.25)).toBe(2.3);
    expect(round1(4.04)).toBe(4);
  });

  it('textos', () => {
    expect(deTotal(5, 7)).toBe('5 de 7');
    expect(joinPt([])).toBe('');
    expect(joinPt(['a'])).toBe('a');
    expect(joinPt(['a', 'b'])).toBe('a e b');
    expect(joinPt(['a', 'b', 'c'])).toBe('a, b e c');
    expect(capitalize('dormi mal')).toBe('Dormi mal');
    expect(capitalize('')).toBe('');
  });
});
