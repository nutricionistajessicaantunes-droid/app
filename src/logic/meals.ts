import type { MealId } from '../content/agua-fibras';
import {
  INGREDIENTES,
  QUALQUER_FRUTA,
  QUALQUER_VEGETAL,
  RECEITAS,
  SLOT_KINDS,
  type Ingredient,
  type MealKind,
  type Recipe,
  type RecipeSource,
  type Req,
} from '../content/refeicoes';
import type { FodmapProtocol, Profile } from '../types';

export interface MealFilters {
  semLactose: boolean;
  semGluten: boolean;
  vegetariano: boolean;
  baixoFodmap: boolean;
}

export const NO_FILTERS: MealFilters = {
  semLactose: false,
  semGluten: false,
  vegetariano: false,
  baixoFodmap: false,
};

const BY_ID = new Map(INGREDIENTES.map((i) => [i.id, i]));

export function ingredient(id: string): Ingredient | undefined {
  return BY_ID.get(id);
}

export function recipeById(id: string | undefined): Recipe | undefined {
  return id ? RECEITAS.find((r) => r.id === id) : undefined;
}

/** O ingrediente passa nos filtros ligados. */
export function allowedIngredient(i: Ingredient, f: MealFilters): boolean {
  if (f.semLactose && i.lactose) return false;
  if (f.semGluten && i.gluten) return false;
  if (f.vegetariano && i.carne) return false;
  if (f.baixoFodmap && i.fodmap !== 'baixo') return false;
  return true;
}

/** As opções que resolvem a linha: "atum ou sardinha", qualquer verdura, qualquer fruta. */
export function reqOptions(req: Req): Ingredient[] {
  const ids = Array.isArray(req) ? req : [req];
  const out: Ingredient[] = [];
  for (const id of ids) {
    if (id === QUALQUER_VEGETAL) out.push(...INGREDIENTES.filter((i) => i.grupo === 'vegetal'));
    else if (id === QUALQUER_FRUTA) out.push(...INGREDIENTES.filter((i) => i.grupo === 'fruta'));
    else {
      const i = BY_ID.get(id);
      if (i) out.push(i);
    }
  }
  return out;
}

export function reqLabel(req: Req): string {
  if (req === QUALQUER_VEGETAL) return 'uma verdura ou legume';
  if (req === QUALQUER_FRUTA) return 'uma fruta';
  const nomes = reqOptions(req).map((i) => i.nome.toLowerCase());
  if (nomes.length <= 1) return nomes[0] ?? '';
  return `${nomes.slice(0, -1).join(', ')} ou ${nomes[nomes.length - 1]}`;
}

/** A receita pode ser feita dentro dos filtros: cada linha tem ao menos uma opção permitida. */
export function recipeFits(r: Recipe, f: MealFilters): boolean {
  return r.usa.every((req) => reqOptions(req).some((i) => allowedIngredient(i, f)));
}

/** Selos da receita: o que ela pode ser, escolhendo as opções certas de cada linha. */
export function recipeTags(r: Recipe): MealFilters {
  return {
    semLactose: recipeFits(r, { ...NO_FILTERS, semLactose: true }),
    semGluten: recipeFits(r, { ...NO_FILTERS, semGluten: true }),
    vegetariano: recipeFits(r, { ...NO_FILTERS, vegetariano: true }),
    baixoFodmap: recipeFits(r, { ...NO_FILTERS, baixoFodmap: true }),
  };
}

/** Linhas que o que você tem em casa ainda não resolve, dentro dos filtros. */
export function missingReqs(r: Recipe, pantry: ReadonlySet<string>, f: MealFilters): Req[] {
  return r.usa.filter(
    (req) => !reqOptions(req).some((i) => pantry.has(i.id) && allowedIngredient(i, f)),
  );
}

export function fitsSlot(r: Recipe, slot: MealId): boolean {
  return SLOT_KINDS[slot].includes(r.refeicao);
}

export interface Match {
  recipe: Recipe;
  missing: Req[];
}

export interface MatchResult {
  ready: Match[];
  almost: Match[];
  others: Match[];
}

export interface MatchOptions {
  kind?: MealKind;
  /** Cardápio do caminho da aluna, que aparece primeiro. */
  menu?: RecipeSource;
}

/** Até quantos itens faltando a receita ainda conta como "falta pouco". */
export const ALMOST_MAX = 2;

function rank(r: Recipe, o: MatchOptions, f: MealFilters): number {
  let n = 0;
  if (o.menu && r.fonte === o.menu) n -= 4;
  if (f.baixoFodmap && r.fonte === 'fodmap') n -= 2;
  if (o.kind && r.refeicao !== o.kind) n += 1;
  return n;
}

/** Separa as receitas em: dá para fazer agora, falta pouco e as outras. */
export function matchRecipes(
  pantry: ReadonlySet<string>,
  f: MealFilters,
  o: MatchOptions = {},
  recipes: Recipe[] = RECEITAS,
): MatchResult {
  const kinds: MealKind[] | undefined = o.kind
    ? o.kind === 'cafe' || o.kind === 'lanche'
      ? [o.kind, o.kind === 'cafe' ? 'lanche' : 'cafe']
      : [o.kind, o.kind === 'almoco' ? 'jantar' : 'almoco']
    : undefined;
  const list = recipes
    .map((recipe, index) => ({ recipe, index }))
    .filter(({ recipe }) => !kinds || kinds.includes(recipe.refeicao))
    .filter(({ recipe }) => recipeFits(recipe, f))
    .sort((a, b) => rank(a.recipe, o, f) - rank(b.recipe, o, f) || a.index - b.index)
    .map(({ recipe }) => ({ recipe, missing: missingReqs(recipe, pantry, f) }));
  return {
    ready: list.filter((m) => m.missing.length === 0),
    almost: list
      .filter((m) => m.missing.length > 0 && m.missing.length <= ALMOST_MAX)
      .sort((a, b) => a.missing.length - b.missing.length),
    others: list.filter((m) => m.missing.length > ALMOST_MAX),
  };
}

/** Lista de compras: os itens que, sozinhos, completam mais receitas. */
export function shoppingSuggestions(
  almost: Match[],
  limit = 6,
): { label: string; unlocks: number }[] {
  const count = new Map<string, number>();
  for (const m of almost) {
    if (m.missing.length !== 1) continue;
    const req = m.missing[0];
    if (req === undefined) continue;
    const label = reqLabel(req);
    count.set(label, (count.get(label) ?? 0) + 1);
  }
  return [...count.entries()]
    .map(([label, unlocks]) => ({ label, unlocks }))
    .sort((a, b) => b.unlocks - a.unlocks || a.label.localeCompare(b.label, 'pt-BR'))
    .slice(0, limit);
}

/** O filtro baixo FODMAP começa ligado na fase 1 do protocolo ou no caminho de gases e SII. */
export function lowFodmapReason(
  profile: Pick<Profile, 'path'> | null | undefined,
  fodmap: Pick<FodmapProtocol, 'phase'> | null | undefined,
): 'fase1' | 'caminho' | undefined {
  if (fodmap?.phase === 'fase1') return 'fase1';
  if (profile?.path === 'gases_sii') return 'caminho';
  return undefined;
}

/** Cardápio modelo de cada caminho, para ordenar as opções. */
export function menuForPath(path: Profile['path'] | undefined): RecipeSource | undefined {
  if (path === 'preso' || path === 'refluxo') return path;
  if (path === 'gases_sii') return 'gases';
  return undefined;
}

/** O ingrediente que representa a linha: o que você tem, senão o primeiro permitido. */
function pick(req: Req, pantry: ReadonlySet<string>, f: MealFilters): Ingredient | undefined {
  const opts = reqOptions(req);
  const allowed = opts.filter((i) => allowedIngredient(i, f));
  const have = allowed.find((i) => pantry.has(i.id));
  if (have) return have;
  if (req === QUALQUER_VEGETAL || req === QUALQUER_FRUTA) return undefined;
  return allowed[0] ?? opts[0];
}

export interface PlateCheck {
  slot: MealId;
  vegetal: boolean;
  proteina: boolean;
  carboidrato: boolean;
}

export interface DayCheck {
  plates: PlateCheck[];
  leguminosas: string[];
  frutas: string[];
  fibras: string[];
  altoFodmap: { slot: MealId; nomes: string[] }[];
  notas: string[];
  faltam: string[];
  meals: number;
}

const VEG_GENERIC = 'verduras e legumes';
const FRUTA_GENERIC = 'fruta';

function addUnique(list: string[], item: string) {
  if (!list.includes(item)) list.push(item);
}

/**
 * Confere o dia montado: o prato da aula 14 no almoço e no jantar, a leguminosa,
 * as frutas e as fontes de fibra. Nada de caloria.
 */
export function checkDay(
  day: Partial<Record<MealId, string>>,
  pantry: ReadonlySet<string>,
  f: MealFilters,
): DayCheck {
  const out: DayCheck = {
    plates: [],
    leguminosas: [],
    frutas: [],
    fibras: [],
    altoFodmap: [],
    notas: [],
    faltam: [],
    meals: 0,
  };
  const slots: MealId[] = ['cafe', 'lanche_manha', 'almoco', 'lanche_tarde', 'jantar'];
  for (const slot of slots) {
    const r = recipeById(day[slot]);
    if (!r) continue;
    out.meals += 1;
    const roles = new Set<string>();
    const alto: string[] = [];
    for (const req of r.usa) {
      if (req === QUALQUER_VEGETAL) {
        roles.add('vegetal');
        const have = pick(req, pantry, f);
        addUnique(out.fibras, have ? have.nome.toLowerCase() : VEG_GENERIC);
        continue;
      }
      if (req === QUALQUER_FRUTA) {
        roles.add('fruta');
        const have = pick(req, pantry, f);
        const nome = have ? have.nome.toLowerCase() : FRUTA_GENERIC;
        addUnique(out.frutas, nome);
        addUnique(out.fibras, nome);
        continue;
      }
      const i = pick(req, pantry, f);
      if (!i) continue;
      if (i.prato) roles.add(i.prato);
      const nome = i.nome.toLowerCase();
      if (i.prato === 'leguminosa') addUnique(out.leguminosas, nome);
      if (i.prato === 'fruta') addUnique(out.frutas, nome);
      if (i.fibra) addUnique(out.fibras, nome);
      if (i.fodmap === 'alto') alto.push(nome);
      if (i.nota) addUnique(out.notas, i.nota);
    }
    for (const req of missingReqs(r, pantry, f)) addUnique(out.faltam, reqLabel(req));
    if (alto.length > 0) out.altoFodmap.push({ slot, nomes: alto });
    if (slot === 'almoco' || slot === 'jantar') {
      out.plates.push({
        slot,
        vegetal: roles.has('vegetal'),
        proteina: roles.has('proteina') || (roles.has('leguminosa') && roles.has('carboidrato')),
        carboidrato: roles.has('carboidrato'),
      });
    }
  }
  return out;
}

/** Limpa a lista guardada: só ids que existem. */
export function cleanPantry(ids: readonly string[] | undefined): string[] {
  return (ids ?? []).filter((id) => BY_ID.has(id));
}
