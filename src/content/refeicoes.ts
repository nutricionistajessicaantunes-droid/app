import type { MealId } from './agua-fibras';
import { CARDAPIOS } from './cardapios';

/**
 * Refeições: o que dá para fazer com o que você tem em casa e o teu dia montado.
 * Fontes: Biblioteca de Refeições e Receitas com baixo teor de FODMAP da Jéssica, e os
 * cardápios modelo do curso. Sem calorias e sem macronutrientes, de propósito: o app segue
 * a linha do curso, que é o prato, a fibra e a água.
 */

export type MealKind = 'cafe' | 'almoco' | 'lanche' | 'jantar';

export const MEAL_KIND_LABEL: Record<MealKind, string> = {
  cafe: 'Café da manhã',
  almoco: 'Almoço',
  lanche: 'Lanche',
  jantar: 'Jantar',
};

export type IngredientGroup =
  'proteina' | 'lacteo' | 'carboidrato' | 'leguminosa' | 'vegetal' | 'fruta' | 'gordura' | 'outro';

export const GRUPOS: { id: IngredientGroup; titulo: string }[] = [
  { id: 'proteina', titulo: 'Carnes, ovos e peixes' },
  { id: 'lacteo', titulo: 'Leite, queijos e iogurtes' },
  { id: 'carboidrato', titulo: 'Pães, cereais e tubérculos' },
  { id: 'leguminosa', titulo: 'Leguminosas' },
  { id: 'vegetal', titulo: 'Verduras e legumes' },
  { id: 'fruta', titulo: 'Frutas' },
  { id: 'gordura', titulo: 'Sementes e pastas' },
  { id: 'outro', titulo: 'Outros' },
];

/** Papel do ingrediente no prato da aula 14. */
export type PlateRole = 'proteina' | 'carboidrato' | 'vegetal' | 'leguminosa' | 'fruta';

export interface Ingredient {
  id: string;
  nome: string;
  grupo: IngredientGroup;
  prato?: PlateRole;
  lactose?: true;
  gluten?: true;
  carne?: true;
  /**
   * Classificação pela lista de FODMAPs do curso e pelas receitas baixo FODMAP da Jéssica.
   * 'fora' quando o alimento não aparece em nenhuma das duas: fica fora do filtro baixo FODMAP.
   */
  fodmap: 'alto' | 'baixo' | 'fora';
  fibra?: true;
  /** Observação para a fase 1 do protocolo. */
  nota?: string;
}

const ing = (
  id: string,
  nome: string,
  grupo: IngredientGroup,
  fodmap: Ingredient['fodmap'],
  extra: Omit<Ingredient, 'id' | 'nome' | 'grupo' | 'fodmap'> = {},
): Ingredient => ({ id, nome, grupo, fodmap, ...extra });

const P = { prato: 'proteina' } as const;
const PC = { prato: 'proteina', carne: true } as const;
const C = { prato: 'carboidrato' } as const;
const V = { prato: 'vegetal', fibra: true } as const;
const F = { prato: 'fruta', fibra: true } as const;
const L = { prato: 'leguminosa', fibra: true } as const;

export const INGREDIENTES: Ingredient[] = [
  ing('ovo', 'Ovo', 'proteina', 'baixo', P),
  ing('frango', 'Frango', 'proteina', 'baixo', PC),
  ing('carne_moida', 'Carne moída', 'proteina', 'baixo', PC),
  ing('carne', 'Carne bovina (bife ou cubos)', 'proteina', 'baixo', PC),
  ing('peixe', 'Peixe (tilápia, merluza, abadejo)', 'proteina', 'baixo', PC),
  ing('atum', 'Atum em lata', 'proteina', 'baixo', PC),
  ing('sardinha', 'Sardinha em lata', 'proteina', 'baixo', PC),
  ing('linguica', 'Linguiça', 'proteina', 'fora', { ...PC, gluten: true }),
  ing('tofu', 'Tofu', 'proteina', 'baixo', P),
  ing('proteina_soja', 'Proteína de soja', 'proteina', 'fora', P),
  ing('hamburguer_veg', 'Hambúrguer vegetariano', 'proteina', 'fora', { ...P, gluten: true }),

  ing('leite', 'Leite', 'lacteo', 'alto', { lactose: true }),
  ing('leite_sem_lactose', 'Leite sem lactose', 'lacteo', 'baixo'),
  ing('bebida_vegetal', 'Bebida vegetal (coco, amêndoas ou arroz)', 'lacteo', 'baixo'),
  ing('leite_po', 'Leite em pó', 'lacteo', 'alto', { lactose: true }),
  ing('iogurte', 'Iogurte natural', 'lacteo', 'alto', { lactose: true }),
  ing('iogurte_sem_lactose', 'Iogurte sem lactose', 'lacteo', 'baixo'),
  ing('queijo_minas', 'Queijo minas ou queijo branco', 'lacteo', 'alto', { lactose: true }),
  ing('mussarela', 'Queijo mussarela', 'lacteo', 'fora', { lactose: true }),
  ing('parmesao', 'Queijo parmesão', 'lacteo', 'baixo', { lactose: true }),
  ing('queijo_brie', 'Queijo brie, camembert ou feta', 'lacteo', 'baixo', { lactose: true }),
  ing('ricota', 'Ricota ou cottage', 'lacteo', 'alto', { lactose: true }),
  ing('requeijao', 'Requeijão', 'lacteo', 'fora', { lactose: true }),
  ing('creme_leite', 'Creme de leite', 'lacteo', 'alto', { lactose: true }),

  ing('arroz', 'Arroz', 'carboidrato', 'baixo', C),
  ing('arroz_integral', 'Arroz integral', 'carboidrato', 'baixo', { ...C, fibra: true }),
  ing('pao', 'Pão francês ou de forma', 'carboidrato', 'alto', { ...C, gluten: true }),
  ing('pao_integral', 'Pão integral', 'carboidrato', 'alto', { ...C, gluten: true, fibra: true }),
  ing('pao_sem_gluten', 'Pão sem glúten', 'carboidrato', 'baixo', C),
  ing('pao_sirio', 'Pão sírio', 'carboidrato', 'alto', { ...C, gluten: true }),
  ing('tortilha', 'Tortilha de trigo', 'carboidrato', 'alto', { ...C, gluten: true }),
  ing('torrada', 'Torrada', 'carboidrato', 'alto', { ...C, gluten: true }),
  ing('biscoito_arroz', 'Biscoito de arroz', 'carboidrato', 'baixo', C),
  ing('biscoito_agua_sal', 'Biscoito água e sal', 'carboidrato', 'alto', { ...C, gluten: true }),
  ing('tapioca', 'Tapioca', 'carboidrato', 'baixo', C),
  ing('aveia', 'Aveia', 'carboidrato', 'baixo', {
    ...C,
    gluten: true,
    fibra: true,
    nota: 'Na fase 1, a aveia entra em porção pequena.',
  }),
  ing('aveia_sem_gluten', 'Aveia sem glúten', 'carboidrato', 'baixo', { ...C, fibra: true }),
  ing('cuscuz', 'Cuscuz de milho (flocão)', 'carboidrato', 'baixo', { ...C, fibra: true }),
  ing('macarrao', 'Macarrão', 'carboidrato', 'alto', { ...C, gluten: true }),
  ing('macarrao_arroz', 'Macarrão de arroz', 'carboidrato', 'baixo', C),
  ing('batata', 'Batata', 'carboidrato', 'baixo', C),
  ing('batata_doce', 'Batata-doce', 'carboidrato', 'baixo', { ...C, fibra: true }),
  ing('mandioca', 'Mandioca', 'carboidrato', 'baixo', { ...C, fibra: true }),
  ing('mandioquinha', 'Mandioquinha (batata-baroa)', 'carboidrato', 'baixo', C),
  ing('quinoa', 'Quinoa', 'carboidrato', 'baixo', { ...C, fibra: true }),
  ing('farinha_arroz', 'Farinha de arroz', 'carboidrato', 'baixo', C),
  ing('polvilho', 'Polvilho', 'carboidrato', 'fora', C),
  ing('nhoque', 'Nhoque', 'carboidrato', 'fora', { ...C, gluten: true }),
  ing('bolo_caseiro', 'Bolo caseiro', 'carboidrato', 'alto', { ...C, gluten: true, lactose: true }),
  ing('pao_queijo', 'Pão de queijo', 'carboidrato', 'fora', { ...C, lactose: true }),

  ing('feijao', 'Feijão', 'leguminosa', 'alto', L),
  ing('lentilha', 'Lentilha', 'leguminosa', 'alto', L),
  ing('grao_de_bico', 'Grão-de-bico', 'leguminosa', 'alto', L),
  ing('homus', 'Homus (pasta de grão-de-bico)', 'leguminosa', 'alto', L),

  ing('alface', 'Alface e outras folhas', 'vegetal', 'baixo', V),
  ing('tomate', 'Tomate', 'vegetal', 'baixo', V),
  ing('cenoura', 'Cenoura', 'vegetal', 'baixo', V),
  ing('abobrinha', 'Abobrinha', 'vegetal', 'baixo', V),
  ing('espinafre', 'Espinafre', 'vegetal', 'baixo', V),
  ing('couve', 'Couve', 'vegetal', 'baixo', V),
  ing('pepino', 'Pepino', 'vegetal', 'baixo', V),
  ing('abobora', 'Abóbora', 'vegetal', 'baixo', V),
  ing('brocolis', 'Brócolis', 'vegetal', 'alto', V),
  ing('repolho', 'Repolho', 'vegetal', 'alto', V),
  ing('beterraba', 'Beterraba', 'vegetal', 'alto', V),
  ing('cebola', 'Cebola', 'vegetal', 'alto', { prato: 'vegetal' }),

  ing('banana', 'Banana', 'fruta', 'baixo', {
    ...F,
    nota: 'Na fase 1, a banana entra mais verde.',
  }),
  ing('laranja', 'Laranja', 'fruta', 'baixo', F),
  ing('suco_laranja', 'Suco de laranja', 'fruta', 'alto', { prato: 'fruta' }),
  ing('mamao', 'Mamão', 'fruta', 'fora', F),
  ing('maca', 'Maçã', 'fruta', 'alto', F),
  ing('uva', 'Uva', 'fruta', 'baixo', F),
  ing('morango', 'Morango', 'fruta', 'baixo', F),
  ing('mirtilo', 'Mirtilo', 'fruta', 'baixo', F),
  ing('manga', 'Manga', 'fruta', 'alto', F),
  ing('abacate', 'Abacate', 'fruta', 'alto', F),
  ing('abacaxi', 'Abacaxi', 'fruta', 'baixo', F),
  ing('kiwi', 'Kiwi', 'fruta', 'baixo', F),
  ing('maracuja', 'Maracujá', 'fruta', 'baixo', F),
  ing('melao', 'Melão', 'fruta', 'baixo', F),
  ing('limao', 'Limão', 'fruta', 'baixo', { prato: 'fruta' }),
  ing('ameixa_preta', 'Ameixa preta', 'fruta', 'alto', F),
  ing('acai', 'Açaí (polpa)', 'fruta', 'fora', { prato: 'fruta' }),

  ing('pasta_amendoim', 'Pasta de amendoim', 'gordura', 'baixo', { fibra: true }),
  ing('chia', 'Chia', 'gordura', 'baixo', { fibra: true }),
  ing('linhaca', 'Linhaça', 'gordura', 'baixo', {
    fibra: true,
    nota: 'Na fase 1, a linhaça entra em porção pequena.',
  }),
  ing('coco_ralado', 'Coco ralado', 'gordura', 'baixo', { fibra: true }),
  ing('manteiga', 'Manteiga', 'gordura', 'baixo', { lactose: true }),

  ing('mel', 'Mel', 'outro', 'alto'),
  ing('geleia', 'Geleia de fruta', 'outro', 'fora'),
  ing('doce_de_leite', 'Doce de leite', 'outro', 'fora', { lactose: true }),
  ing('goiabada', 'Goiabada', 'outro', 'fora'),
  ing('cacau', 'Cacau em pó', 'outro', 'fora'),
  ing('chocolate', 'Chocolate meio amargo', 'outro', 'baixo'),
  ing('molho_tomate', 'Molho de tomate pronto', 'outro', 'fora'),
  ing('gengibre', 'Gengibre', 'outro', 'baixo'),
];

/** O que o app considera que você tem em casa. Não entra na conta do que falta. */
export const BASICOS =
  'O app considera que você tem sal, pimenta, ervas secas, canela, azeite ou óleo, açúcar, fermento e café.';

/** Qualquer verdura ou legume, ou qualquer fruta, resolve a linha. */
export const QUALQUER_VEGETAL = 'qualquer-vegetal';
export const QUALQUER_FRUTA = 'qualquer-fruta';

/** Uma linha da receita: um ingrediente, ou uma lista em que qualquer um resolve. */
export type Req = string | string[];

export type RecipeSource = 'biblioteca' | 'fodmap' | 'preso' | 'gases' | 'refluxo';

export const FONTE_LABEL: Record<RecipeSource, string> = {
  biblioteca: 'Biblioteca de refeições',
  fodmap: 'Receitas baixo FODMAP',
  preso: 'Cardápio modelo · Intestino preso',
  gases: 'Cardápio modelo · Gases, estufamento e SII',
  refluxo: 'Cardápio modelo · Refluxo e gastrite',
};

export interface Recipe {
  id: string;
  titulo: string;
  refeicao: MealKind;
  fonte: RecipeSource;
  /** Linhas como no material. Linha terminada em ":" é subtítulo (massa, recheio). */
  itens: string[];
  usa: Req[];
  preparo?: string[];
  rende?: string;
  /** O que mudou em relação ao material, e por quê. */
  troca?: string;
}

const SEM_WHEY = 'O whey saiu, para caber no orçamento. A receita funciona sem ele.';

function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type Extra = Pick<Recipe, 'preparo' | 'rende' | 'troca'>;

function lib(
  refeicao: MealKind,
  titulo: string,
  itens: string[],
  usa: Req[],
  extra: Extra = {},
): Recipe {
  return { id: `b-${slug(titulo)}`, titulo, refeicao, fonte: 'biblioteca', itens, usa, ...extra };
}

function low(
  refeicao: MealKind,
  titulo: string,
  itens: string[],
  usa: Req[],
  extra: Extra = {},
): Recipe {
  return { id: `f-${slug(titulo)}`, titulo, refeicao, fonte: 'fodmap', itens, usa, ...extra };
}

const V_ = QUALQUER_VEGETAL;
const F_ = QUALQUER_FRUTA;

const BIBLIOTECA: Recipe[] = [
  // Café da manhã
  lib(
    'cafe',
    'Biscoito de arroz com queijo branco',
    ['4 biscoitos de arroz', '2 fatias finas de queijo minas (40 g)', 'Tomate e orégano'],
    ['biscoito_arroz', 'queijo_minas', 'tomate'],
  ),
  lib(
    'cafe',
    'Torrada com abacate',
    ['1 fatia de pão de forma (25 g)', '1 colher de sopa cheia de abacate (30 g)', '1 ovo'],
    ['pao', 'abacate', 'ovo'],
  ),
  lib(
    'cafe',
    'Pudim de chia',
    ['1 iogurte desnatado (170 mL)', '2 colheres de sopa de chia (10 g)', '10 uvas'],
    ['iogurte', 'chia', 'uva'],
    {
      preparo: [
        'Coloque o iogurte em um recipiente, junte a chia e misture.',
        'Deixe descansar por 3 horas e coloque as uvas ao redor. A consistência fica de pudim.',
      ],
    },
  ),
  lib(
    'cafe',
    'Panqueca de banana',
    ['1 colher de sopa de aveia (15 g)', '1 banana prata média (90 g)', '1 ovo'],
    ['aveia', 'banana', 'ovo'],
    { troca: 'O whey saiu e entrou 1 ovo, que dá a liga da massa e custa menos.' },
  ),
  lib(
    'cafe',
    'Pão com queijo e café com leite',
    [
      '1 fatia de pão de forma (25 g)',
      '3 pedaços pequenos de ricota (60 g)',
      '1 copo americano de leite desnatado (150 mL)',
      '1 xícara de café coado (150 mL)',
    ],
    ['pao', 'ricota', 'leite'],
  ),
  lib(
    'cafe',
    'Tapioca com atum',
    [
      '3 colheres de sopa de tapioca (45 g)',
      '1 colher de sopa de requeijão (20 g)',
      '2 colheres de sopa de atum em conserva (32 g)',
    ],
    ['tapioca', 'requeijao', 'atum'],
  ),
  lib(
    'cafe',
    'Vitamina de banana',
    ['1 copo de leite desnatado (200 mL)', '1 banana prata'],
    ['leite', 'banana'],
    { troca: SEM_WHEY },
  ),
  lib(
    'cafe',
    'Bolinho de chocolate de caneca',
    [
      '1 ovo',
      '1 clara',
      '1 banana prata pequena (90 g)',
      '1 colher de sobremesa cheia de cacau (10 g)',
      'Adoçante, se quiser',
    ],
    ['ovo', 'banana', 'cacau'],
    {
      preparo: [
        'Misture todos os ingredientes em uma tigela até ficar uniforme.',
        'Leve ao micro-ondas por 2 minutos.',
      ],
    },
  ),
  lib(
    'cafe',
    'Abacate com ovo cozido',
    [
      '3 colheres de sopa de abacate (135 g)',
      '2 ovos cozidos (100 g)',
      '1 xícara de café (200 mL)',
    ],
    ['abacate', 'ovo'],
  ),
  lib(
    'cafe',
    'Pão com ovos e queijo cottage',
    [
      '1 pão francês (50 g)',
      '2 claras de ovo (68 g)',
      '2 colheres de sopa rasas de cottage ou ricota (40 g)',
    ],
    ['pao', 'ovo', 'ricota'],
  ),
  lib(
    'cafe',
    'Torrada com patê de sardinha',
    [
      '3 torradas de pão francês (15 g)',
      '1 colher de sopa de creme de ricota (30 g)',
      'Sardinha em conserva (50 g)',
      'Meio iogurte desnatado (85 g)',
    ],
    [['torrada', 'pao'], 'ricota', 'sardinha', 'iogurte'],
  ),
  lib(
    'cafe',
    'Cuscuz com ovos e fruta com leite em pó',
    [
      '3 colheres de sopa de cuscuz cru (36 g)',
      '2 ovos',
      '1 clara',
      '6 morangos (30 g), ou outra fruta',
      '1 colher de sopa de leite em pó desnatado (10 g)',
    ],
    ['cuscuz', 'ovo', F_, 'leite_po'],
  ),
  lib(
    'cafe',
    'Pão com geleia e vitamina de morango',
    [
      '1 fatia de pão de forma (25 g)',
      '1 colher de sopa rasa de geleia (10 g)',
      '1 copo americano de leite desnatado (150 mL)',
      '5 morangos (25 g)',
    ],
    ['pao', 'geleia', 'leite', 'morango'],
    { troca: SEM_WHEY },
  ),
  lib(
    'cafe',
    'Pão com ovo assado',
    ['1 fatia de pão de forma (25 g)', '2 ovos', '1 colher de sopa de queijo parmesão (10 g)'],
    ['pao', 'ovo', 'parmesao'],
    {
      preparo: [
        'Amasse o meio do pão com uma colher, coloque o ovo no meio e salpique o parmesão.',
        'Deixe na fritadeira sem óleo por cerca de 10 minutos, olhando, até o ovo cozinhar.',
      ],
    },
  ),
  lib(
    'cafe',
    'Fruta com iogurte e aveia',
    [
      '1 iogurte desnatado (170 g)',
      '1 banana média (90 g), ou outra fruta',
      '1 colher de sopa de aveia (15 g)',
      '1 colher de sopa de leite em pó desnatado (10 g)',
    ],
    ['iogurte', F_, 'aveia', 'leite_po'],
  ),
  lib(
    'cafe',
    'Vitamina de abacate',
    [
      '3 colheres de sopa de abacate (30 g)',
      '3 colheres de sopa de leite em pó desnatado (30 g)',
      '1 colher de sopa de aveia (15 g)',
      '1 copo de leite desnatado (200 mL)',
    ],
    ['abacate', 'leite_po', 'aveia', 'leite'],
  ),
  lib(
    'cafe',
    'Mingau gelado',
    [
      '2 colheres de sopa de aveia (30 g)',
      'Meio iogurte (85 g)',
      'Meia banana (45 g)',
      '1 colher de sopa de leite em pó (10 g)',
      '1 colher de sopa de cacau em pó (10 g)',
    ],
    ['aveia', 'iogurte', 'banana', 'leite_po', 'cacau'],
    {
      preparo: [
        'Misture tudo, menos a banana.',
        'Deixe no congelador por 20 minutos e coloque a banana picada por cima.',
      ],
      troca: 'O whey saiu e entrou leite em pó, mais barato.',
    },
  ),
  lib(
    'cafe',
    'Iogurte de maracujá',
    [
      '1 iogurte natural desnatado (170 g)',
      '1 polpa de maracujá (100 g)',
      '1 colher de sopa de leite em pó desnatado (10 g)',
      '1 colher de sopa de mel, se quiser',
    ],
    ['iogurte', 'maracuja', 'leite_po'],
    { troca: SEM_WHEY },
  ),
  lib(
    'cafe',
    'Pão com pasta de amendoim e ovos mexidos',
    [
      '1 fatia de pão de forma (25 g)',
      '1 colher de sobremesa de pasta de amendoim (15 g)',
      'Canela a gosto',
      '2 ovos mexidos',
    ],
    ['pao', 'pasta_amendoim', 'ovo'],
  ),
  lib(
    'cafe',
    'Pão sírio marguerita com ovo',
    [
      '1 pão sírio (40 g)',
      '1 fatia grande de mussarela (30 g)',
      '3 fatias de tomate (45 g)',
      'Orégano a gosto',
      '1 ovo',
    ],
    [['pao_sirio', 'tortilha'], 'mussarela', 'tomate', 'ovo'],
  ),
  lib(
    'cafe',
    'Crepioca com queijo',
    ['2 colheres de sopa de tapioca (30 g)', '2 ovos', '1 fatia de mussarela (30 g)'],
    ['tapioca', 'ovo', 'mussarela'],
  ),
  lib(
    'cafe',
    'Bolo de caneca',
    [
      '1 ovo',
      '2 colheres de sopa de aveia em flocos (30 g)',
      '1 banana prata (90 g)',
      '1 pitada de fermento',
    ],
    ['ovo', 'aveia', 'banana'],
    { troca: SEM_WHEY },
  ),
  lib(
    'cafe',
    'Mingau de aveia',
    [
      '2 colheres de sopa de aveia (45 g)',
      'Meio copo americano de leite desnatado (75 mL)',
      '1 colher de sopa de leite em pó (10 g)',
      '1 banana (90 g)',
    ],
    ['aveia', 'leite', 'leite_po', 'banana'],
    {
      preparo: [
        'Misture tudo, menos a banana, e leve ao micro-ondas por 1 minuto.',
        'Retire, misture e volte por mais 1 minuto, até ficar na consistência que você gosta.',
        'Se quiser, use metade da banana na massa, para ficar mais firme, e a outra metade por cima.',
      ],
      troca: 'O whey saiu e entrou leite em pó, mais barato.',
    },
  ),
  lib(
    'cafe',
    'Bolo de cenoura de liquidificador',
    [
      'Meia cenoura (70 g)',
      '2 colheres de sopa de aveia (30 g)',
      '2 ovos',
      '1 colher de chá de fermento',
      'Adoçante a gosto',
      '1 quadradinho de chocolate meio amargo (15 g)',
    ],
    ['cenoura', 'aveia', 'ovo', 'chocolate'],
    {
      preparo: [
        'Bata tudo no liquidificador, menos o fermento.',
        'Depois de bater, misture o fermento.',
        'Leve ao micro-ondas por 3 minutos.',
      ],
    },
  ),
  lib(
    'cafe',
    'Aveioca com banana',
    ['2 colheres de sopa de aveia (30 g)', '1 ovo', '1 banana prata pequena (90 g)'],
    ['aveia', 'ovo', 'banana'],
    { troca: SEM_WHEY },
  ),
  lib(
    'cafe',
    'Pão francês com ovo e café com leite',
    [
      '1 pão francês (50 g)',
      '2 ovos',
      '1 copo americano de leite desnatado (150 mL)',
      'Café coado',
    ],
    ['pao', 'ovo', 'leite'],
  ),
  lib(
    'cafe',
    'Suco de laranja com omelete',
    ['1 copo de suco de laranja (200 mL)', '2 ovos', '2 fatias pequenas de queijo minas (40 g)'],
    [['suco_laranja', 'laranja'], 'ovo', 'queijo_minas'],
  ),
  lib(
    'cafe',
    'Pão de queijo de frigideira',
    [
      '2 colheres de sopa de tapioca (30 g)',
      '2 ovos',
      '2 fatias finas de queijo minas (40 g)',
      '1 colher de sopa de requeijão (20 g)',
    ],
    ['tapioca', 'ovo', 'queijo_minas', 'requeijao'],
  ),
  lib(
    'cafe',
    'Sorvete de manga',
    ['2 pedaços de manga (120 g)', '1 colher de sopa de mel (15 g)', '1 iogurte desnatado (170 g)'],
    ['manga', 'mel', 'iogurte'],
    {
      preparo: ['Bata tudo no liquidificador e leve ao congelador.'],
      troca: SEM_WHEY,
    },
  ),
  lib(
    'cafe',
    'Tapioca com ovo e queijo minas',
    ['3 colheres de sopa de tapioca (45 g)', '2 ovos', '2 fatias de queijo minas (40 g)'],
    ['tapioca', 'ovo', 'queijo_minas'],
  ),
  lib(
    'cafe',
    'Pão francês com requeijão e leite',
    [
      '1 pão francês (50 g)',
      '1 colher de sopa de requeijão (20 g)',
      '1 copo americano de leite (150 mL)',
    ],
    ['pao', 'requeijao', 'leite'],
    { troca: SEM_WHEY },
  ),
  lib(
    'cafe',
    'Vitamina de banana com aveia',
    ['1 copo de leite (200 mL)', '1 banana prata (90 g)', '1 colher de sopa de aveia (15 g)'],
    ['leite', 'banana', 'aveia'],
    { troca: SEM_WHEY },
  ),
  lib(
    'cafe',
    'Bolo caseiro, ovos mexidos e café com leite',
    [
      '1 fatia média de bolo simples (50 g)',
      '1 copo americano de leite desnatado (150 mL)',
      '50 mL de café',
      '2 ovos',
    ],
    ['bolo_caseiro', 'leite', 'ovo'],
  ),
  lib(
    'cafe',
    'Pão com geleia, pasta de amendoim e ovo',
    [
      '2 fatias de pão de forma (50 g)',
      '1 colher de sopa de geleia (20 g)',
      '1 colher de sopa de pasta de amendoim (15 g)',
      '1 ovo',
      '1 clara',
    ],
    ['pao', 'geleia', 'pasta_amendoim', 'ovo'],
  ),
  lib(
    'cafe',
    'Crepioca doce',
    [
      'Massa:',
      '1 ovo',
      '1 clara',
      '2 colheres de sopa de tapioca (30 g)',
      '2 colheres de sopa rasas de leite em pó (10 g)',
      '1 colher de sobremesa de doce de leite (10 g)',
      'Recheio:',
      '1 banana prata (90 g)',
      '1 colher de sobremesa de doce de leite (10 g)',
    ],
    ['ovo', 'tapioca', 'leite_po', 'doce_de_leite', 'banana'],
    {
      preparo: [
        'Misture os ingredientes da massa e leve ao fogo até conseguir virar.',
        'Depois é só rechear.',
      ],
    },
  ),
  lib(
    'cafe',
    'Pão com patê de atum',
    [
      '1 fatia de pão de forma (25 g)',
      '1 colher de sopa de creme de ricota (30 g)',
      '2 colheres de sopa de atum (32 g)',
    ],
    ['pao', 'ricota', 'atum'],
    {
      preparo: ['Misture o atum com o creme de ricota e tempere do jeito que você preferir.'],
      troca: 'O brigadeiro de whey que acompanhava ficou de fora, para caber no orçamento.',
    },
  ),
  lib(
    'cafe',
    'Pão de queijo, iogurte e uva',
    [
      '3 pães de queijo pequenos (30 g)',
      '1 iogurte desnatado (170 g)',
      '1 cacho pequeno de uva (170 g)',
    ],
    ['pao_queijo', 'iogurte', 'uva'],
    { troca: SEM_WHEY },
  ),

  // Almoço
  lib(
    'almoco',
    'Omelete caprese e suco',
    [
      '3 ovos',
      'Tomate à vontade',
      'Manjericão',
      'Orégano',
      '1 copo médio de suco de laranja (300 mL)',
    ],
    ['ovo', 'tomate', ['suco_laranja', 'laranja']],
  ),
  lib(
    'almoco',
    'Almôndegas com batata-doce',
    ['2 almôndegas de carne moída (100 g)', 'Meia batata-doce (177 g)', 'Alface à vontade'],
    ['carne_moida', 'batata_doce', V_],
  ),
  lib(
    'almoco',
    'Pão sírio com frango desfiado e salada',
    [
      '1 pão sírio (60 g)',
      '5 colheres de sopa de frango desfiado (100 g)',
      'Alface e tomate à vontade',
    ],
    [['pao_sirio', 'tortilha'], 'frango', V_],
  ),
  lib(
    'almoco',
    'Escondidinho de carne moída',
    [
      '2 batatas médias (120 g)',
      '5 colheres de sopa de carne moída (100 g)',
      'Salada à vontade',
      '1 fio de azeite',
    ],
    ['batata', 'carne_moida', V_],
  ),
  lib(
    'almoco',
    'Estrogonofe de carne',
    [
      '1 escumadeira de arroz (85 g)',
      '1 concha cheia de estrogonofe (100 g)',
      '1 pegador de batata palha (20 g)',
      '1 fio de azeite',
      'Legumes e verduras à vontade',
    ],
    ['arroz', 'carne', 'creme_leite', V_],
  ),
  lib(
    'almoco',
    'Tapioca com frango desfiado e mussarela',
    [
      '3 colheres de sopa de tapioca (45 g)',
      '5 colheres de sopa de frango desfiado (100 g)',
      '1 fatia de mussarela (20 g)',
    ],
    ['tapioca', 'frango', 'mussarela'],
  ),
  lib(
    'almoco',
    'Almôndegas com purê de batata',
    [
      '2 almôndegas (100 g)',
      '4 colheres de sopa de purê de batata (140 g)',
      'Salada de legumes e verduras',
    ],
    ['carne_moida', 'batata', V_],
  ),
  lib(
    'almoco',
    'Arroz com caldo de feijão e carne moída',
    [
      '3 colheres de sopa de arroz (75 g)',
      '1 concha de caldo de feijão (130 g)',
      '1 colher de servir de carne moída (70 g)',
      'Brócolis e cenoura cozidos',
    ],
    ['arroz', 'feijao', 'carne_moida', V_],
  ),
  lib(
    'almoco',
    'Almoço vegetariano',
    [
      '4 colheres de sopa de arroz (80 g)',
      '5 colheres de sopa de proteína de soja (120 g)',
      '1 concha média rasa de feijão (80 g)',
      'Salada à vontade',
      '1 bombom, se quiser',
    ],
    ['arroz', 'proteina_soja', 'feijao', V_],
  ),
  lib(
    'almoco',
    'Peixe com mandioquinha',
    [
      '1 posta de peixe grelhado (100 g), como tilápia ou merluza',
      '4 colheres de sopa de mandioquinha cozida (140 g)',
      '1 colher de sopa de semente de girassol (15 g), se tiver',
    ],
    ['peixe', 'mandioquinha'],
    { troca: 'O salmão virou peixe branco, como tilápia ou merluza, que custa bem menos.' },
  ),
  lib(
    'almoco',
    'Nhoque com carne moída',
    [
      '2 colheres de servir de nhoque (140 g)',
      '3 colheres de sopa de carne moída (75 g)',
      'Legumes e verduras à vontade',
    ],
    ['nhoque', 'carne_moida', V_],
  ),
  lib(
    'almoco',
    'Macarrão com carne moída e fruta',
    [
      '3 colheres de sopa de carne moída (75 g)',
      '1 escumadeira cheia de macarrão (140 g)',
      '1 fatia média de abacaxi (75 g), ou outra fruta',
    ],
    ['carne_moida', 'macarrao', F_],
  ),
  lib(
    'almoco',
    'Almoço comum',
    [
      '4 colheres de sopa de arroz (80 g)',
      '1 concha média rasa de feijão (80 g)',
      '1 filé de frango grande (150 g)',
      'Salada à vontade',
      '1 fio de azeite',
      '1 bombom, se quiser',
    ],
    ['arroz', 'feijao', 'frango', V_],
  ),
  lib(
    'almoco',
    'Almoço churrasco',
    [
      'Meio pão francês (25 g)',
      '2 colheres de sopa de vinagrete (60 g)',
      '1 espetinho de linguiça (50 g)',
      '4 colheres de sopa de arroz (80 g)',
      '1 bife (100 g)',
    ],
    ['pao', 'tomate', 'linguica', 'arroz', 'carne'],
  ),

  // Lanche
  lib(
    'lanche',
    'Creme de mamão',
    [
      'Meio copo americano de leite desnatado (75 mL)',
      'Meio mamão (120 g)',
      '1 colher de sopa de mel (15 g)',
    ],
    ['leite', 'mamao', 'mel'],
  ),
  lib(
    'lanche',
    'Biscoito de arroz com creme de ricota',
    ['5 biscoitos de arroz', '2 colheres de sopa de creme de ricota (40 g)'],
    ['biscoito_arroz', 'ricota'],
  ),
  lib(
    'lanche',
    'Tofu mexido com torrada',
    ['3 fatias finas de tofu (60 g)', '3 torradas (15 g)'],
    ['tofu', ['torrada', 'pao']],
  ),
  lib(
    'lanche',
    'Homus com torrada',
    ['3 colheres de sopa de homus (45 g)', '2 torradas integrais (30 g)'],
    ['homus', ['torrada', 'pao_integral', 'pao']],
  ),
  lib(
    'lanche',
    'Biscoito de arroz com patê de frango',
    [
      '3 biscoitos de arroz (15 g)',
      '2 colheres de sopa de frango desfiado (40 g)',
      '1 colher de sopa rasa de requeijão (15 g)',
    ],
    ['biscoito_arroz', 'frango', 'requeijao'],
    { troca: 'O queijo cremoso importado virou requeijão, mais fácil de achar e mais barato.' },
  ),
  lib(
    'lanche',
    'Vitamina de morango',
    ['1 copo americano de leite ou bebida vegetal (150 mL)', '5 morangos (35 g)'],
    [['leite', 'leite_sem_lactose', 'bebida_vegetal'], 'morango'],
    { troca: 'O whey saiu, e a bebida de amêndoas virou opção ao lado do leite comum.' },
  ),
  lib(
    'lanche',
    'Pão com homus',
    ['1 fatia de pão de forma (25 g)', '1 colher de sopa de homus (30 g)'],
    ['pao', 'homus'],
  ),
  lib(
    'lanche',
    'Pão com doce de leite e banana',
    [
      '1 fatia de pão de forma (25 g)',
      '1 colher de sopa de doce de leite (20 g)',
      'Meia banana prata (45 g)',
      'Canela a gosto',
    ],
    ['pao', 'doce_de_leite', 'banana'],
    {
      preparo: [
        'Passe o doce de leite no pão e coloque a banana picada por cima.',
        'Leve à fritadeira sem óleo por 7 minutos, a 180 °C.',
      ],
    },
  ),
  lib(
    'lanche',
    'Grão-de-bico crocante',
    [
      '1 colher de servir de grão-de-bico cozido (110 g)',
      '1 colher de chá de azeite (5 g)',
      'Páprica a gosto',
      'Sal a gosto',
    ],
    ['grao_de_bico'],
    {
      preparo: [
        'Com o grão-de-bico já cozido, tempere com o azeite, a páprica e o sal.',
        'Leve ao forno a 180 °C até ficar tostado e crocante.',
      ],
    },
  ),
  lib(
    'lanche',
    'Torrada de banana com queijo',
    [
      '1 fatia de pão de forma (25 g)',
      '1 fatia de mussarela (20 g)',
      '1 banana (90 g)',
      'Canela a gosto',
    ],
    ['pao', 'mussarela', 'banana'],
  ),
  lib(
    'lanche',
    'Mamão com leite em pó',
    ['Meio mamão papaia (120 g)', '3 colheres de sopa de leite em pó desnatado (30 g)'],
    ['mamao', 'leite_po'],
  ),
  lib(
    'lanche',
    'Pão com patê de frango',
    [
      '1 fatia de pão de forma (25 g)',
      '1 colher de sopa de requeijão (20 g)',
      '3 colheres de sopa de frango desfiado (60 g)',
    ],
    ['pao', 'requeijao', 'frango'],
  ),
  lib(
    'lanche',
    'Fruta com pasta de amendoim',
    ['1 banana prata (90 g), ou outra fruta', '1 colher de sopa de pasta de amendoim (15 g)'],
    [F_, 'pasta_amendoim'],
  ),
  lib(
    'lanche',
    'Sorvete de banana',
    ['1 banana prata (90 g)', '1 colher de sopa de pasta de amendoim (15 g)'],
    ['banana', 'pasta_amendoim'],
  ),
  lib(
    'lanche',
    'Iogurte com uva',
    [
      '1 iogurte desnatado (170 g)',
      '2 colheres de sopa de leite em pó desnatado (20 g)',
      'Meio cacho médio de uva (75 g)',
    ],
    ['iogurte', 'leite_po', 'uva'],
  ),
  lib(
    'lanche',
    'Pão com ovo, molho de tomate e queijo',
    [
      '1 fatia de pão de forma (25 g)',
      '1 ovo',
      '1 clara',
      '2 colheres de sopa de molho de tomate (30 g)',
      '1 fatia de mussarela (20 g)',
    ],
    ['pao', 'ovo', 'molho_tomate', 'mussarela'],
  ),
  lib(
    'lanche',
    'Pão com ovo mexido e requeijão',
    [
      '1 fatia de pão de forma (25 g)',
      '2 ovos mexidos',
      '1 colher de sopa rasa de requeijão (15 g)',
    ],
    ['pao', 'ovo', 'requeijao'],
  ),
  lib(
    'lanche',
    'Pão de queijo de caneca',
    [
      '1 ovo',
      '4 colheres de sopa de leite desnatado (30 mL)',
      '3 colheres de sopa de mussarela ralada (10 g)',
      '4 colheres de sopa rasas de polvilho azedo (40 g)',
      '1 colher de chá de fermento',
    ],
    ['ovo', 'leite', 'mussarela', 'polvilho'],
    {
      preparo: [
        'Misture tudo em uma tigela e coloque em uma caneca untada com azeite.',
        'Leve ao micro-ondas por cerca de 1 minuto, em potência alta, olhando para não queimar.',
        'Se precisar, deixe mais uns 20 segundos, até o palito sair seco.',
      ],
    },
  ),
  lib(
    'lanche',
    'Tortilha com atum',
    [
      '1 tortilha de trigo (40 g)',
      '3 colheres de sopa de atum (50 g)',
      '1 colher de sopa rasa de requeijão (15 g)',
    ],
    ['tortilha', 'atum', 'requeijao'],
  ),
  lib(
    'lanche',
    'Cuscuz com ovos',
    [
      '4 colheres de sopa de cuscuz (50 g)',
      '2 ovos mexidos',
      '1 colher de sopa de requeijão (15 g)',
    ],
    ['cuscuz', 'ovo', 'requeijao'],
  ),
  lib(
    'lanche',
    'Açaí com banana',
    ['1 polpa de açaí (100 g)', '1 banana média (90 g)'],
    ['acai', 'banana'],
    { troca: SEM_WHEY },
  ),
  lib(
    'lanche',
    'Torrada com patê de ovo',
    ['2 torradas (20 g)', '1 colher de sopa rasa de requeijão (15 g)', '2 ovos'],
    [['torrada', 'pao'], 'requeijao', 'ovo'],
  ),
  lib(
    'lanche',
    'Banana com mel e aveia',
    ['1 banana (90 g)', '1 colher de sopa de aveia (15 g)', '1 colher de sopa de mel (15 g)'],
    ['banana', 'aveia', 'mel'],
    { troca: 'O whey saiu e entrou 1 colher de sopa de aveia.' },
  ),
  lib(
    'lanche',
    'Tapioca romeu e julieta',
    [
      '3 colheres de sopa de tapioca (45 g)',
      '2 fatias pequenas de queijo minas (40 g)',
      '1 ponta de faca de goiabada (12 g)',
    ],
    ['tapioca', 'queijo_minas', 'goiabada'],
  ),
  lib(
    'lanche',
    'Banana com pasta de amendoim e aveia',
    [
      '1 banana média (90 g)',
      '1 colher de sopa de pasta de amendoim (20 g)',
      '1 colher de sopa de aveia (15 g)',
    ],
    ['banana', 'pasta_amendoim', 'aveia'],
  ),
  lib(
    'lanche',
    'Biscoito de aveia e banana',
    [
      'Farinha de aveia (90 g)',
      '1 iogurte integral (170 g)',
      '2 bananas prata (160 g)',
      '1 colher de café de essência de baunilha',
      '1 colher de chá de fermento',
      '3 colheres de sopa de açúcar mascavo (50 g)',
      '1 colher de chá de canela em pó',
    ],
    ['aveia', 'iogurte', 'banana'],
    {
      preparo: [
        'Em uma tigela, misture o iogurte, a farinha de aveia, a banana picada, a baunilha e o fermento.',
        'Em outra tigela, misture o açúcar mascavo com a canela.',
        'Pegue porções da massa, passe na mistura de açúcar e canela e coloque em uma forma untada e enfarinhada.',
        'Leve ao forno preaquecido a 180 °C por 10 minutos.',
      ],
      rende: 'Rende 8 biscoitos médios. A porção do lanche são 2.',
      troca: 'O eritritol virou açúcar mascavo, mais fácil de achar e mais barato.',
    },
  ),
  lib(
    'lanche',
    'Suco de fruta com pão e manteiga',
    [
      '1 copo médio de suco de laranja (200 mL)',
      '1 pão francês (50 g)',
      '1 colher de sopa de manteiga (10 g)',
    ],
    [['suco_laranja', 'laranja'], 'pao', 'manteiga'],
  ),
  lib(
    'lanche',
    'Tapioca com mussarela e tomate',
    ['3 colheres de sopa de tapioca (45 g)', '2 fatias de mussarela (40 g)', 'Tomate'],
    ['tapioca', 'mussarela', 'tomate'],
  ),
  lib(
    'lanche',
    'Pizzinha de queijo minas',
    ['1 tortilha de trigo (40 g)', '3 fatias pequenas de queijo minas (60 g)', 'Tomate e orégano'],
    ['tortilha', 'queijo_minas', 'tomate'],
  ),
  lib(
    'lanche',
    'Tapioca com patê de frango',
    [
      '3 colheres de sopa de tapioca (45 g)',
      '3 colheres de sopa de frango desfiado (60 g)',
      '1 colher de sopa de requeijão (30 g)',
    ],
    ['tapioca', 'frango', 'requeijao'],
  ),
  lib(
    'lanche',
    'Crepioca de chocolate',
    [
      '2 colheres de sobremesa de aveia em flocos (14 g)',
      '2 ovos',
      '1 banana média (90 g)',
      '1 colher de sopa rasa de mel (10 g)',
      '1 pedaço de chocolate meio amargo (15 g)',
      'Canela a gosto',
    ],
    ['aveia', 'ovo', 'banana', 'mel', 'chocolate'],
  ),
  lib(
    'lanche',
    'Bolo caseiro com iogurte',
    ['1 pedaço pequeno de bolo caseiro (60 g)', '1 iogurte desnatado (170 g)'],
    ['bolo_caseiro', 'iogurte'],
    { troca: SEM_WHEY },
  ),
  lib(
    'lanche',
    'Pão com patê de ricota e frango',
    [
      '1 pão francês (50 g)',
      '5 colheres de sopa de frango desfiado (100 g)',
      '2 colheres de sopa de creme de ricota (40 g)',
    ],
    ['pao', 'frango', 'ricota'],
  ),
  lib(
    'lanche',
    'Aveioca com queijo e geleia',
    [
      '2 colheres de sopa de aveia em flocos (30 g)',
      '1 ovo',
      '3 fatias pequenas de queijo minas (60 g)',
      '1 colher de sopa de geleia (20 g)',
    ],
    ['aveia', 'ovo', 'queijo_minas', 'geleia'],
  ),

  // Jantar
  lib(
    'jantar',
    'Salada de macarrão com atum',
    [
      '3 colheres de sopa cheias de atum em conserva (48 g)',
      'Meia escumadeira de macarrão (60 g)',
      'Brócolis picado',
      'Tomate-cereja',
      '2 colheres de sopa de parmesão ralado (20 g)',
    ],
    ['atum', 'macarrao', V_, 'parmesao'],
  ),
  lib(
    'jantar',
    'Batata recheada',
    [
      '2 batatas médias (140 g)',
      '1 colher de sopa de requeijão (15 g)',
      '1 fatia de mussarela (20 g)',
      '4 colheres de sopa de frango desfiado (80 g)',
    ],
    ['batata', 'requeijao', 'mussarela', 'frango'],
    {
      preparo: [
        'Cozinhe a batata até o centro ficar macio.',
        'Tire uma parte do miolo, para caber o recheio.',
        'Coloque o frango desfiado, o queijo e o requeijão.',
        'Se quiser, deixe na fritadeira sem óleo por 10 minutos, a 180 °C.',
      ],
    },
  ),
  lib(
    'jantar',
    'Sopa de frango desfiado',
    [
      '6 colheres de sopa de frango desfiado (120 g)',
      '2 batatas médias (140 g)',
      'Cenoura, brócolis e couve cozidos à vontade',
    ],
    ['frango', 'batata', V_],
  ),
  lib(
    'jantar',
    'Pizza de tortilha com atum ou sardinha',
    [
      '1 tortilha de trigo (40 g)',
      '6 colheres de sopa de atum ou sardinha (96 g)',
      'Tomate',
      'Brócolis picado',
    ],
    ['tortilha', ['atum', 'sardinha'], 'tomate'],
    { troca: 'A sardinha entrou como opção ao atum, porque costuma sair mais barata.' },
  ),
  lib(
    'jantar',
    'Bolinho de espinafre',
    [
      '1 ovo',
      '1 porção de espinafre (60 g)',
      'Meia xícara de chá de leite desnatado (100 mL)',
      '1 colher de sopa de queijo ralado (15 g)',
      '2 colheres de sobremesa de farinha de aveia (16 g)',
      '1 porção de cebola picada',
      'Fermento',
    ],
    ['ovo', 'espinafre', 'leite', 'parmesao', 'aveia', 'cebola'],
    {
      preparo: [
        'Refogue a cebola e coloque o espinafre até murchar. Reserve.',
        'Em outra vasilha, misture os outros ingredientes e junte o espinafre cortado.',
        'Coloque na forma, salpique parmesão e leve ao forno até dourar.',
      ],
    },
  ),
  lib(
    'jantar',
    'Cuscuz com peixe',
    [
      '4 colheres de sopa de cuscuz (72 g)',
      '1 filé médio de peixe branco (120 g), como abadejo, merluza ou tilápia',
      '1 colher de sobremesa de azeite (5 g)',
      'Brócolis e tomate',
    ],
    ['cuscuz', 'peixe', V_],
  ),
  lib(
    'jantar',
    'Tomate recheado com carne moída',
    [
      '2 tomates pequenos (100 g)',
      '3 colheres de sopa de carne moída (75 g)',
      '1 colher de sobremesa de azeite (5 g)',
    ],
    ['tomate', 'carne_moida'],
  ),
  lib(
    'jantar',
    'Risoto com frango',
    [
      '2 colheres de servir de risoto (100 g)',
      '1 filé de frango grelhado (120 g)',
      'Legumes e verduras à vontade',
    ],
    ['arroz', 'frango', V_],
  ),
  lib(
    'jantar',
    'Hambúrguer com legumes assados',
    [
      '1 hambúrguer caseiro (120 g)',
      '1 fatia de mussarela (20 g)',
      'Legumes e verduras assados à vontade',
    ],
    ['carne_moida', 'mussarela', V_],
  ),
  lib(
    'jantar',
    'Peixe e arroz',
    [
      '5 colheres de sopa de arroz (100 g)',
      '1 filé grande de merluza assada (120 g)',
      '1 colher de sobremesa de azeite (5 g)',
      'Alface e cenoura',
    ],
    ['arroz', 'peixe', V_],
  ),
  lib(
    'jantar',
    'Nhoque de abóbora e carne moída',
    [
      'Abóbora cabotiá (450 g)',
      '5 colheres de sopa de farinha de aveia',
      '1 ovo',
      'Sal (1 colher de café)',
      'Pimenta-do-reino (1 colher de café)',
      'Carne moída (960 g)',
    ],
    ['abobora', 'aveia', 'ovo', 'carne_moida'],
    {
      preparo: [
        'Cozinhe a abóbora no micro-ondas, embrulhada em papel-toalha úmido, por 2 a 3 minutos, até amolecer.',
        'Tire a casca. Ela não precisa ir fora: dá para comer como petisco ou refogada.',
        'Amasse a abóbora com um garfo e misture o ovo, a farinha de aveia, o sal e a pimenta, até a massa ficar firme e moldável.',
        'Polvilhe farinha na bancada, abra a massa e corte os nhoques com uns dois dedos de distância.',
        'Coloque os nhoques na água fervendo e espere uns 30 segundos, até boiarem.',
        'Retire com a escumadeira, coloque na travessa e sirva com a carne moída.',
      ],
      rende: 'Rende 8 porções.',
    },
  ),
  lib(
    'jantar',
    'Tortilha com frango desfiado',
    [
      '1 tortilha de trigo (40 g)',
      '5 colheres de sopa de frango desfiado (100 g)',
      '1 colher de sopa cheia de requeijão (18 g)',
      '1 fatia de mussarela (20 g)',
    ],
    ['tortilha', 'frango', 'requeijao', 'mussarela'],
  ),
  lib(
    'jantar',
    'Crepioca de frango',
    [
      '2 colheres de sopa de tapioca (30 g)',
      '2 ovos',
      '1 fatia de mussarela (20 g)',
      '3 colheres de sopa de frango desfiado (60 g)',
    ],
    ['tapioca', 'ovo', 'mussarela', 'frango'],
  ),
  lib(
    'jantar',
    'Arroz com carne moída',
    [
      '4 colheres de sopa de arroz (80 g)',
      '4 colheres de sopa de carne moída (100 g)',
      'Legumes e verduras à vontade',
    ],
    ['arroz', 'carne_moida', V_],
  ),
  lib(
    'jantar',
    'Parmegiana de frango',
    [
      '1 filé médio de frango (120 g)',
      '1 fatia de mussarela (20 g)',
      '2 colheres de sopa de molho de tomate (30 g)',
      '4 colheres de sopa de arroz (80 g)',
    ],
    ['frango', 'mussarela', 'molho_tomate', 'arroz'],
  ),
  lib(
    'jantar',
    'Purê de batata com filé de peixe',
    [
      '4 colheres de sopa de purê de batata (140 g)',
      '1 filé de peixe branco grelhado (155 g)',
      '1 colher de sobremesa de azeite (5 g)',
      'Brócolis e cenoura',
    ],
    ['batata', 'peixe', V_],
  ),
  lib(
    'jantar',
    'Salada de macarrão com iogurte',
    [
      '1 escumadeira de macarrão cozido (110 g)',
      'Meio iogurte desnatado (85 g)',
      '1 lata de atum em conserva (120 g)',
      'Sal a gosto',
      'Brócolis',
      'Tomate picado',
    ],
    ['macarrao', 'iogurte', 'atum', V_],
  ),
  lib(
    'jantar',
    'Hambúrguer',
    [
      '1 pão de hambúrguer',
      '1 hambúrguer de carne médio (100 g)',
      '1 fatia de mussarela (20 g)',
      'Tomate e alface',
    ],
    ['pao', 'carne_moida', 'mussarela', V_],
  ),
  lib(
    'jantar',
    'Hambúrguer vegetariano',
    [
      '1 pão de hambúrguer',
      '1 hambúrguer vegetariano (100 g)',
      '1 fatia de mussarela (20 g)',
      '1 ovo',
    ],
    ['pao', 'hamburguer_veg', 'mussarela', 'ovo'],
  ),
  lib(
    'jantar',
    'Pizza invertida',
    [
      'Massa:',
      'Farinha de aveia (70 g)',
      'Meio iogurte natural integral (60 g)',
      'Sal (1 colher de café)',
      'Fermento (1 colher de chá)',
      'Recheio:',
      'Brócolis (60 g)',
      'Cebola roxa',
      'Tomate',
      '2 fatias de mussarela (40 g)',
    ],
    ['aveia', 'iogurte', 'brocolis', 'cebola', 'tomate', 'mussarela'],
    {
      preparo: [
        'Em uma tigela, junte a farinha de aveia, o iogurte, o sal e o fermento, e misture até ficar homogêneo. Divida em 2 partes.',
        'Unte dois potinhos de forno com azeite e monte: o queijo no fundo, o brócolis picado, a cebola em tiras e o tomate em cubinhos.',
        'Feche com a massa, apertando as bordas.',
        'Leve ao forno preaquecido a 180 °C por 15 minutos, ou até começar a dourar, e desenforme.',
      ],
      rende: 'Rende 2 pizzas.',
    },
  ),
  lib(
    'jantar',
    'Macarrão com atum',
    ['2 escumadeiras de macarrão (220 g)', '4 colheres de sopa de atum em óleo (70 g)'],
    ['macarrao', 'atum'],
  ),
  lib(
    'jantar',
    'Omelete com carne moída',
    ['2 ovos', '4 colheres de sopa de carne moída (100 g)', '1 fatia de mussarela (20 g)'],
    ['ovo', 'carne_moida', 'mussarela'],
  ),
  lib(
    'jantar',
    'Jantar vegetariano',
    [
      '5 colheres de sopa de arroz (100 g)',
      '1 concha média cheia de feijão (140 g)',
      '1 concha de grão-de-bico (120 g)',
      '1 colher de sobremesa de azeite (5 g)',
    ],
    ['arroz', 'feijao', 'grao_de_bico'],
  ),
];

const FODMAP: Recipe[] = [
  low(
    'jantar',
    'Omelete com espinafre e tomate',
    [
      '2 ovos',
      '1 pegador de espinafre cozido',
      '3 tomates-cereja',
      'Sal a gosto',
      '1 colher de café de pimenta',
    ],
    ['ovo', 'espinafre', 'tomate'],
    {
      preparo: [
        'Bata os ovos e misture o espinafre e o tomate.',
        'Tempere e despeje em uma frigideira antiaderente.',
        'Cozinhe dos dois lados.',
      ],
    },
  ),
  low(
    'lanche',
    'Iogurte sem lactose com frutas',
    ['1 iogurte sem lactose', '8 morangos, ou morangos e framboesas', '1 colher de sopa de chia'],
    ['iogurte_sem_lactose', 'morango', 'chia'],
    {
      preparo: ['Misture o iogurte com as frutas e a chia.', 'Sirva gelado.'],
      troca:
        'O iogurte de coco virou iogurte sem lactose, e a framboesa virou morango. Os dois pesam menos no orçamento e também são de baixo teor.',
    },
  ),
  low(
    'cafe',
    'Tapioca com queijo e orégano',
    [
      '2 colheres de sopa de goma de tapioca',
      '2 colheres de sopa de queijo brie ou feta esfarelado, ou parmesão ralado',
      'Orégano a gosto',
    ],
    ['tapioca', ['queijo_brie', 'parmesao']],
    {
      preparo: [
        'Aqueça a frigideira e espalhe a goma.',
        'Quando firmar, coloque o queijo e o orégano.',
        'Dobre e sirva.',
      ],
      troca: 'O parmesão entrou como opção ao brie, porque costuma sair mais barato.',
    },
  ),
  low(
    'lanche',
    'Vitamina de morango com chia',
    [
      '10 morangos, ou 5 morangos e 5 framboesas',
      '1 colher de sopa de chia',
      '1 copo (165 mL) de leite sem lactose ou bebida vegetal de coco',
    ],
    ['morango', 'chia', ['leite_sem_lactose', 'bebida_vegetal']],
    {
      preparo: ['Bata tudo no liquidificador até ficar cremoso.'],
      troca:
        'O leite sem lactose entrou como opção à bebida de coco, e o morango no lugar da framboesa.',
    },
  ),
  low(
    'lanche',
    'Bolinho de aveia e coco',
    [
      '1 ovo',
      '2 colheres de sopa de aveia',
      '1 colher de sopa de coco ralado',
      '1 colher de sopa de óleo de coco, ou outro óleo',
      '1 colher de chá de açúcar mascavo',
    ],
    ['ovo', 'aveia', 'coco_ralado'],
    {
      preparo: ['Misture tudo e leve ao forno em forminhas por 20 minutos a 180 °C.'],
      troca: 'O açúcar de coco virou açúcar mascavo, e o óleo de coco pode ser outro óleo.',
    },
  ),
  low(
    'lanche',
    'Batata-doce crocante assada',
    ['1 batata-doce média em fatias finas', '2 colheres de sopa de azeite', 'Sal a gosto'],
    ['batata_doce'],
    {
      preparo: [
        'Unte uma forma e espalhe as fatias.',
        'Regue com azeite, salpique sal e asse até dourar.',
      ],
    },
  ),
  low(
    'cafe',
    'Mingau de aveia com leite de coco',
    [
      '3 colheres de sopa de aveia sem glúten',
      '1 copo (165 mL) de bebida vegetal de coco, ou leite sem lactose',
      '1 colher de café cheia de canela',
      '5 morangos pequenos',
      'Colágeno, se quiser',
    ],
    [['aveia_sem_gluten', 'aveia'], ['bebida_vegetal', 'leite_sem_lactose'], 'morango'],
    {
      preparo: [
        'Em uma panela, misture a aveia e a bebida.',
        'Cozinhe em fogo baixo até engrossar.',
        'Sirva com os morangos picados e a canela.',
      ],
      troca: 'O leite sem lactose entrou como opção, e o colágeno ficou opcional.',
    },
  ),
  low(
    'cafe',
    'Pão sem glúten com pasta de queijo brie',
    [
      '2 fatias de pão sem glúten',
      '2 fatias de queijo brie ou feta amassado',
      '1 colher de café rasa de orégano',
      '1 colher de sopa de manjericão',
    ],
    ['pao_sem_gluten', 'queijo_brie'],
    { preparo: ['Misture o queijo com as ervas.', 'Espalhe no pão e sirva.'] },
  ),
  low(
    'almoco',
    'Carne de panela com mandioquinha',
    [
      '1 bife (100 g) de carne bovina em cubos',
      '2 colheres de servir cheias de mandioquinha picada',
      '5 tomates-cereja',
      '1 colher de sopa rasa de azeite',
      'Sal a gosto',
      '2 folhas de louro',
    ],
    ['carne', 'mandioquinha', 'tomate'],
    {
      preparo: [
        'Refogue a carne no azeite e junte o tomate e a mandioquinha.',
        'Cozinhe até tudo ficar macio.',
      ],
    },
  ),
  low(
    'jantar',
    'Sopa de abóbora com gengibre',
    [
      '1 porção média (90 g) de abóbora cozida',
      'Água',
      'Sal a gosto',
      '1 colher de sobremesa de gengibre ralado',
      '1 colher de sopa de azeite',
    ],
    ['abobora', 'gengibre'],
    { preparo: ['Bata a abóbora com água.', 'Leve ao fogo com os temperos até ferver.'] },
  ),
  low(
    'jantar',
    'Omelete com abobrinha e queijo',
    [
      '2 ovos',
      '2 colheres de servir de abobrinha ralada',
      '2 fatias de queijo camembert, ou 2 colheres de sopa de parmesão ralado',
    ],
    ['ovo', 'abobrinha', ['queijo_brie', 'parmesao']],
    {
      preparo: ['Misture os ingredientes e cozinhe na frigideira.'],
      troca: 'O parmesão entrou como opção ao camembert, porque costuma sair mais barato.',
    },
  ),
  low(
    'almoco',
    'Quinoa com legumes',
    [
      '1 xícara de chá de quinoa cozida',
      '1 cenoura pequena cozida',
      '1 pegador de espinafre cozido',
      '50 g de abobrinha',
      '1 colher de sopa rasa de azeite',
      'Sal a gosto',
    ],
    ['quinoa', V_],
    { preparo: ['Refogue os legumes e misture à quinoa.'] },
  ),
  low(
    'almoco',
    'Hambúrguer caseiro com purê de batata',
    [
      '150 g de carne moída',
      '1 colher de café de pimenta-do-reino',
      '1 batata pequena cozida (100 g)',
      'Sal a gosto',
      '1 colher de sopa de azeite',
    ],
    ['carne_moida', 'batata'],
    { preparo: ['Modele e grelhe o hambúrguer.', 'Amasse a batata com azeite e sal.'] },
  ),
  low(
    'almoco',
    'Frango grelhado com purê de cenoura',
    [
      '1 filé grande de frango grelhado',
      '2 cenouras pequenas cozidas',
      '1 colher de sopa rasa de azeite',
      'Sal a gosto',
    ],
    ['frango', 'cenoura'],
    {
      preparo: ['Grelhe o frango com temperos.', 'Amasse a cenoura e misture com azeite e sal.'],
    },
  ),
  low(
    'jantar',
    'Abobrinha recheada com arroz e cenoura',
    [
      '2 abobrinhas pequenas cortadas ao meio no comprimento',
      '2 colheres de servir cheias de arroz integral cozido',
      '2 colheres de sopa cheias de cenoura ralada',
      '2 colheres de chá de azeite',
      'Sal a gosto',
    ],
    ['abobrinha', ['arroz_integral', 'arroz'], 'cenoura'],
    {
      preparo: [
        'Retire parte da polpa da abobrinha com cuidado.',
        'Misture o arroz, a cenoura, o azeite e as ervas.',
        'Recheie as abobrinhas e leve ao forno a 180 °C por 25 a 30 minutos.',
      ],
    },
  ),
  low(
    'lanche',
    'Bolinho de frutas vermelhas com farinha de arroz',
    [
      '5 mirtilos ou morangos picados',
      '1 ovo',
      '2 colheres de sopa de farinha de arroz',
      '1 medida de proteína vegana de baunilha, se quiser',
      '1 colher de sobremesa de óleo de coco, ou outro óleo',
    ],
    [['mirtilo', 'morango'], 'ovo', 'farinha_arroz'],
    {
      preparo: [
        'Misture o ovo com a farinha, e com a proteína se for usar, até formar uma massa homogênea.',
        'Passe o óleo nas forminhas e distribua a massa.',
        'Coloque as frutas e asse a 180 °C por cerca de 25 minutos, ou até dourar.',
      ],
      troca: 'O morango entrou como opção ao mirtilo, e a proteína vegana ficou opcional.',
    },
  ),
  low(
    'cafe',
    'Copo de iogurte com morango e aveia',
    [
      '1 iogurte sem lactose (120 mL)',
      '1 colher de sopa de aveia em flocos sem glúten',
      '2 colheres de sopa de morango picado, ou morango e framboesa',
    ],
    ['iogurte_sem_lactose', ['aveia_sem_gluten', 'aveia'], 'morango'],
    {
      preparo: [
        'Em um copo ou taça, faça camadas de iogurte, aveia e frutas.',
        'Sirva gelado, no café da manhã ou no lanche.',
      ],
      troca: 'O iogurte de coco virou iogurte sem lactose, e a framboesa ficou opcional.',
    },
  ),
  low(
    'jantar',
    'Espetinho de frango com abobrinha grelhada',
    [
      '1 filé grande de peito de frango em cubos',
      '1 abobrinha pequena em rodelas (70 g)',
      '1 colher de café rasa de azeite',
      'Sal a gosto',
      '1 colher de café cheia de alecrim',
      'Suco de limão (1 copo americano pequeno, 165 mL)',
    ],
    ['frango', 'abobrinha', 'limao'],
    {
      preparo: [
        'Monte os espetinhos alternando frango e abobrinha.',
        'Tempere com azeite, limão, sal e alecrim.',
        'Grelhe até dourar todos os lados.',
      ],
    },
  ),
  low(
    'lanche',
    'Bolinho de batata-doce com atum',
    [
      'Meia batata-doce média cozida e amassada',
      '1 lata de atum em água (100 g)',
      '1 colher de café de azeite',
      '1 pitada de sal',
      '1 colher de café de orégano',
    ],
    ['batata_doce', 'atum'],
    {
      preparo: [
        'Misture tudo até formar uma massa.',
        'Modele os bolinhos e asse em forno a 200 °C por 20 minutos, virando na metade do tempo.',
      ],
    },
  ),
];

/** Título curto e ingredientes de cada opção dos cardápios modelo (o texto é o do curso). */
const CARDAPIO_MAPA: Record<string, { titulo: string; usa: Req[] }> = {
  'preso.0.0': {
    titulo: 'Ovos mexidos, pão integral e laranja',
    usa: ['ovo', ['pao_integral', 'pao'], 'laranja'],
  },
  'preso.0.1': {
    titulo: 'Mingau de aveia com banana e linhaça',
    usa: ['aveia', 'leite', 'banana', 'linhaca'],
  },
  'preso.0.2': {
    titulo: 'Cuscuz com ovo, tomate e mamão',
    usa: ['cuscuz', 'ovo', 'tomate', 'mamao'],
  },
  'preso.1.0': { titulo: 'Banana com aveia', usa: ['banana', 'aveia'] },
  'preso.1.1': { titulo: 'Iogurte com linhaça e mel', usa: ['iogurte', 'linhaca', 'mel'] },
  'preso.1.2': { titulo: 'Maçã com queijo branco', usa: ['maca', 'queijo_minas'] },
  'preso.2.0': {
    titulo: 'Arroz integral, feijão, frango e salada',
    usa: [['arroz_integral', 'arroz'], 'feijao', 'frango', V_],
  },
  'preso.2.1': {
    titulo: 'Arroz com legumes, lentilha e carne moída',
    usa: ['arroz', 'lentilha', 'carne_moida', V_],
  },
  'preso.2.2': {
    titulo: 'Batata-doce, grão-de-bico e peixe ou ovo',
    usa: [['batata_doce', 'mandioca'], 'grao_de_bico', ['peixe', 'ovo'], V_],
  },
  'preso.3.0': { titulo: 'Ameixa preta hidratada e iogurte', usa: ['ameixa_preta', 'iogurte'] },
  'preso.3.1': {
    titulo: 'Vitamina de mamão com aveia e linhaça',
    usa: ['mamao', 'aveia', 'linhaca'],
  },
  'preso.3.2': {
    titulo: 'Pão integral com ovo ou queijo e fruta',
    usa: [['pao_integral', 'pao'], ['ovo', 'queijo_minas'], F_],
  },
  'preso.4.0': {
    titulo: 'Sopa de legumes com feijão e couve',
    usa: [V_, ['feijao', 'grao_de_bico'], ['pao_integral', 'pao']],
  },
  'preso.4.1': {
    titulo: 'Omelete com espinafre, arroz integral e salada',
    usa: ['ovo', 'espinafre', 'tomate', ['arroz_integral', 'arroz']],
  },
  'preso.4.2': {
    titulo: 'Arroz integral, feijão, legumes e frango ou ovo',
    usa: [['arroz_integral', 'arroz'], 'feijao', V_, ['frango', 'ovo']],
  },

  'gases.0.0': { titulo: 'Tapioca com ovo e laranja', usa: ['tapioca', 'ovo', 'laranja'] },
  'gases.0.1': {
    titulo: 'Mingau de aveia sem lactose com banana',
    usa: ['aveia', 'leite_sem_lactose', 'banana'],
  },
  'gases.0.2': {
    titulo: 'Pão sem glúten com pasta de amendoim e kiwi',
    usa: ['pao_sem_gluten', 'pasta_amendoim', 'kiwi'],
  },
  'gases.1.0': { titulo: 'Banana mais verde', usa: ['banana'] },
  'gases.1.1': {
    titulo: 'Iogurte sem lactose com morango',
    usa: ['iogurte_sem_lactose', 'morango'],
  },
  'gases.1.2': { titulo: 'Uva com parmesão', usa: ['uva', 'parmesao'] },
  'gases.2.0': { titulo: 'Arroz, frango e legumes no azeite', usa: ['arroz', 'frango', V_] },
  'gases.2.1': { titulo: 'Batata, peixe assado e espinafre', usa: ['batata', 'peixe', V_] },
  'gases.2.2': {
    titulo: 'Macarrão de arroz com molho caseiro e carne moída',
    usa: ['macarrao_arroz', 'tomate', 'carne_moida'],
  },
  'gases.3.0': {
    titulo: 'Tapioca com queijo',
    usa: ['tapioca', ['parmesao', 'queijo_brie', 'mussarela', 'queijo_minas']],
  },
  'gases.3.1': { titulo: 'Melão ou abacaxi', usa: [['melao', 'abacaxi']] },
  'gases.3.2': { titulo: 'Iogurte sem lactose com aveia', usa: ['iogurte_sem_lactose', 'aveia'] },
  'gases.4.0': {
    titulo: 'Omelete com espinafre e tomate, com arroz',
    usa: ['ovo', 'espinafre', 'tomate', 'arroz'],
  },
  'gases.4.1': {
    titulo: 'Canja de arroz com frango e cenoura',
    usa: ['arroz', 'frango', 'cenoura'],
  },
  'gases.4.2': {
    titulo: 'Batata-baroa, frango desfiado e abobrinha',
    usa: ['mandioquinha', 'frango', 'abobrinha'],
  },

  'refluxo.0.0': { titulo: 'Mingau de aveia com banana e canela', usa: ['aveia', 'banana'] },
  'refluxo.0.1': { titulo: 'Tapioca com ovo e maçã', usa: ['tapioca', 'ovo', 'maca'] },
  'refluxo.0.2': {
    titulo: 'Pão integral com ovo cozido e chá',
    usa: [['pao_integral', 'pao'], 'ovo'],
  },
  'refluxo.1.0': { titulo: 'Banana', usa: ['banana'] },
  'refluxo.1.1': { titulo: 'Maçã cozida com canela', usa: ['maca'] },
  'refluxo.1.2': { titulo: 'Chá de erva-doce com biscoito água e sal', usa: ['biscoito_agua_sal'] },
  'refluxo.2.0': {
    titulo: 'Arroz integral, feijão, frango e legumes cozidos',
    usa: [['arroz_integral', 'arroz'], 'feijao', 'frango', V_],
  },
  'refluxo.2.1': {
    titulo: 'Arroz integral, lentilha, patinho e abobrinha',
    usa: [['arroz_integral', 'arroz'], 'lentilha', ['carne', 'carne_moida'], V_],
  },
  'refluxo.2.2': {
    titulo: 'Purê de abóbora, peixe e arroz integral',
    usa: ['abobora', 'peixe', ['arroz_integral', 'arroz']],
  },
  'refluxo.3.0': { titulo: 'Vitamina de banana com aveia', usa: ['banana', 'aveia'] },
  'refluxo.3.1': { titulo: 'Tapioca pequena com ovo', usa: ['tapioca', 'ovo'] },
  'refluxo.3.2': {
    titulo: 'Chá de camomila com pão integral e ovo mexido',
    usa: [['pao_integral', 'pao'], 'ovo'],
  },
  'refluxo.4.0': {
    titulo: 'Sopa de abóbora com frango e arroz',
    usa: ['abobora', 'frango', 'arroz'],
  },
  'refluxo.4.1': {
    titulo: 'Canja leve com arroz, cenoura e frango',
    usa: ['arroz', 'cenoura', 'frango'],
  },
  'refluxo.4.2': {
    titulo: 'Arroz integral com legumes e omelete',
    usa: [['arroz_integral', 'arroz'], V_, 'ovo'],
  },
};

const KIND_POR_POSICAO: MealKind[] = ['cafe', 'lanche', 'almoco', 'lanche', 'jantar'];

function cardapioRecipes(): Recipe[] {
  const out: Recipe[] = [];
  for (const menu of CARDAPIOS) {
    if (menu.id !== 'preso' && menu.id !== 'gases' && menu.id !== 'refluxo') continue;
    const fonte = menu.id;
    menu.refeicoes.slice(0, 5).forEach((meal, mi) => {
      meal.opcoes.forEach((texto, oi) => {
        const mapa = CARDAPIO_MAPA[`${menu.id}.${mi}.${oi}`];
        const refeicao = KIND_POR_POSICAO[mi];
        if (!mapa || !refeicao) return;
        out.push({
          id: `c-${menu.id}-${mi}-${oi}`,
          titulo: mapa.titulo,
          refeicao,
          fonte,
          itens: [texto],
          usa: mapa.usa,
        });
      });
    });
  }
  return out;
}

export const RECEITAS: Recipe[] = [...cardapioRecipes(), ...FODMAP, ...BIBLIOTECA];

/** Só as receitas baixo FODMAP, na ordem do material. */
export const RECEITAS_FODMAP: Recipe[] = FODMAP;

/** Orientações práticas das receitas baixo FODMAP. */
export const ORIENTACOES_FODMAP = [
  'Evite produtos industrializados com adoçantes como xilitol, sorbitol e manitol.',
  'Respeite o tamanho das porções.',
  'Leia os rótulos com atenção.',
  'Registre o que você come e como se sente. Isso ajuda muito a encontrar padrões e entender o que o teu corpo aceita melhor.',
];

/** Encaixe das receitas nas refeições do dia: café e lanche se trocam, almoço e jantar também. */
export const SLOT_KINDS: Record<MealId, MealKind[]> = {
  cafe: ['cafe', 'lanche'],
  lanche_manha: ['lanche', 'cafe'],
  almoco: ['almoco', 'jantar'],
  lanche_tarde: ['lanche', 'cafe'],
  jantar: ['jantar', 'almoco'],
};

/** Textos das telas de refeições. */
export const REFEICOES_TEXTOS = {
  intro:
    'Mais opções além dos cardápios modelo: as refeições da Biblioteca, as receitas baixo FODMAP e as opções dos cardápios, tudo com o que você tem em casa.',
  semNumeros:
    'Aqui não tem conta de caloria. O app segue a linha do curso: o prato montado, a fibra e a água.',
  quantidades:
    'As quantidades são medidas caseiras, como referência. Ajuste ao teu apetite e à tua rotina.',
  aviso: 'São modelos educativos. Plano individual sai de consulta, com a tua história na mesa.',
  ajudaEmCasa: [
    'Toque nos ingredientes que você tem em casa. O app guarda a lista neste celular.',
    'Escolha a refeição e os filtros, se precisar.',
    'Em "Dá para fazer agora" ficam as receitas completas. Em "Falta pouco", as que pedem só um ou dois itens.',
    'Toque numa receita para ver o preparo e colocar no teu dia.',
  ],
  ajudaMeuDia: [
    'Escolha uma opção para cada refeição. Não precisa preencher todas.',
    'O app confere o dia pelo prato da aula 14, pelas fontes de fibra e pela meta de água.',
    'O dia fica salvo até você trocar.',
  ],
  baixoFodmapFase1: 'Ligado porque você está na fase 1 do protocolo low FODMAP.',
  baixoFodmapCaminho: 'Ligado porque o teu caminho é gases, estufamento e SII.',
  baixoFodmapDetalhe:
    'Mostra só receitas com alimentos de baixo teor na lista do curso e nas receitas baixo FODMAP.',
  listaVazia:
    'Marque o que você tem em casa para ver o que dá para fazer. Enquanto isso, aqui estão todas as opções.',
  nadaPronto:
    'Com o que está marcado ainda não fecha nenhuma receita inteira. Veja as que faltam pouco.',
  compras: 'Com estes itens você libera mais receitas:',
  pratoAula14: 'O prato da aula 14: metade vegetais, um quarto proteína, um quarto carboidrato.',
  faltaVegetal: 'falta verdura ou legume. Complete com salada ou legumes, metade do prato.',
  faltaProteina: 'falta proteína: ovo, frango, carne, peixe ou combinação vegetal.',
  faltaCarboidrato: 'falta carboidrato: arroz, batata, mandioca, macarrão ou cuscuz.',
  pratoCompleto: 'tem vegetal, proteína e carboidrato.',
  semLeguminosa:
    'Nenhuma leguminosa no dia. No prato da aula 14 ela entra fora do prato: uma concha de feijão, lentilha, grão-de-bico ou ervilha.',
  fibrasLink: 'Para ver os gramas de fibra, monte o dia em Meu dia de fibras.',
  aguaMeta: 'A meta de água é a mesma em qualquer cardápio.',
  aguaSemMeta: 'Você ainda não calculou a tua meta de água.',
  altoFodmap: 'Na fase 1, atenção ao que é alto teor na lista:',
  diaVazio: 'Escolha pelo menos uma refeição para o app conferir o dia.',
};
