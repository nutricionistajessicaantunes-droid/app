import type { DayKey } from '../types';
import { addDays } from './dates';

/**
 * Lembretes de agenda sem servidor (seção 3.6): arquivo .ics gerado no aparelho
 * e link do Google Agenda. Os eventos nunca levam dado de saúde.
 */

export type Recurrence =
  | { kind: 'nenhuma' }
  | { kind: 'diaria'; count: number }
  | { kind: 'semanal'; weekday: number }
  | { kind: 'mensal'; monthDay: number };

export interface CalendarEvent {
  /** Identificador estável, para o calendário não duplicar ao importar de novo. */
  uid: string;
  title: string;
  description?: string;
  day: DayKey;
  /** 'HH:mm' */
  time: string;
  durationMin?: number;
  recurrence?: Recurrence;
}

const BYDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export function rrule(rec: Recurrence | undefined): string | undefined {
  if (!rec || rec.kind === 'nenhuma') return undefined;
  if (rec.kind === 'diaria') return `FREQ=DAILY;COUNT=${rec.count}`;
  if (rec.kind === 'semanal') return `FREQ=WEEKLY;BYDAY=${BYDAY[((rec.weekday % 7) + 7) % 7]}`;
  return `FREQ=MONTHLY;BYMONTHDAY=${rec.monthDay}`;
}

/** 'AAAAMMDDTHHMMSS' em hora local (sem fuso: o calendário usa o fuso do aparelho). */
export function localStamp(day: DayKey, time: string, plusMinutes = 0): string {
  const [hh, mm] = time.split(':').map(Number) as [number, number];
  const total = hh * 60 + mm + plusMinutes;
  const dayOffset = Math.floor(total / 1440);
  const minutes = ((total % 1440) + 1440) % 1440;
  const d = addDays(day, dayOffset).replace(/-/g, '');
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${d}T${h}${m}00`;
}

export function utcStamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

export function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Dobra linhas longas em 75 bytes, como pede o formato. */
export function foldLine(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  let size = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = parts.length === 0 ? 75 : 74;
    if (size + n > limit) {
      parts.push(current);
      current = '';
      size = 0;
    }
    current += ch;
    size += n;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export function buildIcs(events: CalendarEvent[], now: Date = new Date()): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Modulacao Intestinal na Pratica//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  for (const ev of events) {
    const duration = ev.durationMin ?? 15;
    const rule = rrule(ev.recurrence);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.uid}@modulacao-intestinal`,
      `DTSTAMP:${utcStamp(now)}`,
      `DTSTART:${localStamp(ev.day, ev.time)}`,
      `DTEND:${localStamp(ev.day, ev.time, duration)}`,
    );
    if (rule) lines.push(`RRULE:${rule}`);
    lines.push(`SUMMARY:${escapeIcsText(ev.title)}`);
    if (ev.description) lines.push(`DESCRIPTION:${escapeIcsText(ev.description)}`);
    lines.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(ev.title)}`,
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/** Link do Google Agenda (calendar.google.com/calendar/render?action=TEMPLATE). */
export function googleCalendarUrl(ev: CalendarEvent, timeZone?: string): string {
  const params = new URLSearchParams();
  params.set('action', 'TEMPLATE');
  params.set('text', ev.title);
  params.set(
    'dates',
    `${localStamp(ev.day, ev.time)}/${localStamp(ev.day, ev.time, ev.durationMin ?? 15)}`,
  );
  if (ev.description) params.set('details', ev.description);
  const rule = rrule(ev.recurrence);
  if (rule) params.set('recur', `RRULE:${rule}`);
  if (timeZone) params.set('ctz', timeZone);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Parâmetros para a função da Netlify: só título, horário e repetição. */
export function functionQuery(ev: CalendarEvent): string {
  const params = new URLSearchParams();
  params.set('titulo', ev.title);
  params.set('inicio', localStamp(ev.day, ev.time).slice(0, 13));
  params.set('duracao', String(ev.durationMin ?? 15));
  const rule = rrule(ev.recurrence);
  if (rule) params.set('repetir', rule);
  params.set('id', ev.uid);
  return params.toString();
}

export function icsFileName(uid: string): string {
  return `lembrete-${uid.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}.ics`;
}

/** Próximo dia (a partir de hoje) com esse dia da semana. */
export function nextWeekday(
  from: DayKey,
  weekday: number,
  weekdayOf: (d: DayKey) => number,
): DayKey {
  let d = from;
  for (let i = 0; i < 7; i++) {
    if (weekdayOf(d) === weekday) return d;
    d = addDays(d, 1);
  }
  return from;
}
