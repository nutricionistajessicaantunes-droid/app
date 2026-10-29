import { FODMAP_CATEGORIAS, USE_SEM_CONTAR, type FodmapLevel } from '../content/fodmap';
import { normalizeFood } from './text';

/** Uma entrada da lista de FODMAPs, com o nome como está no caderno. */
export interface FodmapEntry {
  name: string;
  level: FodmapLevel;
  categoryId: string;
  categoryTitle: string;
  /** Formas normalizadas do nome e dos termos de busca. */
  keys: string[];
}

let cache: FodmapEntry[] | null = null;

export function fodmapEntries(): FodmapEntry[] {
  if (cache) return cache;
  const out: FodmapEntry[] = [];
  for (const c of FODMAP_CATEGORIAS) {
    for (const [level, items] of [
      ['alto', c.alto],
      ['baixo', c.baixo],
    ] as const) {
      for (const it of items) {
        out.push({
          name: it.name,
          level,
          categoryId: c.id,
          categoryTitle: c.title,
          keys: [it.name, ...(it.aliases ?? [])].map(normalizeFood),
        });
      }
    }
  }
  for (const g of USE_SEM_CONTAR.grupos) {
    for (const it of g.itens) {
      out.push({
        name: it.name,
        level: 'livre',
        categoryId: 'livre',
        categoryTitle: USE_SEM_CONTAR.title,
        keys: [it.name, ...(it.aliases ?? [])].map(normalizeFood),
      });
    }
  }
  cache = out;
  return out;
}

function containsWords(text: string, phrase: string): boolean {
  return ` ${text} `.includes(` ${phrase} `);
}

/**
 * Classificação de um alimento pela lista (seção 7.10). Vale o nome inteiro ou o nome
 * contido como palavras inteiras; ganha a entrada mais longa. Sem correspondência, nada.
 */
export function classifyFood(food: string): FodmapEntry | undefined {
  const key = normalizeFood(food);
  if (!key) return undefined;
  let best: { entry: FodmapEntry; len: number } | undefined;
  for (const e of fodmapEntries()) {
    for (const k of e.keys) {
      if (k === key || containsWords(key, k)) {
        if (!best || k.length > best.len) best = { entry: e, len: k.length };
      }
    }
  }
  return best?.entry;
}

/** Sugestões para o diário (nomes da lista que começam com o que foi digitado). */
export function suggestFoods(typed: string, limit = 6): string[] {
  const q = normalizeFood(typed);
  if (q.length < 2) return [];
  const seen = new Set<string>();
  const starts: string[] = [];
  const contains: string[] = [];
  for (const e of fodmapEntries()) {
    if (seen.has(e.name)) continue;
    const hit = e.keys.some((k) => k.startsWith(q));
    const inside = !hit && e.keys.some((k) => containsWords(k, q) || k.includes(q));
    if (hit) starts.push(e.name);
    else if (inside) contains.push(e.name);
    if (hit || inside) seen.add(e.name);
  }
  return [...starts, ...contains].slice(0, limit);
}

/** Busca da lista (seção 6.11): o grupo, o alto teor e as trocas de baixo teor. */
export function searchFodmap(query: string): FodmapEntry[] {
  const q = normalizeFood(query);
  if (q.length < 2) return [];
  return fodmapEntries().filter((e) =>
    e.keys.some((k) => k.startsWith(q) || containsWords(k, q) || k.includes(q)),
  );
}
