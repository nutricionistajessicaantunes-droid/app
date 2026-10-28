/**
 * Servidor local para testes: serve a pasta dist como a Netlify serviria
 * (rotas caem no index.html e os cabeçalhos de segurança do netlify.toml valem).
 * Uso: node scripts/servidor.mjs [porta]
 */
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const porta = Number(process.argv[2] ?? 4173);
const raiz = new URL('../dist/', import.meta.url).pathname;
const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf-8');
const csp = /Content-Security-Policy = "([^"]+)"/.exec(toml)?.[1] ?? '';

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
  '.ttf': 'font/ttf',
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${porta}`);
  let caminho = normalize(join(raiz, decodeURIComponent(url.pathname)));
  if (!caminho.startsWith(raiz)) caminho = join(raiz, 'index.html');
  if (!existsSync(caminho) || statSync(caminho).isDirectory()) caminho = join(raiz, 'index.html');
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', tipos[extname(caminho)] ?? 'application/octet-stream');
  res.end(readFileSync(caminho));
}).listen(porta, () => console.log(`Servindo dist em http://localhost:${porta}`));
