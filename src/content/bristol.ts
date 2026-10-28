import type { Bristol, BristolBand } from '../types';

/** Escala de Bristol (seção 9.3). */
export interface BristolInfo {
  type: Bristol;
  name: string;
  description: string;
  band: BristolBand;
  ideal?: boolean;
}

export const BRISTOL: BristolInfo[] = [
  {
    type: 1,
    name: 'Bolinhas duras',
    description: 'Separadas, difíceis de sair. É o extremo da constipação.',
    band: 'lenta',
  },
  {
    type: 2,
    name: 'Linguiça encaroçada',
    description: 'Com pequenas bolinhas grudadas. Também é constipação.',
    band: 'lenta',
  },
  {
    type: 3,
    name: 'Linguiça com rachaduras',
    description: 'Rachaduras na superfície. Já entra na faixa saudável.',
    band: 'saudavel',
  },
  {
    type: 4,
    name: 'Lisa e macia',
    description: 'Formato de salsicha. É o tipo considerado ideal.',
    band: 'saudavel',
    ideal: true,
  },
  {
    type: 5,
    name: 'Pedaços macios',
    description: 'Bordas bem definidas, fáceis de sair.',
    band: 'saudavel',
  },
  {
    type: 6,
    name: 'Massa pastosa',
    description: 'Bordas irregulares. O trânsito já está acelerado.',
    band: 'rapida',
  },
  {
    type: 7,
    name: 'Totalmente líquida',
    description: 'Sem pedaços sólidos. É a diarreia.',
    band: 'rapida',
  },
];

/** Nome de cada faixa (seção 7.2). */
export const BAND_LABEL: Record<BristolBand, string> = {
  lenta: 'trânsito lento',
  saudavel: 'faixa saudável',
  rapida: 'trânsito acelerado',
};

/** Nome da faixa como aparece na tabela da escala (seção 9.3). */
export const BAND_TABLE_LABEL: Record<BristolBand, string> = {
  lenta: 'constipação',
  saudavel: 'saudável',
  rapida: 'acelerado',
};

export const SELO_TIPO_IDEAL = 'tipo ideal';

export const BRISTOL_TEXTOS = {
  faixas:
    'Faixa saudável: tipos 3, 4 e 5. Tipos 1 e 2 indicam constipação e tipos 6 e 7 indicam trânsito acelerado.',
  retrato: 'O tipo das fezes é o retrato da velocidade do teu intestino.',
  frequencia:
    'A faixa considerada normal vai de três vezes por dia até três vezes por semana, desde que venha com conforto, sem esforço excessivo, sem dor e sem sensação de evacuação incompleta.',
  qualidade:
    'Qualidade vale mais do que frequência. Ir todo dia com muito esforço, em bolinhas, é pior do que ir dia sim, dia não, com fezes tipo 4 e sem sofrimento.',
  padrao:
    'Ninguém tem tipo 4 todos os dias da vida. Um dia diferente não significa nada sozinho. O que a gente procura é padrão.',
};

export function getBristol(type: Bristol): BristolInfo {
  const info = BRISTOL[type - 1];
  if (!info) throw new Error(`Tipo de Bristol inválido: ${type}`);
  return info;
}
