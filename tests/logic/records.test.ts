import { describe, expect, it } from 'vitest';
import {
  bristolOf,
  dayScore,
  evacuationsOf,
  hasData,
  indexByDate,
  isRegistered,
  lastRegisteredOnOrBefore,
  looseStreakEndingAt,
  noEvacuationStreakEndingAt,
  recordsInRange,
  registeredDaysIn,
  symptomValue,
} from '../../src/logic/records';
import { rec, week } from '../helpers';

describe('registros', () => {
  it('registrado só quando "Você evacuou?" foi respondida', () => {
    expect(isRegistered(undefined)).toBe(false);
    expect(isRegistered(rec('2026-11-03'))).toBe(false);
    expect(isRegistered(rec('2026-11-03', { habits: { p1: true } }))).toBe(false);
    expect(isRegistered(rec('2026-11-03', { evacuated: false }))).toBe(true);
    expect(isRegistered(rec('2026-11-03', { evacuated: true }))).toBe(true);
  });

  it('evacuações: sim sem quantidade conta 1, não registrado conta 0', () => {
    expect(evacuationsOf(rec('d', { evacuated: true }))).toBe(1);
    expect(evacuationsOf(rec('d', { evacuated: true, evacuationCount: 3 }))).toBe(3);
    expect(evacuationsOf(rec('d', { evacuated: false, evacuationCount: 2 }))).toBe(0);
    expect(evacuationsOf(undefined)).toBe(0);
  });

  it('Bristol só conta quando evacuou', () => {
    expect(bristolOf(rec('d', { evacuated: true, bristol: 4 }))).toBe(4);
    expect(bristolOf(rec('d', { evacuated: false, bristol: 4 }))).toBeUndefined();
  });

  it('nota do dia é o maior sintoma: {estufamento 5, gases 2} dá 5', () => {
    expect(dayScore(rec('d', { symptoms: { estufamento: 5, gases: 2 } }))).toBe(5);
    expect(dayScore(rec('d', { symptoms: {} }))).toBeUndefined();
    expect(dayScore(rec('d'))).toBeUndefined();
    expect(dayScore(undefined)).toBeUndefined();
    expect(dayScore(rec('d', { symptoms: { dor: 0 } }))).toBe(0);
    expect(symptomValue(rec('d', { symptoms: { dor: 3 } }), 'dor')).toBe(3);
    expect(symptomValue(rec('d'), 'dor')).toBeUndefined();
  });

  it('dia com dado', () => {
    expect(hasData(rec('d', { symptoms: { dor: 2 } }))).toBe(true);
    expect(hasData(rec('d', { note: 'só nota' }))).toBe(false);
  });

  it('sequência sem evacuar só com dias registrados com "Não"', () => {
    const rs = week('2026-11-01', [
      { evacuated: true },
      { evacuated: false },
      { evacuated: false },
      { evacuated: false },
    ]);
    expect(noEvacuationStreakEndingAt(rs, '2026-11-04')).toBe(3);
    const gap = week('2026-11-01', [
      { evacuated: false },
      null,
      { evacuated: false },
      { evacuated: false },
    ]);
    expect(noEvacuationStreakEndingAt(gap, '2026-11-04')).toBe(2);
  });

  it('sequência de tipo 6 ou 7', () => {
    const rs = week('2026-11-01', [
      { evacuated: true, bristol: 4 },
      { evacuated: true, bristol: 6 },
      { evacuated: true, bristol: 7 },
    ]);
    expect(looseStreakEndingAt(rs, '2026-11-03')).toBe(2);
    expect(looseStreakEndingAt(rs, '2026-11-01')).toBe(0);
  });

  it('período, contagem e último registro', () => {
    const rs = week('2026-11-01', [{ evacuated: true }, null, { evacuated: false }, { note: 'x' }]);
    expect(recordsInRange(rs, '2026-11-02', '2026-11-04').map((r) => r.date)).toEqual([
      '2026-11-03',
      '2026-11-04',
    ]);
    expect(registeredDaysIn(rs, '2026-11-01', '2026-11-07')).toBe(2);
    expect(lastRegisteredOnOrBefore(rs, '2026-11-07')).toBe('2026-11-03');
    expect(lastRegisteredOnOrBefore(rs, '2026-10-30')).toBeUndefined();
    expect(indexByDate(rs).size).toBe(3);
  });
});
