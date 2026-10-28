import { describe, expect, it } from 'vitest';
import {
  goalFor,
  habitDone,
  habitStat,
  habitsActiveInRange,
  habitsActiveOn,
  habitsDoneCount,
  isHabitActiveOn,
  type ActiveHabit,
} from '../../src/logic/habits';
import { rec, week } from '../helpers';

const agua: ActiveHabit = { id: 'p1', label: 'Água', source: 'plano', activeFrom: '2026-11-02' };

describe('hábitos', () => {
  it('[sim, sim, não, sim, sim, sim, sem registro] dá 5 dias e meta atingida', () => {
    const rs = week('2026-11-02', [
      { habits: { p1: true } },
      { habits: { p1: true } },
      { habits: { p1: false } },
      { habits: { p1: true } },
      { habits: { p1: true } },
      { habits: { p1: true } },
      null,
    ]);
    const s = habitStat(rs, agua, '2026-11-02', '2026-11-08');
    expect(s).toEqual({ id: 'p1', label: 'Água', done: 5, activeDays: 7, goal: 5, reached: true });
  });

  it('4 de 7 fica abaixo da meta', () => {
    const rs = week('2026-11-02', [
      { habits: { p1: true } },
      { habits: { p1: true } },
      { habits: { p1: true } },
      { habits: { p1: true } },
    ]);
    expect(habitStat(rs, agua, '2026-11-02', '2026-11-08').reached).toBe(false);
  });

  it('meta proporcional quando o hábito começou no meio da semana', () => {
    expect(goalFor(7)).toBe(5);
    expect(goalFor(6)).toBe(5);
    expect(goalFor(3)).toBe(3);
    expect(goalFor(1)).toBe(1);
    expect(goalFor(0)).toBe(0);
    const tarde: ActiveHabit = { ...agua, activeFrom: '2026-11-06' };
    const rs = week('2026-11-02', [
      null,
      null,
      null,
      null,
      { habits: { p1: true } },
      { habits: { p1: true } },
      { habits: { p1: true } },
    ]);
    expect(habitStat(rs, tarde, '2026-11-02', '2026-11-08')).toMatchObject({
      done: 3,
      activeDays: 3,
      goal: 3,
      reached: true,
    });
  });

  it('marca fora do período ativo não conta', () => {
    const curto: ActiveHabit = { ...agua, activeTo: '2026-11-03' };
    const rs = week('2026-11-02', [
      { habits: { p1: true } },
      { habits: { p1: true } },
      { habits: { p1: true } },
    ]);
    expect(habitStat(rs, curto, '2026-11-02', '2026-11-08')).toMatchObject({
      done: 2,
      activeDays: 2,
    });
    expect(isHabitActiveOn(curto, '2026-11-04')).toBe(false);
    expect(habitsActiveOn([agua, curto], '2026-11-04').map((h) => h.id)).toEqual(['p1']);
  });

  it('hábito nunca ativo no período', () => {
    const futuro: ActiveHabit = { ...agua, activeFrom: '2026-12-01' };
    expect(habitStat([], futuro, '2026-11-02', '2026-11-08')).toMatchObject({
      activeDays: 0,
      reached: false,
    });
    expect(
      habitsActiveInRange([agua, futuro], '2026-11-02', '2026-11-08').map((h) => h.id),
    ).toEqual(['p1']);
    const passado: ActiveHabit = { ...agua, activeFrom: '2026-10-01', activeTo: '2026-10-10' };
    expect(habitsActiveInRange([passado], '2026-11-02', '2026-11-08')).toEqual([]);
  });

  it('cumprido só quando marcado como sim', () => {
    expect(habitDone(undefined, 'p1')).toBe(false);
    expect(habitDone(rec('d', { habits: { p1: false } }), 'p1')).toBe(false);
    expect(habitsDoneCount(rec('d', { habits: { p1: true, p2: true } }), [agua])).toBe(1);
  });
});
