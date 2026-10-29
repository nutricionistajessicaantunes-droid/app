import { RED_FLAG_LABEL } from '../content/alertas';
import { getLesson } from '../content/curso';
import { RESULTADO_LABEL, TABELA_TESTE } from '../content/fodmap';
import type {
  Bristol,
  DayKey,
  DayRecord,
  DiaryEntry,
  FodmapProtocol,
  LessonProgress,
  RedFlagId,
} from '../types';
import { bandOf, bristolModes, hasAlternation } from './bristol';
import { addDays, daysBetween, formatDayMonth } from './dates';
import { formatDecimal, joinPt } from './format';
import { bristolOf, indexByDate } from './records';
import type { ReevalResult } from './reevaluation';
import { findSuspects } from './suspects';
import { consultSymptomStat, symptomGetter, type ConsultSymptomStat } from './symptoms';
import { taskWindow } from './tasks';
import { summarizeWeek, type WeekSummary } from './week';

/** Autopreenchimento da ficha para a consulta (seção 6.14). Tudo continua editável. */

export const FICHA_DIAS = 21;

export interface ConsultAutofill {
  bristol: string;
  padrao: string;
  sintomas: Record<string, ConsultSymptomStat>;
  testado: string;
  gatilhos: string;
  alertas: string;
  weeks: WeekSummary[];
}

export function bristolText(modes: Bristol[]): string {
  if (modes.length === 0) return '';
  return modes.length === 1 ? `Tipo ${modes[0]}` : `Tipos ${joinPt(modes.map(String))}`;
}

export function patternText(types: Bristol[]): string {
  if (types.length === 0) return '';
  if (hasAlternation(types)) return 'Há alternância entre tipos';
  return new Set(types.map(bandOf)).size === 1
    ? 'O padrão é sempre o mesmo'
    : 'Varia, sem alternar entre preso e solto';
}

/** Vezes por semana de um chip do registro (esforço, evacuação incompleta). */
function chipStat(
  records: DayRecord[],
  start: DayKey,
  end: DayKey,
  chip: 'effort' | 'incomplete',
): ConsultSymptomStat {
  const map = indexByDate(records);
  const days = daysBetween(start, end);
  const withEvac = days.filter((d) => map.get(d)?.evacuated === true);
  if (withEvac.length === 0) return {};
  const n = withEvac.filter((d) => map.get(d)?.[chip] === true).length;
  return { timesPerWeek: Math.round((n / (days.length / 7)) * 10) / 10 };
}

export function consultAutofill(input: {
  records: DayRecord[];
  today: DayKey;
  lessons: LessonProgress[];
  reeval?: ReevalResult;
  diary: DiaryEntry[];
  fodmap?: FodmapProtocol | null;
}): ConsultAutofill {
  const { records, today, lessons, reeval, diary, fodmap } = input;
  const start = addDays(today, -(FICHA_DIAS - 1));
  const map = indexByDate(records);
  const types = daysBetween(start, today)
    .map((d) => bristolOf(map.get(d)))
    .filter((t): t is Bristol => t !== undefined);

  const sintomas: Record<string, ConsultSymptomStat> = {};
  for (const id of ['dor', 'estufamento', 'gases', 'urgencia'] as const)
    sintomas[id] = consultSymptomStat(records, symptomGetter(id), start, today);
  sintomas.esforco = chipStat(records, start, today, 'effort');
  sintomas.incompleta = chipStat(records, start, today, 'incomplete');

  const testado: string[] = [];
  if (reeval?.s1 && reeval.s3) {
    const parts: string[] = [];
    if (reeval.s1.modes.length > 0 && reeval.s3.modes.length > 0)
      parts.push(
        `tipo de Bristol predominante foi de ${joinPt(reeval.s1.modes.map(String))} para ${joinPt(reeval.s3.modes.map(String))}`,
      );
    if (reeval.s1.symptomAverage !== undefined && reeval.s3.symptomAverage !== undefined)
      parts.push(
        `sintomas de ${formatDecimal(reeval.s1.symptomAverage)} para ${formatDecimal(reeval.s3.symptomAverage)}`,
      );
    if (parts.length > 0) testado.push(`Plano de 21 dias: ${parts.join('; ')}.`);
  }
  for (const p of [...lessons].sort((a, b) => a.lessonId - b.lessonId)) {
    const resposta = typeof p.task.data.resposta === 'string' ? p.task.data.resposta.trim() : '';
    if (p.task.status !== 'concluida' || !resposta) continue;
    testado.push(
      `Aula ${p.lessonId}, ${getLesson(p.lessonId)?.task.name.toLowerCase() ?? ''}: ${resposta}`,
    );
  }

  const gatilhos: string[] = [];
  const l7 = lessons.find((l) => l.lessonId === 7);
  const w7 = taskWindow(l7);
  if (l7?.task.status === 'concluida' && w7) {
    const s = findSuspects(diary, w7.start, w7.end).map((x) => x.label);
    if (s.length > 0) gatilhos.push(`Diário de sintomas: ${joinPt(s)}.`);
  }
  for (const t of fodmap?.tests ?? []) {
    if (t.result !== 'gatilho' && t.result !== 'quantidade') continue;
    const label = TABELA_TESTE.find((x) => x.group === t.group)?.label ?? t.group;
    gatilhos.push(`${label} (${t.food}): ${RESULTADO_LABEL[t.result].toLowerCase()}.`);
  }

  const flags = new Map<RedFlagId, DayKey>();
  for (const r of [...records].sort((a, b) => (a.date < b.date ? -1 : 1)))
    for (const f of r.redFlags ?? []) if (!flags.has(f)) flags.set(f, r.date);
  const alertas = [...flags.entries()]
    .map(([f, d]) => `${RED_FLAG_LABEL[f]} (marcado em ${formatDayMonth(d)})`)
    .join('; ');

  const weeks = [2, 1, 0].map((k) => {
    const end = addDays(today, -7 * k);
    return summarizeWeek({ records, habits: [], start: addDays(end, -6), end });
  });

  return {
    bristol: bristolText(bristolModes(types)),
    padrao: patternText(types),
    sintomas,
    testado: testado.join('\n'),
    gatilhos: gatilhos.join('\n'),
    alertas,
    weeks,
  };
}
