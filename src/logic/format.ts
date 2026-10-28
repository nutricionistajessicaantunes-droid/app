/** Formatação de números no padrão brasileiro (vírgula decimal, ponto de milhar). */

const inteiro = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const umaCasa = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const ateUmaCasa = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

/** Arredonda para uma casa decimal, com meio para cima. */
export function round1(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

/** "4,0", "2,5" */
export function formatDecimal(n: number): string {
  return umaCasa.format(round1(n));
}

/** "2.275" */
export function formatInt(n: number): string {
  return inteiro.format(Math.round(n));
}

/** "5" ou "2,7": uma casa só quando precisa. */
export function formatCompact(n: number): string {
  return ateUmaCasa.format(round1(n));
}

/** "x de y" */
export function deTotal(x: number, y: number): string {
  return `${x} de ${y}`;
}

/** Junta itens em português: "a, b e c". */
export function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

/** Primeira letra maiúscula. */
export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
