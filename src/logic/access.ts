import { stripAccents } from './text';

/** Código normalizado: minúsculas, sem acento, sem espaços (seção 3.5). */
export function normalizeCode(code: string): string {
  return stripAccents(code.toLowerCase()).replace(/\s+/g, '');
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

export async function hashCode(code: string): Promise<string> {
  return sha256Hex(normalizeCode(code));
}

export async function isCodeValid(code: string, expectedHash: string): Promise<boolean> {
  if (!code.trim()) return false;
  return (await hashCode(code)) === expectedHash.toLowerCase();
}
