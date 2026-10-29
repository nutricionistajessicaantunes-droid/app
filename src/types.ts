/**
 * Modelo de dados (seção 5 da especificação). Nomes de campo em inglês.
 */

/** 'AAAA-MM-DD' no fuso do aparelho. Ver src/logic/dates.ts. */
export type DayKey = string;

export type Path = 'preso' | 'solto' | 'gases_sii' | 'refluxo' | 'indefinido';
export type Bristol = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BristolBand = 'lenta' | 'saudavel' | 'rapida';
export type SymptomId = 'estufamento' | 'gases' | 'dor' | 'azia' | 'urgencia';
export type TagId =
  | 'dormi_mal'
  | 'estresse_alto'
  | 'comi_correndo'
  | 'comi_fora'
  | 'viagem'
  | 'pre_menstrual'
  | 'menstruada'
  | 'treinei'
  | 'bebi_pouca_agua'
  | 'dia_corrido';
export type RedFlagId =
  | 'sangue_ou_fezes_escuras'
  | 'febre'
  | 'perda_de_peso'
  | 'anemia'
  | 'dor_forte_noturna'
  | 'vomito_persistente'
  | 'diarreia_mais_de_2_semanas'
  | 'mudanca_duradoura'
  | 'inicio_depois_dos_50';

export type CareFlags = {
  diagnosticoIntestinal?: boolean;
  medicacaoContinua?: boolean;
  gestanteOuAmamentando?: boolean;
  relacaoDificilComida?: boolean;
};

export type Theme = 'auto' | 'claro' | 'escuro';
export type CourseStage = 'comecando' | 'aulas' | 'plano';

export interface Profile {
  id: 'me';
  name?: string;
  path: Path;
  careFlags: CareFlags;
  /** Só para a meta de água. Nunca exibido fora dela. */
  weightKg?: number;
  waterGoalMl?: number;
  /** 'HH:mm' */
  bathroomTime?: string;
  /** Horário do lembrete do registro, 'HH:mm'. */
  registerTime?: string;
  /** 0 = domingo (padrão). */
  readingWeekday: number;
  simpleMode: boolean;
  trackedSymptoms: SymptomId[];
  showCycleTags: boolean;
  theme: Theme;
  /** 1 a 28 */
  monthlyReviewDay?: number;
  abdominal?: { date: DayKey; cm: number }[];
  courseStage: CourseStage;
  createdAt: string;
  updatedAt: string;
}

export interface DayRecord {
  date: DayKey;
  /** undefined = não respondeu (nunca tratar como "não"). */
  evacuated?: boolean;
  /** 3 = três ou mais. */
  evacuationCount?: 1 | 2 | 3;
  /** O tipo que mais apareceu no dia. */
  bristol?: Bristol;
  effort?: boolean;
  incomplete?: boolean;
  /** 0 a 10; ausente = não registrado. */
  symptoms?: Partial<Record<SymptomId, number>>;
  energy?: number;
  habits?: Record<string, boolean>;
  waterCups?: number;
  tags?: TagId[];
  note?: string;
  taskFields?: Record<string, unknown>;
  redFlags?: RedFlagId[];
  /** Copos de líquido no modo crise. */
  crisisCups?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntry {
  id: string;
  date: DayKey;
  /** 'HH:mm' */
  time: string;
  kind: 'refeicao' | 'sintoma';
  foods?: string[];
  text?: string;
  symptom?: { type: SymptomId | 'outro'; intensity: number };
  createdAt: string;
  updatedAt: string;
}

export type HabitSource = 'plano' | 'aula5' | 'aula8' | 'aula13' | 'plano_minimo' | 'ciclo';

export interface Habit {
  id: string;
  label: string;
  detail?: string;
  source: HabitSource;
  /** "Depois que eu ___, eu ___" */
  trigger?: string;
  /** Onde a aluna vai ver o gatilho escrito (aula 13). */
  whereWritten?: string;
  activeFrom: DayKey;
  activeTo?: DayKey;
  /** Hábito de água: marca sozinho quando os copos chegam na meta. */
  isWater?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = 'nao_iniciada' | 'em_andamento' | 'pausada' | 'concluida';

export interface LessonProgress {
  lessonId: number;
  watched: boolean;
  watchedAt?: string;
  task: {
    status: TaskStatus;
    startDate?: DayKey;
    data: Record<string, unknown>;
    completedAt?: string;
  };
  updatedAt: string;
}

export type PlanTheme = 1 | 2 | 3;

export interface PlanBlock {
  theme: PlanTheme;
  start: DayKey;
  repeated: boolean;
}

export type PlanStatus = 'nao_iniciado' | 'semana_zero' | 'ativo' | 'reavaliacao' | 'concluido';

export type Scenario = 'bastante' | 'em_parte' | 'nao_mudou';

export interface Reevaluation {
  computedAt: string;
  suggested?: Scenario;
  chosen?: Scenario;
  completedAt?: string;
}

export interface PlanState {
  id: 'plan';
  status: PlanStatus;
  semanaZero: Record<string, boolean>;
  day1?: DayKey;
  blocks: PlanBlock[];
  reevaluation?: Reevaluation;
  /** Dia em que a reavaliação foi concluída. Os seis hábitos ficam ativos até esse dia. */
  concludedOn?: DayKey;
  /** Ids dos hábitos do plano mínimo (tabela habits). */
  minimumPlan?: string[];
  /** Novos ciclos depois do plano. `weeks` conta os blocos de 7 dias (repetir soma um). */
  cycles?: { start: DayKey; habitIds: string[]; weeks?: number }[];
  /** Recados já vistos ("Entendi"). */
  seenNotes?: string[];
  updatedAt: string;
}

export interface WeeklyReading {
  id: string;
  start: DayKey;
  end: DayKey;
  context: 'livre' | 'plano' | 'ciclo';
  planBlockIndex?: number;
  computed: unknown;
  commonNotes: string;
  keep: string;
  adjust: string;
  decision?: 'avancar' | 'repetir';
  createdAt: string;
  updatedAt: string;
}

export type FodmapGroup =
  'lactose' | 'frutose' | 'sorbitol' | 'manitol' | 'frutanos' | 'galactanos';
export type FodmapResult = 'liberado' | 'quantidade' | 'gatilho';
export type FodmapSuggestion = FodmapResult | 'inconclusivo';

export interface FodmapTest {
  group: FodmapGroup;
  food: string;
  start?: DayKey;
  pauseDays: 2 | 3;
  days: { portion: string; score?: number; atypical?: boolean }[];
  baseline?: number;
  suggested?: FodmapSuggestion;
  result?: FodmapResult;
}

export interface FodmapProtocol {
  id: 'fodmap';
  phase: 'planejamento' | 'fase1' | 'fase2' | 'fase3' | 'encerrado';
  acknowledgedCare?: boolean;
  phase1Start?: DayKey;
  evaluationDate?: DayKey;
  baseline?: number;
  responded?: boolean;
  preparations?: Record<string, boolean>;
  tests: FodmapTest[];
  retestDate?: DayKey;
  updatedAt: string;
}

export interface CrisisState {
  id: 'crisis';
  active: boolean;
  startedAt?: DayKey;
  improvedAt?: DayKey;
  holdUntil?: DayKey;
  /** Último dia em que um tipo 6 ou 7 segurou a volta (para não contar duas vezes). */
  lastRelapseDay?: DayKey;
  /** Etapa parada durante a pausa de 2 dias depois de um tipo 6 ou 7. */
  heldStage?: number;
  /** Dias descontados da contagem da volta, por causa das pausas. */
  offsetDays?: number;
  stageDone?: number;
  dehydrationSigns?: string[];
  updatedAt: string;
}

export interface ConsultForm {
  id: 'consult';
  fields: Record<string, string>;
  savedAt?: string;
  updatedAt: string;
}

export type NoticeKind =
  'alerta' | 'acompanhamento' | 'sem_evacuar' | 'crise_sugestao' | 'crise_sem_melhora';

export interface Notice {
  id: string;
  kind: NoticeKind;
  /** Identifica o motivo, por exemplo um RedFlagId ou 'estufamento_diario'. */
  reason: string;
  detectedAt: DayKey;
  dismissedAt?: string;
  updatedAt: string;
}

export interface Meta {
  id: 'meta';
  schemaVersion: number;
  unlocked?: boolean;
  lastBackupAt?: string;
  onboardingDone?: boolean;
  installSkipped?: boolean;
  installPromptDismissedAt?: string;
  persistRequested?: boolean;
  dismissed?: Record<string, string>;
  updatedAt?: string;
}
