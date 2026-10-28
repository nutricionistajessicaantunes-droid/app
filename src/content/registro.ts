import type { Path, SymptomId, TagId } from '../types';

/** Rótulos dos sintomas acompanhados no registro (seção 6.4). */
export const SYMPTOM_LABEL: Record<SymptomId, string> = {
  estufamento: 'Estufamento',
  gases: 'Gases',
  dor: 'Dor',
  azia: 'Azia',
  urgencia: 'Urgência',
};

export const ALL_SYMPTOMS: SymptomId[] = ['estufamento', 'gases', 'dor', 'azia', 'urgencia'];

/** Sintomas padrão por caminho (seção 6.4). */
export const DEFAULT_SYMPTOMS_BY_PATH: Record<Path, SymptomId[]> = {
  preso: ['estufamento', 'gases', 'dor'],
  indefinido: ['estufamento', 'gases', 'dor'],
  solto: ['estufamento', 'gases', 'dor', 'urgencia'],
  gases_sii: ['estufamento', 'gases', 'dor', 'urgencia'],
  refluxo: ['estufamento', 'gases', 'dor', 'azia'],
};

/** Chips de "O dia em uma linha" (seção 6.4). */
export const TAGS: { id: TagId; label: string; cycle?: boolean }[] = [
  { id: 'dormi_mal', label: 'Dormi mal' },
  { id: 'estresse_alto', label: 'Estresse alto' },
  { id: 'comi_correndo', label: 'Comi correndo' },
  { id: 'comi_fora', label: 'Comi fora' },
  { id: 'viagem', label: 'Viagem' },
  { id: 'pre_menstrual', label: 'Pré-menstrual', cycle: true },
  { id: 'menstruada', label: 'Menstruada', cycle: true },
  { id: 'treinei', label: 'Treinei' },
  { id: 'bebi_pouca_agua', label: 'Bebi pouca água' },
  { id: 'dia_corrido', label: 'Dia corrido' },
];

export const TAG_LABEL: Record<TagId, string> = Object.fromEntries(
  TAGS.map((t) => [t.id, t.label]),
) as Record<TagId, string>;

/** Textos do Registro do dia (seção 6.4). */
export const REGISTRO_TEXTOS = {
  evacuou: 'Você evacuou?',
  quantasVezes: 'Quantas vezes?',
  comoEstavam: 'Como estavam as fezes?',
  ajudaBristol: 'Se teve mais de um tipo, marque o que mais apareceu.',
  fizEsforco: 'Fiz esforço',
  naoEsvaziei: 'Senti que não esvaziei',
  comoECadaTipo: 'Como é cada tipo?',
  sintomas: 'Sintomas, de 0 a 10',
  semSintomas: 'Sem sintomas hoje',
  energia: 'Energia e disposição, de 0 a 10',
  habitos: 'Hábitos de hoje',
  metaHabitos: 'A meta é cinco dias de sete.',
  agua: 'Água',
  diaEmUmaLinha: 'O dia em uma linha',
  exemploLinha: 'Ex.: dormi mal, almocei correndo no trabalho',
  notouAlgo: 'Notou algo preocupante?',
  pronto: 'Pronto',
  diaRegistrado: 'Dia registrado.',
  simplificar: 'Simplificar meu registro',
  textoModoSimples:
    'Se anotar começar a te deixar ansiosa, simplifique. Ficar só com o tipo de Bristol e uma linha sobre o dia já resolve. E se mesmo assim continuar pesado, pare de registrar e siga com os hábitos.',
};

/** Registro e leitura da semana (seção 9.4). */
export const REGISTRO_CURSO = {
  campos:
    'Hábitos da semana; evacuou hoje; tipo de Bristol de 1 a 7; sintomas de 0 a 10 (estufamento, gases, dor, azia, o que for o teu caso); o dia em uma linha (sono, estresse, comeu fora, ciclo menstrual, treino); energia e disposição de 0 a 10.',
  falhouUmDia:
    'Falhou um dia? Anote mesmo assim. O dia em que você não cumpriu nada é o que mais ensina.',
  usoNaConsulta:
    'Quando você leva três semanas de anotação para um atendimento, o profissional deixa de trabalhar com a tua memória e passa a trabalhar com dado.',
};

export const LEITURA_TEXTOS = {
  intro:
    'Cinco minutos, uma vez por semana, sempre no mesmo dia. É aqui que o registro vira informação.',
  p1: 'Quantos dias cumpri cada hábito?',
  p1Nota: 'Abaixo de cinco dias, repita a semana antes de avançar.',
  p1Abaixo:
    'Abaixo de cinco dias, repita a semana antes de avançar. Repetir funciona melhor do que seguir com base frágil.',
  p2: 'Qual foi o tipo de Bristol mais frequente?',
  p2Nota: 'O padrão da semana é o que conta. O dia isolado não diz nada.',
  p2Alternancia: 'Teve dia de fezes ressecadas e dia de fezes amolecidas na mesma semana.',
  p3: 'Em que dias apareceu sintoma?',
  p3Nota: 'E o que esses dias tinham em comum entre si.',
  p3Campo: 'O que esses dias tinham em comum?',
  p4: 'O que eu mantenho e o que eu ajusto?',
  p4Nota: 'Apenas um ajuste por vez, para saber a que atribuir o resultado.',
  algumAbaixo:
    'Algum hábito ficou abaixo de cinco dias? Repita a semana antes de avançar. Repetir funciona melhor do que seguir com base frágil.',
  poucosDias: 'Com poucos dias registrados, a leitura fica fraca. Vale olhar mesmo assim.',
};
