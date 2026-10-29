import { JANELA_SUSPEITOS_HORAS, SINTOMA_SUSPEITO_MIN } from '../config';
import type { DayKey, DiaryEntry } from '../types';
import { timeToMinutes } from './dates';
import { classifyFood, type FodmapEntry } from './fodmapLookup';
import { normalizeFood, splitFoods } from './text';

export interface Suspect {
  key: string;
  label: string;
  /** Dias diferentes em que apareceu antes de um sintoma. */
  days: number;
  /** Refeições com o alimento seguidas de sintoma. */
  timesBefore: number;
  /** Refeições com o alimento no período. */
  timesEaten: number;
  fodmap?: FodmapEntry;
}

/** Alimentos de uma refeição: itens marcados e o texto livre separado por vírgula. */
export function mealFoods(e: DiaryEntry): { key: string; label: string }[] {
  const items = [...(e.foods ?? []), ...(e.text ? splitFoods(e.text) : [])];
  const out = new Map<string, string>();
  for (const it of items) {
    const key = normalizeFood(it);
    if (key && !out.has(key)) out.set(key, it.trim().toLowerCase());
  }
  return [...out.entries()].map(([key, label]) => ({ key, label }));
}

/**
 * Suspeitos do diário de sintomas (seção 7.10): para cada sintoma de intensidade 4 ou
 * mais, os alimentos das refeições do mesmo dia nas 6 horas anteriores. Ficam os que
 * aparecem antes de sintoma em pelo menos 2 dias diferentes.
 */
export function findSuspects(entries: DiaryEntry[], start?: DayKey, end?: DayKey): Suspect[] {
  const inRange = entries.filter((e) => (!start || e.date >= start) && (!end || e.date <= end));
  const meals = inRange.filter((e) => e.kind === 'refeicao');
  const symptoms = inRange.filter(
    (e) => e.kind === 'sintoma' && (e.symptom?.intensity ?? 0) >= SINTOMA_SUSPEITO_MIN,
  );
  const janela = JANELA_SUSPEITOS_HORAS * 60;
  const stats = new Map<string, { label: string; days: Set<DayKey>; before: number; eaten: number }>();

  for (const meal of meals) {
    const mt = timeToMinutes(meal.time);
    const followed =
      mt !== undefined &&
      symptoms.some((s) => {
        if (s.date !== meal.date) return false;
        const st = timeToMinutes(s.time);
        return st !== undefined && st >= mt && st - mt <= janela;
      });
    for (const f of mealFoods(meal)) {
      const cur = stats.get(f.key) ?? { label: f.label, days: new Set<DayKey>(), before: 0, eaten: 0 };
      cur.eaten++;
      if (followed) {
        cur.before++;
        cur.days.add(meal.date);
      }
      stats.set(f.key, cur);
    }
  }

  const out: Suspect[] = [];
  for (const [key, s] of stats) {
    if (s.days.size < 2) continue;
    out.push({
      key,
      label: s.label,
      days: s.days.size,
      timesBefore: s.before,
      timesEaten: s.eaten,
      fodmap: classifyFood(s.label),
    });
  }
  out.sort((a, b) => b.days - a.days || b.timesBefore - a.timesBefore || a.label.localeCompare(b.label, 'pt-BR'));
  return out;
}

/** "apareceu antes de sintoma em 3 das 5 vezes em que você comeu" (sempre 2 ou mais). */
export function suspectContext(s: Suspect): string {
  return `apareceu antes de sintoma em ${s.timesBefore} das ${s.timesEaten} vezes em que você comeu`;
}

/**
 * "O que comi antes" (seção 7.11): itens separados por vírgula, ponto e vírgula e " e ",
 * contados nos dias com sintoma. Ficam os que aparecem em 2 dias ou mais.
 */
export function foodsBeforeSymptoms(
  days: { date: DayKey; symptom: boolean; text?: string }[],
): { key: string; label: string; days: number }[] {
  const counts = new Map<string, { label: string; days: Set<DayKey> }>();
  for (const d of days) {
    if (!d.symptom || !d.text) continue;
    for (const item of splitFoods(d.text)) {
      const key = normalizeFood(item);
      if (!key) continue;
      const cur = counts.get(key) ?? { label: item.trim().toLowerCase(), days: new Set<DayKey>() };
      cur.days.add(d.date);
      counts.set(key, cur);
    }
  }
  return [...counts.entries()]
    .filter(([, v]) => v.days.size >= 2)
    .map(([key, v]) => ({ key, label: v.label, days: v.days.size }))
    .sort((a, b) => b.days - a.days || a.label.localeCompare(b.label, 'pt-BR'));
}
