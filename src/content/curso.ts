/**
 * Módulos, aulas e tarefas (seção 9.2 e tabela da seção 6.6).
 * Textos transcritos da especificação. Não editar sem a Jéssica.
 */

export interface Material {
  label: string;
  /** Rota interna do app (atalho para o Guia ou para a ferramenta). */
  to?: string;
}

export interface LessonTask {
  /** Nome curto da tarefa (tabela da seção 6.6). */
  name: string;
  /** null = sem prazo. 'fim_do_plano' = aula 17. */
  durationDays: number | null | 'fim_do_plano';
  /** Instrução principal da aula. */
  instruction?: string;
  /** Resumo dos campos, como está na aula. */
  fields?: string;
  /** O que a tarefa pergunta no fim. */
  endQuestion?: string;
  /** Textos extras da aula (avisos, observações). */
  notes?: string[];
  /** Se a tarefa tem campos que aparecem dentro do Registro do dia. */
  hasDailyFields: boolean;
}

export interface Lesson {
  id: number;
  module: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  material: Material[];
  task: LessonTask;
}

export interface Module {
  id: 1 | 2 | 3 | 4;
  title: string;
  lessons: number[];
}

export const MODULES: Module[] = [
  { id: 1, title: 'Entenda o teu intestino', lessons: [1, 2, 3, 4] },
  { id: 2, title: 'Identifique o teu caso', lessons: [5, 6, 7, 8, 9] },
  { id: 3, title: 'Modulação na prática', lessons: [10, 11, 12, 13, 14] },
  { id: 4, title: 'Plano de 21 dias', lessons: [15, 16, 17] },
];

export const LESSONS: Lesson[] = [
  {
    id: 1,
    module: 1,
    title: 'Intestino, o nosso segundo cérebro',
    description:
      'Por que o intestino tem uma rede de neurônios própria, como ela conversa com o teu cérebro nos dois sentidos e por que isso muda a forma de cuidar dele. Aqui você entende que cuidar do intestino envolve rotina e não só lista de alimento.',
    material: [],
    task: {
      name: '3 dias de observação',
      durationDays: 3,
      instruction: 'Anote uma vez por dia, de preferência à noite.',
      fields:
        'Como estavam as fezes, horas de sono, estresse do dia de 0 a 10, copos de água, o que comi.',
      endQuestion: 'O que se repetiu?',
      hasDailyFields: true,
    },
  },
  {
    id: 2,
    module: 1,
    title: 'Como o intestino funciona, da boca até o banheiro',
    description:
      'O caminho completo do alimento, etapa por etapa, com cada sintoma que você já sentiu ligado ao lugar onde ele aparece. Você descobre em que ponto do processo o teu desconforto nasce e por que segurar a vontade resseca as fezes.',
    material: [],
    task: {
      name: '3 dias de rotina de banheiro',
      durationDays: 3,
      instruction:
        'Depois do café da manhã, sente no vaso de 10 a 15 minutos. Sem pressa e sem celular. Não force nada. Se vier, veio. Se não vier, tudo bem.',
      fields: 'Sentei, evacuei, como estavam as fezes, como foi o dia.',
      hasDailyFields: true,
    },
  },
  {
    id: 3,
    module: 1,
    title: 'Escala de Bristol, como está o teu intestino hoje',
    description:
      'A escala usada em consultório para classificar as fezes em sete tipos, o que cada tipo indica sobre o trânsito intestinal e quais sinais pedem avaliação. Aqui você aprende a ler uma informação que o teu corpo te dá todo dia.',
    material: [
      { label: 'Escala de Bristol', to: '/guia/bristol' },
      { label: 'Registro e leitura da semana', to: '/guia/registro' },
    ],
    task: {
      name: '7 dias de registro',
      durationDays: 7,
      instruction: 'Tipo de Bristol de 1 a 7.',
      fields: 'Evacuei, tipo, o dia em uma linha.',
      endQuestion: 'O que esses dias tinham em comum?',
      notes: [
        'No fim: tipo que mais apareceu, dias com desconforto, o que esses dias tinham em comum.',
      ],
      hasDailyFields: false,
    },
  },
  {
    id: 4,
    module: 1,
    title: 'Disbiose, quando a microbiota sai do equilíbrio',
    description:
      'O que é disbiose, como ela é avaliada, o que danifica a barreira intestinal e o que ajuda a reequilibrar esse ambiente. Você sai sabendo reconhecer promessa exagerada sobre disbiose na internet.',
    material: [{ label: 'Tabela de fibras', to: '/guia/fibras' }],
    task: {
      name: 'Uma fibra por dia',
      durationDays: 7,
      instruction: 'Escolha três fibras na tabela de fibras.',
      fields: 'Fibra do dia, tipo de Bristol.',
      hasDailyFields: true,
    },
  },
  {
    id: 5,
    module: 2,
    title: 'Intestino preso',
    description:
      'Os critérios de constipação, as causas que estão na tua rotina e as mudanças que mais costumam ajudar. A diferença entre fibra solúvel e insolúvel, como combinar fibra com água e como organizar a rotina de banheiro.',
    material: [{ label: 'Cardápio do intestino preso', to: '/guia/cardapios/preso' }],
    task: {
      name: '3 mudanças por 7 dias',
      durationDays: 7,
      instruction:
        'Só três, as que mais cabem na tua rotina. Exemplo: água, rotina de banheiro e uma colher de linhaça por dia.',
      fields: 'Cumpri 1, 2, 3, tipo de Bristol.',
      endQuestion: 'A mudança mais fácil de manter',
      notes: ['No fim: tipo que mais apareceu, a mudança mais fácil de manter.'],
      hasDailyFields: true,
    },
  },
  {
    id: 6,
    module: 2,
    title: 'Intestino solto e diarreia',
    description:
      'A diferença entre diarreia aguda e crônica, como cuidar da hidratação, o que comer durante a crise e como reintroduzir alimentos sem reacender o quadro. Inclui os sinais de desidratação que pedem atenção.',
    material: [
      { label: 'Cardápio da crise', to: '/guia/cardapios/crise' },
      { label: 'A volta depois da crise', to: '/guia/diarreia' },
    ],
    task: {
      name: 'Kit de crise',
      durationDays: null,
      instruction: 'Monte hoje, enquanto você está bem.',
      notes: [
        'Se a crise vier, anote: data, tipo de Bristol durante a crise, copos de líquido no dia, boca seca, tontura ou pouco xixi, tipo de Bristol nos dias seguintes.',
        'Procure atendimento se tiver sangue nas fezes, febre alta, vômito que impede de beber líquido ou se a diarreia passar de dois dias sem melhorar.',
      ],
      hasDailyFields: false,
    },
  },
  {
    id: 7,
    module: 2,
    title: 'Gases, estufamento e Síndrome do Intestino Irritável',
    description:
      'O que é SII, o que são FODMAPs e como funciona o protocolo de baixo FODMAP, com a ressalva de que ele é temporário e precisa de acompanhamento. Você aprende a diferenciar gases comuns de SII e a identificar os teus gatilhos.',
    material: [
      { label: 'Lista de FODMAPs', to: '/guia/fodmap' },
      { label: 'Cardápio de gases e SII', to: '/guia/cardapios/gases' },
    ],
    task: {
      name: 'Diário de sintomas',
      durationDays: 7,
      instruction: 'Anote o que comeu e o que sentiu, com o horário de cada um. Sintoma de 0 a 10.',
      endQuestion: 'Alimentos que apareceram antes do sintoma mais de uma vez',
      notes: [
        'No fim: alimentos que apareceram antes do sintoma mais de uma vez; marcar na lista de FODMAPs.',
      ],
      hasDailyFields: true,
    },
  },
  {
    id: 8,
    module: 2,
    title: 'Refluxo e gastrite',
    description:
      'O que é cada um dos dois quadros, as causas, os hábitos de rotina que mais aliviam e os alimentos que costumam disparar sintoma. Aqui você entende por que mexer no volume e no horário costuma ajudar mais do que cortar alimento.',
    material: [
      { label: 'Cardápio de refluxo', to: '/guia/cardapios/refluxo' },
      { label: 'Gatilhos e substituições', to: '/guia/cardapios/gatilhos' },
    ],
    task: {
      name: '3 medidas por 7 dias',
      durationDays: 7,
      instruction:
        'As três mais fáceis de encaixar na tua rotina. Exemplo: refeições menores, jantar 3 horas antes de deitar e cabeceira da cama elevada.',
      fields: 'Cumpri 1, 2, 3, teve sintoma, o que comi antes.',
      endQuestion: 'O que apareceu antes do sintoma mais de uma vez',
      hasDailyFields: true,
    },
  },
  {
    id: 9,
    module: 2,
    title: 'Sinais de alerta e casos que precisam de acompanhamento',
    description:
      'SIBO, IMO, doenças inflamatórias intestinais e diverticulite explicadas de forma simples e os sinais que mostram quando o teu caso sai do alcance do autocuidado. É a aula que te ensina a chegar preparada numa consulta.',
    material: [
      { label: 'Preparação para a consulta', to: '/ficha' },
      { label: 'Sinais de alerta', to: '/guia/alertas' },
    ],
    task: {
      name: 'Ficha para a consulta',
      durationDays: null,
      instruction: 'Preencha em casa olhando o teu registro e mostre no começo da consulta.',
      hasDailyFields: false,
    },
  },
  {
    id: 10,
    module: 3,
    title: 'Fibras e água do jeito certo',
    description:
      'Sai do conceito e vai para a conta. Quanta fibra tem em cada alimento, como fechar a meta do dia com comida comum e como calcular e distribuir a tua meta de água ao longo do dia.',
    material: [
      { label: 'Meta de água', to: '/guia/agua' },
      { label: 'Tabela de fibras', to: '/guia/fibras' },
    ],
    task: {
      name: 'Água e fibra',
      durationDays: null,
      fields:
        'Minha água (peso x 35, copos de manhã, à tarde e antes de dormir) e meu dia de fibras (café da manhã, lanche da manhã, almoço, lanche da tarde, jantar, total com meta de 25 a 30 g).',
      notes: [
        'Quem tem condição renal ou cardíaca precisa de orientação individual sobre a quantidade de água.',
      ],
      hasDailyFields: false,
    },
  },
  {
    id: 11,
    module: 3,
    title: 'Prebióticos, probióticos e simbióticos',
    description:
      'A diferença entre os três, as fontes alimentares de cada um e como montar combinações simbióticas no dia a dia. Inclui como ler o rótulo do iogurte e o que os estudos permitem afirmar sobre suplemento.',
    material: [{ label: 'Prebióticos e probióticos', to: '/guia/prebioticos' }],
    task: {
      name: 'Prebiótico e fermentado',
      durationDays: 7,
      instruction:
        'Uma fonte prebiótica e uma fermentada por dia. Comece com meia porção. Se você tem intestino irritável, deixe alho e cebola de fora nessa fase.',
      fields: 'Prebiótico, fermentado, gases ou estufamento de 0 a 10.',
      hasDailyFields: true,
    },
  },
  {
    id: 12,
    module: 3,
    title: 'Low FODMAP na prática, fase por fase',
    description:
      'Como executar o protocolo: conduzir a restrição com prazo, testar um grupo por vez e chegar na alimentação personalizada. Com a tabela de teste e o calendário do protocolo para preencher.',
    material: [
      { label: 'Lista de FODMAPs', to: '/guia/fodmap' },
      { label: 'Tabela de teste', to: '/guia/fodmap#teste' },
    ],
    task: {
      name: 'Calendário do protocolo',
      durationDays: null,
      instruction:
        'Se você tem ou já teve uma relação difícil com a comida, faça este protocolo com acompanhamento.',
      notes: [
        'Fase 1: data de início, data da avaliação (entre a semana 2 e a 4), "Os sintomas caíram de forma clara?"',
        'Se não caíram em 4 semanas, encerre a fase 1, volte a comer normal e leve essa informação para uma consulta.',
        'Fase 2: um grupo por semana, 3 dias de teste com porção crescente, depois 2 a 3 dias de pausa, sintoma de 0 a 10.',
        'Fase 3, o que eu aprendi: liberado, só em quantidade menor, gatilho.',
      ],
      hasDailyFields: false,
    },
  },
  {
    id: 13,
    module: 3,
    title: 'A rotina que segura o resultado',
    description:
      'Mastigação, horários, sono, estresse e movimento virando técnica aplicável, com o roteiro da refeição em cinco passos. E como implantar isso sem sobrecarregar a tua semana.',
    material: [{ label: 'Rotina', to: '/guia/rotina' }],
    task: {
      name: 'Dois hábitos com gatilho',
      durationDays: 7,
      instruction: 'Escreva o gatilho no formato: depois que eu faço X, eu faço Y.',
      notes: ['Material: nenhum novo, continue o registro.'],
      hasDailyFields: true,
    },
  },
  {
    id: 14,
    module: 3,
    title: 'Montando o prato e o cardápio do dia a dia',
    description:
      'Um método de montagem que funciona sem cardápio fechado, com adaptação por queixa, planejamento de semana, lista de compras base e o que fazer quando você come fora.',
    material: [{ label: 'O prato, a lista de compras e o comer fora', to: '/guia/prato' }],
    task: {
      name: 'Compra e preparos',
      durationDays: null,
      hasDailyFields: false,
    },
  },
  {
    id: 15,
    module: 4,
    title: 'Como usar o plano de 21 dias',
    description:
      'A lógica do plano, o ajuste por queixa e as regras que evitam o abandono no meio do caminho. Como escolher a data de início e preparar a semana zero.',
    material: [{ label: 'O plano de 21 dias', to: '/guia/plano' }],
    task: {
      name: 'Semana zero',
      durationDays: null,
      fields: 'Semana zero, meu caminho e os hábitos das três semanas.',
      hasDailyFields: false,
    },
  },
  {
    id: 16,
    module: 4,
    title: 'Checklist diário e diário intestinal',
    description:
      'Como registrar em dois minutos por dia e, principalmente, como ler o que foi registrado. A leitura semanal em quatro perguntas e os padrões que costumam aparecer.',
    material: [
      { label: 'Registro e leitura da semana', to: '/guia/registro' },
      { label: 'Padrões que costumam aparecer', to: '/guia/registro#padroes' },
    ],
    task: {
      name: 'Registro e leitura da semana',
      durationDays: 7,
      fields:
        'Registrar sete dias seguidos e fazer a primeira leitura da semana, com o gatilho do registro e o dia da leitura definidos.',
      hasDailyFields: false,
    },
  },
  {
    id: 17,
    module: 4,
    title: 'Reavaliação e próximos passos',
    description:
      'A reavaliação do dia 21 comparando com o teu ponto de partida, os três cenários possíveis e o que fazer em cada um. E como manter o resultado depois que o plano acaba.',
    material: [{ label: 'Reavaliação, cenários e plano mínimo', to: '/guia/plano#reavaliacao' }],
    task: {
      name: 'Reavaliação do dia 21',
      durationDays: 'fim_do_plano',
      fields: 'Reavaliação, meu cenário, meu plano mínimo e o dia da revisão do mês.',
      hasDailyFields: false,
    },
  },
];

export function getLesson(id: number): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getModule(id: number): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

/** Itens da tarefa da aula 6 (kit de crise). */
export const KIT_CRISE_ITENS = [
  'Soro de reidratação oral, um sachê na gaveta',
  'Arroz branco',
  'Cenoura',
  'Banana',
  'Base para caldo leve: batata, abobrinha, frango',
];

/** Tarefa da aula 14 (compra e preparos). */
export const AULA14 = {
  listaBase: [
    'Leguminosas',
    'Ovos',
    'Proteína animal',
    'Arroz, batata ou mandioca',
    'Aveia',
    'Uma semente',
    'Frutas',
    'Folhas',
    'Legumes',
    'Iogurte natural',
    'Azeite',
  ],
  preparos: [
    'Uma leguminosa cozida e congelada em porções',
    'Uma proteína desfiada ou pronta',
    'Legumes e folhas higienizados',
  ],
  foto: ['Tirei a foto', 'O que ficou parecido com o modelo', 'O que faltou'],
};

/** Sugestões de mudanças da tarefa da aula 5 (seção 6.6). */
export const AULA5_SUGESTOES = [
  { label: 'Água distribuída', isWater: true },
  { label: 'Rotina de banheiro', isWater: false },
  { label: 'Uma colher de linhaça por dia', isWater: false },
];

/** Selo por caminho (seção 6.6). */
export const LESSON_RECOMMENDED_FOR: Record<number, string> = {
  5: 'preso',
  6: 'solto',
  7: 'gases_sii',
  8: 'refluxo',
  12: 'gases_sii',
};

/** Nota das aulas 1 e 2 sobre o seletor de Bristol (seção 6.6). */
export const NOTA_BRISTOL_ANTES_AULA3 =
  'Você vai aprender a escala na aula 3. Por enquanto, escolha o desenho mais parecido com o teu dia.';
