/** Água e fibras (seção 9.9, aula 10). */

export const AGUA_TEXTOS = {
  meta: 'Peso atual em quilos multiplicado por 35, em mililitros. Exemplo: 65 kg, cerca de 2.275 ml.',
  distribuicao: '3 copos pela manhã, 3 copos pela tarde e 2 copos antes de dormir.',
  conferencia: 'Urina clara ao longo do dia. Tons amarelados ou escuros indicam que falta água.',
  copoAoAcordar:
    'Um copo cheio ao acordar e um antes de cada refeição já resolve boa parte da meta.',
  frutas:
    'Frutas e vegetais com bastante água, como melancia, melão e abobrinha, também contam na hidratação.',
  dicas: [
    'Carregar sempre uma garrafa',
    'Usar a garrafa ou um copo de referência para saber quanto já foi',
    'Se tiver muita dificuldade, aumentar aos poucos',
    'Usar lembretes visuais',
  ],
  avisoRenal:
    'Quem tem condição renal ou cardíaca precisa de orientação individual sobre a quantidade.',
  avisoRenalAula10:
    'Quem tem condição renal ou cardíaca precisa de orientação individual sobre a quantidade de água.',
};

export const FIBRA_TEXTOS = {
  meta: 'Entre 25 e 30 gramas por dia.',
  campeas:
    'As campeãs são as sementes e as leguminosas. Uma colher de sopa de linhaça entrega mais fibra do que uma maçã inteira.',
  frutaSozinha: 'A fruta, sozinha, não fecha a meta.',
  feijao: 'Tire o feijão do dia e você perde quase um terço da meta.',
  aosPoucos: 'Aumente fibra e água juntas, e aumente aos poucos.',
  avisoValores: 'Os valores de fibra são aproximados, por 100 g do alimento.',
  avisoDiagnostico:
    'Quem tem diagnóstico intestinal, estenose ou restrição alimentar precisa de orientação individual antes de aumentar fibras.',
  /** Texto fixo da ferramenta "Meu dia de fibras" (seção 7.14). */
  ferramenta: 'Valores aproximados, por 100 g. Aumente a fibra aos poucos e sempre com água junto.',
};

export interface FiberFood {
  id: string;
  name: string;
  /** Gramas de fibra por 100 g. */
  per100: number;
}

export const FIBRAS: FiberFood[] = [
  { id: 'linhaca', name: 'Semente de linhaça', per100: 33.5 },
  { id: 'soja', name: 'Soja cozida', per100: 20 },
  { id: 'aveia', name: 'Aveia em flocos', per100: 9.1 },
  { id: 'feijao', name: 'Feijão cozido', per100: 8.5 },
  { id: 'grao_de_bico', name: 'Grão-de-bico cozido', per100: 7.6 },
  { id: 'ervilha', name: 'Ervilha em vagem', per100: 7.5 },
  { id: 'abacate', name: 'Abacate', per100: 6.3 },
  { id: 'goiaba', name: 'Goiaba', per100: 6.2 },
  { id: 'quinoa', name: 'Quinoa', per100: 6 },
  { id: 'milho', name: 'Milho cozido', per100: 3.9 },
  { id: 'brocolis', name: 'Brócolis cozido', per100: 3.4 },
  { id: 'beterraba', name: 'Beterraba crua', per100: 3.4 },
  { id: 'cenoura', name: 'Cenoura crua', per100: 3.2 },
  { id: 'couve', name: 'Couve crua', per100: 3.1 },
  { id: 'pera', name: 'Pera', per100: 3 },
  { id: 'espinafre', name: 'Espinafre cozido', per100: 2.5 },
  { id: 'farinha_trigo', name: 'Farinha de trigo', per100: 2.3 },
  { id: 'batata_doce', name: 'Batata-doce cozida', per100: 2.2 },
  { id: 'banana', name: 'Banana', per100: 2 },
  { id: 'maca', name: 'Maçã', per100: 1.3 },
];

export type MealId = 'cafe' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar';

export const REFEICOES: { id: MealId; label: string }[] = [
  { id: 'cafe', label: 'Café da manhã' },
  { id: 'lanche_manha', label: 'Lanche da manhã' },
  { id: 'almoco', label: 'Almoço' },
  { id: 'lanche_tarde', label: 'Lanche da tarde' },
  { id: 'jantar', label: 'Jantar' },
];

export interface ModelDayItem {
  meal: MealId;
  foodId: string;
  /** Medida caseira, como está na tabela. */
  measure: string;
  grams: number;
  /** Valor de fibra como está na tabela do caderno (exibido no Guia). */
  fiberText: string;
}

/** Dia modelo de fibras, cerca de 27 g (seção 9.9). */
export const DIA_MODELO_FIBRAS: ModelDayItem[] = [
  {
    meal: 'cafe',
    foodId: 'aveia',
    measure: '3 col. de sopa de aveia em flocos (30 g)',
    grams: 30,
    fiberText: '2,7 g',
  },
  {
    meal: 'cafe',
    foodId: 'linhaca',
    measure: '1 col. de sopa de linhaça (15 g)',
    grams: 15,
    fiberText: '5 g',
  },
  {
    meal: 'lanche_manha',
    foodId: 'banana',
    measure: '1 banana média (100 g)',
    grams: 100,
    fiberText: '2 g',
  },
  {
    meal: 'almoco',
    foodId: 'feijao',
    measure: '1 concha de feijão cozido (100 g)',
    grams: 100,
    fiberText: '8,5 g',
  },
  {
    meal: 'almoco',
    foodId: 'couve',
    measure: '1 pires de couve crua picada (50 g)',
    grams: 50,
    fiberText: '1,5 g',
  },
  {
    meal: 'almoco',
    foodId: 'cenoura',
    measure: '1 cenoura média crua ralada (75 g)',
    grams: 75,
    fiberText: '2,4 g',
  },
  {
    meal: 'lanche_tarde',
    foodId: 'maca',
    measure: '1 maçã com casca (130 g)',
    grams: 130,
    fiberText: '1,7 g',
  },
  {
    meal: 'jantar',
    foodId: 'batata_doce',
    measure: '1 batata-doce média cozida (150 g)',
    grams: 150,
    fiberText: '3,3 g',
  },
];

export const DIA_MODELO_TITULO = 'Dia modelo de fibras (cerca de 27 g)';

export function getFiberFood(id: string): FiberFood | undefined {
  return FIBRAS.find((f) => f.id === id);
}
