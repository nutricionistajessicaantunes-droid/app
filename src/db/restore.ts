import { z } from 'zod';
import { isValidDayKey } from '../logic/dates';
import { isRegistered } from '../logic/records';
import type { DayKey, DayRecord, Meta } from '../types';
import { BACKUP_APP_ID, type BackupFile } from './backup';
import { getDb } from './index';
import { nowIso } from './repo';
import { CURRENT_SCHEMA_VERSION, TABLES, type AppDB, type TableName } from './schema';

/** Validação e restauração da cópia de segurança (seção 3.3). Carregado só quando usado. */

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------

const dayKey = z.string().refine((s) => isValidDayKey(s), { message: 'data inválida' });
const score = z.number().min(0).max(10);
const stamp = z.string();

const daySchema = z.looseObject({
  date: dayKey,
  evacuated: z.boolean().optional(),
  evacuationCount: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  bristol: z.number().int().min(1).max(7).optional(),
  effort: z.boolean().optional(),
  incomplete: z.boolean().optional(),
  symptoms: z.record(z.string(), score).optional(),
  energy: score.optional(),
  habits: z.record(z.string(), z.boolean()).optional(),
  waterCups: z.number().int().min(0).max(100).optional(),
  crisisCups: z.number().int().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  note: z.string().optional(),
  taskFields: z.record(z.string(), z.unknown()).optional(),
  redFlags: z.array(z.string()).optional(),
  createdAt: stamp,
  updatedAt: stamp,
});

const profileSchema = z.looseObject({
  id: z.literal('me'),
  path: z.enum(['preso', 'solto', 'gases_sii', 'refluxo', 'indefinido']),
  careFlags: z.record(z.string(), z.boolean().optional()).optional().default({}),
  readingWeekday: z.number().int().min(0).max(6),
  simpleMode: z.boolean(),
  trackedSymptoms: z.array(z.string()),
  showCycleTags: z.boolean(),
  theme: z.enum(['auto', 'claro', 'escuro']),
  courseStage: z.enum(['comecando', 'aulas', 'plano']),
  createdAt: stamp,
  updatedAt: stamp,
});

const keyed = (key: string) => z.looseObject({ [key]: z.union([z.string(), z.number()]) });

const tableSchemas: Record<TableName, z.ZodType> = {
  profile: profileSchema,
  meta: z.looseObject({ id: z.literal('meta') }),
  days: daySchema,
  diary: z.looseObject({
    id: z.string(),
    date: dayKey,
    time: z.string(),
    kind: z.enum(['refeicao', 'sintoma']),
  }),
  habits: z.looseObject({
    id: z.string(),
    label: z.string(),
    source: z.string(),
    activeFrom: dayKey,
  }),
  lessons: z.looseObject({ lessonId: z.number().int().min(1).max(17), watched: z.boolean() }),
  plan: z.looseObject({ id: z.literal('plan'), status: z.string(), blocks: z.array(z.unknown()) }),
  readings: keyed('id'),
  fodmap: z.looseObject({ id: z.literal('fodmap') }),
  crisis: z.looseObject({ id: z.literal('crisis'), active: z.boolean() }),
  consult: z.looseObject({ id: z.literal('consult') }),
  notices: keyed('id'),
};

const fileSchema = z.looseObject({
  app: z.literal(BACKUP_APP_ID),
  schemaVersion: z.number().int().min(1),
  appVersion: z.string().optional().default(''),
  exportedAt: stamp,
  data: z.record(z.string(), z.array(z.unknown())),
});

export type ParseResult = { ok: true; backup: BackupFile } | { ok: false; error: string };

/** Lê e valida um arquivo de cópia. Mensagens de erro em português, para a aluna. */
export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch {
    return {
      ok: false,
      error:
        'Este arquivo não é uma cópia do app. Escolha o arquivo que começa com "modulacao-copia".',
    };
  }
  const top = fileSchema.safeParse(raw);
  if (!top.success) {
    return {
      ok: false,
      error:
        'Este arquivo não é uma cópia do app. Escolha o arquivo que começa com "modulacao-copia".',
    };
  }
  if (top.data.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return {
      ok: false,
      error: 'Esta cópia foi feita numa versão mais nova do app. Atualize o app e tente de novo.',
    };
  }
  const data: Partial<Record<TableName, unknown[]>> = {};
  for (const table of TABLES) {
    const rows = top.data.data[table];
    if (!rows) continue;
    const parsed: unknown[] = [];
    for (const row of rows) {
      const r = tableSchemas[table].safeParse(row);
      if (!r.success) {
        return {
          ok: false,
          error: 'A cópia está incompleta ou foi alterada. Tente outro arquivo de cópia.',
        };
      }
      parsed.push(r.data);
    }
    data[table] = parsed;
  }
  return {
    ok: true,
    backup: {
      app: top.data.app,
      schemaVersion: top.data.schemaVersion,
      appVersion: top.data.appVersion,
      exportedAt: top.data.exportedAt,
      data,
    },
  };
}

export interface BackupPreview {
  firstDay?: DayKey;
  lastDay?: DayKey;
  registeredDays: number;
  exportedAt: string;
}

export function previewBackup(backup: BackupFile): BackupPreview {
  const days = (backup.data.days ?? []) as DayRecord[];
  const registered = days
    .filter(isRegistered)
    .map((d) => d.date)
    .sort();
  return {
    firstDay: registered[0],
    lastDay: registered[registered.length - 1],
    registeredDays: registered.length,
    exportedAt: backup.exportedAt,
  };
}

// ---------------------------------------------------------------------------
// Restaurar
// ---------------------------------------------------------------------------

function keyOf(table: TableName, row: Record<string, unknown>): string {
  if (table === 'days') return String(row.date);
  if (table === 'lessons') return String(row.lessonId);
  return String(row.id);
}

function stampOf(row: Record<string, unknown>): string {
  const u = row.updatedAt;
  return typeof u === 'string' ? u : '';
}

function mergeMeta(existing: Meta | undefined, incoming: Meta | undefined): Meta {
  const base: Meta = { id: 'meta', schemaVersion: CURRENT_SCHEMA_VERSION };
  const a = existing ?? base;
  const b = incoming ?? base;
  const newer = stampOf(b as never) > stampOf(a as never) ? b : a;
  const lastBackupAt = [a.lastBackupAt, b.lastBackupAt].filter(Boolean).sort().pop();
  return {
    ...newer,
    id: 'meta',
    schemaVersion: CURRENT_SCHEMA_VERSION,
    unlocked: Boolean(a.unlocked || b.unlocked) || undefined,
    onboardingDone: true,
    lastBackupAt,
    dismissed: { ...(b.dismissed ?? {}), ...(a.dismissed ?? {}) },
    updatedAt: nowIso(),
  };
}

/** Substituir tudo: apaga o que existe e grava a cópia. */
export async function restoreReplace(backup: BackupFile, db: AppDB = getDb()): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    const currentMeta = (await db.meta.get('meta')) as Meta | undefined;
    for (const t of TABLES) await db.table(t).clear();
    for (const t of TABLES) {
      if (t === 'meta') continue;
      const rows = backup.data[t];
      if (rows && rows.length > 0) await db.table(t).bulkPut(rows);
    }
    const incomingMeta = (backup.data.meta?.[0] as Meta | undefined) ?? undefined;
    await db.meta.put(mergeMeta(currentMeta, incomingMeta));
  });
}

/** Juntar com o que já tenho: por chave, vence a versão com updatedAt mais recente. */
export async function restoreMerge(backup: BackupFile, db: AppDB = getDb()): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    for (const t of TABLES) {
      if (t === 'meta') continue;
      const rows = (backup.data[t] ?? []) as Record<string, unknown>[];
      if (rows.length === 0) continue;
      const table = db.table(t);
      const existing = (await table.toArray()) as Record<string, unknown>[];
      const byKey = new Map(existing.map((r) => [keyOf(t, r), r]));
      const toPut: Record<string, unknown>[] = [];
      for (const row of rows) {
        const cur = byKey.get(keyOf(t, row));
        if (!cur || stampOf(row) > stampOf(cur)) toPut.push(row);
      }
      if (toPut.length > 0) await table.bulkPut(toPut);
    }
    const currentMeta = (await db.meta.get('meta')) as Meta | undefined;
    const incomingMeta = backup.data.meta?.[0] as Meta | undefined;
    await db.meta.put(mergeMeta(currentMeta, incomingMeta));
  });
}
