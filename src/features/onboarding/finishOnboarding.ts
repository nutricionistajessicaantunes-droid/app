import { DEFAULT_SYMPTOMS_BY_PATH } from '../../content/registro';
import { getDb } from '../../db/index';
import { defaultProfile, nowIso } from '../../db/repo';
import { createBlocks } from '../../logic/plan';
import type { CareFlags, CourseStage, DayKey, Path, RedFlagId } from '../../types';

export interface OnboardingAnswers {
  name: string;
  path?: Path;
  redFlags: RedFlagId[];
  noneOfThese: boolean;
  care: CareFlags;
  stage: CourseStage;
  lastLesson?: number;
  day1?: DayKey;
  registerTime: string;
  readingWeekday: number;
}

export const initialAnswers: OnboardingAnswers = {
  name: '',
  redFlags: [],
  noneOfThese: false,
  care: {},
  stage: 'comecando',
  registerTime: '21:30',
  readingWeekday: 0,
};

/** Grava tudo de uma vez no fim da primeira vez. */
export async function finishOnboarding(a: OnboardingAnswers, today: DayKey): Promise<void> {
  const db = getDb();
  const now = nowIso();
  const path = a.path ?? 'indefinido';
  await db.transaction('rw', [db.profile, db.meta, db.lessons, db.plan, db.notices], async () => {
    const existing = await db.profile.get('me');
    const base = existing ?? defaultProfile(path);
    await db.profile.put({
      ...base,
      name: a.name.trim() || undefined,
      path,
      trackedSymptoms: existing?.trackedSymptoms ?? [...DEFAULT_SYMPTOMS_BY_PATH[path]],
      careFlags: a.care,
      registerTime: a.registerTime,
      readingWeekday: a.readingWeekday,
      courseStage: a.stage,
      updatedAt: now,
    });

    if (a.stage === 'aulas' && a.lastLesson) {
      for (let n = 1; n <= a.lastLesson; n++) {
        const cur = await db.lessons.get(n);
        await db.lessons.put({
          lessonId: n,
          watched: true,
          watchedAt: cur?.watchedAt ?? now,
          task: cur?.task ?? { status: 'nao_iniciada', data: {} },
          updatedAt: now,
        });
      }
    }

    if (a.stage === 'plano' && a.day1) {
      await db.plan.put({
        id: 'plan',
        status: 'ativo',
        semanaZero: {},
        day1: a.day1,
        blocks: createBlocks(a.day1),
        updatedAt: now,
      });
    }

    if (a.redFlags.length > 0) {
      await db.notices.put({
        id: `alerta-${today}-${Date.now()}`,
        kind: 'alerta',
        reason: a.redFlags.join(','),
        detectedAt: today,
        updatedAt: now,
      });
    }

    const meta = (await db.meta.get('meta')) ?? { id: 'meta' as const, schemaVersion: 1 };
    await db.meta.put({ ...meta, onboardingDone: true, updatedAt: now });
  });

  try {
    if (navigator.storage?.persist) {
      const persisted = await navigator.storage.persisted?.();
      if (!persisted) await navigator.storage.persist();
    }
  } catch {
    /* sem suporte: Ajustes mostra a situação */
  }
}
