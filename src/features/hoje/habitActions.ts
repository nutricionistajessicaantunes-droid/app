import { getDb } from '../../db/index';
import { nowIso } from '../../db/repo';
import { reachedCupGoal } from '../../logic/water';
import type { DayKey, DayRecord } from '../../types';

/** Grava hábitos e copos direto no registro do dia, numa transação. */
export async function updateHabitsAndWater(
  day: DayKey,
  change: (r: DayRecord | undefined) => Partial<DayRecord>,
): Promise<void> {
  const db = getDb();
  await db.transaction('rw', db.days, async () => {
    const existing = await db.days.get(day);
    const now = nowIso();
    const patch = change(existing);
    await db.days.put({
      ...(existing ?? { date: day, createdAt: now }),
      ...patch,
      date: day,
      updatedAt: now,
    } as DayRecord);
  });
}

export function setWaterCups(day: DayKey, next: number, waterHabitId: string | undefined) {
  return updateHabitsAndWater(day, (r) => {
    const prev = r?.waterCups ?? 0;
    const patch: Partial<DayRecord> = { waterCups: next };
    if (waterHabitId && reachedCupGoal(prev, next))
      patch.habits = { ...(r?.habits ?? {}), [waterHabitId]: true };
    return patch;
  });
}

export function toggleHabit(day: DayKey, habitId: string, done: boolean) {
  return updateHabitsAndWater(day, (r) => ({ habits: { ...(r?.habits ?? {}), [habitId]: done } }));
}
