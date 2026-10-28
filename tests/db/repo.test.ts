import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDbForTests } from '../../src/db/index';
import {
  clearAllData,
  defaultProfile,
  getDay,
  getMeta,
  getPlan,
  getProfile,
  listDays,
  saveDay,
  saveLesson,
  savePlan,
  saveProfile,
  setDismissed,
  setHabit,
  updateMeta,
  saveCrisis,
  getCrisis,
  upsertNotice,
  dismissNotice,
  saveHabit,
  listHabits,
} from '../../src/db/repo';
import { AppDB } from '../../src/db/schema';

let db: AppDB;

beforeEach(() => {
  db = new AppDB(`teste-${Math.random()}`);
  setDbForTests(db);
});

afterEach(async () => {
  await db.delete();
  setDbForTests(null);
});

describe('repo', () => {
  it('perfil padrão por caminho', () => {
    expect(defaultProfile('solto').trackedSymptoms).toEqual([
      'estufamento',
      'gases',
      'dor',
      'urgencia',
    ]);
    expect(defaultProfile().readingWeekday).toBe(0);
    expect(defaultProfile().registerTime).toBe('21:30');
  });

  it('salva e lê o perfil', async () => {
    await saveProfile({ path: 'preso', name: 'Ana' });
    await saveProfile({ simpleMode: true });
    const p = await getProfile();
    expect(p?.name).toBe('Ana');
    expect(p?.path).toBe('preso');
    expect(p?.simpleMode).toBe(true);
  });

  it('registro do dia junta alterações e apaga campos undefined', async () => {
    await saveDay('2026-11-03', { evacuated: true, bristol: 4 });
    await saveDay('2026-11-03', { energy: 7 });
    let r = await getDay('2026-11-03');
    expect(r).toMatchObject({ date: '2026-11-03', evacuated: true, bristol: 4, energy: 7 });
    const created = r?.createdAt;
    await saveDay('2026-11-03', { bristol: undefined });
    r = await getDay('2026-11-03');
    expect(r?.bristol).toBeUndefined();
    expect('bristol' in (r ?? {})).toBe(false);
    expect(r?.createdAt).toBe(created);
  });

  it('marca hábito sem perder os outros', async () => {
    await setHabit('2026-11-03', 'p1', true);
    await setHabit('2026-11-03', 'p2', true);
    await setHabit('2026-11-03', 'p1', false);
    expect((await getDay('2026-11-03'))?.habits).toEqual({ p1: false, p2: true });
  });

  it('lista dias por período', async () => {
    await saveDay('2026-11-01', { evacuated: true });
    await saveDay('2026-11-05', { evacuated: true });
    await saveDay('2026-11-09', { evacuated: true });
    expect((await listDays('2026-11-02', '2026-11-09')).map((d) => d.date)).toEqual([
      '2026-11-05',
      '2026-11-09',
    ]);
    expect((await listDays()).length).toBe(3);
  });

  it('meta, plano, aula, crise, avisos e hábitos', async () => {
    expect((await getMeta()).schemaVersion).toBe(1);
    await updateMeta({ unlocked: true });
    await setDismissed('copia', '2026-11-10');
    expect(await getMeta()).toMatchObject({ unlocked: true, dismissed: { copia: '2026-11-10' } });

    expect(await getPlan()).toBeUndefined();
    await savePlan({ status: 'semana_zero', semanaZero: { compra: true } });
    expect((await getPlan())?.status).toBe('semana_zero');

    const l = await saveLesson(3, (c) => ({ ...c, watched: true }));
    expect(l).toMatchObject({ lessonId: 3, watched: true, task: { status: 'nao_iniciada' } });

    await saveCrisis({ active: true, startedAt: '2026-11-03' });
    expect((await getCrisis())?.active).toBe(true);

    await upsertNotice({ id: 'a', kind: 'alerta', reason: 'febre', detectedAt: '2026-11-03' });
    await dismissNotice('a');
    await dismissNotice('nao-existe');
    expect((await db.notices.get('a'))?.dismissedAt).toBeTruthy();

    await saveHabit({ id: 'h1', label: 'Água', source: 'aula5', activeFrom: '2026-11-03' });
    expect((await listHabits())[0]?.createdAt).toBeTruthy();
  });

  it('apagar tudo mantém só o desbloqueio', async () => {
    await saveProfile({ path: 'preso' });
    await saveDay('2026-11-03', { evacuated: true });
    await updateMeta({ unlocked: true, onboardingDone: true });
    await clearAllData();
    expect(await getProfile()).toBeUndefined();
    expect(await getDay('2026-11-03')).toBeUndefined();
    const meta = await getMeta();
    expect(meta.unlocked).toBe(true);
    expect(meta.onboardingDone).toBeUndefined();
  });

  it('apagar tudo sem desbloqueio não deixa nada', async () => {
    await saveDay('2026-11-03', { evacuated: true });
    await clearAllData();
    expect(await db.meta.count()).toBe(0);
  });
});
