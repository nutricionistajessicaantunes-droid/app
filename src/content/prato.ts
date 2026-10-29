/** O prato, a compra e o comer fora (seção 9.11, aula 14). */

export const PRATO = {
  intro:
    'Uma estrutura que funciona em casa, no restaurante e na casa da tua mãe. Vale a proporção, sem medida exata.',
  partes: [
    {
      parte: 'Metade do prato',
      titulo: 'Vegetais e verduras',
      texto: 'Salada crua, legumes refogados ou cozidos, variando as cores.',
    },
    {
      parte: 'Um quarto',
      titulo: 'Proteína',
      texto: 'Ovo, frango, carne, peixe ou combinação vegetal.',
    },
    {
      parte: 'Um quarto',
      titulo: 'Carboidrato',
      texto: 'Arroz, batata, mandioca, batata-doce, macarrão, cuscuz.',
    },
    {
      parte: 'Fora do prato',
      titulo: 'Gordura boa e leguminosa',
      texto:
        'Gordura boa (azeite na salada, abacate, sementes) e leguminosa (uma concha de feijão, lentilha, grão-de-bico ou ervilha).',
    },
  ],
};

export const PRATO_POR_QUEIXA = [
  {
    queixa: 'Intestino preso',
    texto: 'Mais vegetais, leguminosa diária, integrais e água junto com a fibra.',
  },
  {
    queixa: 'Intestino solto',
    texto: 'Menos fibra temporariamente, legumes cozidos, arroz branco e volta gradual.',
  },
  {
    queixa: 'Gases e SII',
    texto:
      'Mesma estrutura com itens de baixo FODMAP, ervas no lugar de alho e cebola, atenção à porção das leguminosas.',
  },
  {
    queixa: 'Refluxo e gastrite',
    texto:
      'Porções menores e mais refeições, sem fritura, última refeição 3 horas antes de deitar.',
  },
];

export const LISTA_BASE = {
  itens: [
    { grupo: 'Leguminosas', texto: 'feijão, lentilha, grão-de-bico ou ervilha' },
    { grupo: 'Proteínas', texto: 'ovos, frango, carne moída, peixe e queijo branco' },
    {
      grupo: 'Carboidratos',
      texto: 'arroz, batata, mandioca, batata-doce, cuscuz de milho e macarrão',
    },
    { grupo: 'Cereais e sementes', texto: 'aveia, linhaça ou chia' },
    { grupo: 'Frutas variadas', texto: 'priorizando as que você realmente come' },
    { grupo: 'Folhas', texto: 'alface, couve, repolho e espinafre' },
    { grupo: 'Legumes', texto: 'cenoura, abobrinha, chuchu, abóbora, beterraba e tomate' },
    { grupo: 'Iogurte natural ou coalhada, e azeite de oliva', texto: '' },
  ],
  fecho:
    'A lista base é o que sustenta qualquer um dos cardápios. Compre isso e o resto se resolve.',
};

export const COMENDO_FORA = {
  situacoes: [
    {
      onde: 'Por quilo',
      texto:
        'Comece enchendo metade do prato com salada e legumes, depois a proteína e por último o carboidrato.',
    },
    {
      onde: 'À la carte',
      texto:
        'Procure o prato que tenha os três componentes. Grelhado com arroz e salada resolve em quase todo lugar.',
    },
    { onde: 'Lanche', texto: 'Escolha o mais simples da lista e coma devagar.' },
    {
      onde: 'Casa da família',
      texto:
        'Coma do que tem, ajustando a proporção: mais salada e porção menor do que costuma pesar para você.',
    },
    {
      onde: 'Viagem',
      texto:
        'Leve fruta e uma fonte de fibra, como um pote pequeno de aveia, para não depender só do que aparecer.',
    },
  ],
  fecho: 'O objetivo é constância. Uma refeição diferente não compromete o processo.',
};
