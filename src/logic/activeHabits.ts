import type { DayKey, Habit, PlanState } from '../types';
import { habitsActiveOn, type ActiveHabit } from './habits';
import { planHabits } from './plan';

/** Todos os hábitos com período resolvido: os do plano (derivados dos blocos) e os guardados. */
export function allHabits(plan: PlanState | undefined, stored: Habit[]): ActiveHabit[] {
  const fromStore: ActiveHabit[] = stored.map((h) => ({
    id: h.id,
    label: h.label,
    detail: h.detail,
    source: h.source,
    activeFrom: h.activeFrom,
    activeTo: h.activeTo,
    isWater: h.isWater,
    trigger: h.trigger,
  }));
  return [...planHabits(plan), ...fromStore];
}

/** Hábitos ativos no dia, na ordem: plano, tarefas, plano mínimo, ciclos. */
export function activeHabitsOn(
  day: DayKey,
  plan: PlanState | undefined,
  stored: Habit[],
): ActiveHabit[] {
  const order = ['plano', 'aula5', 'aula8', 'aula13', 'plano_minimo', 'ciclo'];
  return habitsActiveOn(allHabits(plan, stored), day).sort(
    (a, b) => order.indexOf(a.source) - order.indexOf(b.source),
  );
}

/** O hábito de água ativo no dia, se houver. */
export function waterHabitOn(
  day: DayKey,
  plan: PlanState | undefined,
  stored: Habit[],
): ActiveHabit | undefined {
  return activeHabitsOn(day, plan, stored).find((h) => h.isWater);
}
