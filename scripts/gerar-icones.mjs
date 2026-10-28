/**
 * Gera os ícones PNG do app a partir do desenho em scripts/icone.svg, usando o
 * Chromium do Playwright. Rode com: npm run gerar-icones
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const svg = readFileSync(new URL('./icone.svg', import.meta.url), 'utf-8');

// Versão maskable: o traço ocupa a área segura central (80%).
const maskable = svg
  .replace('<path ', '<g transform="translate(256 256) scale(0.78) translate(-256 -256)"><path ')
  .replace('/>\n</svg>', '/></g>\n</svg>');

const alvos = [
  { arquivo: 'public/icons/icon-192.png', tamanho: 192, fonte: svg },
  { arquivo: 'public/icons/icon-512.png', tamanho: 512, fonte: svg },
  { arquivo: 'public/icons/icon-maskable-512.png', tamanho: 512, fonte: maskable },
  { arquivo: 'public/icons/apple-touch-icon.png', tamanho: 180, fonte: svg },
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const { arquivo, tamanho, fonte } of alvos) {
  await page.setViewportSize({ width: tamanho, height: tamanho });
  await page.setContent(
    `<html><body style="margin:0;background:#6E2B3D">${fonte.replace('<svg ', `<svg width="${tamanho}" height="${tamanho}" `)}</body></html>`,
  );
  const png = await page.screenshot({ type: 'png', omitBackground: false });
  writeFileSync(arquivo, png);
  console.log('gerado', arquivo);
}
await browser.close();
