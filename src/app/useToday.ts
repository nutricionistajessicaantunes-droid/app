import { useSyncExternalStore } from 'react';
import { toDayKey } from '../logic/dates';
import type { DayKey } from '../types';

/**
 * O dia de hoje (fuso do aparelho), atualizado na virada do dia e quando o app volta
 * para a frente.
 */
let current: DayKey = toDayKey(new Date());
const listeners = new Set<() => void>();
let started = false;

function refresh() {
  const next = toDayKey(new Date());
  if (next !== current) {
    current = next;
    listeners.forEach((l) => l());
  }
}

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.setInterval(refresh, 30_000);
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('focus', refresh);
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useToday(): DayKey {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  );
}

/** Para testes e para o relógio simulado: força a releitura. */
export function refreshToday(): void {
  refresh();
}
