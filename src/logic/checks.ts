import {
  ALTERNANCIA_SEMANAS_SEGUIDAS,
  DIARREIA_PERSISTENTE_DIAS,
  DIARREIA_PERSISTENTE_MIN_REGISTROS,
  DIAS_SEM_EVACUAR_AVISO,
  ESTUFAMENTO_DIARIO,
} from '../config';
import type { Bristol, DayKey, DayRecord, Notice, NoticeKind, PlanState, Profile } from '../types';
import { bristolModes, hasAlternation } from './bristol';
import { addDays, daysBetween, diffDays, toDayKey } from './dates';
import { blockEnd, s3Block } from './plan';
import { bristolOf, indexByDate, isRegistered, noEvacuationStreakEndingAt } from './records';

/** Verificações automáticas (seção 7.13). Rodam ao abrir o app e depois de salvar um registro. */

/** Janelas de 7 dias seguidas, terminando hoje (a mais antiga primeiro). */
function lastWeeks(today: DayKey, n: number): DayKey[][] {
  return Array.from({ length: n }, (_, i) => {
    const end = addDays(today, -7 * (n - 1 - i));
    return daysBetween(addDays(end, -6), end);
  });
}

function typesIn(map: Map<DayKey, DayRecord>, days: DayKey[]): Bristol[] {
  return days.map((d) => bristolOf(map.get(d))).filter((t): t is Bristol => t !== undefined);
}

/** Tipo 6 ou 7 em todos os dias com evacuação dos últimos 14 dias, com 10 ou mais registrados. */
export function persistentDiarrhea(records: DayRecord[], today: DayKey): boolean {
  const map = indexByDate(records);
  const days = daysBetween(addDays(today, -(DIARREIA_PERSISTENTE_DIAS - 1)), today);
  if (days.filter((d) => isRegistered(map.get(d))).length < DIARREIA_PERSISTENTE_MIN_REGISTROS)
    return false;
  const types = typesIn(map, days);
  return types.length > 0 && types.every((t) => t >= 6);
}

/** Estufamento 4 ou mais em 6 dias de 7, por 2 semanas seguidas. */
export function dailyBloating(records: DayRecord[], today: DayKey): boolean {
  const map = indexByDate(records);
  return lastWeeks(today, ESTUFAMENTO_DIARIO.semanasSeguidas).every(
    (days) =>
      days.filter((d) => (map.get(d)?.symptoms?.estufamento ?? -1) >= ESTUFAMENTO_DIARIO.nota)
        .length >= ESTUFAMENTO_DIARIO.diasNaSemana,
  );
}

/** Alternância entre preso e solto em 2 semanas seguidas. */
export function constantAlternation(records: DayRecord[], today: DayKey): boolean {
  const map = indexByDate(records);
  return lastWeeks(today, ALTERNANCIA_SEMANAS_SEGUIDAS).every((days) =>
    hasAlternation(typesIn(map, days)),
  );
}

/** Caminho preso, plano concluído e a semana 3 ainda com tipo 1 ou 2. */
export function constipationNotResponding(
  profile: Pick<Profile, 'path'>,
  plan: PlanState | undefined,
  records: DayRecord[],
): boolean {
  if (profile.path !== 'preso' || plan?.status !== 'concluido') return false;
  const b = s3Block(plan.blocks);
  if (!b) return false;
  const modes = bristolModes(typesIn(indexByDate(records), daysBetween(b.start, blockEnd(b))));
  return modes.length > 0 && modes.every((m) => m <= 2);
}

export interface NoticeDraft {
  id: string;
  kind: NoticeKind;
  reason: string;
  detectedAt: DayKey;
}

/** Depois de "Entendi", o mesmo aviso automático só volta depois deste tempo. */
export const AVISO_AUTOMATICO_PAUSA_DIAS = 14;

export function automaticNotices(input: {
  records: DayRecord[];
  today: DayKey;
  profile: Pick<Profile, 'path'>;
  plan?: PlanState;
  notices: Notice[];
}): NoticeDraft[] {
  const { records, today, profile, plan, notices } = input;
  const out: NoticeDraft[] = [];
  const add = (kind: NoticeKind, reason: string) => {
    const id = `auto-${reason}`;
    const existing = notices.find((n) => n.id === id);
    if (existing && !existing.dismissedAt) return;
    if (
      existing?.dismissedAt &&
      diffDays(today, toDayKey(new Date(existing.dismissedAt))) < AVISO_AUTOMATICO_PAUSA_DIAS
    )
      return;
    out.push({ id, kind, reason, detectedAt: today });
  };
  if (persistentDiarrhea(records, today)) add('alerta', 'diarreia_mais_de_2_semanas');
  if (dailyBloating(records, today)) add('acompanhamento', 'estufamento_diario');
  if (constantAlternation(records, today)) add('acompanhamento', 'alternancia_constante');
  if (constipationNotResponding(profile, plan, records))
    add('acompanhamento', 'preso_nao_responde');
  if (plan?.reevaluation?.chosen === 'nao_mudou') add('acompanhamento', 'sintomas_persistem');
  return out;
}

/** Três dias registrados seguidos com "Não" evacuou (recado na tela Hoje). */
export function noEvacuationRun(
  records: DayRecord[],
  today: DayKey,
): { start: DayKey; days: number } | undefined {
  const todayRec = indexByDate(records).get(today);
  const end = todayRec?.evacuated === undefined ? addDays(today, -1) : today;
  const n = noEvacuationStreakEndingAt(records, end);
  if (n < DIAS_SEM_EVACUAR_AVISO) return undefined;
  return { start: addDays(end, -(n - 1)), days: n };
}
