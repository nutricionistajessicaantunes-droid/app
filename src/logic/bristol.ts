import type { Bristol, BristolBand } from '../types';

/** Faixa de cada tipo (seção 7.2). */
export function bandOf(type: Bristol): BristolBand {
  if (type <= 2) return 'lenta';
  if (type <= 5) return 'saudavel';
  return 'rapida';
}

export function isBristol(n: unknown): n is Bristol {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 7;
}

export function isHealthy(type: Bristol): boolean {
  return type >= 3 && type <= 5;
}

/** Contagem de cada tipo, índice 0 = tipo 1. */
export function bristolDistribution(types: Bristol[]): number[] {
  const out = [0, 0, 0, 0, 0, 0, 0];
  for (const t of types) out[t - 1] = (out[t - 1] ?? 0) + 1;
  return out;
}

/**
 * Tipo mais frequente: a moda. Empate devolve todos os empatados, em ordem.
 * Sem tipos registrados, devolve lista vazia.
 */
export function bristolModes(types: Bristol[]): Bristol[] {
  if (types.length === 0) return [];
  const dist = bristolDistribution(types);
  const max = Math.max(...dist);
  const modes: Bristol[] = [];
  dist.forEach((count, i) => {
    if (count === max) modes.push((i + 1) as Bristol);
  });
  return modes;
}

/** Alternância: pelo menos um dia com tipo 1 ou 2 e pelo menos um com 6 ou 7. */
export function hasAlternation(types: Bristol[]): boolean {
  return types.some((t) => t <= 2) && types.some((t) => t >= 6);
}

/** Faixa da moda; com empate entre faixas diferentes, sem faixa única. */
export function bandOfModes(modes: Bristol[]): BristolBand | undefined {
  if (modes.length === 0) return undefined;
  const bands = new Set(modes.map(bandOf));
  return bands.size === 1 ? bandOf(modes[0] as Bristol) : undefined;
}

/** Todas as modas dentro da faixa saudável (3 a 5). */
export function modesHealthy(modes: Bristol[]): boolean {
  return modes.length > 0 && modes.every(isHealthy);
}

/** Distância média das modas até o tipo 4. */
export function modesDistanceTo4(modes: Bristol[]): number | undefined {
  if (modes.length === 0) return undefined;
  return modes.reduce((s, m) => s + Math.abs(m - 4), 0) / modes.length;
}
