/** Padrões que costumam aparecer (seção 9.5). */

export type PatternId =
  | 'noite_mal_dormida'
  | 'refeicao_rapida'
  | 'fim_de_semana'
  | 'ciclo_pre'
  | 'ciclo_menstruada'
  | 'estresse'
  | 'viagem';

export const PADROES_INTRO =
  'Nenhum deles aparece em um dia. Todos aparecem em três semanas de registro.';

export const PADROES_FECHO =
  'Marcou um padrão? Leve para a leitura da semana, na pergunta 3, e decida um ajuste só.';

export const PADROES: { id: string; title: string; text: string; extra?: string }[] = [
  {
    id: 'noite_mal_dormida',
    title: 'Noite mal dormida',
    text: 'o intestino trava, às vezes com 1 ou 2 dias de atraso.',
  },
  {
    id: 'refeicao_rapida',
    title: 'Refeição rápida',
    text: 'estufamento e sensação de peso logo na sequência.',
  },
  {
    id: 'fim_de_semana',
    title: 'Fim de semana',
    text: 'rotina e horários diferentes desorganizam o funcionamento.',
  },
  {
    id: 'ciclo',
    title: 'Ciclo menstrual',
    text: 'mais preso antes da menstruação e mais solto quando ela chega.',
    extra: 'Isso tem explicação hormonal e é esperado.',
  },
  {
    id: 'estresse',
    title: 'Semana de estresse',
    text: 'piora mesmo mantendo a alimentação igual.',
  },
  {
    id: 'viagem',
    title: 'Viagem',
    text: 'muda água, comida, horário e banheiro. O trânsito desacelera.',
  },
];

/** Texto base de cada padrão encontrado nos registros (seção 7.6). */
export const PADRAO_TEXTO: Record<PatternId, string> = {
  noite_mal_dormida: 'Noite mal dormida: o intestino trava, às vezes com 1 ou 2 dias de atraso.',
  refeicao_rapida: 'Refeição rápida: estufamento e sensação de peso logo na sequência.',
  fim_de_semana: 'Fim de semana: rotina e horários diferentes desorganizam o funcionamento.',
  ciclo_pre:
    'Ciclo menstrual: mais preso antes da menstruação e mais solto quando ela chega. Isso tem explicação hormonal e é esperado.',
  ciclo_menstruada:
    'Ciclo menstrual: mais preso antes da menstruação e mais solto quando ela chega. Isso tem explicação hormonal e é esperado.',
  estresse: 'Semana de estresse: piora mesmo mantendo a alimentação igual.',
  viagem: 'Viagem: muda água, comida, horário e banheiro. O trânsito desacelera.',
};

export const PADROES_SEM_DADOS =
  'Os padrões aparecem com três semanas de registro. Nenhum deles aparece em um dia.';

export const PADROES_ORIENTACAO = 'Leve para a leitura da semana e decida um ajuste só.';
