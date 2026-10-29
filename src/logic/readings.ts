import type { DayKey, LessonProgress, PlanState, Profile, WeeklyReading } from '../types';
import { addDays, lastWeekdayOnOrBefore } from './dates';
import { blockEnd, effectiveStatus, hasStarted, repeatBlock } from './plan';
import { lastCompleteWeek } from './weeks';

/** Leitura da semana (seção 6.8): qual período ler e o que acontece depois. */

export interface ReadingPeriod {
  context: WeeklyReading['context'];
  start: DayKey;
  end: DayKey;
  planBlockIndex?: number;
  cycleIndex?: number;
}

export function readingId(p: Pick<ReadingPeriod, 'context' | 'start'>): string {
  return `leitura-${p.context}-${p.start}`;
}

const hasReading = (readings: WeeklyReading[], context: ReadingPeriod['context'], start: DayKey) =>
  readings.some((r) => r.context === context && r.start === start);

/**
 * No plano: o bloco mais recente que já chegou ao último dia. Sem leitura feita, o plano
 * avança pela data e a leitura fica pendente até a aluna fazer.
 */
export function pendingPlanReading(
  plan: PlanState | undefined,
  readings: WeeklyReading[],
  today: DayKey,
): ReadingPeriod | undefined {
  if (!plan) return undefined;
  const status = effectiveStatus(plan, today);
  if (status !== 'ativo' && status !== 'reavaliacao') return undefined;
  for (let i = plan.blocks.length - 1; i >= 0; i--) {
    const b = plan.blocks[i];
    if (!b || blockEnd(b) > today) continue;
    if (hasReading(readings, 'plano', b.start)) return undefined;
    return { context: 'plano', start: b.start, end: blockEnd(b), planBlockIndex: i };
  }
  return undefined;
}

/** Bloco atual (o último) de um novo ciclo. */
export function cycleBlock(c: { start: DayKey; weeks?: number }): { start: DayKey; end: DayKey } {
  const start = addDays(c.start, ((c.weeks ?? 1) - 1) * 7);
  return { start, end: addDays(start, 6) };
}

export function pendingCycleReading(
  plan: PlanState | undefined,
  readings: WeeklyReading[],
  today: DayKey,
): ReadingPeriod | undefined {
  if (!plan || plan.status !== 'concluido' || !plan.cycles?.length) return undefined;
  const cycleIndex = plan.cycles.length - 1;
  const c = plan.cycles[cycleIndex];
  if (!c) return undefined;
  const b = cycleBlock(c);
  if (b.end > today || hasReading(readings, 'ciclo', b.start)) return undefined;
  return { context: 'ciclo', ...b, cycleIndex };
}

/**
 * Fora do plano, depois que a aluna começa a tarefa da aula 16: os 7 dias que terminam
 * no dia da leitura. Na manutenção, quem cuida é a revisão do mês.
 */
export function pendingFreeReading(
  profile: Pick<Profile, 'readingWeekday'>,
  lessons: LessonProgress[],
  plan: PlanState | undefined,
  readings: WeeklyReading[],
  today: DayKey,
): ReadingPeriod | undefined {
  const status = effectiveStatus(plan, today);
  if (status === 'reavaliacao' || status === 'concluido') return undefined;
  if (status === 'ativo' && hasStarted(plan, today)) return undefined;
  const t16 = lessons.find((l) => l.lessonId === 16)?.task;
  if (!t16?.startDate || (t16.status !== 'em_andamento' && t16.status !== 'concluida'))
    return undefined;
  const end = lastWeekdayOnOrBefore(today, profile.readingWeekday);
  if (end < t16.startDate || readings.some((r) => r.end === end)) return undefined;
  return { context: 'livre', start: addDays(end, -6), end };
}

export function pendingReading(
  profile: Pick<Profile, 'readingWeekday'>,
  lessons: LessonProgress[],
  plan: PlanState | undefined,
  readings: WeeklyReading[],
  today: DayKey,
): ReadingPeriod | undefined {
  return (
    pendingPlanReading(plan, readings, today) ??
    pendingCycleReading(plan, readings, today) ??
    pendingFreeReading(profile, lessons, plan, readings, today)
  );
}

/** Aberta à mão: os últimos 7 dias completos. */
export function manualReadingPeriod(today: DayKey): ReadingPeriod {
  return { context: 'livre', ...lastCompleteWeek(today) };
}

/**
 * "Repetir a semana": no plano, insere um bloco do mesmo tema logo depois (se a leitura
 * foi atrasada, o bloco atual vira a repetição); no ciclo, soma uma semana.
 */
export function planPatchForDecision(
  plan: PlanState,
  period: ReadingPeriod,
  decision: 'avancar' | 'repetir',
): Partial<PlanState> | undefined {
  if (decision !== 'repetir') return undefined;
  if (period.context === 'plano' && period.planBlockIndex !== undefined)
    return { blocks: repeatBlock(plan.blocks, period.planBlockIndex) };
  if (period.context === 'ciclo' && period.cycleIndex !== undefined && plan.cycles)
    return {
      cycles: plan.cycles.map((c, i) =>
        i === period.cycleIndex ? { ...c, weeks: (c.weeks ?? 1) + 1 } : c,
      ),
    };
  return undefined;
}
