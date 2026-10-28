import { useSyncExternalStore } from 'react';

/** Evento do Chrome no Android e no computador que permite o botão "Instalar o app". */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
let snapshot = { canPrompt: false, installed: false };

function notify() {
  snapshot = { canPrompt: deferred !== null, installed };
  listeners.forEach((l) => l());
}

export function initInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    notify();
  });
}

export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferred) return 'unavailable';
  const ev = deferred;
  deferred = null;
  notify();
  await ev.prompt();
  const choice = await ev.userChoice;
  if (choice.outcome === 'accepted') {
    installed = true;
    notify();
  }
  return choice.outcome;
}

export function useInstallPrompt(): { canPrompt: boolean; installed: boolean } {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => snapshot,
    () => snapshot,
  );
}
