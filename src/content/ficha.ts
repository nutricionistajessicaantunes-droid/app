/** Ficha para a consulta (seção 9.15, aula 9). */

export const FICHA_TEXTOS = {
  comoUsar:
    'Preencha antes de ir, em casa, olhando o teu registro. Entregue para o profissional no começo da consulta. Em vinte minutos, chegar organizada muda o que dá para fazer com o tempo.',
  dicas: [
    { texto: 'Leve o registro junto.' },
    { texto: 'Não invente resposta.', nota: 'Não lembro é uma resposta válida e útil.' },
    { texto: 'Escreva as tuas perguntas.', nota: 'Todo mundo esquece na hora.' },
  ],
  medicamentosNota:
    'Inclua antiácido, laxante, anti-inflamatório, ferro, cálcio e o que você toma por conta.',
  perguntasNota: 'Escreva agora. Na hora da consulta todo mundo esquece.',
  oQueLevar: [
    'A ficha preenchida',
    'O registro das últimas semanas',
    'Exames e resultados',
    'Caixas dos medicamentos',
  ],
  oQueLevarFecho:
    'Três semanas de registro transformam memória em dado. É a diferença entre dizer que sente mal e mostrar quando, quanto e depois do quê.',
  convite:
    'Se quiser fazer essa consulta comigo, atendo on-line e presencialmente em Palmeira das Missões e Ronda Alta.',
};

export const FICHA_EVENTOS_INICIO = [
  'Infecção intestinal',
  'Viagem',
  'Período de estresse',
  'Uso de antibiótico',
  'Mudança de rotina',
  'Não sei dizer',
];

/** Sintomas da ficha, com vezes por semana e intensidade de 0 a 10. */
export const FICHA_SINTOMAS = [
  { id: 'dor', label: 'Dor abdominal' },
  { id: 'estufamento', label: 'Estufamento' },
  { id: 'gases', label: 'Gases' },
  { id: 'urgencia', label: 'Urgência para ir ao banheiro' },
  { id: 'esforco', label: 'Esforço para evacuar' },
  { id: 'incompleta', label: 'Sensação de evacuação incompleta' },
] as const;
