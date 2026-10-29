/**
 * Servidor local para testes: serve a pasta dist como a Netlify serviria
 * (rotas caem no index.html e os cabeçalhos de segurança do netlify.toml valem).
 * Os arquivos de texto saem comprimidos (brotli ou gzip), como na Netlify.
 * Uso: node scripts/servidor.mjs [porta]
 */
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

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

const TEXTO = new Set(['.html', '.js', '.css', '.svg', '.webmanifest', '.json']);
const cache = new Map();
function comprimido(caminho, corpo, tipo) {
  const chave = `${tipo}:${caminho}`;
  if (!cache.has(chave)) cache.set(chave, tipo === 'br' ? brotliCompressSync(corpo) : gzipSync(corpo));
  return cache.get(chave);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${porta}`);
  let caminho = normalize(join(raiz, decodeURIComponent(url.pathname)));
  if (!caminho.startsWith(raiz)) caminho = join(raiz, 'index.html');
  if (!existsSync(caminho) || statSync(caminho).isDirectory()) caminho = join(raiz, 'index.html');
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const ext = extname(caminho);
  res.setHeader('Content-Type', tipos[ext] ?? 'application/octet-stream');
  const corpo = readFileSync(caminho);
  const aceita = String(req.headers['accept-encoding'] ?? '');
  if (TEXTO.has(ext) && /\bbr\b/.test(aceita)) {
    res.setHeader('Content-Encoding', 'br');
    res.setHeader('Vary', 'Accept-Encoding');
    res.end(comprimido(caminho, corpo, 'br'));
  } else if (TEXTO.has(ext) && /gzip/.test(aceita)) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');
    res.end(comprimido(caminho, corpo, 'gzip'));
  } else res.end(corpo);
}).listen(porta, () => console.log(`Servindo dist em http://localhost:${porta}`));
