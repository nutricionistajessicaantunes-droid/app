import { COPOS_POR_DIA, DISTRIBUICAO_COPOS, ML_POR_KG, PESO_MAX_KG, PESO_MIN_KG } from '../config';

export interface WaterGoal {
  /** Meta em ml, sem arredondar (peso x 35). */
  ml: number;
  /** Copo de referência, meta dividida por 8, em múltiplo de 10 ml. */
  cupMl: number;
  cups: number;
  /** Manhã, tarde, antes de dormir. */
  distribution: readonly number[];
}

export function isValidWeight(kg: unknown): kg is number {
  return typeof kg === 'number' && Number.isFinite(kg) && kg >= PESO_MIN_KG && kg <= PESO_MAX_KG;
}

/** Meta de água (seção 7.14). Peso fora de 30 a 300 kg não calcula. */
export function waterGoal(kg: number): WaterGoal | undefined {
  if (!isValidWeight(kg)) return undefined;
  const ml = kg * ML_POR_KG;
  const cupMl = Math.round(ml / COPOS_POR_DIA / 10) * 10;
  return { ml, cupMl, cups: COPOS_POR_DIA, distribution: DISTRIBUICAO_COPOS };
}

/** Lê um peso digitado no padrão brasileiro ("65", "65,5"). */
export function parseWeight(text: string): number | undefined {
  const clean = text.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(clean)) return undefined;
  const n = Number(clean);
  return Number.isFinite(n) ? n : undefined;
}

/** Ao chegar na meta de copos, o hábito de água é marcado (seção 6.3). */
export function reachedCupGoal(
  previous: number,
  next: number,
  goal: number = COPOS_POR_DIA,
): boolean {
  return previous < goal && next >= goal;
}
