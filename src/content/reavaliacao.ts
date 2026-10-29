import type { Scenario } from '../types';

/** Reavaliação, cenários e plano mínimo (seções 9.7 e 6.9). */

export const REAVALIACAO_TEXTOS = {
  intro: 'Compare a tua semana 1 com a tua semana 3, com dado e não com impressão.',
  oQueComparar: [
    'Tipo de Bristol predominante',
    'Frequência semanal',
    'Esforço e evacuação incompleta',
    'Sintomas, média de 0 a 10',
    'Energia e disposição, média de 0 a 10',
    'Hábitos cumpridos nas semanas 1, 2 e 3, quantos dias em média',
  ],
  fotosCircunferencia:
    'Se você usou fotos ou circunferência abdominal, compare também. O objetivo ali é observar o inchaço abdominal.',
  notaCircunferencia:
    'O objetivo aqui é observar o inchaço abdominal, e não avaliar o teu corpo. Este curso não é sobre emagrecer.',
  bristolMudancaGrande:
    'Sair do tipo 1 ou 2 para o 3 ou 4 é uma mudança grande, mesmo que a frequência não tenha mudado.',
  poucosDias: 'Poucos dias registrados nesta semana. Use também a tua percepção.',
  planoNaoTestado:
    'Pode ser que a tua rotina, naquele momento, não permitiu aplicar o plano. Aí a conclusão é outra: o plano ainda não foi testado.',
  qualquerCenario:
    'Em qualquer um dos três, você terminou com três semanas de informação organizada sobre o teu próprio corpo.',
  conteudoFunciona: 'O conteúdo do curso é teu e funciona por conta própria.',
  convite:
    'Se quiser fazer esse acompanhamento comigo, atendo on-line e presencialmente em Palmeira das Missões e Ronda Alta.',
};

export const CENARIOS: Record<Scenario, { titulo: string; texto: string; detalhe: string }> = {
  bastante: {
    titulo: 'Melhorou bastante',
    texto: 'Mantenha os seis hábitos. Se quiser, inicie um novo ciclo com dois hábitos novos.',
    detalhe: 'Fezes na faixa de 3 a 5, frequência confortável, menos esforço e menos sintoma.',
  },
  em_parte: {
    titulo: 'Melhorou em parte',
    texto:
      'Trabalhe o que sobrou com o conteúdo do curso, ou busque atendimento individual para essa parte.',
    detalhe: 'Por exemplo, o protocolo low FODMAP se o estufamento é o problema.',
  },
  nao_mudou: {
    titulo: 'Não mudou quase nada',
    texto:
      'Isso não é falha tua. Pode ser um quadro que precisa de diagnóstico, uma causa não alimentar, como medicação ou tireoide, ou uma rotina que não permitiu aplicar o plano. Leve o teu registro e a ficha para a consulta.',
    detalhe: '',
  },
};

export const PLANO_MINIMO_TEXTOS = {
  intro:
    'Escolha os três hábitos que você mantém mesmo na pior semana do ano. Em viagem, em festa, em semana de mudança.',
  exemplos: [
    'Para intestino preso: água, uma fonte de fibra por dia e a rotina de banheiro.',
    'Para refluxo: refeições menores, jantar cedo e não deitar depois de comer.',
  ],
  revisao:
    'Uma revisão de cinco minutos por mês, olhando o teu registro, é o que mantém tudo de pé. Se um hábito caiu, retome apenas ele.',
  retomeApenasEle: 'Se um hábito caiu, retome apenas ele.',
};

export const MANUTENCAO_TEXTOS = [
  'Depois do dia 21, os seis hábitos continuam.',
  'A cada novo ciclo, acrescente no máximo dois hábitos novos.',
  'Procure atendimento se aparecerem sinais de alerta ou se o quadro persistir mesmo com o plano aplicado.',
];

export const FIM_DO_CURSO = {
  frase: 'Constância vale mais do que intensidade.',
  convite: 'Se o curso te ajudou, me conta o que mudou.',
};
