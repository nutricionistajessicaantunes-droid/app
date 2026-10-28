/**
 * Gera as capturas das telas principais em docs/telas (390 x 844, tema claro e escuro).
 * Antes, rode npm run build. Uso: npm run capturas
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const PORTA = 4199;
const BASE = `http://localhost:${PORTA}`;
const PASTA = 'docs/telas';
mkdirSync(PASTA, { recursive: true });

const UA_IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const UA_ANDROID =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

const servidor = spawn(process.execPath, ['scripts/servidor.mjs', String(PORTA)], {
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 800));

function hojeMenos(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const TELAS_DEMO = [
  ['04-hoje', '/'],
  ['05-registro', `/registro/${hojeMenos(1)}`],
  ['06-escala-de-bristol', '/guia/bristol'],
  ['07-caminho', '/caminho'],
  ['08-aula', '/aula/3'],
  ['09-resultados', '/resultados'],
  ['10-guia', '/guia'],
  ['11-ajustes', '/ajustes'],
];

const browser = await chromium.launch();
try {
  for (const [tema, scheme] of [
    ['claro', 'light'],
    ['escuro', 'dark'],
  ]) {
    const base = {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      colorScheme: scheme,
    };

    // Primeira vez: código de acesso e guia de instalação no iPhone.
    let ctx = await browser.newContext({ ...base, userAgent: UA_IPHONE });
    let page = await ctx.newPage();
    await page.goto(`${BASE}/`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${PASTA}/01-codigo-de-acesso-${tema}.png` });
    await page.goto(`${BASE}/?acesso=NAPRATICA`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${PASTA}/02-instalar-no-iphone-${tema}.png` });
    await ctx.close();

    // Boas-vindas (Android, depois de "Agora não").
    ctx = await browser.newContext({ ...base, userAgent: UA_ANDROID });
    page = await ctx.newPage();
    await page.goto(`${BASE}/?acesso=NAPRATICA`);
    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Agora não' }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${PASTA}/03-boas-vindas-${tema}.png` });
    await ctx.close();

    // Telas com dados de demonstração (plano em andamento).
    ctx = await browser.newContext({ ...base, userAgent: UA_ANDROID });
    page = await ctx.newPage();
    await page.goto(`${BASE}/?demo=plano`);
    await page.waitForTimeout(1200);
    for (const [nome, rota] of TELAS_DEMO) {
      await page.goto(`${BASE}${rota}`);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${PASTA}/${nome}-${tema}.png` });
    }
    await ctx.close();
  }
  console.log(`Capturas salvas em ${PASTA}`);
} finally {
  await browser.close();
  servidor.kill();
}
