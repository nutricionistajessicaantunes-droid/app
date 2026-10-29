/** Cardápios modelo e gatilhos (seção 9.14). */

export const COMO_LER_CARDAPIO =
  'Escolha uma opção de cada refeição e monte o teu dia. As três opções valem a mesma coisa. As quantidades são medidas caseiras, como referência. Ajuste ao teu apetite e à tua rotina. Troque o que você não come pelo que aparece na mesma linha. Comida que você não gosta não vira rotina. A meta de água é a mesma em qualquer um dos cardápios.';

export const AVISO_CARDAPIO =
  'Nenhum destes é plano alimentar. São modelos educativos, para você ver como um dia bem montado se parece. Plano individual sai de consulta, com a tua história na mesa.';

export interface MenuMeal {
  refeicao: string;
  opcoes: string[];
}

export interface Menu {
  id: 'preso' | 'crise' | 'gases' | 'refluxo';
  titulo: string;
  intro: string;
  refeicoes: MenuMeal[];
  trocas?: { titulo: string; texto: string }[];
  fecho?: string[];
  regras?: { titulo: string; itens: string[] };
}

export const CARDAPIOS: Menu[] = [
  {
    id: 'preso',
    titulo: 'Intestino preso',
    intro:
      'Fibra, água e rotina no mesmo dia. Aumente a fibra ao longo de duas a três semanas, sempre com a água junto.',
    refeicoes: [
      {
        refeicao: 'Café da manhã',
        opcoes: [
          '2 ovos mexidos, 1 fatia de pão 100% integral e 1 laranja com bagaço',
          'Mingau de aveia: 3 col. de sopa de aveia com leite, 1 banana amassada, canela e 1 col. de sopa de linhaça',
          '1 xícara de cuscuz de milho com 1 ovo e tomate picado, e 1 fatia de mamão',
        ],
      },
      {
        refeicao: 'Lanche da manhã',
        opcoes: [
          '1 banana com 1 col. de sopa de aveia',
          '1 pote de iogurte natural com 1 col. de sopa de linhaça e 1 col. de chá de mel',
          '1 maçã com casca e 1 fatia de queijo branco',
        ],
      },
      {
        refeicao: 'Almoço',
        opcoes: [
          'Salada de folhas com talos, tomate e cenoura ralada, 4 col. de sopa de arroz integral, 1 concha de feijão, frango desfiado e brócolis refogado',
          'Salada de repolho com laranja, arroz cozido com cenoura e abobrinha raladas, 1 concha de lentilha e carne moída com legumes',
          'Salada de folhas com beterraba ralada, 1 pedaço de batata-doce ou mandioca cozida, grão-de-bico refogado e peixe ou ovo',
        ],
      },
      {
        refeicao: 'Lanche da tarde',
        opcoes: [
          '2 ameixas pretas hidratadas num copo de água durante o dia, consumidas com a água, e 1 pote de iogurte natural',
          'Vitamina de mamão com 1 col. de sopa de aveia e 1 col. de chá de linhaça',
          '1 fatia de pão integral com ovo mexido ou queijo branco e 1 fruta',
        ],
      },
      {
        refeicao: 'Jantar',
        opcoes: [
          'Sopa de legumes com feijão ou grão-de-bico e couve picada, com 1 fatia de pão integral',
          'Omelete com espinafre e tomate, 3 col. de sopa de arroz integral e salada crua',
          'Arroz integral, feijão, legumes cozidos e frango ou ovo',
        ],
      },
      {
        refeicao: 'Ceia, se quiser',
        opcoes: [
          '1 copo de leite morno com canela',
          '1 pote pequeno de iogurte natural com 1 col. de chá de chia',
          '1 ameixa preta hidratada com um pouco da água',
        ],
      },
    ],
    trocas: [
      {
        titulo: 'Frutas que ajudam mais',
        texto:
          'Laranja com bagaço, mamão, manga, abacaxi, ameixa, kiwi, banana, uva e maçã com casca; frutas secas também entram.',
      },
      {
        titulo: 'Para acrescentar fibra',
        texto:
          '1 a 2 colheres de sopa por dia de aveia, farelo de trigo, linhaça ou chia, na fruta, no iogurte, na salada ou no arroz.',
      },
      {
        titulo: 'Leguminosas',
        texto:
          'Feijão de qualquer tipo, lentilha, grão-de-bico e ervilha; revezar na semana e usar a panela de pressão rende vários dias.',
      },
      {
        titulo: 'Integrais',
        texto:
          'Arroz integral, batata-doce, mandioca, cuscuz de milho, pão e massa integrais; no rótulo, o primeiro ingrediente precisa ser farinha integral.',
      },
    ],
    fecho: [
      'Os mais baratos da lista são os que mais aparecem: aveia, linhaça, feijão, ovo, banana e repolho.',
    ],
  },
  {
    id: 'crise',
    titulo: 'Diarreia, fase de crise',
    intro:
      'Na crise a prioridade é a hidratação, o dia inteiro, entre as refeições. A comida vem depois e fica leve de propósito.',
    refeicoes: [
      {
        refeicao: 'Ao acordar',
        opcoes: [
          '1 copo de soro de reidratação oral',
          '1 copo de água de coco',
          '1 copo de chá morno sem açúcar',
        ],
      },
      {
        refeicao: 'Café da manhã',
        opcoes: [
          '2 fatias de pão branco com um fio de azeite e chá morno',
          'Creme de arroz feito com água e uma pitada de sal',
          '1 banana bem madura amassada com 2 torradas',
        ],
      },
      {
        refeicao: 'Lanche da manhã',
        opcoes: [
          '1 maçã sem casca, cozida ou raspada',
          '1 banana',
          '1 porção pequena de batata cozida com sal',
        ],
      },
      {
        refeicao: 'Almoço',
        opcoes: [
          'Arroz branco, cenoura cozida e frango desfiado cozido',
          'Caldo de legumes coado com arroz e frango desfiado',
          'Purê de batata feito com a água do cozimento e carne magra desfiada',
        ],
      },
      {
        refeicao: 'Lanche da tarde',
        opcoes: [
          'Chá morno sem açúcar com 3 biscoitos água e sal',
          '1 banana amassada',
          '1 xícara de caldo leve de legumes',
        ],
      },
      {
        refeicao: 'Jantar',
        opcoes: [
          'Canja com arroz branco, cenoura e frango',
          'Sopa de batata, cenoura e abobrinha com peixe cozido',
          'Arroz branco com cenoura cozida e ovo cozido',
        ],
      },
      {
        refeicao: 'Ao longo do dia',
        opcoes: [
          'Soro de reidratação oral em pequenos goles',
          'Água, água de coco e sucos diluídos em água',
          'Caldos leves e isotônico',
        ],
      },
    ],
  },
  {
    id: 'gases',
    titulo: 'Gases, estufamento e SII',
    intro:
      'Dia modelo de baixo teor de FODMAP, para a fase 1 do protocolo. Cinco refeições menores, porque o intestino irritável responde melhor assim.',
    refeicoes: [
      {
        refeicao: 'Café da manhã',
        opcoes: [
          'Tapioca com 1 ovo mexido e 1 laranja',
          'Mingau de aveia feito com leite sem lactose, banana mais verde e canela',
          '2 fatias de pão sem glúten com pasta de amendoim e 1 kiwi',
        ],
      },
      {
        refeicao: 'Lanche da manhã',
        opcoes: [
          '1 banana mais verde',
          '1 pote de iogurte sem lactose com morangos picados',
          '10 uvas e 1 fatia de queijo parmesão',
        ],
      },
      {
        refeicao: 'Almoço',
        opcoes: [
          'Arroz, frango grelhado, cenoura e abobrinha refogadas no azeite e salada de alface com tomate',
          'Batata cozida, peixe assado, espinafre refogado e salada de pepino',
          'Macarrão de arroz com molho de tomate caseiro, carne moída e salada de alface',
        ],
      },
      {
        refeicao: 'Lanche da tarde',
        opcoes: [
          'Tapioca com queijo',
          '1 fatia de melão ou 1 xícara de abacaxi',
          '1 pote de iogurte sem lactose com 1 col. de sopa de aveia',
        ],
      },
      {
        refeicao: 'Jantar',
        opcoes: [
          'Omelete com espinafre e tomate, com arroz',
          'Canja de arroz com frango e cenoura',
          'Batata-baroa cozida, frango desfiado e abobrinha refogada',
        ],
      },
    ],
    fecho: [
      'As trocas de cada grupo estão na lista de FODMAPs. Não corte tudo de uma vez: a lista serve para testar.',
      'A fase de restrição dura de 2 a 6 semanas e é temporária. Restringir por tempo indefinido empobrece a microbiota. O diagnóstico de SII é médico.',
    ],
  },
  {
    id: 'refluxo',
    titulo: 'Refluxo e gastrite',
    intro:
      'Cinco refeições menores, sem os gatilhos mais comuns. A água fica principalmente entre as refeições.',
    refeicoes: [
      {
        refeicao: 'Café da manhã',
        opcoes: [
          'Mingau de aveia feito com água ou bebida vegetal, com banana amassada e canela',
          '1 tapioca com 1 ovo mexido e 1 maçã',
          '2 fatias de pão integral com ovo cozido e chá de camomila',
        ],
      },
      {
        refeicao: 'Lanche da manhã',
        opcoes: [
          '1 banana',
          '1 maçã cozida com canela',
          'Chá de erva-doce com 3 biscoitos água e sal',
        ],
      },
      {
        refeicao: 'Almoço',
        opcoes: [
          '4 col. de sopa de arroz integral, 1 concha de feijão, frango grelhado e cenoura e abóbora cozidas',
          'Arroz integral, 1 concha de lentilha, patinho cozido e abobrinha refogada no azeite',
          'Purê de abóbora, peixe assado, arroz integral e salada de folhas com azeite',
        ],
      },
      {
        refeicao: 'Lanche da tarde',
        opcoes: [
          'Vitamina de banana com 1 col. de sopa de aveia, feita com água ou bebida vegetal',
          '1 tapioca pequena com ovo',
          'Chá de camomila com 1 fatia de pão integral e ovo mexido',
        ],
      },
      {
        refeicao: 'Jantar, 3 h antes de deitar',
        opcoes: [
          'Sopa de abóbora com frango desfiado e arroz',
          'Canja leve com arroz, cenoura e frango',
          'Arroz integral com legumes cozidos e omelete simples',
        ],
      },
    ],
    regras: {
      titulo: 'As regras que valem mais que o cardápio',
      itens: [
        'Quatro ou mais refeições por dia, em porções menores. Refeição volumosa aumenta a pressão no estômago.',
        'Água principalmente entre as refeições, e não em grande quantidade durante a refeição.',
        'Coma devagar e mastigue bem. A digestão começa na boca.',
        'Última refeição pelo menos três horas antes de deitar, e nada de deitar nas duas horas seguintes a qualquer refeição.',
        'Eleve a cabeceira da cama em torno de quinze centímetros, com calços embaixo do colchão. Mais travesseiro não resolve.',
      ],
    },
  },
];

/** Regras do refluxo, também sugestões de medidas da tarefa da aula 8. */
export const MEDIDAS_REFLUXO = [
  'Refeições menores',
  'Jantar 3 horas antes de deitar',
  'Cabeceira da cama elevada',
  'Água principalmente entre as refeições',
  'Comer devagar e mastigar bem',
  'Não deitar nas duas horas seguintes a qualquer refeição',
];

export const GATILHOS = {
  intro:
    'A lista abaixo é ponto de partida. A resposta é individual, e o objetivo é chegar à tua própria lista.',
  evite: [
    'Café, chá mate e chocolate',
    'Refrigerante e bebida alcoólica',
    'Fritura e excesso de gordura',
    'Enlatados e embutidos',
    'Leite e derivados, enquanto o sintoma estiver ativo',
    'Pimenta-do-reino e condimentos fortes',
    'No refluxo, some cítricos, tomate, menta e hortelã',
  ],
  useNoLugar: [
    'Chá de camomila, erva-doce ou cidreira no lugar do café',
    'Água com gás sem açúcar ou água saborizada com fruta no lugar do refrigerante',
    'Assado, cozido e grelhado no lugar da fritura',
    'Manjericão, orégano, salsa e alecrim no lugar da pimenta',
    'Bebida vegetal ou versão sem lactose enquanto o sintoma estiver ativo',
  ],
  aviso:
    'Quem usa antiácido com frequência precisa de acompanhamento, porque o uso prolongado pode prejudicar a absorção de vitamina B12, ferro e ácido fólico. O diagnóstico de refluxo, gastrite e H. pylori é médico, e o tratamento também.',
};
