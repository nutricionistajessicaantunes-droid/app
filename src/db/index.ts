import { DB_NAME, DB_NAME_DEMO } from '../config';
import { AppDB } from './schema';

/**
 * Uma única instância do banco por sessão. O modo demonstração (?demo=1) usa outro
 * banco e nunca mistura com os dados reais.
 */

const DEMO_KEY = 'modulacao:demo';
let current: AppDB | null = null;

function safeSession(): Storage | null {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
}

/** Decide se a sessão está em modo demonstração, a partir do endereço. */
export function resolveDemoFlag(search: string): boolean {
  const params = new URLSearchParams(search);
  const ss = safeSession();
  if (params.get('demo') === '1') {
    try {
      ss?.setItem(DEMO_KEY, '1');
    } catch {
      /* sem sessionStorage, vale só para esta página */
    }
    return true;
  }
  if (params.get('demo') === '0') {
    try {
      ss?.removeItem(DEMO_KEY);
    } catch {
      /* ignora */
    }
    return false;
  }
  try {
    return ss?.getItem(DEMO_KEY) === '1';
  } catch {
    return false;
  }
}

export function leaveDemo(): void {
  try {
    safeSession()?.removeItem(DEMO_KEY);
  } catch {
    /* ignora */
  }
}

export function openDb(demo: boolean): AppDB {
  const name = demo ? DB_NAME_DEMO : DB_NAME;
  if (current && current.name === name) return current;
  if (current) current.close();
  current = new AppDB(name);
  return current;
}

export function getDb(): AppDB {
  if (!current) current = new AppDB(DB_NAME);
  return current;
}

export function isDemoDb(): boolean {
  return getDb().name === DB_NAME_DEMO;
}

/** Só para testes: troca a instância. */
export function setDbForTests(db: AppDB | null): void {
  current = db;
}

/** Testa se o IndexedDB funciona neste navegador (no modo privado de alguns, não funciona). */
export async function checkIndexedDb(): Promise<boolean> {
  if (typeof indexedDB === 'undefined') return false;
  try {
    const db = getDb();
    await db.open();
    await db.meta.get('meta');
    return true;
  } catch {
    return false;
  }
}
