/**
 * Detecção de plataforma para instalação (seção 3.4). Função pura: recebe os dados
 * do navegador e devolve a situação. Ver src/features/instalacao.
 */

export type OS = 'ios' | 'android' | 'outro';
export type Browser = 'safari' | 'chrome' | 'samsung' | 'firefox' | 'edge' | 'outro';

export interface PlatformInput {
  userAgent: string;
  /** navigator.standalone (iPhone) ou display-mode: standalone. */
  standalone: boolean;
  maxTouchPoints?: number;
}

export interface PlatformInfo {
  os: OS;
  browser: Browser;
  standalone: boolean;
  /** Navegador dentro de outro app (Instagram, Facebook, WebView). */
  inApp: boolean;
  inAppName?: string;
}

const IN_APP_TOKENS: [RegExp, string][] = [
  [/Instagram/i, 'Instagram'],
  [/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i, 'Facebook'],
  [/Messenger/i, 'Messenger'],
  [/Line\//i, 'Line'],
  [/TikTok|musical_ly|BytedanceWebview/i, 'TikTok'],
  [/Kiwify/i, 'Kiwify'],
  [/Snapchat/i, 'Snapchat'],
  [/Pinterest/i, 'Pinterest'],
  [/Twitter/i, 'Twitter'],
  [/WhatsApp/i, 'WhatsApp'],
  [/GSA\//i, 'Google'],
];

export function detectPlatform({
  userAgent: ua,
  standalone,
  maxTouchPoints = 0,
}: PlatformInput): PlatformInfo {
  const isIPadDesktop = /Macintosh/.test(ua) && maxTouchPoints > 1;
  const os: OS =
    /iPhone|iPad|iPod/.test(ua) || isIPadDesktop ? 'ios' : /Android/.test(ua) ? 'android' : 'outro';

  let browser: Browser = 'outro';
  if (/SamsungBrowser/.test(ua)) browser = 'samsung';
  else if (/EdgA|EdgiOS|Edg\//.test(ua)) browser = 'edge';
  else if (/FxiOS|Firefox\//.test(ua)) browser = 'firefox';
  else if (/CriOS/.test(ua)) browser = 'chrome';
  else if (/Chrome\//.test(ua) && !/OPR\//.test(ua)) browser = 'chrome';
  else if (/Safari\//.test(ua)) browser = 'safari';

  // O app instalado nunca é "navegador de outro app" (no iPhone ele também não tem "Safari").
  if (standalone) return { os, browser, standalone: true, inApp: false };

  let inApp = false;
  let inAppName: string | undefined;
  for (const [re, name] of IN_APP_TOKENS) {
    if (re.test(ua)) {
      inApp = true;
      inAppName = name;
      break;
    }
  }
  if (!inApp && os === 'android' && /; wv\)/.test(ua)) inApp = true;
  if (!inApp && os === 'ios' && !/Safari\//.test(ua)) inApp = true;
  if (inApp) browser = 'outro';

  return inAppName
    ? { os, browser, standalone: false, inApp, inAppName }
    : { os, browser, standalone: false, inApp };
}

/** Lê os dados do navegador atual. */
export function currentPlatformInput(): PlatformInput {
  const nav = navigator as Navigator & { standalone?: boolean };
  const standalone =
    nav.standalone === true ||
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches);
  return { userAgent: nav.userAgent, standalone, maxTouchPoints: nav.maxTouchPoints ?? 0 };
}
