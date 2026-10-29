import type { Page } from '@playwright/test';

/** Ajudantes dos testes ponta a ponta. */

export const HOJE = '2026-11-02';

/** Fixa o relógio do navegador (o app usa a data do aparelho). */
export async function setClock(page: Page, day: string, time = '20:00') {
  await page.clock.setFixedTime(new Date(`${day}T${time}:00-03:00`));
}

const STAMP = '2026-11-01T12:00:00.000Z';

export function profile(over: Record<string, unknown> = {}) {
  return {
    id: 'me',
    name: 'Ana',
    path: 'preso',
    careFlags: {},
    readingWeekday: 0,
    simpleMode: false,
    trackedSymptoms: ['estufamento', 'gases', 'dor'],
    showCycleTags: false,
    theme: 'auto',
    courseStage: 'plano',
    registerTime: '21:30',
    createdAt: STAMP,
    updatedAt: STAMP,
    ...over,
  };
}

export const META = {
  id: 'meta',
  schemaVersion: 1,
  unlocked: true,
  onboardingDone: true,
  installSkipped: true,
  installPromptDismissedAt: STAMP,
  lastBackupAt: STAMP,
};

export function day(date: string, data: Record<string, unknown> = {}) {
  return { date, createdAt: STAMP, updatedAt: STAMP, ...data };
}

type Stores = Partial<Record<string, Record<string, unknown>[]>>;

/** Escreve direto no banco do app (IndexedDB) e recarrega a página. */
export async function seed(page: Page, data: Stores, path = '/') {
  if (!page.url().startsWith('http')) {
    await page.goto('/?acesso=NAPRATICA');
    await page.waitForTimeout(600);
  }
  await page.evaluate(async (stores) => {
    const db: IDBDatabase = await new Promise((res, rej) => {
      const req = indexedDB.open('modulacao-intestinal');
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
    const names = Object.keys(stores);
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(names, 'readwrite');
      for (const n of names) for (const row of stores[n] ?? []) tx.objectStore(n).put(row);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    db.close();
  }, data);
  await page.goto(path);
  await page.waitForTimeout(500);
}

/** Lê uma tabela inteira do banco do app. */
export async function readStore<T = Record<string, unknown>>(
  page: Page,
  store: string,
): Promise<T[]> {
  return page.evaluate(async (name) => {
    const db: IDBDatabase = await new Promise((res, rej) => {
      const req = indexedDB.open('modulacao-intestinal');
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
    const rows = await new Promise<unknown[]>((res) => {
      const r = db.transaction(name).objectStore(name).getAll();
      r.onsuccess = () => res(r.result);
    });
    db.close();
    return rows;
  }, store) as Promise<T[]>;
}

export async function clearStore(page: Page, store: string) {
  await page.evaluate(async (name) => {
    const db: IDBDatabase = await new Promise((res) => {
      const req = indexedDB.open('modulacao-intestinal');
      req.onsuccess = () => res(req.result);
    });
    await new Promise<void>((res) => {
      const tx = db.transaction(name, 'readwrite');
      tx.objectStore(name).clear();
      tx.oncomplete = () => res();
    });
    db.close();
  }, store);
}

/** Toque no controle de 0 a 10, numa fração da largura. */
export async function tapSlider(page: Page, index: number, fraction: number) {
  const s = page.getByRole('slider').nth(index);
  await s.scrollIntoViewIfNeeded();
  const box = await s.boundingBox();
  if (!box) throw new Error('controle sem posição');
  await page.mouse.click(box.x + box.width * fraction, box.y + box.height / 2);
}
