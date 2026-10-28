/**
 * Imprime o hash SHA-256 de um novo código de acesso.
 * Uso: npm run gerar-codigo -- PALAVRA
 * Depois, cole o resultado em ACCESS_CODE_HASH, no arquivo src/config.ts.
 */
import { createHash } from 'node:crypto';

const palavra = process.argv.slice(2).join(' ');
if (!palavra.trim()) {
  console.error('Escreva o código depois de --. Exemplo: npm run gerar-codigo -- NAPRATICA');
  process.exit(1);
}

const normalizado = palavra.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '');

const hash = createHash('sha256').update(normalizado).digest('hex');
console.log(`Código: ${palavra}`);
console.log(`Normalizado: ${normalizado}`);
console.log(`Hash (cole em ACCESS_CODE_HASH no src/config.ts):`);
console.log(hash);
