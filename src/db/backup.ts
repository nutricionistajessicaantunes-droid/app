import { APP_VERSION } from '../config';
import { toDayKey } from '../logic/dates';
import type { DayKey } from '../types';
import { getDb } from './index';
import { nowIso } from './repo';
import { CURRENT_SCHEMA_VERSION, TABLES, type AppDB, type TableName } from './schema';

/**
 * Cópia de segurança (seção 3.3). O arquivo é JSON dentro de um .txt, porque o Chrome
 * do Android não compartilha .json pela Web Share API.
 */

export const BACKUP_APP_ID = 'modulacao-intestinal';

export interface BackupFile {
  app: string;
  schemaVersion: number;
  appVersion: string;
  exportedAt: string;
  data: Partial<Record<TableName, unknown[]>>;
}

export function backupFileName(day: DayKey): string {
  return `modulacao-copia-${day}.txt`;
}

// ---------------------------------------------------------------------------
// Exportar
// ---------------------------------------------------------------------------

export async function exportAll(db: AppDB = getDb()): Promise<BackupFile> {
  const data: Partial<Record<TableName, unknown[]>> = {};
  await db.transaction('r', db.tables, async () => {
    for (const t of TABLES) data[t] = await db.table(t).toArray();
  });
  return {
    app: BACKUP_APP_ID,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportedAt: nowIso(),
    data,
  };
}

/** Lê um arquivo como texto, com alternativa para navegadores sem Blob.text(). */
export function readFileText(file: Blob): Promise<string> {
  if (typeof file.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function serializeBackup(backup: BackupFile): string {
  return JSON.stringify(backup, null, 1);
}

export function backupToFile(backup: BackupFile, day: DayKey = toDayKey(new Date())): File {
  return new File([serializeBackup(backup)], backupFileName(day), { type: 'text/plain' });
}

/**
 * Cópia de emergência: lê direto do IndexedDB, sem Dexie e sem React, para funcionar
 * mesmo quando o app quebrou.
 */
export function emergencyExport(dbName: string): Promise<BackupFile> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const idb = req.result;
      const names = [...idb.objectStoreNames].filter((n) =>
        (TABLES as readonly string[]).includes(n),
      );
      const data: Partial<Record<TableName, unknown[]>> = {};
      if (names.length === 0) {
        idb.close();
        resolve({
          app: BACKUP_APP_ID,
          schemaVersion: CURRENT_SCHEMA_VERSION,
          appVersion: APP_VERSION,
          exportedAt: nowIso(),
          data,
        });
        return;
      }
      const tx = idb.transaction(names, 'readonly');
      for (const n of names) {
        const r = tx.objectStore(n).getAll();
        r.onsuccess = () => {
          data[n as TableName] = r.result as unknown[];
        };
      }
      tx.oncomplete = () => {
        idb.close();
        resolve({
          app: BACKUP_APP_ID,
          schemaVersion:
            idb.version > 0 ? Math.max(1, Math.round(idb.version / 10)) : CURRENT_SCHEMA_VERSION,
          appVersion: APP_VERSION,
          exportedAt: nowIso(),
          data,
        });
      };
      tx.onerror = () => {
        idb.close();
        reject(tx.error);
      };
    };
  });
}

// ---------------------------------------------------------------------------
// Compartilhar ou baixar
// ---------------------------------------------------------------------------

export type DeliverResult = 'compartilhado' | 'baixado' | 'cancelado';

export async function shareOrDownload(file: File, preferShare: boolean): Promise<DeliverResult> {
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (preferShare && typeof nav.share === 'function' && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: file.name });
      return 'compartilhado';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelado';
      // Outros erros: cai no download.
    }
  }
  downloadFile(file);
  return 'baixado';
}

export function downloadFile(file: Blob & { name?: string }, name?: string): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = name ?? file.name ?? 'arquivo.txt';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
