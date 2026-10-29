import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DayKey } from '../types';

/**
 * Chaves de dia sempre no fuso do aparelho, no formato 'AAAA-MM-DD'.
 * Nunca usar toISOString().slice(0, 10): à noite no Brasil isso já é o dia seguinte.
 */

const DAY_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_DIA = 86_400_000;

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function toDayKey(date: Date): DayKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isValidDayKey(key: unknown): key is DayKey {
  if (typeof key !== 'string') return false;
  const m = DAY_KEY_RE.exec(key);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1) return false;
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
}

function parts(key: DayKey): [number, number, number] {
  const m = DAY_KEY_RE.exec(key);
  if (!m) throw new Error(`Data inválida: ${key}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** Meia-noite local do dia. */
export function fromDayKey(key: DayKey): Date {
  const [y, m, d] = parts(key);
  return new Date(y, m - 1, d);
}

export function todayKey(now: Date = new Date()): DayKey {
  return toDayKey(now);
}

export function addDays(key: DayKey, n: number): DayKey {
  const [y, m, d] = parts(key);
  return toDayKey(new Date(y, m - 1, d + n));
}

/** Diferença em dias inteiros: a menos b. */
export function diffDays(a: DayKey, b: DayKey): number {
  const [ya, ma, da] = parts(a);
  const [yb, mb, db] = parts(b);
  return Math.round((Date.UTC(ya, ma - 1, da) - Date.UTC(yb, mb - 1, db)) / MS_DIA);
}

/** Todos os dias de start até end, inclusive. */
export function daysBetween(start: DayKey, end: DayKey): DayKey[] {
  const n = diffDays(end, start);
  const out: DayKey[] = [];
  for (let i = 0; i <= n; i++) out.push(addDays(start, i));
  return out;
}

/** 0 = domingo. */
export function weekdayOf(key: DayKey): number {
  return fromDayKey(key).getDay();
}

export function isWeekend(key: DayKey): boolean {
  const w = weekdayOf(key);
  return w === 0 || w === 6;
}

/** O último dia com esse dia da semana, no próprio dia ou antes. */
export function lastWeekdayOnOrBefore(key: DayKey, weekday: number): DayKey {
  const w = weekdayOf(key);
  const back = (w - weekday + 7) % 7;
  return addDays(key, -back);
}

export function maxDayKey(a: DayKey, b: DayKey): DayKey {
  return a >= b ? a : b;
}

export function minDayKey(a: DayKey, b: DayKey): DayKey {
  return a <= b ? a : b;
}

export function isBetween(key: DayKey, start: DayKey, end: DayKey): boolean {
  return key >= start && key <= end;
}

const DIAS_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const DIAS_SEMANA_COMPLETO = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

export function weekdayName(weekday: number): string {
  return DIAS_SEMANA[((weekday % 7) + 7) % 7] ?? '';
}

export function weekdayFullName(weekday: number): string {
  return DIAS_SEMANA_COMPLETO[((weekday % 7) + 7) % 7] ?? '';
}

/** "3 de novembro" */
export function formatDayMonth(key: DayKey): string {
  return format(fromDayKey(key), "d 'de' MMMM", { locale: ptBR });
}

/** "terça, 3 de novembro" */
export function formatDayLong(key: DayKey): string {
  return `${weekdayName(weekdayOf(key))}, ${formatDayMonth(key)}`;
}

/** "26/10" */
export function formatDayShort(key: DayKey): string {
  const [, m, d] = parts(key);
  return `${pad(d)}/${pad(m)}`;
}

/** "9/11", como nos botões ("Começar o plano em 9/11"). */
export function formatDayCompact(key: DayKey): string {
  const [, m, d] = parts(key);
  return `${d}/${m}`;
}

/** "03/11/2026" */
export function formatDateFull(key: DayKey): string {
  const [y, m, d] = parts(key);
  return `${pad(d)}/${pad(m)}/${y}`;
}

/** "21:30" vira "21h30"; "09:00" vira "9h". */
export function formatTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return time;
  const h = Number(m[1]);
  return m[2] === '00' ? `${h}h` : `${h}h${m[2]}`;
}

/** Minutos desde a meia-noite para 'HH:mm'. */
export function timeToMinutes(time: string): number | undefined {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return undefined;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return undefined;
  return h * 60 + min;
}

/** 'HH:mm' do horário atual. */
export function nowTime(now: Date = new Date()): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/** Texto relativo para o cabeçalho do registro: "hoje", "ontem" ou a data curta. */
export function relativeDayLabel(key: DayKey, today: DayKey): 'hoje' | 'ontem' | string {
  const d = diffDays(today, key);
  if (d === 0) return 'hoje';
  if (d === 1) return 'ontem';
  return formatDayShort(key);
}
