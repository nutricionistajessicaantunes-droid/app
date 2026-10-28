import { describe, expect, it } from 'vitest';
import { ACCESS_CODE_HASH } from '../../src/config';
import { hashCode, isCodeValid, normalizeCode, sha256Hex } from '../../src/logic/access';
import { detectPlatform } from '../../src/logic/platform';
import {
  normalizeFood,
  normalizeSearch,
  singularWord,
  splitFoods,
  stripAccents,
} from '../../src/logic/text';

describe('código de acesso', () => {
  it('normaliza: minúsculas, sem acento, sem espaços', () => {
    expect(normalizeCode(' Na Prática ')).toBe('napratica');
    expect(normalizeCode('NAPRATICA')).toBe('napratica');
  });

  it('o hash guardado é o de NAPRATICA', async () => {
    expect(await hashCode('NAPRATICA')).toBe(ACCESS_CODE_HASH);
    expect(await isCodeValid('na prática', ACCESS_CODE_HASH)).toBe(true);
    expect(await isCodeValid('outra', ACCESS_CODE_HASH)).toBe(false);
    expect(await isCodeValid('   ', ACCESS_CODE_HASH)).toBe(false);
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

const UA = {
  iphoneSafari:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  iphoneChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1',
  iphoneInstagram:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 334.0.4.32.98',
  iphoneFacebook:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.37.106]',
  iphoneWebView:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  androidChrome:
    'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  androidWebView:
    'Mozilla/5.0 (Linux; Android 14; SM-S911B Build/UP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.0.0 Mobile Safari/537.36',
  androidInstagram:
    'Mozilla/5.0 (Linux; Android 14; SM-S911B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.0.0 Mobile Safari/537.36 Instagram 334.0.0.42.95 Android',
  samsung:
    'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
  desktopChrome:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  ipadDesktop:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  firefoxAndroid: 'Mozilla/5.0 (Android 14; Mobile; rv:127.0) Gecko/127.0 Firefox/127.0',
  edgeDesktop:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
};

describe('plataforma', () => {
  it('iPhone no Safari', () => {
    expect(detectPlatform({ userAgent: UA.iphoneSafari, standalone: false })).toEqual({
      os: 'ios',
      browser: 'safari',
      standalone: false,
      inApp: false,
    });
  });

  it('iPhone no Chrome', () => {
    expect(detectPlatform({ userAgent: UA.iphoneChrome, standalone: false })).toMatchObject({
      os: 'ios',
      browser: 'chrome',
      inApp: false,
    });
  });

  it('Instagram e Facebook no iPhone são navegador de outro app', () => {
    expect(detectPlatform({ userAgent: UA.iphoneInstagram, standalone: false })).toMatchObject({
      inApp: true,
      inAppName: 'Instagram',
    });
    expect(detectPlatform({ userAgent: UA.iphoneFacebook, standalone: false })).toMatchObject({
      inApp: true,
      inAppName: 'Facebook',
    });
    expect(detectPlatform({ userAgent: UA.iphoneWebView, standalone: false })).toMatchObject({
      inApp: true,
      browser: 'outro',
    });
  });

  it('o app instalado no iPhone também não tem "Safari", mas não cai na tela de outro app', () => {
    expect(detectPlatform({ userAgent: UA.iphoneWebView, standalone: true })).toMatchObject({
      inApp: false,
      standalone: true,
    });
  });

  it('Android', () => {
    expect(detectPlatform({ userAgent: UA.androidChrome, standalone: false })).toMatchObject({
      os: 'android',
      browser: 'chrome',
      inApp: false,
    });
    expect(detectPlatform({ userAgent: UA.androidWebView, standalone: false })).toMatchObject({
      inApp: true,
    });
    expect(detectPlatform({ userAgent: UA.androidInstagram, standalone: false })).toMatchObject({
      inApp: true,
      inAppName: 'Instagram',
    });
    expect(detectPlatform({ userAgent: UA.samsung, standalone: false })).toMatchObject({
      browser: 'samsung',
      inApp: false,
    });
    expect(detectPlatform({ userAgent: UA.firefoxAndroid, standalone: false })).toMatchObject({
      browser: 'firefox',
      os: 'android',
    });
  });

  it('computador e iPad no modo computador', () => {
    expect(detectPlatform({ userAgent: UA.desktopChrome, standalone: false })).toMatchObject({
      os: 'outro',
      browser: 'chrome',
      inApp: false,
    });
    expect(detectPlatform({ userAgent: UA.edgeDesktop, standalone: false })).toMatchObject({
      browser: 'edge',
    });
    expect(
      detectPlatform({ userAgent: UA.ipadDesktop, standalone: false, maxTouchPoints: 5 }),
    ).toMatchObject({ os: 'ios', browser: 'safari' });
    expect(
      detectPlatform({ userAgent: UA.ipadDesktop, standalone: false, maxTouchPoints: 0 }),
    ).toMatchObject({ os: 'outro' });
  });
});

describe('texto', () => {
  it('normaliza alimentos com acento, maiúsculas e plural', () => {
    expect(normalizeFood('Maçãs')).toBe(normalizeFood('maçã'));
    expect(normalizeFood('Grão-de-Bico')).toBe(normalizeFood('grão de bico'));
    expect(normalizeFood('feijões')).toBe('feijao');
    expect(normalizeFood('pães')).toBe('pao');
    expect(normalizeFood('Ovos')).toBe('ovo');
    expect(normalizeFood('nozes')).toBe('noz');
    expect(normalizeFood('pastéis')).toBe('pastel');
    expect(normalizeFood('cereais')).toBe('cereal');
    expect(normalizeFood('lençóis')).toBe('lencol');
    expect(normalizeFood('atuns')).toBe('atum');
    expect(normalizeFood('  arroz  ')).toBe('arroz');
    expect(normalizeFood('!!!')).toBe('');
    expect(singularWord('gás')).toBe('gás');
  });

  it('separa o que comi antes', () => {
    expect(splitFoods('café, pão e manteiga; tomate')).toEqual([
      'café',
      'pão',
      'manteiga',
      'tomate',
    ]);
    expect(splitFoods(' ')).toEqual([]);
  });

  it('busca simples', () => {
    expect(normalizeSearch('  Maçã   Verde ')).toBe('maca verde');
    expect(stripAccents('ação')).toBe('acao');
  });
});
