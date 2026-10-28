/** Diarreia: crise e volta (seção 9.13, aula 6). */

export const DIARREIA = {
  primeiroAgua: 'Em diarreia, primeiro a água, depois a comida.',
  sintomasAtencao: [
    'Fezes líquidas frequentes',
    'Dor ou cólica abdominal',
    'Náuseas ou vômitos',
    'Fraqueza e sede intensa',
    'Pouca urina ou urina escura',
  ],
  sinaisPerda:
    'Sede intensa, fraqueza, urina escura e em pouca quantidade são sinais de que o corpo já está perdendo mais líquido do que recebendo.',
  aguda:
    'Aguda: mais de quatro evacuações líquidas por dia, início súbito, dura menos de duas semanas.',
  cronica: 'Crônica: evacuações frequentes ou volumosas que passam de duas semanas.',
  passouDuasSemanas:
    'Passou de duas semanas, é caso para investigação médica, e não para ajuste de cardápio por conta própria.',
  quandoProcurar:
    'Procure atendimento médico se houver sangue nas fezes, febre alta, vômito que impeça beber líquido, sinais de desidratação ou diarreia por mais de duas semanas. Criança pequena, pessoa idosa, gestante e quem tem doença crônica desidratam mais rápido.',
  quandoProcurarAula6: 'Procure atendimento também se a diarreia passar de dois dias sem melhorar.',
  hidratacaoIntro:
    'Água pura sozinha não dá conta, porque você está perdendo também sódio e potássio.',
  hidratacao: [
    'Soro de reidratação oral (sachê de farmácia, diluído como diz a embalagem)',
    'Água de coco',
    'Caldos e sopas leves',
    'Sucos diluídos',
    'Isotônicos',
  ],
  hidratacaoComo: 'Em pequenos goles ao longo do dia inteiro.',
  entra: [
    'Caldos e sopas leves',
    'Arroz branco',
    'Pão',
    'Carnes magras',
    'Banana',
    'Maçã sem casca',
    'Cenoura cozida',
  ],
  sai: [
    'Leite e derivados',
    'Frituras e gordura',
    'Feijão e grãos em geral',
    'Frutas muito doces',
    'Café',
    'Álcool',
    'Doces',
    'Alimentos com muita fibra',
  ],
  voltaIntro:
    'A reintrodução é por etapas, e não de uma vez. Cada passo só acontece se o anterior passou bem.',
  temporaria:
    'Esta fase é temporária. Ficar muito tempo nessa alimentação restritiva prejudica a nutrição e a microbiota.',
  sempreSolto:
    'Fezes tipo 6 todos os dias, urgência e medo de sair de casa sem saber onde tem banheiro pedem avaliação individual.',
  acompanhe:
    'Acompanhe pela Escala de Bristol. Se voltar ao tipo 6 ou 7 depois de um alimento, segure a reintrodução por mais dois dias antes de tentar de novo.',
  segure: 'Segure a reintrodução por mais dois dias antes de tentar de novo.',
  semMelhora: 'Se a diarreia não melhora em dois dias, procure atendimento.',
  kitIntro:
    'Monte hoje, enquanto você está bem. No dia que acontecer, você não vai ter cabeça nem disposição para resolver isso.',
};

/** A volta depois da crise: etapas por dia desde a melhora (seção 9.13). */
export const VOLTA_ETAPAS: {
  id: number;
  dias: string;
  deDia: number;
  texto: string;
  fecho?: string;
}[] = [
  {
    id: 1,
    dias: 'Dias 1 e 2 depois da melhora',
    deDia: 1,
    texto:
      'Alimentos leves e de pouco resíduo, como arroz, batata, cenoura cozida, frango e banana.',
  },
  {
    id: 2,
    dias: 'Dias 3 e 4',
    deDia: 3,
    texto: 'Outros legumes cozidos e frutas sem casca, como maçã e pera cozidas.',
  },
  {
    id: 3,
    dias: 'Dias 5 e 6',
    deDia: 5,
    texto: 'Cereais integrais em pequena quantidade e saladas cruas mais leves.',
  },
  {
    id: 4,
    dias: 'Dia 7 em diante',
    deDia: 7,
    texto: 'Leguminosas, como feijão e lentilha, começando com meia concha.',
  },
  {
    id: 5,
    dias: 'Por último',
    deDia: 9,
    texto: 'Leite e derivados, frituras, café e álcool.',
    fecho: 'Se algum reacender o sintoma, anote e leve para a consulta.',
  },
];

/** Verificação de desidratação do modo crise (seção 6.12). */
export const SINAIS_DESIDRATACAO = [
  { id: 'sede', label: 'Sede intensa' },
  { id: 'fraqueza', label: 'Fraqueza' },
  { id: 'boca_seca', label: 'Boca muito seca' },
  { id: 'tontura', label: 'Tontura' },
  { id: 'pouca_urina', label: 'Pouca urina ou urina escura' },
];

/** Lista de hidratação do cartão do modo crise (seção 6.12). */
export const HIDRATACAO_CRISE = [
  'Soro de reidratação oral em pequenos goles ao longo do dia',
  'Água de coco',
  'Caldos e sopas leves',
  'Sucos diluídos',
  'Isotônicos',
];
