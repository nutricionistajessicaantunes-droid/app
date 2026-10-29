import { META_DIAS_HABITO } from '../config';
import type { DayKey, DayRecord } from '../types';
import { daysBetween } from './dates';
import { indexByDate } from './records';

/** Hábito com período de atividade já resolvido (plano, tarefa, plano mínimo, ciclo). */
export interface ActiveHabit {
  id: string;
  label: string;
  detail?: string;
  source: string;
  activeFrom: DayKey;
  activeTo?: DayKey;
  isWater?: boolean;
  trigger?: string;
}

export function isHabitActiveOn(
  h: Pick<ActiveHabit, 'activeFrom' | 'activeTo'>,
  day: DayKey,
): boolean {
  return day >= h.activeFrom && (h.activeTo === undefined || day <= h.activeTo);
}

export function habitsActiveOn<T extends Pick<ActiveHabit, 'activeFrom' | 'activeTo'>>(
  habits: T[],
  day: DayKey,
): T[] {
  return habits.filter((h) => isHabitActiveOn(h, day));
}

/** Hábito cumprido no dia: só quando marcado como sim. Dia sem registro não conta. */
export function habitDone(r: DayRecord | undefined, habitId: string): boolean {
  return r?.habits?.[habitId] === true;
}

/**
 * Meta proporcional ao número de dias em que o hábito esteve ativo:
 * 7 dias dão 5 (cinco de sete). Ver docs/PERGUNTAS.md.
 */
export function goalFor(activeDays: number): number {
  if (activeDays <= 0) return 0;
  return Math.ceil((activeDays * META_DIAS_HABITO) / 7);
}

export interface HabitStat {
  id: string;
  label: string;
  done: number;
  activeDays: number;
  goal: number;
  reached: boolean;
}

export function habitStat(
  records: DayRecord[],
  habit: ActiveHabit,
  start: DayKey,
  end: DayKey,
): HabitStat {
  const map = indexByDate(records);
  let done = 0;
  let activeDays = 0;
  for (const d of daysBetween(start, end)) {
    if (!isHabitActiveOn(habit, d)) continue;
    activeDays++;
    if (habitDone(map.get(d), habit.id)) done++;
  }
  const goal = goalFor(activeDays);
  return {
    id: habit.id,
    label: habit.label,
    done,
    activeDays,
    goal,
    reached: activeDays > 0 && done >= goal,
  };
}

/** Hábitos que estiveram ativos em pelo menos um dia do período. */
export function habitsActiveInRange(
  habits: ActiveHabit[],
  start: DayKey,
  end: DayKey,
): ActiveHabit[] {
  return habits.filter(
    (h) => h.activeFrom <= end && (h.activeTo === undefined || h.activeTo >= start),
  );
}

/** Quantos hábitos do dia foram cumpridos. */
export function habitsDoneCount(r: DayRecord | undefined, habits: ActiveHabit[]): number {
  return habits.filter((h) => habitDone(r, h.id)).length;
}
