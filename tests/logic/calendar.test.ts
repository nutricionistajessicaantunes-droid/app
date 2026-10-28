import { describe, expect, it } from 'vitest';
import {
  buildIcs,
  escapeIcsText,
  foldLine,
  functionQuery,
  googleCalendarUrl,
  icsFileName,
  localStamp,
  nextWeekday,
  rrule,
  utcStamp,
  type CalendarEvent,
} from '../../src/logic/calendar';
import { weekdayOf } from '../../src/logic/dates';

const registro: CalendarEvent = {
  uid: 'registro-do-dia',
  title: 'Registro do dia',
  description: 'Abra o app Modulação e registre o teu dia. Leva um minuto.',
  day: '2026-11-03',
  time: '21:30',
  durationMin: 10,
  recurrence: { kind: 'diaria', count: 60 },
};

describe('lembretes de agenda', () => {
  it('regras de repetição', () => {
    expect(rrule(undefined)).toBeUndefined();
    expect(rrule({ kind: 'nenhuma' })).toBeUndefined();
    expect(rrule({ kind: 'diaria', count: 60 })).toBe('FREQ=DAILY;COUNT=60');
    expect(rrule({ kind: 'semanal', weekday: 0 })).toBe('FREQ=WEEKLY;BYDAY=SU');
    expect(rrule({ kind: 'semanal', weekday: 7 })).toBe('FREQ=WEEKLY;BYDAY=SU');
    expect(rrule({ kind: 'mensal', monthDay: 15 })).toBe('FREQ=MONTHLY;BYMONTHDAY=15');
  });

  it('horário local, inclusive passando da meia-noite', () => {
    expect(localStamp('2026-11-03', '21:30')).toBe('20261103T213000');
    expect(localStamp('2026-11-03', '23:50', 15)).toBe('20261104T000500');
    expect(utcStamp(new Date(Date.UTC(2026, 10, 3, 12, 0, 0)))).toBe('20261103T120000Z');
  });

  it('texto escapado e linhas dobradas em 75 bytes', () => {
    expect(escapeIcsText('a, b; c\\d\ne')).toBe('a\\, b\\; c\\\\d\\ne');
    expect(foldLine('curta')).toBe('curta');
    const longa = 'DESCRIPTION:' + 'ç'.repeat(80);
    const dobrada = foldLine(longa);
    expect(dobrada).toContain('\r\n ');
    for (const parte of dobrada.split('\r\n')) expect(new TextEncoder().encode(parte).length).toBeLessThanOrEqual(75);
    expect(dobrada.replace(/\r\n /g, '')).toBe(longa);
  });

  it('arquivo .ics com alarme na hora do evento e repetição', () => {
    const ics = buildIcs([registro], new Date(Date.UTC(2026, 10, 3, 12, 0, 0)));
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics).toContain('UID:registro-do-dia@modulacao-intestinal');
    expect(ics).toContain('DTSTART:20261103T213000');
    expect(ics).toContain('DTEND:20261103T214000');
    expect(ics).toContain('RRULE:FREQ=DAILY;COUNT=60');
    expect(ics).toContain('SUMMARY:Registro do dia');
    expect(ics).toContain('TRIGGER:PT0M');
    expect(ics).toContain('DTSTAMP:20261103T120000Z');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    const semRepeticao = buildIcs([{ ...registro, recurrence: undefined, description: undefined, durationMin: undefined }]);
    expect(semRepeticao).not.toContain('RRULE');
    expect(semRepeticao).not.toContain('DESCRIPTION:Abra');
    expect(semRepeticao).toContain('DTEND:20261103T214500');
  });

  it('link do Google Agenda', () => {
    const url = new URL(googleCalendarUrl(registro, 'America/Sao_Paulo'));
    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('text')).toBe('Registro do dia');
    expect(url.searchParams.get('dates')).toBe('20261103T213000/20261103T214000');
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY;COUNT=60');
    expect(url.searchParams.get('ctz')).toBe('America/Sao_Paulo');
    const simples = new URL(googleCalendarUrl({ ...registro, recurrence: undefined, description: undefined }));
    expect(simples.searchParams.has('recur')).toBe(false);
    expect(simples.searchParams.has('details')).toBe(false);
    expect(simples.searchParams.has('ctz')).toBe(false);
  });

  it('parâmetros da função: só título, horário e repetição', () => {
    const q = new URLSearchParams(functionQuery(registro));
    expect(q.get('titulo')).toBe('Registro do dia');
    expect(q.get('inicio')).toBe('20261103T2130');
    expect(q.get('repetir')).toBe('FREQ=DAILY;COUNT=60');
    expect(q.has('descricao')).toBe(false);
    expect(new URLSearchParams(functionQuery({ ...registro, recurrence: undefined, durationMin: undefined })).get('duracao')).toBe('15');
    expect(icsFileName('Plano dia 1')).toBe('lembrete-plano-dia-1.ics');
  });

  it('próximo dia da semana', () => {
    expect(nextWeekday('2026-11-03', 0, weekdayOf)).toBe('2026-11-08');
    expect(nextWeekday('2026-11-08', 0, weekdayOf)).toBe('2026-11-08');
    expect(nextWeekday('2026-11-03', 9, weekdayOf)).toBe('2026-11-03');
  });
});
