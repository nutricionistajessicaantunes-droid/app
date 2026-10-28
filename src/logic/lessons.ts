import { LESSON_RECOMMENDED_FOR } from '../content/curso';
import type { LessonProgress, Path } from '../types';

export type LessonBadge = 'recomendada' | 'opcional' | undefined;

/** Selo por caminho (seção 6.6). Com caminho "indefinido", nenhuma aula tem selo. */
export function lessonBadge(lessonId: number, path: Path): LessonBadge {
  if (path === 'indefinido') return undefined;
  const target = LESSON_RECOMMENDED_FOR[lessonId];
  if (!target) return undefined;
  return target === path ? 'recomendada' : 'opcional';
}

export type LessonState =
  'nao_assistida' | 'assistida' | 'tarefa_em_andamento' | 'tarefa_concluida';

export function lessonState(p: LessonProgress | undefined): LessonState {
  if (!p) return 'nao_assistida';
  if (p.task.status === 'concluida') return 'tarefa_concluida';
  if (p.task.status === 'em_andamento') return 'tarefa_em_andamento';
  return p.watched ? 'assistida' : 'nao_assistida';
}

export const LESSON_STATE_LABEL: Record<LessonState, string> = {
  nao_assistida: 'Não assistida',
  assistida: 'Assistida',
  tarefa_em_andamento: 'Tarefa em andamento',
  tarefa_concluida: 'Tarefa concluída',
};

/** Link da aula na Kiwify: o da aula, ou a área de membros, ou nenhum. */
export function lessonUrl(
  lessonId: number,
  urls: Record<number, string>,
  area: string,
): string | undefined {
  return urls[lessonId]?.trim() || area.trim() || undefined;
}
