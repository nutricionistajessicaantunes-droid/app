import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CARDAPIOS } from '../../src/content/cardapios';
import {
  INGREDIENTES,
  QUALQUER_FRUTA,
  QUALQUER_VEGETAL,
  RECEITAS,
  RECEITAS_FODMAP,
} from '../../src/content/refeicoes';
import { classifyFood } from '../../src/logic/fodmapLookup';
import {
  NO_FILTERS,
  checkDay,
  cleanPantry,
  lowFodmapReason,
  matchRecipes,
  menuForPath,
  missingReqs,
  recipeById,
  recipeFits,
  recipeTags,
  reqLabel,
  shoppingSuggestions,
} from '../../src/logic/meals';

const set = (...ids: string[]) => new Set(ids);

describe('conteúdo das refeições', () => {
  it('ids de receita únicos e ingredientes que existem', () => {
    const ids = RECEITAS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    const known = new Set([...INGREDIENTES.map((i) => i.id), QUALQUER_VEGETAL, QUALQUER_FRUTA]);
    for (const r of RECEITAS) {
      expect(r.usa.length, r.id).toBeGreaterThan(0);
      for (const req of r.usa) {
        for (const id of Array.isArray(req) ? req : [req])
          expect(known.has(id), `${r.id}: ${id}`).toBe(true);
      }
    }
  });

  it('sem calorias, macronutrientes nem whey no conteúdo', () => {
    const fonte = readFileSync(join(__dirname, '../../src/content/refeicoes.ts'), 'utf-8');
    const semComentarios = fonte.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    expect(semComentarios).not.toMatch(/kcal|carbo:|gordura:|scoop|cream cheese|light\b/i);
    expect(semComentarios.replace(/O whey saiu[^']*'|whey que[^']*'|SEM_WHEY/g, '')).not.toMatch(
      /\bwhey\b/i,
    );
  });

  it('traz todas as opções dos cardápios preso, gases e refluxo', () => {
    for (const id of ['preso', 'gases', 'refluxo'] as const) {
      const menu = CARDAPIOS.find((m) => m.id === id);
      const esperado = (menu?.refeicoes.slice(0, 5) ?? []).reduce((s, m) => s + m.opcoes.length, 0);
      expect(RECEITAS.filter((r) => r.fonte === id)).toHaveLength(esperado);
    }
    expect(RECEITAS_FODMAP).toHaveLength(19);
    expect(RECEITAS.filter((r) => r.fonte === 'biblioteca').length).toBeGreaterThan(100);
  });

  it('a classificação de FODMAP dos ingredientes bate com a lista do curso', () => {
    // A tabela das receitas baixo FODMAP põe "sucos de fruta" no alto teor.
    const excecoes = new Set(['suco_laranja']);
    for (const i of INGREDIENTES) {
      if (excecoes.has(i.id)) continue;
      const e = classifyFood(i.nome.split(' (')[0] ?? i.nome);
      if (!e || i.fodmap === 'fora') continue;
      const nivel = e.level === 'livre' ? 'baixo' : e.level;
      expect(nivel, i.nome).toBe(i.fodmap);
    }
  });

  it('as receitas baixo FODMAP passam no filtro baixo FODMAP', () => {
    for (const r of RECEITAS_FODMAP) expect(recipeTags(r).baixoFodmap, r.id).toBe(true);
    for (const r of RECEITAS.filter((x) => x.fonte === 'gases'))
      expect(recipeTags(r).baixoFodmap, r.id).toBe(true);
  });
});

describe('o que eu tenho em casa', () => {
  it('receita completa, falta pouco e as outras', () => {
    const r = matchRecipes(set('tapioca', 'ovo', 'queijo_minas'), NO_FILTERS, { kind: 'cafe' });
    expect(r.ready.map((m) => m.recipe.id)).toContain('b-tapioca-com-ovo-e-queijo-minas');
    const romeu = r.almost.find((m) => m.recipe.id === 'b-tapioca-romeu-e-julieta');
    expect(romeu?.missing).toEqual(['goiabada']);
    expect(r.others.every((m) => m.missing.length > 2)).toBe(true);
  });

  it('café e lanche se trocam, almoço e jantar também', () => {
    const r = matchRecipes(set(), NO_FILTERS, { kind: 'cafe' });
    const kinds = new Set([...r.ready, ...r.almost, ...r.others].map((m) => m.recipe.refeicao));
    expect([...kinds].sort()).toEqual(['cafe', 'lanche']);
  });

  it('linha com alternativas e qualquer verdura', () => {
    const pizza = recipeById('b-pizza-de-tortilha-com-atum-ou-sardinha');
    expect(pizza).toBeDefined();
    if (!pizza) return;
    expect(missingReqs(pizza, set('tortilha', 'sardinha', 'tomate'), NO_FILTERS)).toEqual([]);
    const escondidinho = recipeById('b-escondidinho-de-carne-moida');
    if (!escondidinho) throw new Error('faltou receita');
    expect(missingReqs(escondidinho, set('batata', 'carne_moida', 'couve'), NO_FILTERS)).toEqual(
      [],
    );
    expect(reqLabel(['atum', 'sardinha'])).toBe('atum em lata ou sardinha em lata');
    expect(reqLabel(QUALQUER_VEGETAL)).toBe('uma verdura ou legume');
  });

  it('filtros: lactose, glúten, vegetariano e baixo FODMAP', () => {
    const vit = recipeById('b-vitamina-de-morango');
    if (!vit) throw new Error('faltou receita');
    expect(recipeFits(vit, { ...NO_FILTERS, semLactose: true })).toBe(true);
    expect(
      missingReqs(vit, set('leite', 'morango'), { ...NO_FILTERS, semLactose: true }),
    ).toHaveLength(1);
    const pao = recipeById('b-pao-com-patê-de-frango'.replace('ê', 'e'));
    if (!pao) throw new Error('faltou receita');
    expect(recipeFits(pao, { ...NO_FILTERS, semGluten: true })).toBe(false);
    expect(recipeFits(pao, { ...NO_FILTERS, vegetariano: true })).toBe(false);
    const aveia = recipeById('f-mingau-de-aveia-com-leite-de-coco');
    if (!aveia) throw new Error('faltou receita');
    expect(recipeTags(aveia).semGluten).toBe(true);
    const low = matchRecipes(set(), { ...NO_FILTERS, baixoFodmap: true });
    const todas = [...low.ready, ...low.almost, ...low.others];
    expect(todas.length).toBeGreaterThan(30);
    expect(todas.every((m) => recipeTags(m.recipe).baixoFodmap)).toBe(true);
    expect(todas[0]?.recipe.fonte).toBe('fodmap');
  });

  it('o cardápio do caminho vem primeiro', () => {
    const r = matchRecipes(set(), NO_FILTERS, { kind: 'almoco', menu: 'refluxo' });
    expect(r.others[0]?.recipe.fonte).toBe('refluxo');
    expect(menuForPath('gases_sii')).toBe('gases');
    expect(menuForPath('indefinido')).toBeUndefined();
  });

  it('lista de compras pelo que mais completa receitas', () => {
    const r = matchRecipes(set('tapioca', 'ovo', 'pao'), NO_FILTERS);
    const list = shoppingSuggestions(r.almost);
    expect(list.length).toBeGreaterThan(0);
    for (let k = 1; k < list.length; k++)
      expect((list[k - 1]?.unlocks ?? 0) >= (list[k]?.unlocks ?? 0)).toBe(true);
  });

  it('baixo FODMAP começa ligado na fase 1 ou no caminho de gases', () => {
    expect(lowFodmapReason({ path: 'preso' }, { phase: 'fase1' })).toBe('fase1');
    expect(lowFodmapReason({ path: 'gases_sii' }, null)).toBe('caminho');
    expect(lowFodmapReason({ path: 'gases_sii' }, { phase: 'fase2' })).toBe('caminho');
    expect(lowFodmapReason({ path: 'preso' }, { phase: 'fase2' })).toBeUndefined();
  });

  it('limpa ids que não existem mais', () => {
    expect(cleanPantry(['ovo', 'nada', 'arroz'])).toEqual(['ovo', 'arroz']);
    expect(cleanPantry(undefined)).toEqual([]);
  });
});

describe('montar o meu dia', () => {
  it('confere o prato, a leguminosa, as frutas e a fibra', () => {
    const c = checkDay(
      {
        cafe: 'c-preso-0-1',
        almoco: 'b-almoco-comum',
        jantar: 'b-macarrao-com-atum',
      },
      set('alface'),
      NO_FILTERS,
    );
    expect(c.meals).toBe(3);
    const almoco = c.plates.find((p) => p.slot === 'almoco');
    expect(almoco).toEqual({ slot: 'almoco', vegetal: true, proteina: true, carboidrato: true });
    const jantar = c.plates.find((p) => p.slot === 'jantar');
    expect(jantar?.vegetal).toBe(false);
    expect(c.leguminosas).toEqual(['feijão']);
    expect(c.fibras).toEqual(
      expect.arrayContaining(['aveia', 'banana', 'linhaça', 'feijão', 'alface e outras folhas']),
    );
    expect(c.faltam).toContain('arroz');
  });

  it('arroz com feijão conta como proteína (combinação vegetal)', () => {
    const c = checkDay({ jantar: 'b-jantar-vegetariano' }, set(), NO_FILTERS);
    expect(c.plates[0]?.proteina).toBe(true);
    expect(c.plates[0]?.vegetal).toBe(false);
  });

  it('marca o que é alto teor e as notas da fase 1', () => {
    const c = checkDay({ cafe: 'b-vitamina-de-banana' }, set(), NO_FILTERS);
    expect(c.altoFodmap).toEqual([{ slot: 'cafe', nomes: ['leite'] }]);
    expect(c.notas).toContain('Na fase 1, a banana entra mais verde.');
  });

  it('dia vazio e receita que não existe mais', () => {
    expect(checkDay({}, set(), NO_FILTERS).meals).toBe(0);
    expect(checkDay({ cafe: 'sumiu' }, set(), NO_FILTERS).meals).toBe(0);
  });
});
