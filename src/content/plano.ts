import type { Path, PlanTheme } from '../types';

/** Plano de 21 dias (seção 9.6 e 6.7). */

export const PLANO_TEXTOS = {
  comoFunciona:
    'São três semanas, com dois hábitos novos por semana. Os hábitos acumulam: na semana 2 você soma em vez de trocar. No dia 21 você tem seis hábitos ativos.',
  porQue21:
    // voz-ok: "você consegue enxergar" é texto do curso (seção 9.6), não frase motivacional pronta.
    'É tempo suficiente para o teu intestino mostrar resposta às mudanças e é um período que cabe na vida real. Três semanas você consegue enxergar do começo ao fim.',
  anoteDiaRuim: 'Anote inclusive o dia ruim. É o dia que mais ensina.',
  acumulam:
    'Os hábitos acumulam. Na semana 3 você está mantendo os seis, e não apenas os dois últimos.',
  semanaZero:
    'Faça estes seis itens antes do dia 1. Sem eles, o primeiro dia vira dia de compra e o plano começa devendo.',
  tresPreparos:
    'uma leguminosa cozida em quantidade, uma proteína desfiada e os legumes higienizados.',
  semanaComum: 'Comece numa semana comum, sem viagem, festa ou mudança.',
  naoAntecipe: 'Não antecipe hábitos. Dois por semana, na ordem.',
  retomar: 'Retome hoje. Falhou um dia, retoma no dia seguinte. Não existe recomeçar do zero.',
};

export const REGRAS = [
  'A meta é cinco dias de sete. Perfeição não é requisito.',
  'Falhou um dia, retoma no dia seguinte. Não existe recomeçar do zero.',
  'Não antecipe hábitos. Dois por semana, na ordem.',
  'Comece numa semana comum, sem viagem, festa ou mudança.',
  'Se um hábito não pegou, repita a semana antes de avançar.',
];

/** Ajuste do caminho (seção 9.6). */
export const CAMINHOS: Record<Exclude<Path, 'indefinido'>, { titulo: string; textos: string[] }> = {
  preso: {
    titulo: 'Intestino preso',
    textos: [
      'Reforce fibra e água desde a semana 1. A rotina de banheiro é o hábito mais importante do teu plano.',
    ],
  },
  solto: {
    titulo: 'Intestino solto',
    textos: [
      'Entre com a fibra de forma mais suave na semana 2, prefira legumes cozidos e mantenha a hidratação como foco.',
      'Saindo de crise, faça a volta depois da crise antes de começar.',
    ],
  },
  gases_sii: {
    titulo: 'Estufamento, gases ou intestino irritável',
    textos: [
      'Cuide da porção das leguminosas e use a respiração antes das refeições desde a semana 1. A lista de FODMAPs foi feita para o teu caso.',
      'Se você já conhece teus gatilhos, mantenha as escolhas de baixo FODMAP dentro do plano.',
    ],
  },
  refluxo: {
    titulo: 'Refluxo ou gastrite',
    textos: [
      'Some ao plano as regras de volume e horário: refeições menores e a última pelo menos 3 horas antes de deitar.',
    ],
  },
};

export interface PlanHabit {
  id: string;
  /** Número do hábito no plano (1 a 6). */
  n: number;
  theme: PlanTheme;
  label: string;
  text: string;
  isWater?: boolean;
}

export const PLAN_HABITS: PlanHabit[] = [
  {
    id: 'p1',
    n: 1,
    theme: 1,
    label: 'Água distribuída no dia',
    text: 'Beba a tua meta ao longo do dia, em três copos pela manhã, três à tarde e dois antes de dormir. Um copo cheio ao acordar e um antes de cada refeição já resolve boa parte.',
    isWater: true,
  },
  {
    id: 'p2',
    n: 2,
    theme: 1,
    label: 'Rotina de banheiro depois do café',
    text: 'Reserve de 10 a 15 minutos depois do café da manhã, todos os dias no mesmo horário, sem pressa e sem celular. Apoie os pés num banquinho baixo, com os joelhos um pouco acima do quadril. Quando a vontade aparecer em outro momento, vá.',
  },
  {
    id: 'p3',
    n: 3,
    theme: 2,
    label: 'Uma leguminosa e uma fonte de fibra',
    text: 'Inclua uma leguminosa por dia, como feijão, lentilha, grão-de-bico ou ervilha, e mais uma fonte de fibra, como uma colher de sopa de aveia, linhaça ou chia, ou uma fruta com casca.',
  },
  {
    id: 'p4',
    n: 4,
    theme: 2,
    label: 'Roteiro da refeição no almoço',
    text: 'No almoço, aplique os cinco passos: sente, tire a tela, pouse o talher entre as garfadas, mastigue até virar papa e mire em 20 minutos.',
  },
  {
    id: 'p5',
    n: 5,
    theme: 3,
    label: 'Caminhada de 20 a 30 minutos',
    text: 'Caminhada de 20 a 30 minutos na maior parte dos dias, ou 10 minutos depois das refeições principais. Não precisa de academia.',
  },
  {
    id: 'p6',
    n: 6,
    theme: 3,
    label: 'Horário de dormir mais fixo',
    text: 'Horário de dormir mais ou menos fixo, inclusive no fim de semana, tela longe na última meia hora e nada de café depois do meio da tarde.',
  },
];

export interface PlanThemeInfo {
  theme: PlanTheme;
  /** "base", "alimentação", "ajuste fino" */
  name: string;
  activeCount: number;
  summary: string;
  note: string;
  expect: string;
}

export const PLAN_THEMES: Record<PlanTheme, PlanThemeInfo> = {
  1: {
    theme: 1,
    name: 'base',
    activeCount: 2,
    summary: 'água distribuída no dia e rotina de banheiro depois do café.',
    note: 'Por que esses dois primeiro? Porque são os que dão resultado mais rápido e não dependem de mudar o que você come.',
    expect:
      'Muita gente já percebe diferença na facilidade de evacuar. É a semana de menor esforço e de resultado mais rápido.',
  },
  2: {
    theme: 2,
    name: 'alimentação',
    activeCount: 4,
    summary: 'uma leguminosa e uma fonte de fibra por dia, e o roteiro da refeição no almoço.',
    note: 'É normal sentir um pouco mais de gases nos primeiros dias. Se ficar desconfortável, diminua a quantidade e aumente mais devagar. Lembre que fibra sem água piora.',
    expect:
      'Você pode sentir um pouco mais de gases nos primeiros dias. Isso é esperado e passa conforme o intestino se adapta. Se estiver muito desconfortável, diminua a quantidade e aumente mais devagar.',
  },
  3: {
    theme: 3,
    name: 'ajuste fino',
    activeCount: 6,
    summary: 'caminhada na maior parte dos dias e horário de dormir mais fixo.',
    note: 'Esses dois dão resultado mais sutil no curto prazo e são os que mais sustentam o resultado no longo prazo.',
    expect:
      'O resultado é mais sutil no curto prazo e é o que mais sustenta o longo prazo. É também quando as anotações começam a mostrar padrão de verdade.',
  },
};

export const RECADO_DIA4 =
  'O dia mais perigoso do plano é o quarto ou quinto dia. É quando a novidade passa e o cansaço aparece. Se você chegar no dia 7 com o plano em pé, a chance de terminar é muito alta.';

/** Semana zero (seção 6.7). */
export const SEMANA_ZERO_ITENS: { id: string; text: string; detail?: string }[] = [
  {
    id: 'onde_registrar',
    text: 'Defini onde vou registrar: no app ou nas folhas impressas do caderno.',
  },
  { id: 'meta_agua', text: 'Calculei a minha meta de água' },
  { id: 'compra', text: 'Fiz a compra pela lista base da aula 14' },
  {
    id: 'preparos',
    text: 'Deixei os três preparos prontos',
    detail: 'Uma leguminosa cozida em quantidade, uma proteína desfiada e os legumes higienizados.',
  },
  { id: 'horario_banheiro', text: 'Defini o horário da minha rotina de banheiro' },
  { id: 'calendario', text: 'Marquei o dia 1 e o dia 21 no calendário' },
];

export function planHabitsForTheme(theme: PlanTheme): PlanHabit[] {
  return PLAN_HABITS.filter((h) => h.theme <= theme);
}
