import type { Theme } from '../types';

const KEY = 'modulacao:tema';

const BARRA = { claro: '#FAF5F3', escuro: '#1C0F14' };

function systemDark(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/** Aplica o tema: claro, escuro ou automático (segue o celular). */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'claro') root.dataset.theme = 'light';
  else if (theme === 'escuro') root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  const dark = theme === 'escuro' || (theme === 'auto' && systemDark());
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    if (theme === 'auto') {
      const media = m.getAttribute('media') ?? '';
      m.setAttribute('content', media.includes('dark') ? BARRA.escuro : BARRA.claro);
    } else {
      m.setAttribute('content', dark ? BARRA.escuro : BARRA.claro);
    }
  });
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* sem localStorage: o tema vale só nesta visita */
  }
}

/** Antes de desenhar a tela, para não piscar. */
export function applyInitialTheme(): void {
  let theme: Theme = 'auto';
  try {
    const t = localStorage.getItem(KEY);
    if (t === 'claro' || t === 'escuro' || t === 'auto') theme = t;
  } catch {
    /* ignora */
  }
  applyTheme(theme);
}
