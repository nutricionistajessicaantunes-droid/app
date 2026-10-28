import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  backupFileName,
  backupToFile,
  emergencyExport,
  exportAll,
  readFileText,
  serializeBackup,
} from '../../src/db/backup';
import { parseBackup, previewBackup, restoreMerge, restoreReplace } from '../../src/db/restore';
import { setDbForTests } from '../../src/db/index';
import { getDay, saveDay, saveProfile, updateMeta } from '../../src/db/repo';
import { AppDB } from '../../src/db/schema';

let db: AppDB;

beforeEach(() => {
  db = new AppDB(`backup-${Math.random()}`);
  setDbForTests(db);
});

afterEach(async () => {
  await db.delete();
  setDbForTests(null);
});

async function seed() {
  await saveProfile({ path: 'preso', name: 'Ana' });
  await saveDay('2026-11-01', { evacuated: true, bristol: 4 });
  await saveDay('2026-11-02', { evacuated: false });
  await saveDay('2026-11-03', { habits: { p1: true } });
  await updateMeta({ unlocked: true, onboardingDone: true });
}

describe('cópia de segurança', () => {
  it('nome do arquivo', () => {
    expect(backupFileName('2026-11-03')).toBe('modulacao-copia-2026-11-03.txt');
  });

  it('arquivo .txt com JSON e prévia', async () => {
    await seed();
    const backup = await exportAll(db);
    const file = backupToFile(backup, '2026-11-03');
    expect(file.name).toBe('modulacao-copia-2026-11-03.txt');
    expect(file.type).toBe('text/plain');
    const text = await readFileText(file);
    const parsed = parseBackup(text);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.schemaVersion).toBe(1);
    expect(previewBackup(parsed.backup)).toMatchObject({
      firstDay: '2026-11-01',
      lastDay: '2026-11-02',
      registeredDays: 2,
    });
  });

  it('salvar e restaurar substituindo tudo', async () => {
    await seed();
    const text = serializeBackup(await exportAll(db));
    await saveDay('2026-11-04', { evacuated: true, bristol: 2 });
    await saveDay('2026-11-01', { evacuated: true, bristol: 7 });
    const parsed = parseBackup(text);
    if (!parsed.ok) throw new Error(parsed.error);
    await restoreReplace(parsed.backup, db);
    expect(await getDay('2026-11-04')).toBeUndefined();
    expect((await getDay('2026-11-01'))?.bristol).toBe(4);
    expect((await db.profile.get('me'))?.name).toBe('Ana');
    expect((await db.meta.get('meta'))?.unlocked).toBe(true);
    expect((await db.meta.get('meta'))?.onboardingDone).toBe(true);
  });

  it('restaurar juntando: por dia vence o updatedAt mais recente', async () => {
    await saveDay('2026-11-01', { evacuated: true, bristol: 3 });
    const backup = await exportAll(db);
    // Depois da cópia, o dia 01 muda aqui (mais novo) e o dia 05 é novo aqui.
    await new Promise((r) => setTimeout(r, 5));
    await saveDay('2026-11-01', { bristol: 5 });
    await saveDay('2026-11-05', { evacuated: false });
    // Na cópia, acrescenta um dia que não existe aqui e uma versão antiga do dia 01.
    const incoming = structuredClone(backup);
    (incoming.data.days as Record<string, unknown>[]).push({
      date: '2026-11-02',
      evacuated: true,
      bristol: 4,
      createdAt: '2026-11-02T10:00:00.000Z',
      updatedAt: '2026-11-02T10:00:00.000Z',
    });
    await restoreMerge(incoming, db);
    expect((await getDay('2026-11-01'))?.bristol).toBe(5);
    expect((await getDay('2026-11-02'))?.bristol).toBe(4);
    expect((await getDay('2026-11-05'))?.evacuated).toBe(false);
  });

  it('juntar traz a versão da cópia quando ela é mais nova', async () => {
    await saveDay('2026-11-01', { evacuated: true, bristol: 3 });
    const backup = await exportAll(db);
    const row = (backup.data.days as Record<string, unknown>[])[0]!;
    row.bristol = 6;
    row.updatedAt = '2999-01-01T00:00:00.000Z';
    await restoreMerge(backup, db);
    expect((await getDay('2026-11-01'))?.bristol).toBe(6);
  });

  it('recusa arquivos que não são cópia do app', () => {
    expect(parseBackup('isto não é json')).toMatchObject({ ok: false });
    expect(
      parseBackup('{"app":"outro","schemaVersion":1,"exportedAt":"x","data":{}}'),
    ).toMatchObject({ ok: false });
    const futura = JSON.stringify({
      app: 'modulacao-intestinal',
      schemaVersion: 99,
      exportedAt: 'x',
      data: {},
    });
    expect(parseBackup(futura)).toMatchObject({
      ok: false,
      error: expect.stringContaining('versão mais nova'),
    });
    const ruim = JSON.stringify({
      app: 'modulacao-intestinal',
      schemaVersion: 1,
      exportedAt: 'x',
      data: { days: [{ date: '03/11/2026', createdAt: 'x', updatedAt: 'x' }] },
    });
    expect(parseBackup(ruim)).toMatchObject({
      ok: false,
      error: expect.stringContaining('incompleta'),
    });
    const bristolRuim = JSON.stringify({
      app: 'modulacao-intestinal',
      schemaVersion: 1,
      exportedAt: 'x',
      data: { days: [{ date: '2026-11-03', bristol: 9, createdAt: 'x', updatedAt: 'x' }] },
    });
    expect(parseBackup(bristolRuim).ok).toBe(false);
  });

  it('aceita arquivo com marca BOM e campos desconhecidos', () => {
    const text =
      '﻿' +
      JSON.stringify({
        app: 'modulacao-intestinal',
        schemaVersion: 1,
        exportedAt: '2026-11-03T00:00:00.000Z',
        extra: true,
        data: {
          days: [
            { date: '2026-11-03', evacuated: true, futuro: 1, createdAt: 'x', updatedAt: 'x' },
          ],
        },
      });
    const p = parseBackup(text);
    expect(p.ok).toBe(true);
    if (p.ok) expect((p.backup.data.days?.[0] as Record<string, unknown>).futuro).toBe(1);
  });

  it('cópia de emergência lê direto do IndexedDB', async () => {
    await seed();
    db.close();
    const backup = await emergencyExport(db.name);
    expect(backup.app).toBe('modulacao-intestinal');
    expect(backup.schemaVersion).toBe(1);
    expect(backup.data.days).toHaveLength(3);
    const p = parseBackup(serializeBackup(backup));
    expect(p.ok).toBe(true);
    await db.open();
  });

  it('cópia de emergência de um banco vazio', async () => {
    const b = await emergencyExport(`vazio-${Math.random()}`);
    expect(b.data).toEqual({});
  });
});
