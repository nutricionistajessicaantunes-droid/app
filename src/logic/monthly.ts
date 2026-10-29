import type { DayKey, Meta, PlanState, Profile } from '../types';
import { addDays } from './dates';

/** Revisão do mês (seção 6.9). */

export function reviewKey(today: DayKey): string {
  return `revisao:${today.slice(0, 7)}`;
}

/** A partir do dia escolhido no mês, até ser feita; nunca antes do fim do plano. */
export function monthlyReviewDue(
  profile: Pick<Profile, 'monthlyReviewDay'>,
  plan: PlanState | undefined,
  today: DayKey,
  meta?: Pick<Meta, 'dismissed'>,
): boolean {
  const day = profile.monthlyReviewDay;
  if (!plan || plan.status !== 'concluido' || !day) return false;
  const reviewDate = `${today.slice(0, 7)}-${String(day).padStart(2, '0')}`;
  if (today < reviewDate) return false;
  if (plan.concludedOn && reviewDate <= plan.concludedOn) return false;
  return !meta?.dismissed?.[reviewKey(today)];
}

/** As últimas 4 semanas, terminando hoje (a mais antiga primeiro). */
export function monthlyWeeks(today: DayKey): { start: DayKey; end: DayKey }[] {
  return [3, 2, 1, 0].map((k) => {
    const end = addDays(today, -7 * k);
    return { start: addDays(end, -6), end };
  });
}
