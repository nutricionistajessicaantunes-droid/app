import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setDbForTests } from '../../src/db/index';
import { getDay } from '../../src/db/repo';
import { AppDB } from '../../src/db/schema';
import { useDayDraft } from '../../src/features/registro/useDayDraft';

let db: AppDB;

beforeEach(() => {
  db = new AppDB(`autosave-${Math.random()}`);
  setDbForTests(db);
});

afterEach(async () => {
  await db.delete();
  setDbForTests(null);
});

describe('salvamento automático do registro', () => {
  it('grava em 300 ms, juntando as alterações, sem botão de salvar', async () => {
    const { result } = renderHook(({ stored }) => useDayDraft('2026-11-03', stored), {
      initialProps: { stored: null as null },
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.draft).toEqual({ date: '2026-11-03' });

    act(() => {
      result.current.update({ evacuated: true });
      result.current.update({ bristol: 4 });
    });
    expect(result.current.draft).toMatchObject({ evacuated: true, bristol: 4 });
    // Antes dos 300 ms, ainda não gravou.
    await new Promise((r) => setTimeout(r, 100));
    expect(await getDay('2026-11-03')).toBeUndefined();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350));
    });
    await vi.waitFor(async () => {
      expect(await getDay('2026-11-03')).toMatchObject({ evacuated: true, bristol: 4 });
    });
    expect(result.current.savedAt).toBeGreaterThan(0);
  });

  it('grava na hora ao sair da tela', async () => {
    const { result, unmount } = renderHook(() => useDayDraft('2026-11-04', null));
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      result.current.update({ evacuated: false, note: 'dia corrido' });
    });
    unmount();
    await vi.waitFor(async () => {
      expect(await getDay('2026-11-04')).toMatchObject({ evacuated: false, note: 'dia corrido' });
    });
  });

  it('apagar um campo remove do registro', async () => {
    const { result } = renderHook(() => useDayDraft('2026-11-05', null));
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      result.current.update({ effort: true });
    });
    await act(async () => {
      await result.current.flush();
    });
    act(() => {
      result.current.update({ effort: undefined });
    });
    await act(async () => {
      await result.current.flush();
    });
    const r = await getDay('2026-11-05');
    expect(r && 'effort' in r).toBe(false);
  });

  it('grava quando o app vai para o fundo', async () => {
    const { result } = renderHook(() => useDayDraft('2026-11-06', null));
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      result.current.update({ energy: 6 });
    });
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.waitFor(async () => {
      expect((await getDay('2026-11-06'))?.energy).toBe(6);
    });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  });
});
