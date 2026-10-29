import type { RedFlagId } from '../types';

/** Sinais de alerta (seção 9.15 e 6.15). */

export const RED_FLAGS: { id: RedFlagId; label: string }[] = [
  { id: 'sangue_ou_fezes_escuras', label: 'Sangue nas fezes ou fezes muito escuras' },
  { id: 'perda_de_peso', label: 'Perda de peso sem explicação' },
  { id: 'febre', label: 'Febre junto com alteração intestinal' },
  { id: 'anemia', label: 'Anemia' },
  { id: 'dor_forte_noturna', label: 'Dor abdominal forte, principalmente se acorda à noite' },
  { id: 'diarreia_mais_de_2_semanas', label: 'Diarreia por mais de duas semanas' },
  { id: 'vomito_persistente', label: 'Vômito persistente' },
  { id: 'mudanca_duradoura', label: 'Mudança importante e duradoura no padrão intestinal' },
  { id: 'inicio_depois_dos_50', label: 'Sintomas que começaram depois dos 50 anos' },
];

export const RED_FLAG_LABEL: Record<RedFlagId, string> = Object.fromEntries(
  RED_FLAGS.map((f) => [f.id, f.label]),
) as Record<RedFlagId, string>;

export const ALERTA_TEXTOS = {
  pedemAvaliacao: 'Qualquer um deles pede avaliação médica, e não ajuste de cardápio.',
  cartao:
    'Qualquer um deles pede avaliação médica, e não ajuste de cardápio. Isso não espera o fim do plano.',
  historicoFamilia:
    'Se você tem histórico de câncer de intestino na família, ou já passou dos 45 anos, isso vale ainda mais atenção.',
  naoSignificaGrave:
    'Nada disso significa que você tem alguma coisa grave. Significa que essas situações precisam de investigação médica.',
  nenhumDestes: 'Nenhum destes',
};

/** Segundo grupo, pedem acompanhamento, sem urgência (seção 9.15). */
export type CareReason =
  'sintomas_persistem' | 'preso_nao_responde' | 'estufamento_diario' | 'alternancia_constante';

export const SEGUNDO_GRUPO: { id: CareReason; label: string }[] = [
  {
    id: 'sintomas_persistem',
    label: 'Sintomas que persistem mesmo depois de aplicar o que você aprendeu no curso',
  },
  { id: 'preso_nao_responde', label: 'Intestino preso que não responde a fibra, água e rotina' },
  { id: 'estufamento_diario', label: 'Estufamento diário' },
  { id: 'alternancia_constante', label: 'Alternância constante entre preso e solto' },
];

/** Nomes curtos de cada detecção (seção 7.13). */
export const SEGUNDO_GRUPO_DETECCAO: Record<CareReason, string> = {
  estufamento_diario: 'estufamento diário',
  alternancia_constante: 'alternância constante entre preso e solto',
  preso_nao_responde: 'intestino preso que não responde a fibra, água e rotina',
  sintomas_persistem: 'sintomas que persistem mesmo aplicando o que você aprendeu',
};

export const ACOMPANHAMENTO_TEXTO =
  'Procurar ajuda não é fracasso. Saber a hora de pedir ajuda faz parte do autocuidado.';

/** Onboarding: situações de cuidado (seção 6.1). */
export const SITUACOES_CUIDADO = [
  { id: 'diagnosticoIntestinal', label: 'Tenho diagnóstico intestinal' },
  { id: 'medicacaoContinua', label: 'Uso medicação contínua' },
  { id: 'gestanteOuAmamentando', label: 'Estou gestante ou amamentando' },
  { id: 'relacaoDificilComida', label: 'Tenho ou já tive uma relação difícil com a comida' },
] as const;

export const SITUACOES_CUIDADO_TEXTO =
  'Nesses casos, o plano é adaptado com acompanhamento profissional.';

/** Recado de três dias sem evacuar (seção 7.13). */
export const SEM_EVACUAR_TEXTO =
  'Três dias sem evacuar ficam fora da faixa considerada normal, que vai de três vezes por dia a três vezes por semana. Reforce a água, a fibra e a rotina de banheiro. Se vier junto dor forte ou vômito persistente, procure atendimento.';

/** Sugestão do modo crise (seção 7.13). */
export const CRISE_SUGESTAO_TEXTO =
  'Teus registros mostram fezes tipo 6 ou 7 há dois dias. Quer abrir o guia da crise?';
