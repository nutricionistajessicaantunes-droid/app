import { useCallback, useEffect, useRef, useState } from 'react';
import { saveDay } from '../../db/repo';
import type { DayKey, DayRecord } from '../../types';

const DEBOUNCE_MS = 300;

export type DayDraft = Omit<DayRecord, 'createdAt' | 'updatedAt'> &
  Partial<Pick<DayRecord, 'createdAt' | 'updatedAt'>>;

/** Aplica um patch; chave com valor undefined some do registro. */
export function applyPatch(base: DayDraft, patch: Partial<DayRecord>): DayDraft {
  const next = { ...base, ...patch } as DayDraft;
  for (const k of Object.keys(patch) as (keyof DayRecord)[]) {
    if (patch[k] === undefined) delete (next as Record<string, unknown>)[k];
  }
  return next;
}

/**
 * Rascunho do registro do dia com salvamento automático (seção 3.3): cada alteração
 * grava em até 300 ms, sem botão de salvar. Grava na hora ao sair da tela, ao trocar de
 * dia e quando o app vai para o fundo.
 */
export function useDayDraft(date: DayKey, stored: DayRecord | null | undefined) {
  const [draft, setDraft] = useState<DayDraft | null>(null);
  const [savedAt, setSavedAt] = useState(0);
  const pending = useRef<Partial<DayRecord>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateRef = useRef(date);
  const loadedFor = useRef<DayKey | null>(null);

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const patch = pending.current;
    pending.current = {};
    if (Object.keys(patch).length === 0) return;
    await saveDay(dateRef.current, patch);
    setSavedAt(Date.now());
  }, []);

  // Troca de dia: grava o que faltou do dia anterior antes de carregar o novo.
  useEffect(() => {
    if (dateRef.current !== date) {
      void flush();
      dateRef.current = date;
      loadedFor.current = null;
      setDraft(null);
    }
  }, [date, flush]);

  useEffect(() => {
    if (stored === undefined || loadedFor.current === date) return;
    loadedFor.current = date;
    setDraft(stored ? { ...stored } : { date });
  }, [stored, date]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void flush();
    };
    const onPageHide = () => void flush();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onPageHide);
      void flush();
    };
  }, [flush]);

  const update = useCallback(
    (patch: Partial<DayRecord>) => {
      setDraft((cur) => (cur ? applyPatch(cur, patch) : cur));
      pending.current = { ...pending.current, ...patch };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), DEBOUNCE_MS);
    },
    [flush],
  );

  return { draft, update, flush, savedAt };
}

/** Mostra "Salvo" por alguns segundos depois de cada gravação. */
export function useSavedFlash(savedAt: number, ms = 2200): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!savedAt) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), ms);
    return () => clearTimeout(t);
  }, [savedAt, ms]);
  return visible;
}
