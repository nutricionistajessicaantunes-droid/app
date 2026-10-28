/**
 * Normalização de nomes de alimento (seção 7.10): sem acento, sem diferença de
 * maiúsculas e tolerando singular e plural.
 */

export function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Singular aproximado de uma palavra já sem acento e em minúsculas. */
export function singularWord(w: string): string {
  if (w.length < 4 || !w.endsWith('s')) return w;
  if (w.endsWith('oes') || w.endsWith('aes')) return `${w.slice(0, -3)}ao`;
  if (w.endsWith('ais')) return `${w.slice(0, -3)}al`;
  if (w.endsWith('eis')) return `${w.slice(0, -3)}el`;
  if (w.endsWith('ois')) return `${w.slice(0, -3)}ol`;
  if (w.endsWith('res') || w.endsWith('zes')) return w.slice(0, -2);
  if (w.endsWith('ns')) return `${w.slice(0, -2)}m`;
  return w.slice(0, -1);
}

/** Forma comparável de um nome: "Grãos-de-Bico" e "grão de bico" ficam iguais. */
export function normalizeFood(s: string): string {
  const base = stripAccents(s.toLowerCase())
    .replace(/[-_/]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!base) return '';
  return base.split(' ').map(singularWord).join(' ');
}

/**
 * Separa um texto livre em itens (seção 7.11): por vírgula, ponto e vírgula e " e ".
 */
export function splitFoods(text: string): string[] {
  return text
    .split(/[,;\n]|\s+e\s+/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Normaliza para busca simples (sem acento, minúsculas, espaços únicos). */
export function normalizeSearch(s: string): string {
  return stripAccents(s.toLowerCase()).replace(/\s+/g, ' ').trim();
}
