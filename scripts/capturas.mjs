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

// Telas da Fase 2. Com SO_NOVAS=1, só estas (para economizar tempo).
const TELAS_PLANO = [
  ['12-plano-de-21-dias', '/plano'],
  ['13-leitura-da-semana', '/leitura?manual=1'],
  ['14-tarefa-em-andamento', '/aula/11'],
  ['15-registro-com-tarefa', '/registro'],
  ['16-semana-zero', '/plano/semana-zero'],
];
const TELAS_COMPLETO = [
  ['17-reavaliacao', '/plano/reavaliacao'],
  ['18-fim-do-curso', '/fim'],
  ['19-plano-minimo', '/plano/minimo'],
  ['20-hoje-manutencao', '/'],
];
const SO_NOVAS = process.env.SO_NOVAS === '1';
const SO_FASE3 = process.env.SO_FASE3 === '1';
// Telas da Fase 3 (cenário completo). Cada item: nome, rota e o texto até onde rolar.
const TELAS_FASE3 = [
  ['23-resultados-graficos', '/resultados', 'Tipo de Bristol por dia'],
  ['24-resultados-historico', '/resultados', 'Histórico'],
  ['25-ficha-para-a-consulta', '/ficha', null],
  ['26-protocolo-low-fodmap', '/fodmap', 'Fase 2'],
  ['27-meu-dia-de-fibras', '/guia/fibras', 'Meu dia de fibras'],
  ['28-respiracao', '/guia/rotina', 'Respiração antes de comer'],
];
const erros = [];
const vigiar = (page) => {
  page.on('pageerror', (e) => erros.push(`${page.url()}: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && erros.push(`${page.url()}: ${m.text()}`));
};

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

    let ctx;
    let page;
    if (!SO_NOVAS && !SO_FASE3) {
    // Primeira vez: código de acesso e guia de instalação no iPhone.
    ctx = await browser.newContext({ ...base, userAgent: UA_IPHONE });
    page = await ctx.newPage();
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

    if (SO_FASE3) {
      ctx = await browser.newContext({ ...base, userAgent: UA_ANDROID });
      page = await ctx.newPage();
      vigiar(page);
      await page.goto(`${BASE}/?demo=1`);
      await page.waitForTimeout(1200);
      for (const [nome, rota, rolar] of TELAS_FASE3) {
        await page.goto(`${BASE}${rota}`);
        await page.waitForTimeout(800);
        if (rolar) {
          await page.getByText(rolar, { exact: false }).first().scrollIntoViewIfNeeded();
          await page.evaluate(() => window.scrollBy(0, -90));
          await page.waitForTimeout(300);
        }
        await page.screenshot({ path: `${PASTA}/${nome}-${tema}.png` });
      }
      await page.goto(`${BASE}/guia`);
      await page.waitForTimeout(600);
      await page.getByLabel('Procurar no Guia').fill('maçã');
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${PASTA}/29-busca-no-guia-${tema}.png` });
      await ctx.close();
      continue;
    }

    // Fase 2: plano em andamento.
    ctx = await browser.newContext({ ...base, userAgent: UA_ANDROID });
    page = await ctx.newPage();
    vigiar(page);
    await page.goto(`${BASE}/?demo=plano`);
    await page.waitForTimeout(1200);
    for (const [nome, rota] of TELAS_PLANO) {
      await page.goto(`${BASE}${rota}`);
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${PASTA}/${nome}-${tema}.png` });
    }
    // Modo crise ligado.
    await page.goto(`${BASE}/crise`);
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: 'Estou com diarreia agora' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${PASTA}/21-modo-crise-${tema}.png` });
    await page.goto(`${BASE}/`);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${PASTA}/22-hoje-com-crise-${tema}.png` });
    await ctx.close();

    // Fase 2: plano concluído (reavaliação, fim do curso, plano mínimo).
    ctx = await browser.newContext({ ...base, userAgent: UA_ANDROID });
    page = await ctx.newPage();
    vigiar(page);
    await page.goto(`${BASE}/?demo=1`);
    await page.waitForTimeout(1200);
    for (const [nome, rota] of TELAS_COMPLETO) {
      await page.goto(`${BASE}${rota}`);
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${PASTA}/${nome}-${tema}.png` });
    }
    await ctx.close();
  }
  if (erros.length > 0) {
    console.log('Erros no console:');
    for (const e of [...new Set(erros)]) console.log(`  ${e}`);
  } else console.log('Nenhum erro no console.');
  console.log(`Capturas salvas em ${PASTA}`);
} finally {
  await browser.close();
  servidor.kill();
}
