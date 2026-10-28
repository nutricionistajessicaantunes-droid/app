import Dexie from 'dexie';
import { describe, expect, it } from 'vitest';
import { AppDB, CURRENT_SCHEMA_VERSION, SCHEMA_HISTORY } from '../../src/db/schema';

/**
 * Para cada versão antiga do esquema: cria o banco como o app daquela versão criaria,
 * grava dados, fecha, abre com o app atual e confere que os dados continuam lá.
 */
describe('migrações do banco', () => {
  for (const step of SCHEMA_HISTORY) {
    it(`dados criados na versão ${step.version} continuam depois de abrir na versão ${CURRENT_SCHEMA_VERSION}`, async () => {
      const name = `migracao-${step.version}-${Math.random()}`;
      const old = new Dexie(name);
      for (const s of SCHEMA_HISTORY.filter((x) => x.version <= step.version)) {
        old.version(s.version).stores(s.stores);
      }
      await old.open();
      const stamp = '2026-11-03T12:00:00.000Z';
      await old
        .table('days')
        .put({
          date: '2026-11-03',
          evacuated: true,
          bristol: 4,
          createdAt: stamp,
          updatedAt: stamp,
        });
      await old
        .table('profile')
        .put({ id: 'me', path: 'preso', name: 'Ana', createdAt: stamp, updatedAt: stamp });
      await old.table('meta').put({ id: 'meta', schemaVersion: step.version, unlocked: true });
      old.close();

      const db = new AppDB(name);
      await db.open();
      expect(db.verno).toBe(CURRENT_SCHEMA_VERSION);
      expect(await db.days.get('2026-11-03')).toMatchObject({ evacuated: true, bristol: 4 });
      expect(await db.profile.get('me')).toMatchObject({ path: 'preso', name: 'Ana' });
      expect(await db.meta.get('meta')).toMatchObject({ unlocked: true });
      await db.delete();
    });
  }

  it('as versões do histórico são crescentes e a atual é a última', () => {
    const versions = SCHEMA_HISTORY.map((s) => s.version);
    expect([...versions].sort((a, b) => a - b)).toEqual(versions);
    expect(CURRENT_SCHEMA_VERSION).toBe(versions[versions.length - 1]);
  });
});
