import { currentPlatformInput, detectPlatform, type PlatformInfo } from '../logic/platform';

let cached: PlatformInfo | null = null;

/** Plataforma deste aparelho, calculada uma vez por sessão. */
export function getPlatform(): PlatformInfo {
  if (!cached) cached = detectPlatform(currentPlatformInput());
  return cached;
}

/** Só para testes. */
export function setPlatformForTests(p: PlatformInfo | null): void {
  cached = p;
}
