import { LESSONS } from '../content/curso';
import { SEMANA_ZERO_ITENS } from '../content/plano';
import type {
  CrisisState,
  DayKey,
  FodmapProtocol,
  LessonProgress,
  Meta,
  PlanState,
  Profile,
  WeeklyReading,
} from '../types';
import { lessonBadge } from './lessons';
import { monthlyReviewDue } from './monthly';
import { blockIndexOn, effectiveStatus, hasStarted, planDayNumber } from './plan';
import { pendingReading, type ReadingPeriod } from './readings';
import { isTaskResultReady, taskDays, taskProgress } from './tasks';

/** Teu próximo passo (seção 7.12). */

export type NextStep =
  | { kind: 'crise' }
  | { kind: 'reavaliacao' }
  | { kind: 'leitura'; period: ReadingPeriod }
  | { kind: 'plano_hoje'; day: number; blockIndex: number }
  | { kind: 'plano_comeca'; start: DayKey }
  | { kind: 'fodmap'; phase: FodmapProtocol['phase'] }
  | { kind: 'tarefa'; lessonId: number; day: number; total: number; ready: boolean }
  | { kind: 'semana_zero'; missing: number }
  | { kind: 'aula'; lessonId: number; watched: boolean }
  | { kind: 'preparar_semana_zero' }
  | { kind: 'revisao_mes' }
  | { kind: 'plano_minimo' };

export interface NextStepInput {
  today: DayKey;
  profile: Pick<Profile, 'readingWeekday' | 'monthlyReviewDay'> & Partial<Pick<Profile, 'path'>>;
  plan?: PlanState;
  lessons: LessonProgress[];
  readings: WeeklyReading[];
  crisis?: CrisisState | null;
  fodmap?: FodmapProtocol | null;
  meta?: Pick<Meta, 'dismissed'>;
}

export function semanaZeroMissing(plan: PlanState | undefined): number {
  return SEMANA_ZERO_ITENS.filter((i) => !plan?.semanaZero?.[i.id]).length;
}

/**
 * A próxima aula a cuidar, pela tarefa: a primeira cuja tarefa ainda não começou.
 * Assistir à aula não é exigido (o app explica cada tarefa). Ficam de fora a aula 17,
 * que depende do fim do plano, as aulas opcionais para o caminho da aluna e as que ela
 * pulou ("Pular esta aula"). As opcionais continuam no Caminho.
 */
export function nextLesson(
  lessons: LessonProgress[],
  path?: Profile['path'],
  plan?: PlanState,
): { lessonId: number; watched: boolean } | undefined {
  for (const l of LESSONS) {
    if (l.id === 17) continue;
    if (path && lessonBadge(l.id, path) === 'opcional') continue;
    const p = lessons.find((x) => x.lessonId === l.id);
    if (p?.task.data?.dispensada) continue;
    if (p && p.task.status !== 'nao_iniciada') continue;
    if (l.id === 15 && plan && plan.status !== 'nao_iniciado') continue;
    return { lessonId: l.id, watched: Boolean(p?.watched) };
  }
  return undefined;
}

export function nextSteps(input: NextStepInput): NextStep[] {
  const { today, profile, plan, lessons, readings, crisis, fodmap, meta } = input;
  const steps: NextStep[] = [];
  const status = effectiveStatus(plan, today);
  if (crisis?.active) steps.push({ kind: 'crise' });
  if (status === 'reavaliacao') steps.push({ kind: 'reavaliacao' });
  const period = pendingReading(profile, lessons, plan, readings, today);
  if (period) steps.push({ kind: 'leitura', period });
  if (plan && status === 'ativo') {
    if (hasStarted(plan, today)) {
      const blockIndex = blockIndexOn(plan.blocks, today);
      const day = planDayNumber(plan.blocks, today);
      if (blockIndex >= 0 && day) steps.push({ kind: 'plano_hoje', day, blockIndex });
    } else if (plan.blocks[0]) steps.push({ kind: 'plano_comeca', start: plan.blocks[0].start });
  }
  if (fodmap && (fodmap.phase === 'fase1' || fodmap.phase === 'fase2' || fodmap.phase === 'fase3'))
    steps.push({ kind: 'fodmap', phase: fodmap.phase });
  for (const p of [...lessons].sort((a, b) => a.lessonId - b.lessonId)) {
    const total = taskDays(p.lessonId);
    const prog = taskProgress(p, today);
    if (p.task.status !== 'em_andamento' || total === undefined || !prog) continue;
    steps.push({
      kind: 'tarefa',
      lessonId: p.lessonId,
      day: prog.day,
      total,
      ready: isTaskResultReady(p, today),
    });
  }
  if (plan?.status === 'semana_zero')
    steps.push({ kind: 'semana_zero', missing: semanaZeroMissing(plan) });
  const lesson = nextLesson(lessons, profile.path, plan);
  if (lesson) steps.push({ kind: 'aula', ...lesson });
  else if (!plan || plan.status === 'nao_iniciado') steps.push({ kind: 'preparar_semana_zero' });
  if (status === 'concluido')
    steps.push(
      monthlyReviewDue(profile, plan, today, meta)
        ? { kind: 'revisao_mes' }
        : { kind: 'plano_minimo' },
    );
  return steps;
}
