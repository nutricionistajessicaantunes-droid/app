import { joinPt } from '../../logic/format';
import type { ActiveHabit } from '../../logic/habits';
import { aula1Days, aula1Highlights, habitsTaskResult, type TaskWindow } from '../../logic/tasks';
import { summarizeWeek } from '../../logic/week';
import type { DayRecord } from '../../types';

/** Sugestão inicial para a pergunta do fim da tarefa (a aluna edita). */
export function suggestionFor(
  lessonId: number,
  records: DayRecord[],
  w: TaskWindow,
  habits: ActiveHabit[],
): string {
  if (lessonId === 1) return aula1Highlights(aula1Days(records, w)).join(' ');
  if (lessonId === 3) {
    const s = summarizeWeek({ records, habits: [], start: w.start, end: w.end });
    return joinPt(s.commonFactors.map((f) => f.label));
  }
  if (lessonId === 5) return habitsTaskResult(records, w, habits).easiest?.label ?? '';
  return '';
}
