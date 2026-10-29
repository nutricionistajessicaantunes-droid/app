import { describe, expect, it } from 'vitest';
import {
  addDays,
  daysBetween,
  diffDays,
  formatDateFull,
  formatDayCompact,
  formatDayLong,
  formatDayMonth,
  formatDayShort,
  formatTime,
  fromDayKey,
  isBetween,
  isValidDayKey,
  isWeekend,
  lastWeekdayOnOrBefore,
  maxDayKey,
  minDayKey,
  nowTime,
  relativeDayLabel,
  timeToMinutes,
  toDayKey,
  todayKey,
  weekdayFullName,
  weekdayName,
  weekdayOf,
} from '../../src/logic/dates';

describe('toDayKey', () => {
  it('usa o fuso do aparelho: 03/11/2026 às 23h30 em São Paulo continua sendo 2026-11-03', () => {
    const d = new Date(2026, 10, 3, 23, 30);
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/Sao_Paulo');
    expect(toDayKey(d)).toBe('2026-11-03');
    // O jeito proibido troca o dia.
    expect(d.toISOString().slice(0, 10)).toBe('2026-11-04');
  });

  it('meia-noite e um minuto antes', () => {
    expect(toDayKey(new Date(2026, 10, 3, 0, 0))).toBe('2026-11-03');
    expect(toDayKey(new Date(2026, 10, 3, 23, 59, 59))).toBe('2026-11-03');
  });

  it('completa com zeros', () => {
    expect(toDayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('todayKey usa a data informada', () => {
    expect(todayKey(new Date(2026, 10, 3, 23, 30))).toBe('2026-11-03');
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('fromDayKey', () => {
  it('volta para a meia-noite local', () => {
    const d = fromDayKey('2026-11-03');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(10);
    expect(d.getDate()).toBe(3);
    expect(d.getHours()).toBe(0);
    expect(toDayKey(d)).toBe('2026-11-03');
  });

  it('recusa formato inválido', () => {
    expect(() => fromDayKey('03/11/2026')).toThrow();
  });
});

describe('isValidDayKey', () => {
  it('aceita datas reais e recusa o resto', () => {
    expect(isValidDayKey('2026-11-03')).toBe(true);
    expect(isValidDayKey('2028-02-29')).toBe(true);
    expect(isValidDayKey('2026-02-29')).toBe(false);
    expect(isValidDayKey('2026-13-01')).toBe(false);
    expect(isValidDayKey('2026-00-10')).toBe(false);
    expect(isValidDayKey('2026-01-00')).toBe(false);
    expect(isValidDayKey('2026-1-1')).toBe(false);
    expect(isValidDayKey(20261103)).toBe(false);
  });
});

describe('aritmética de dias', () => {
  it('addDays atravessa mês e ano', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-11-02', 20)).toBe('2026-11-22');
    expect(addDays('2026-11-02', -1)).toBe('2026-11-01');
  });

  it('diffDays', () => {
    expect(diffDays('2026-11-30', '2026-11-02')).toBe(28);
    expect(diffDays('2026-11-02', '2026-11-30')).toBe(-28);
    expect(diffDays('2027-01-01', '2026-12-31')).toBe(1);
  });

  it('daysBetween inclui as pontas', () => {
    expect(daysBetween('2026-11-02', '2026-11-04')).toEqual([
      '2026-11-02',
      '2026-11-03',
      '2026-11-04',
    ]);
    expect(daysBetween('2026-11-04', '2026-11-02')).toEqual([]);
  });

  it('dia da semana e fim de semana', () => {
    expect(weekdayOf('2026-11-03')).toBe(2); // terça
    expect(weekdayOf('2026-11-08')).toBe(0); // domingo
    expect(isWeekend('2026-11-07')).toBe(true);
    expect(isWeekend('2026-11-08')).toBe(true);
    expect(isWeekend('2026-11-09')).toBe(false);
  });

  it('último domingo no dia ou antes', () => {
    expect(lastWeekdayOnOrBefore('2026-11-08', 0)).toBe('2026-11-08');
    expect(lastWeekdayOnOrBefore('2026-11-11', 0)).toBe('2026-11-08');
    expect(lastWeekdayOnOrBefore('2026-11-07', 0)).toBe('2026-11-01');
  });

  it('min, max e intervalo', () => {
    expect(maxDayKey('2026-11-01', '2026-11-03')).toBe('2026-11-03');
    expect(minDayKey('2026-11-01', '2026-11-03')).toBe('2026-11-01');
    expect(isBetween('2026-11-02', '2026-11-01', '2026-11-03')).toBe(true);
    expect(isBetween('2026-11-04', '2026-11-01', '2026-11-03')).toBe(false);
  });
});

describe('formatação', () => {
  it('datas por extenso', () => {
    expect(formatDayLong('2026-11-03')).toBe('terça, 3 de novembro');
    expect(formatDayMonth('2026-11-03')).toBe('3 de novembro');
    expect(formatDayShort('2026-10-26')).toBe('26/10');
    expect(formatDayCompact('2026-11-09')).toBe('9/11');
    expect(formatDateFull('2026-11-03')).toBe('03/11/2026');
  });

  it('nomes dos dias', () => {
    expect(weekdayName(0)).toBe('domingo');
    expect(weekdayName(7)).toBe('domingo');
    expect(weekdayName(-1)).toBe('sábado');
    expect(weekdayFullName(1)).toBe('segunda-feira');
  });

  it('horas no padrão 21h30', () => {
    expect(formatTime('21:30')).toBe('21h30');
    expect(formatTime('09:00')).toBe('9h');
    expect(formatTime('7:05')).toBe('7h05');
    expect(formatTime('qualquer')).toBe('qualquer');
  });

  it('minutos e hora atual', () => {
    expect(timeToMinutes('21:30')).toBe(1290);
    expect(timeToMinutes('24:00')).toBeUndefined();
    expect(timeToMinutes('xx')).toBeUndefined();
    expect(nowTime(new Date(2026, 10, 3, 8, 5))).toBe('08:05');
  });

  it('rótulo relativo do registro', () => {
    expect(relativeDayLabel('2026-11-03', '2026-11-03')).toBe('hoje');
    expect(relativeDayLabel('2026-11-02', '2026-11-03')).toBe('ontem');
    expect(relativeDayLabel('2026-10-26', '2026-11-03')).toBe('26/10');
  });
});
