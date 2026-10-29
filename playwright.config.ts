import { defineConfig, devices } from '@playwright/test';

/**
 * Testes ponta a ponta (seção 10): iPhone 13 e Pixel 7, com relógio simulado.
 * Rodam contra a versão de produção (`npm run build` antes), com a mesma política de
 * segurança da Netlify.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  expect: { timeout: 8_000 },
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4300',
    timezoneId: 'America/Sao_Paulo',
    locale: 'pt-BR',
    acceptDownloads: true,
  },
  webServer: {
    command: 'node scripts/servidor.mjs 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'iphone-13', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },
  ],
});
