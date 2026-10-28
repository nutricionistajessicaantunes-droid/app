import Dexie, { type EntityTable, type Transaction } from 'dexie';
import type {
  ConsultForm,
  CrisisState,
  DayRecord,
  DiaryEntry,
  FodmapProtocol,
  Habit,
  LessonProgress,
  Meta,
  Notice,
  PlanState,
  Profile,
  WeeklyReading,
} from '../types';

/**
 * Esquema do banco. Toda mudança de esquema ganha uma versão nova aqui, com migração
 * quando os dados precisam mudar, e um teste em tests/db/migracao.test.ts provando
 * que os dados da versão anterior continuam lá.
 */
export interface SchemaStep {
  version: number;
  stores: Record<string, string>;
  /** Migração dos dados, quando a versão nova precisa transformar o que já existe. */
  upgrade?: (tx: Transaction) => Promise<void> | void;
}

export const SCHEMA_HISTORY: SchemaStep[] = [
  {
    version: 1,
    stores: {
      profile: 'id',
      meta: 'id',
      days: 'date',
      diary: 'id, date',
      habits: 'id, source',
      lessons: 'lessonId',
      plan: 'id',
      readings: 'id, start',
      fodmap: 'id',
      crisis: 'id',
      consult: 'id',
      notices: 'id, kind',
    },
  },
];

export const CURRENT_SCHEMA_VERSION = SCHEMA_HISTORY[SCHEMA_HISTORY.length - 1]?.version ?? 1;

/** Nomes das tabelas que entram na cópia de segurança. */
export const TABLES = [
  'profile',
  'meta',
  'days',
  'diary',
  'habits',
  'lessons',
  'plan',
  'readings',
  'fodmap',
  'crisis',
  'consult',
  'notices',
] as const;

export type TableName = (typeof TABLES)[number];

export class AppDB extends Dexie {
  profile!: EntityTable<Profile, 'id'>;
  meta!: EntityTable<Meta, 'id'>;
  days!: EntityTable<DayRecord, 'date'>;
  diary!: EntityTable<DiaryEntry, 'id'>;
  habits!: EntityTable<Habit, 'id'>;
  lessons!: EntityTable<LessonProgress, 'lessonId'>;
  plan!: EntityTable<PlanState, 'id'>;
  readings!: EntityTable<WeeklyReading, 'id'>;
  fodmap!: EntityTable<FodmapProtocol, 'id'>;
  crisis!: EntityTable<CrisisState, 'id'>;
  consult!: EntityTable<ConsultForm, 'id'>;
  notices!: EntityTable<Notice, 'id'>;

  constructor(name: string) {
    super(name);
    for (const step of SCHEMA_HISTORY) {
      const v = this.version(step.version).stores(step.stores);
      if (step.upgrade) v.upgrade(step.upgrade);
    }
  }
}
