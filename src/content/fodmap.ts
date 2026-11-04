import type { FodmapGroup } from '../types';

/**
 * FODMAPs e protocolo (seção 9.12, aulas 7 e 12).
 * "aliases" são só termos de busca para a mesma entrada da lista. A classificação
 * exibida é sempre o nome da entrada como está no caderno.
 */

export type FodmapLevel = 'alto' | 'baixo' | 'livre';

export interface FodmapItem {
  name: string;
  aliases?: string[];
}

export interface FodmapCategory {
  id: string;
  title: string;
  alto: FodmapItem[];
  baixo: FodmapItem[];
  dica: string;
}

const i = (name: string, aliases?: string[]): FodmapItem =>
  aliases ? { name, aliases } : { name };

export const FODMAP_CATEGORIAS: FodmapCategory[] = [
  {
    id: 'frutas',
    title: 'Frutas',
    alto: [
      i('maçã'),
      i('pera'),
      i('manga'),
      i('melancia'),
      i('abacate'),
      i('ameixa'),
      i('pêssego'),
      i('nectarina'),
      i('damasco'),
      i('cereja'),
      i('figo'),
      i('frutas secas', ['fruta seca']),
    ],
    baixo: [
      i('banana mais verde', ['banana verde']),
      i('uva'),
      i('melão'),
      i('kiwi'),
      i('laranja'),
      i('tangerina'),
      i('limão'),
      i('abacaxi'),
      i('morango'),
      i('maracujá'),
      i('carambola'),
      i('mirtilo'),
    ],
    dica: 'Fruta em pedaço grande pesa mais do que fruta em porção pequena. Comece com meia porção.',
  },
  {
    id: 'vegetais',
    title: 'Vegetais e temperos',
    alto: [
      i('alho'),
      i('cebola'),
      i('alho-poró', ['alho poró']),
      i('brócolis', ['brócoli']),
      i('couve-flor', ['couve flor']),
      i('beterraba'),
      i('aspargos', ['aspargo']),
      i('alcachofra'),
      i('cogumelo'),
      i('ervilha'),
      i('repolho'),
      i('quiabo'),
    ],
    baixo: [
      i('cenoura'),
      i('pepino'),
      i('berinjela'),
      i('abobrinha'),
      i('alface'),
      i('espinafre'),
      i('tomate'),
      i('pimentão'),
      i('acelga'),
      i('nabo'),
      i('batata'),
      i('batata-baroa', ['batata baroa', 'mandioquinha']),
    ],
    dica: 'Alho e cebola são os gatilhos mais comuns e os mais presentes na comida brasileira.',
  },
  {
    id: 'cereais',
    title: 'Cereais, massas e pães',
    alto: [
      i('trigo'),
      i('centeio'),
      i('cevada'),
      i('pão francês e de forma', ['pão francês', 'pão de forma']),
      i('massas de trigo', ['massa de trigo', 'macarrão de trigo']),
      i('biscoitos de trigo', ['biscoito de trigo']),
    ],
    baixo: [
      i('arroz'),
      i('tapioca'),
      i('quinoa'),
      i('painço'),
      i('macarrão de arroz'),
      i('farinha de milho'),
      i('mandioca'),
      i('pão e massa sem glúten', ['pão sem glúten', 'massa sem glúten']),
    ],
    dica: 'Aqui a restrição é do FODMAP do trigo, e não do glúten. São coisas diferentes.',
  },
  {
    id: 'leguminosas',
    title: 'Leguminosas',
    alto: [
      i('feijão'),
      i('grão-de-bico', ['grão de bico']),
      i('lentilha'),
      i('soja em grão'),
      i('ervilha seca'),
    ],
    baixo: [
      i('grão-de-bico em conserva', ['grão de bico em conserva']),
      i('tofu firme'),
      i('broto de feijão'),
    ],
    dica: 'O grão-de-bico em conserva vale bem enxaguado e em porção pequena. É o grupo que mais faz falta, e volta na fase 2.',
  },
  {
    id: 'leite',
    title: 'Leite e derivados',
    alto: [
      i('leite'),
      i('iogurte comum'),
      i('ricota'),
      i('cottage'),
      i('minas frescal', ['queijo minas frescal']),
      i('creme de leite'),
      i('leite condensado'),
      i('sorvete'),
    ],
    baixo: [
      i('leite sem lactose'),
      i('iogurte sem lactose'),
      i('leite de arroz'),
      i('leite de coco'),
      i('leite de amêndoas'),
      i('manteiga'),
      i('parmesão', ['queijo parmesão']),
      i('brie e camembert', ['brie', 'camembert']),
    ],
    dica: 'Queijo curado tem pouca lactose. Queijo fresco tem bastante.',
  },
  {
    id: 'oleaginosas',
    title: 'Oleaginosas e sementes',
    alto: [
      i('castanha de caju', ['castanha-de-caju']),
      i('pistache'),
      i('amêndoa em quantidade', ['amêndoa']),
      i('avelã em quantidade', ['avelã']),
    ],
    baixo: [
      i('castanha-do-pará', ['castanha do pará']),
      i('noz-pecã', ['noz pecã']),
      i('macadâmia'),
      i('semente de abóbora'),
      i('semente de girassol'),
      i('chia'),
      i('linhaça em porção pequena', ['linhaça']),
    ],
    dica: 'Aqui a quantidade decide quase tudo. Um punhado pequeno costuma passar.',
  },
  {
    id: 'adocantes',
    title: 'Adoçantes e açúcares',
    alto: [
      i('mel'),
      i('agave'),
      i('xarope de milho'),
      i('sorbitol'),
      i('manitol'),
      i('xilitol'),
      i('maltitol'),
      i('isomalte'),
    ],
    baixo: [
      i('açúcar cristal'),
      i('açúcar mascavo'),
      i('xarope de bordo'),
      i('chocolate amargo'),
      i('estévia'),
      i('sucralose'),
    ],
    dica: 'Tudo que termina em ol no rótulo costuma ser FODMAP. Olhe bala, chiclete e produto diet.',
  },
];

/** "Use sem contar, em qualquer fase" (seção 9.12). */
export const USE_SEM_CONTAR = {
  title: 'Use sem contar, em qualquer fase',
  grupos: [
    {
      titulo: 'Proteínas e gorduras',
      itens: [
        i('carne bovina', ['carne']),
        i('frango'),
        i('peru'),
        i('porco', ['carne de porco']),
        i('peixe'),
        i('frutos do mar'),
        i('ovos', ['ovo']),
        i('tofu firme'),
        i('azeite'),
        i('óleos em geral', ['óleo']),
      ],
    },
    {
      titulo: 'No lugar de alho e cebola',
      itens: [
        i('parte verde da cebolinha'),
        i('cebolinha-capim'),
        i('manjericão'),
        i('orégano'),
        i('salsa'),
        i('alecrim'),
        i('tomilho'),
        i('gengibre'),
        i('açafrão'),
      ],
    },
  ],
  dica: 'O azeite aromatizado com o dente de alho, tirando os pedaços antes de usar, entrega o sabor sem o FODMAP.',
};

export const FODMAP_COMO_USAR = {
  intro:
    'Esta parte é para quem tem estufamento, gases ou intestino irritável. A lista sozinha vira uma lista de proibições, e ela só funciona dentro das três fases.',
  fases: [
    {
      titulo: 'Fase 1, restrição',
      texto:
        'De 2 a 6 semanas, com data marcada para acabar. Troque o alto teor pelo baixo teor e observe se os sintomas caem.',
    },
    {
      titulo: 'Fase 2, reintrodução',
      texto:
        'Um grupo por vez, 3 dias de teste com porção crescente e 2 a 3 dias de pausa antes do próximo.',
    },
    {
      titulo: 'Fase 3, personalização',
      texto:
        'Mantenha tudo que você tolerou e restrinja só o que causou sintoma, na quantidade que causou.',
    },
  ],
  temporaria:
    'A restrição é temporária. Se depois de quatro semanas os sintomas não caíram de forma clara, encerre a fase 1, volte a comer normal e leve essa informação para a consulta.',
  colunas: 'Na lista, a coluna de alto teor sai durante a fase 1 e a de baixo teor entra no lugar.',
};

export interface FodmapTestInfo {
  group: FodmapGroup;
  label: string;
  /** Alimento como está na tabela. */
  foodText: string;
  foods: string[];
  portions: [string, string, string];
}

/** Tabela de teste da fase 2 (porções dos dias 1, 2 e 3). */
export const TABELA_TESTE: FodmapTestInfo[] = [
  {
    group: 'lactose',
    label: 'Lactose',
    foodText:
      'leite, iogurte comum, queijo minas frescal, ricota, requeijão light ou creme de leite',
    foods: [
      'leite',
      'iogurte comum',
      'queijo minas frescal',
      'ricota',
      'requeijão light',
      'creme de leite',
    ],
    portions: ['meio copo', '1 copo', '1 copo e meio'],
  },
  {
    group: 'frutose',
    label: 'Frutose',
    foodText: 'mel, manga, figo fresco, aspargo ou xarope de agave',
    foods: ['mel', 'manga', 'figo fresco', 'aspargo', 'xarope de agave'],
    portions: ['1 colher de chá', '1 colher de sopa', '2 colheres de sopa'],
  },
  {
    group: 'sorbitol',
    label: 'Sorbitol',
    foodText: 'abacate, ameixa, amora, pêssego, nectarina, damasco ou lichia',
    foods: ['abacate', 'ameixa', 'amora', 'pêssego', 'nectarina', 'damasco', 'lichia'],
    portions: ['1 fatia fina ou meia ameixa', '1 fatia', '2 fatias ou 2 ameixas'],
  },
  {
    group: 'manitol',
    label: 'Manitol',
    foodText: 'cogumelo, couve-flor, batata-doce ou salsão',
    foods: ['cogumelo', 'couve-flor', 'batata-doce', 'salsão'],
    portions: ['2 colheres de sopa', 'meia xícara', '1 xícara'],
  },
  {
    group: 'frutanos',
    label: 'Frutanos',
    foodText:
      'pão de trigo, macarrão de trigo, biscoito de trigo, pão de centeio, alho, cebola, alho-poró ou beterraba',
    foods: [
      'pão de trigo',
      'macarrão de trigo',
      'biscoito de trigo',
      'pão de centeio',
      'alho',
      'cebola',
      'alho-poró',
      'beterraba',
    ],
    portions: ['meia fatia ou 1 colher de chá', '1 fatia', '2 fatias'],
  },
  {
    group: 'galactanos',
    label: 'Galactanos',
    foodText: 'feijão, lentilha, grão-de-bico, ervilha, soja em grão ou homus',
    foods: ['feijão', 'lentilha', 'grão-de-bico', 'ervilha', 'soja em grão', 'homus'],
    portions: ['2 colheres de sopa', 'meia concha', '1 concha'],
  },
];

/**
 * Porções de cada alimento nos dias 1, 2 e 3, quando a medida da tabela não serve para ele.
 * Aumento pequeno a cada dia, até uma porção comum de quem come aquele alimento.
 */
export const PORCOES_POR_ALIMENTO: Record<string, [string, string, string]> = {
  'queijo minas frescal': ['1 fatia fina (15 g)', '1 fatia (30 g)', '2 fatias (60 g)'],
  ricota: ['1 colher de sopa', '2 colheres de sopa', '3 colheres de sopa'],
  'requeijão light': ['1 colher de chá', '1 colher de sopa', '2 colheres de sopa'],
  'creme de leite': ['1 colher de chá', '1 colher de sopa', '2 colheres de sopa'],
  manga: ['meia fatia pequena', '1 fatia', 'meia manga'],
  'figo fresco': ['meio figo', '1 figo', '2 figos'],
  aspargo: ['1 aspargo', '3 aspargos', '5 aspargos'],
  ameixa: ['meia ameixa', '1 ameixa', '2 ameixas'],
  abacate: ['1 fatia fina', '1 fatia', '2 fatias'],
  amora: ['5 amoras', '10 amoras', '15 amoras'],
  pêssego: ['um quarto de pêssego', 'meio pêssego', '1 pêssego'],
  nectarina: ['um quarto de nectarina', 'meia nectarina', '1 nectarina'],
  damasco: ['meio damasco', '1 damasco', '2 damascos'],
  lichia: ['2 lichias', '4 lichias', '6 lichias'],
  salsão: ['meio talo', '1 talo', '2 talos'],
  'macarrão de trigo': ['2 colheres de sopa cozido', 'meia xícara cozido', '1 xícara cozido'],
  'biscoito de trigo': ['1 biscoito', '2 biscoitos', '4 biscoitos'],
  'pão de centeio': ['meia fatia', '1 fatia', '2 fatias'],
  alho: [
    '1 colher de chá de alho picado',
    '1 colher de chá e meia',
    '2 colheres de chá (cerca de 2 dentes)',
  ],
  cebola: ['1 colher de chá de cebola picada', '1 colher de sopa', '2 colheres de sopa'],
  'alho-poró': ['1 colher de sopa', '2 colheres de sopa', '3 colheres de sopa'],
  beterraba: ['2 rodelas', '4 rodelas', 'meia beterraba'],
  homus: ['1 colher de sopa', '2 colheres de sopa', '4 colheres de sopa'],
};

export const TABELA_TESTE_TEXTOS = {
  leitura:
    'Anote os sintomas de 0 a 10 nos três dias. Sintoma claro significa gatilho. Sintoma só na porção maior significa questão de quantidade. Nada significa liberado.',
  ordem: 'Ordem sugerida: lactose, frutose, sorbitol, manitol, frutanos e galactanos.',
  duracao:
    'Cada grupo leva cerca de uma semana entre teste e pausa. A fase 2 leva algo em torno de seis semanas.',
};

export const ANTES_DE_COMECAR = [
  'Escolha uma semana comum, sem viagem, festa, prova, mudança ou trabalho muito pesado',
  'Tenha o registro pronto',
  'Planeje a compra e duas ou três preparações',
];

export const FODMAP_CUIDADO = {
  relacaoComida:
    'Se você tem ou já teve uma relação difícil com a comida, com restrição, contagem ou culpa, esse protocolo não é para ser feito sozinha. Ele é restritivo por natureza e pode reativar esse tipo de padrão. Nesse caso, faça com acompanhamento profissional.',
  gestanteDiagnostico:
    'Quem está gestante ou amamentando, e quem tem doença intestinal diagnosticada, deve fazer o protocolo apenas com acompanhamento profissional.',
};

export const FASE1_TEXTOS = {
  completa:
    'A alimentação continua completa, com carboidrato, proteína, gordura, verdura e fruta. Não é fase de comer menos.',
  registrar: 'O que comeu, os sintomas de 0 a 10 e o tipo de Bristol.',
  restringirMais:
    'Restringir mais e por mais tempo não vai fazer aparecer um resultado que não apareceu.',
  naoFuncionou:
    'Saber que não funcionou também é uma informação valiosa, porque aponta para outra direção.',
  encerreNaoCaiu:
    'Encerre a fase 1, volte a comer normal e leve essa informação para uma consulta. Saber que não funcionou também é uma informação valiosa.',
};

export const FASE2_TEXTOS = {
  umGrupo:
    'Você testa um grupo por vez, durante três dias, enquanto mantém o resto da alimentação com baixo teor. Assim, se aparecer sintoma, você sabe exatamente de quem foi.',
  pausa:
    'Depois de cada teste, dois ou três dias de pausa, voltando ao baixo teor, antes do próximo grupo.',
  umPorVez: 'Um grupo por vez, para saber exatamente de quem foi o sintoma.',
};

export const EFEITO_ACUMULATIVO =
  'Você pode tolerar bem uma porção de cada grupo, mas se juntar quatro alimentos fermentáveis na mesma refeição, o sintoma aparece. Observe também a combinação, e não só o alimento isolado.';

export const FASE3_TEXTOS = {
  testeDeNovo:
    'Teste de novo daqui a alguns meses o que deu problema. A tolerância muda, principalmente se o teu intestino melhorou no meio tempo.',
  objetivo: 'O objetivo final é a maior variedade possível com o menor sintoma possível.',
};

export const CINCO_ERROS = [
  'Ficar na fase 1 para sempre, que é o mais comum e o que empobrece a microbiota.',
  'Testar dois grupos ao mesmo tempo.',
  'Testar numa semana atípica, com estresse alto, noites mal dormidas ou no período pré-menstrual.',
  'Cortar alimento porque viu numa lista na internet, sem nunca ter testado em você.',
  'Confundir com alergia alimentar. FODMAP causa desconforto digestivo por fermentação e osmolaridade. Alergia envolve o sistema imunológico e pode ser grave. Suspeita de alergia é investigação médica.',
];

export const FODMAP_AVISOS = [
  'A fase de restrição dura de 2 a 6 semanas. Restringir por tempo indefinido empobrece a diversidade da tua microbiota.',
  'O diagnóstico de SII é médico.',
];

export const RESULTADO_LABEL = {
  liberado: 'Liberado',
  quantidade: 'Só em quantidade menor',
  gatilho: 'Gatilho',
  inconclusivo: 'Inconclusivo',
} as const;

export const LEVEL_LABEL: Record<FodmapLevel, string> = {
  alto: 'alto teor',
  baixo: 'baixo teor',
  livre: 'use sem contar',
};
