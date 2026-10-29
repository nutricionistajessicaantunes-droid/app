import { FATOR_COMUM_DIFERENCA } from '../config';
import { TAG_LABEL } from '../content/registro';
import type { DayKey, TagId } from '../types';
import { joinPt } from './format';

export interface CommonFactor {
  /** 'tag:dormi_mal' ou 'food:<nome normalizado>' */
  key: string;
  label: string;
  kind: 'tag' | 'food';
  /** Dias com sintoma em que apareceu. */
  count: number;
  /** Total de dias com sintoma. */
  total: number;
  otherCount: number;
  otherTotal: number;
}

export interface DayFactors {
  date: DayKey;
  tags: TagId[];
  /** Alimentos já normalizados, com o rótulo para exibir. */
  foods: { key: string; label: string }[];
}

/**
 * Fatores em comum nos dias com sintoma (seção 7.5). Aparecem os que estão em pelo menos
 * 2 dias com sintoma e cuja proporção nesses dias supera a dos outros dias registrados em
 * FATOR_COMUM_DIFERENCA. Sem outros dias, basta aparecer em 2.
 */
export function commonFactors(symptomDays: DayFactors[], otherDays: DayFactors[]): CommonFactor[] {
  const total = symptomDays.length;
  const otherTotal = otherDays.length;
  if (total === 0) return [];

  const labels = new Map<string, { label: string; kind: 'tag' | 'food' }>();
  const countIn = (days: DayFactors[]): Map<string, number> => {
    const counts = new Map<string, number>();
    for (const d of days) {
      const keys = new Set<string>();
      for (const t of d.tags) {
        const key = `tag:${t}`;
        keys.add(key);
        if (!labels.has(key))
          labels.set(key, { label: (TAG_LABEL[t] ?? t).toLowerCase(), kind: 'tag' });
      }
      for (const f of d.foods) {
        const key = `food:${f.key}`;
        keys.add(key);
        if (!labels.has(key)) labels.set(key, { label: f.label, kind: 'food' });
      }
      for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return counts;
  };

  const inSymptom = countIn(symptomDays);
  const inOther = countIn(otherDays);
  const out: CommonFactor[] = [];
  for (const [key, count] of inSymptom) {
    if (count < 2) continue;
    const otherCount = inOther.get(key) ?? 0;
    if (otherTotal > 0) {
      const diff = count / total - otherCount / otherTotal;
      if (diff < FATOR_COMUM_DIFERENCA - 1e-9) continue;
    }
    const meta = labels.get(key);
    out.push({
      key,
      label: meta?.label ?? key,
      kind: meta?.kind ?? 'tag',
      count,
      total,
      otherCount,
      otherTotal,
    });
  }
  out.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'));
  return out;
}

/** "Nos dias com sintoma, apareceu mais: dormi mal (3 de 4 dias), comi correndo (2 de 4)." */
export function commonFactorsSentence(factors: CommonFactor[]): string {
  if (factors.length === 0) return '';
  const parts = factors.map((f, i) =>
    i === 0
      ? `${f.label} (${f.count} de ${f.total} dias)`
      : `${f.label} (${f.count} de ${f.total})`,
  );
  return `Nos dias com sintoma, apareceu mais: ${parts.join(', ')}.`;
}

/** Versão curta para preencher o campo da pergunta 3. */
export function commonFactorsSuggestion(factors: CommonFactor[]): string {
  if (factors.length === 0) return '';
  return joinPt(factors.map((f) => f.label));
}
