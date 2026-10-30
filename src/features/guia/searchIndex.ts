import * as agua from '../../content/agua-fibras';
import * as alertas from '../../content/alertas';
import * as avisos from '../../content/avisos';
import * as bristol from '../../content/bristol';
import * as cardapios from '../../content/cardapios';
import * as curso from '../../content/curso';
import * as diarreia from '../../content/diarreia';
import * as fodmap from '../../content/fodmap';
import * as padroes from '../../content/padroes';
import * as plano from '../../content/plano';
import * as prato from '../../content/prato';
import * as prebioticos from '../../content/prebioticos';
import * as reav from '../../content/reavaliacao';
import * as registro from '../../content/registro';
import * as refeicoes from '../../content/refeicoes';
import * as rotina from '../../content/rotina';
import * as sobre from '../../content/sobre';
import { normalizeSearch } from '../../logic/text';

/** Índice da busca do Guia (seção 6.11). Carregado só quando a aluna começa a digitar. */

const SOURCES: Record<string, unknown[]> = {
  bristol: [bristol.BRISTOL, bristol.BRISTOL_TEXTOS],
  plano: [
    plano.PLANO_TEXTOS,
    plano.REGRAS,
    plano.CAMINHOS,
    plano.PLAN_HABITS,
    plano.PLAN_THEMES,
    plano.SEMANA_ZERO_ITENS,
    plano.RECADO_DIA4,
    reav.REAVALIACAO_TEXTOS,
    reav.CENARIOS,
    reav.PLANO_MINIMO_TEXTOS,
    reav.MANUTENCAO_TEXTOS,
  ],
  registro: [registro.REGISTRO_CURSO, registro.LEITURA_TEXTOS, padroes.PADROES],
  agua: [agua.AGUA_TEXTOS],
  fibras: [agua.FIBRA_TEXTOS, agua.FIBRAS, agua.DIA_MODELO_FIBRAS],
  prebioticos: [prebioticos],
  prato: [prato],
  rotina: [rotina],
  fodmap: [
    fodmap.FODMAP_COMO_USAR,
    fodmap.TABELA_TESTE,
    fodmap.TABELA_TESTE_TEXTOS,
    fodmap.ANTES_DE_COMECAR,
    fodmap.FODMAP_CUIDADO,
    fodmap.FASE1_TEXTOS,
    fodmap.FASE2_TEXTOS,
    fodmap.FASE3_TEXTOS,
    fodmap.EFEITO_ACUMULATIVO,
    fodmap.CINCO_ERROS,
    fodmap.FODMAP_AVISOS,
    fodmap.FODMAP_CATEGORIAS.map((c) => c.dica),
  ],
  cardapios: [
    cardapios.CARDAPIOS,
    cardapios.COMO_LER_CARDAPIO,
    cardapios.AVISO_CARDAPIO,
    cardapios.GATILHOS,
  ],
  diarreia: [diarreia.DIARREIA, diarreia.VOLTA_ETAPAS, curso.KIT_CRISE_ITENS],
  alertas: [
    alertas.RED_FLAGS,
    alertas.ALERTA_TEXTOS,
    alertas.SEGUNDO_GRUPO,
    alertas.ACOMPANHAMENTO_TEXTO,
  ],
  refeicoes: [
    refeicoes.REFEICOES_TEXTOS.intro,
    refeicoes.RECEITAS.filter((r) => r.fonte !== 'fodmap').map((r) => [r.titulo, r.itens]),
  ],
  'receitas-fodmap': [
    refeicoes.ORIENTACOES_FODMAP,
    refeicoes.RECEITAS_FODMAP.map((r) => [r.titulo, r.itens, r.preparo]),
  ],
  avisos: [avisos.AVISOS_IMPORTANTES],
  sobre: [sobre.SOBRE_O_APP],
};

function collect(v: unknown, out: string[]): void {
  if (typeof v === 'string') {
    if (v.length > 3 && !/^[a-z0-9_-]+$/.test(v)) out.push(v);
  } else if (Array.isArray(v)) v.forEach((x) => collect(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => collect(x, out));
}

let index: { section: string; text: string; norm: string }[] | null = null;

function getIndex() {
  if (index) return index;
  index = [];
  for (const [section, items] of Object.entries(SOURCES)) {
    const strings: string[] = [];
    collect(items, strings);
    for (const text of new Set(strings)) index.push({ section, text, norm: normalizeSearch(text) });
  }
  return index;
}

export interface GuideHit {
  section: string;
  snippets: string[];
}

function snippet(text: string, norm: string, token: string): string {
  if (text.length <= 140) return text;
  const at = Math.max(0, norm.indexOf(token) - 50);
  const cut = text.slice(at, at + 140).trim();
  return `${at > 0 ? '...' : ''}${cut}${at + 140 < text.length ? '...' : ''}`;
}

/** Procura todas as palavras digitadas, sem acento e sem diferença de maiúsculas. */
export function searchGuide(query: string): GuideHit[] {
  const tokens = normalizeSearch(query)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (tokens.length === 0) return [];
  const bySection = new Map<string, string[]>();
  for (const e of getIndex()) {
    if (!tokens.every((t) => e.norm.includes(t))) continue;
    const list = bySection.get(e.section) ?? [];
    if (list.length < 2) list.push(snippet(e.text, e.norm, tokens[0] as string));
    bySection.set(e.section, list);
  }
  return [...bySection.entries()].map(([section, snippets]) => ({ section, snippets }));
}
