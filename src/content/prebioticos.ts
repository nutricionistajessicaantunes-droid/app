/** Prebióticos e probióticos (seção 9.10, aula 11). */

export const PREBIOTICOS_TEXTOS = {
  conceito:
    'Probiótico é a bactéria viva. Prebiótico é o alimento dela. Os dois na mesma refeição formam um simbiótico.',
  probioticosNota: 'Prefira as versões naturais, com pouco ou nenhum açúcar.',
  prebioticosNota: 'Quem tem intestino irritável começa por aveia, kiwi e banana mais verde.',
  simbioticosNota: 'Uma combinação por dia já aplica o conceito.',
  aviso:
    'Os efeitos dos probióticos dependem da cepa. Resultado de estudo com uma cepa específica não se aplica a qualquer fermentado nem a qualquer cápsula. Suplemento tem cepa e dose para cada situação, e isso é indicação individual.',
  /** Aula 11, tarefa para gases_sii (seção 6.6). */
  comecePor: 'Comece por aveia, kiwi e banana mais verde.',
};

export const PROBIOTICOS = [
  'Iogurte com culturas vivas',
  'Kefir',
  'Kombucha',
  'Missô',
  'Chucrute',
  'Coalhada',
];

/** Fontes prebióticas. "alhoCebola" marca o que fica de fora no caminho gases_sii. */
export const PREBIOTICOS: { label: string; alhoCebola?: boolean }[] = [
  { label: 'Alho', alhoCebola: true },
  { label: 'Cebola', alhoCebola: true },
  { label: 'Alcachofra' },
  { label: 'Aspargos' },
  { label: 'Chicória' },
  { label: 'Aveia' },
  { label: 'Soja' },
  { label: 'Kiwi' },
];

/** Para quem tem intestino irritável (seção 9.10). */
export const PREBIOTICO_BANANA_VERDE = 'Banana mais verde';

export const SIMBIOTICOS = [
  'Iogurte com fruta e aveia',
  'Kefir com linhaça ou chia',
  'Coalhada com banana',
  'Kombucha com fruta',
];

export const COMBINACOES_PRONTAS = [
  {
    refeicao: 'Café da manhã',
    texto: '1 pote de iogurte natural com 1 banana picada e 2 col. de sopa de aveia',
  },
  { refeicao: 'Café da manhã', texto: '1 copo de kefir com 1 col. de sopa de linhaça ou chia' },
  {
    refeicao: 'Lanche da tarde',
    texto: '1 pote de coalhada com 1 banana amassada ou 1 col. de chá de mel',
  },
  {
    refeicao: 'Lanche da tarde',
    texto: '1 copo de kombucha com fruta picada e 1 col. de sopa de aveia',
  },
];
