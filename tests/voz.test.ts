import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * Voz da interface (seções 8.1 e 10): varre o conteúdo e os textos da interface.
 * Exceção só com o comentário "voz-ok: motivo" na mesma linha ou na linha de cima.
 */

const ROOT = join(__dirname, '..');
const PASTAS = ['src', 'netlify/functions'];

function arquivos(dir: string): string[] {
  const out: string[] = [];
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) out.push(...arquivos(p));
    else if (/\.(tsx?|mjs)$/.test(nome) && !nome.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

interface Texto {
  arquivo: string;
  linha: number;
  texto: string;
}

function textosDoArquivo(arquivo: string): Texto[] {
  const fonte = readFileSync(arquivo, 'utf-8');
  const sf = ts.createSourceFile(
    arquivo,
    fonte,
    ts.ScriptTarget.Latest,
    true,
    arquivo.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const linhas = fonte.split('\n');
  const out: Texto[] = [];
  const add = (node: ts.Node, texto: string) => {
    const linha = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line;
    const atual = linhas[linha] ?? '';
    const anterior = linhas[linha - 1] ?? '';
    if (/voz-ok:/.test(atual) || /voz-ok:/.test(anterior)) return;
    out.push({ arquivo: relative(ROOT, arquivo), linha: linha + 1, texto });
  };
  const visitar = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const pai = node.parent;
      const ehChave = pai && ts.isPropertyAssignment(pai) && pai.name === node;
      const ehImport =
        pai && ts.isCallExpression(pai) && pai.expression.kind === ts.SyntaxKind.ImportKeyword;
      const ehTipo = pai && ts.isLiteralTypeNode(pai);
      if (!ehChave && !ehImport && !ehTipo) add(node, node.text);
    } else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      add(node, node.text);
    } else if (ts.isJsxText(node)) {
      if (node.text.trim()) add(node, node.text);
    }
    ts.forEachChild(node, visitar);
  };
  visitar(sf);
  return out;
}

const todos = PASTAS.flatMap((p) => arquivos(join(ROOT, p)));
const textos = todos.flatMap(textosDoArquivo);

function falhas(teste: (t: string) => boolean): string[] {
  return textos
    .filter((t) => teste(t.texto))
    .map((t) => `${t.arquivo}:${t.linha}  ${t.texto.trim().slice(0, 80)}`);
}

describe('voz da interface', () => {
  it('encontrou textos para conferir', () => {
    expect(textos.length).toBeGreaterThan(500);
  });

  it('sem travessão nem meia-risca em nenhum arquivo', () => {
    const ruins = todos
      .filter((a) => /[–—]/.test(readFileSync(a, 'utf-8')))
      .map((a) => relative(ROOT, a));
    expect(ruins).toEqual([]);
  });

  it('sem "seu", "sua", "seus" e "suas"', () => {
    expect(falhas((t) => /(^|[^\p{L}])(seu|sua|seus|suas)(?=$|[^\p{L}])/iu.test(t))).toEqual([]);
  });

  it('sem ponto de exclamação', () => {
    expect(falhas((t) => t.includes('!'))).toEqual([]);
  });

  it('sem emoji (o 🤍 só na tela de fim do curso, com voz-ok)', () => {
    expect(falhas((t) => /\p{Extended_Pictographic}/u.test(t))).toEqual([]);
  });

  it('sem "não é X, é Y" e "isso não é sobre"', () => {
    expect(
      falhas((t) => /\bnão é [^.,;!?]{1,40}, é\b/i.test(t) || /isso não é sobre/i.test(t)),
    ).toEqual([]);
  });

  it('sem termos em inglês e frases motivacionais prontas', () => {
    const proibidas =
      /(^|[^\p{L}])(backup|check-in|streak|dashboard|você consegue|acredite|jornada|transformação)(?=$|[^\p{L}])/iu;
    expect(falhas((t) => proibidas.test(t))).toEqual([]);
  });

  it('o index.html também segue as regras', () => {
    const html = readFileSync(join(ROOT, 'index.html'), 'utf-8');
    expect(html).not.toMatch(/[–—]/);
    expect(html.replace(/<!doctype html>/i, '')).not.toMatch(/!/);
  });
});
