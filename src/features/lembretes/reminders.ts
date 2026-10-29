import { ICS_FUNCAO_URL, ICS_MODO, LEMBRETE_REGISTRO_DIAS } from '../../config';
import { downloadFile } from '../../db/backup';
import {
  buildIcs,
  functionQuery,
  googleCalendarUrl,
  icsFileName,
  nextWeekday,
  type CalendarEvent,
} from '../../logic/calendar';
import { addDays, nowTime, timeToMinutes, weekdayOf } from '../../logic/dates';
import type { PlatformInfo } from '../../logic/platform';
import type { DayKey } from '../../types';

/** Eventos de agenda do app (seção 3.6). Títulos sem dado de saúde. */

const HORARIO_MANHA = '08:00';

export function registroEvent(today: DayKey, time: string, now: Date = new Date()): CalendarEvent {
  const passed = (timeToMinutes(nowTime(now)) ?? 0) >= (timeToMinutes(time) ?? 0);
  return {
    uid: 'registro-do-dia',
    title: 'Registro do dia',
    description: 'Abra o app Modulação e registre o teu dia. Leva um minuto.',
    day: passed ? addDays(today, 1) : today,
    time,
    durationMin: 10,
    recurrence: { kind: 'diaria', count: LEMBRETE_REGISTRO_DIAS },
  };
}

export function leituraEvent(today: DayKey, weekday: number, time: string): CalendarEvent {
  return {
    uid: 'leitura-da-semana',
    title: 'Leitura da semana',
    description: 'Cinco minutos para ler a tua semana no app Modulação.',
    day: nextWeekday(today, weekday, weekdayOf),
    time,
    durationMin: 15,
    recurrence: { kind: 'semanal', weekday },
  };
}

export function planDayEvent(day: DayKey, which: 1 | 21): CalendarEvent {
  return {
    uid: `plano-dia-${which}`,
    title: which === 1 ? 'Dia 1 do plano de 21 dias' : 'Dia 21 do plano de 21 dias',
    description:
      which === 1
        ? 'Hoje começa o teu plano de 21 dias. Abra o app Modulação.'
        : 'Último dia do plano. Amanhã, abra o app Modulação para a reavaliação.',
    day,
    time: HORARIO_MANHA,
    durationMin: 15,
  };
}

export function fodmapEvaluationEvent(day: DayKey): CalendarEvent {
  return {
    uid: 'fodmap-avaliacao',
    title: 'Avaliação da fase 1 do protocolo',
    description: 'Abra o app Modulação para avaliar a fase 1.',
    day,
    time: HORARIO_MANHA,
    durationMin: 15,
  };
}

export function fodmapRetestEvent(day: DayKey): CalendarEvent {
  return {
    uid: 'fodmap-testar-de-novo',
    title: 'Testar de novo os gatilhos',
    description: 'A tolerância muda. Abra o app Modulação para lembrar o que testar.',
    day,
    time: HORARIO_MANHA,
    durationMin: 15,
  };
}

export function revisaoMesEvent(today: DayKey, monthDay: number, time: string): CalendarEvent {
  // Próxima data com esse dia do mês.
  let day = today;
  for (let i = 0; i < 32; i++) {
    if (Number(day.slice(8, 10)) === monthDay) break;
    day = addDays(day, 1);
  }
  return {
    uid: 'revisao-do-mes',
    title: 'Revisão do mês',
    description: 'Cinco minutos olhando o teu registro no app Modulação.',
    day,
    time,
    durationMin: 15,
    recurrence: { kind: 'mensal', monthDay },
  };
}

export type IcsOutcome = 'aberto' | 'baixado' | 'sem_internet';

/** "Agenda do iPhone": arquivo .ics gerado no aparelho ou, no iPhone com o app instalado, pela função. */
export function openIcs(ev: CalendarEvent, platform: PlatformInfo): IcsOutcome {
  const useFunction =
    ICS_MODO === 'funcao' || (ICS_MODO === 'auto' && platform.os === 'ios' && platform.standalone);
  if (useFunction) {
    if (navigator.onLine === false) return 'sem_internet';
    window.open(`${ICS_FUNCAO_URL}?${functionQuery(ev)}`, '_blank', 'noopener');
    return 'aberto';
  }
  const ics = buildIcs([ev]);
  if (platform.os === 'ios') {
    window.location.assign(`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`);
    return 'aberto';
  }
  downloadFile(new Blob([ics], { type: 'text/calendar;charset=utf-8' }), icsFileName(ev.uid));
  return 'baixado';
}

export function openGoogle(ev: CalendarEvent): boolean {
  if (navigator.onLine === false) return false;
  let tz: string | undefined;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    tz = undefined;
  }
  window.open(googleCalendarUrl(ev, tz), '_blank', 'noopener');
  return true;
}
