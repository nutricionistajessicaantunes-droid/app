import { DEFAULT_SYMPTOMS_BY_PATH } from '../content/registro';
import type {
  CrisisState,
  DayKey,
  DayRecord,
  Habit,
  LessonProgress,
  Meta,
  Notice,
  Path,
  PlanState,
  Profile,
} from '../types';
import { getDb } from './index';
import { CURRENT_SCHEMA_VERSION } from './schema';

export function nowIso(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------

export function defaultProfile(path: Path = 'indefinido'): Profile {
  const now = nowIso();
  return {
    id: 'me',
    path,
    careFlags: {},
    readingWeekday: 0,
    registerTime: '21:30',
    simpleMode: false,
    trackedSymptoms: [...DEFAULT_SYMPTOMS_BY_PATH[path]],
    showCycleTags: true,
    theme: 'auto',
    courseStage: 'comecando',
    createdAt: now,
    updatedAt: now,
  };
}

export async function getProfile(): Promise<Profile | undefined> {
  return getDb().profile.get('me');
}

export async function saveProfile(patch: Partial<Profile>): Promise<Profile> {
  const db = getDb();
  return db.transaction('rw', db.profile, async () => {
    const existing = (await db.profile.get('me')) ?? defaultProfile(patch.path);
    const next: Profile = { ...existing, ...patch, id: 'me', updatedAt: nowIso() };
    await db.profile.put(next);
    return next;
  });
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export async function getMeta(): Promise<Meta> {
  return (await getDb().meta.get('meta')) ?? { id: 'meta', schemaVersion: CURRENT_SCHEMA_VERSION };
}

export async function updateMeta(patch: Partial<Meta>): Promise<Meta> {
  const db = getDb();
  return db.transaction('rw', db.meta, async () => {
    const existing = (await db.meta.get('meta')) ?? {
      id: 'meta' as const,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };
    const next: Meta = {
      ...existing,
      ...patch,
      id: 'meta',
      schemaVersion: CURRENT_SCHEMA_VERSION,
      updatedAt: nowIso(),
    };
    await db.meta.put(next);
    return next;
  });
}

export async function setDismissed(key: string, untilOrStamp: string): Promise<void> {
  const meta = await getMeta();
  await updateMeta({ dismissed: { ...(meta.dismissed ?? {}), [key]: untilOrStamp } });
}

// ---------------------------------------------------------------------------
// Registro do dia
// ---------------------------------------------------------------------------

export async function getDay(date: DayKey): Promise<DayRecord | undefined> {
  return getDb().days.get(date);
}

/**
 * Grava uma alteração no registro do dia, juntando com o que já existe.
 * Campos com valor undefined no patch são apagados (por exemplo, desfazer "Sim").
 */
export async function saveDay(date: DayKey, patch: Partial<DayRecord>): Promise<DayRecord> {
  const db = getDb();
  return db.transaction('rw', db.days, async () => {
    const existing = await db.days.get(date);
    const now = nowIso();
    const merged: DayRecord = {
      ...(existing ?? { date, createdAt: now }),
      ...patch,
      date,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    } as DayRecord;
    for (const key of Object.keys(patch) as (keyof DayRecord)[]) {
      if (patch[key] === undefined) delete merged[key];
    }
    await db.days.put(merged);
    return merged;
  });
}

export async function listDays(start?: DayKey, end?: DayKey): Promise<DayRecord[]> {
  const db = getDb();
  if (start && end) return db.days.where('date').between(start, end, true, true).toArray();
  return db.days.orderBy('date').toArray();
}

export async function setHabit(date: DayKey, habitId: string, done: boolean): Promise<DayRecord> {
  const existing = await getDay(date);
  return saveDay(date, { habits: { ...(existing?.habits ?? {}), [habitId]: done } });
}

// ---------------------------------------------------------------------------
// Hábitos guardados (tarefas, plano mínimo, ciclos)
// ---------------------------------------------------------------------------

export async function listHabits(): Promise<Habit[]> {
  return getDb().habits.toArray();
}

export async function saveHabit(habit: Habit): Promise<void> {
  const now = nowIso();
  await getDb().habits.put({ ...habit, createdAt: habit.createdAt ?? now, updatedAt: now });
}

// ---------------------------------------------------------------------------
// Plano, aulas, crise, avisos
// ---------------------------------------------------------------------------

export function emptyPlan(): PlanState {
  return { id: 'plan', status: 'nao_iniciado', semanaZero: {}, blocks: [], updatedAt: nowIso() };
}

export async function getPlan(): Promise<PlanState | undefined> {
  return getDb().plan.get('plan');
}

export async function savePlan(patch: Partial<PlanState>): Promise<PlanState> {
  const db = getDb();
  return db.transaction('rw', db.plan, async () => {
    const existing = (await db.plan.get('plan')) ?? emptyPlan();
    const next: PlanState = { ...existing, ...patch, id: 'plan', updatedAt: nowIso() };
    await db.plan.put(next);
    return next;
  });
}

export function emptyLesson(lessonId: number): LessonProgress {
  return {
    lessonId,
    watched: false,
    task: { status: 'nao_iniciada', data: {} },
    updatedAt: nowIso(),
  };
}

export async function saveLesson(
  lessonId: number,
  update: (current: LessonProgress) => LessonProgress,
): Promise<LessonProgress> {
  const db = getDb();
  return db.transaction('rw', db.lessons, async () => {
    const current = (await db.lessons.get(lessonId)) ?? emptyLesson(lessonId);
    const next = { ...update(current), lessonId, updatedAt: nowIso() };
    await db.lessons.put(next);
    return next;
  });
}

export async function getCrisis(): Promise<CrisisState | undefined> {
  return getDb().crisis.get('crisis');
}

export async function saveCrisis(patch: Partial<CrisisState>): Promise<CrisisState> {
  const db = getDb();
  return db.transaction('rw', db.crisis, async () => {
    const existing = (await db.crisis.get('crisis')) ?? {
      id: 'crisis' as const,
      active: false,
      updatedAt: nowIso(),
    };
    const next: CrisisState = { ...existing, ...patch, id: 'crisis', updatedAt: nowIso() };
    await db.crisis.put(next);
    return next;
  });
}

export async function upsertNotice(notice: Omit<Notice, 'updatedAt'>): Promise<void> {
  await getDb().notices.put({ ...notice, updatedAt: nowIso() });
}

export async function dismissNotice(id: string): Promise<void> {
  const db = getDb();
  const n = await db.notices.get(id);
  if (n) await db.notices.put({ ...n, dismissedAt: nowIso(), updatedAt: nowIso() });
}

// ---------------------------------------------------------------------------
// Apagar tudo
// ---------------------------------------------------------------------------

/** Apaga todos os registros. Mantém só o desbloqueio do código de acesso. */
export async function clearAllData(): Promise<void> {
  const db = getDb();
  await db.transaction('rw', db.tables, async () => {
    const meta = await db.meta.get('meta');
    for (const t of db.tables) await t.clear();
    if (meta?.unlocked) {
      await db.meta.put({
        id: 'meta',
        schemaVersion: CURRENT_SCHEMA_VERSION,
        unlocked: true,
        updatedAt: nowIso(),
      });
    }
  });
}
