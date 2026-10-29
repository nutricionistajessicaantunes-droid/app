import {
  PADRAO_DIFERENCA_NOTA,
  PADRAO_DIFERENCA_PROPORCAO,
  PADRAO_MIN_DIAS_REGISTRADOS,
  PADRAO_MIN_OCORRENCIAS,
} from '../config';
import { PADRAO_TEXTO, type PatternId } from '../content/padroes';
import type { DayKey, DayRecord, TagId } from '../types';
import { addDays, isWeekend } from './dates';
import { formatDecimal } from './format';
import { dayScore, indexByDate, isRegistered } from './records';
import { average } from './symptoms';

export interface PatternResult {
  id: PatternId;
  text: string;
  triggers: number;
  hits: number;
  baseHits: number;
  baseTotal: number;
}

/** Janela de análise dos padrões: as últimas 8 semanas. */
export const JANELA_PADROES_DIAS = 56;

const lento = (r: DayRecord) =>
  r.evacuated === false || (r.evacuated === true && r.bristol !== undefined && r.bristol <= 2);
const foraDaFaixa = (r: DayRecord) =>
  r.evacuated === false || (r.evacuated === true && r.bristol !== undefined && (r.bristol < 3 || r.bristol > 5));
const acelerado = (r: DayRecord) => r.evacuated === true && r.bristol !== undefined && r.bristol >= 6;
const temTag = (r: DayRecord, t: TagId) => (r.tags ?? []).includes(t);

/** "1 de cada 5", "2 de 3" ou "nenhuma vez". */
export function rateText(k: number, n: number): string {
  if (k === 0 || n === 0) return 'nenhuma vez';
  const cada = Math.round(n / k);
  if (k / n <= 0.5 && Math.abs(n / k - cada) < 0.25) return `em 1 de cada ${cada}`;
  return `em ${k} de ${n}`;
}

function outrosDias(baseHits: number, baseTotal: number): string {
  const r = rateText(baseHits, baseTotal);
  return r === 'nenhuma vez' ? 'Nos outros dias, isso não apareceu.' : `Nos outros dias, ${r}.`;
}

/**
 * Padrão com atraso de até 2 dias (noite mal dormida, viagem): o gatilho conta se o
 * próprio dia ou um dos dois seguintes teve o resultado. A linha de base são os dias
 * registrados fora dessas janelas.
 */
function lagged(regs: DayRecord[], tag: TagId, outcome: (r: DayRecord) => boolean) {
  const byDate = indexByDate(regs);
  const triggers = regs.filter((r) => temTag(r, tag));
  const inWindow = new Set<DayKey>();
  let hits = 0;
  for (const t of triggers) {
    let hit = false;
    for (let i = 0; i <= 2; i++) {
      const d = addDays(t.date, i);
      inWindow.add(d);
      const r = byDate.get(d);
      if (r && outcome(r)) hit = true;
    }
    if (hit) hits++;
  }
  const base = regs.filter((r) => !inWindow.has(r.date));
  return { triggers: triggers.length, hits, baseHits: base.filter(outcome).length, baseTotal: base.length };
}

function simple(trig: DayRecord[], base: DayRecord[], outcome: (r: DayRecord) => boolean) {
  return {
    triggers: trig.length,
    hits: trig.filter(outcome).length,
    baseHits: base.filter(outcome).length,
    baseTotal: base.length,
  };
}

function aparece(c: { triggers: number; hits: number; baseHits: number; baseTotal: number }): boolean {
  if (c.triggers < PADRAO_MIN_OCORRENCIAS || c.baseTotal === 0) return false;
  return c.hits / c.triggers - c.baseHits / c.baseTotal >= PADRAO_DIFERENCA_PROPORCAO - 1e-9;
}

/**
 * Padrões que costumam aparecer (seção 7.6). Só com pelo menos 14 dias registrados;
 * cada padrão precisa de pelo menos 3 ocorrências e é comparado com os outros dias.
 */
export function findPatterns(records: DayRecord[], end: DayKey, windowDays = JANELA_PADROES_DIAS): PatternResult[] {
  const start = addDays(end, -(windowDays - 1));
  const regs = records.filter((r) => r.date >= start && r.date <= end && isRegistered(r));
  if (regs.length < PADRAO_MIN_DIAS_REGISTRADOS) return [];
  const out: PatternResult[] = [];

  const noite = lagged(regs, 'dormi_mal', lento);
  if (aparece(noite)) {
    out.push({
      id: 'noite_mal_dormida',
      ...noite,
      text: `${PADRAO_TEXTO.noite_mal_dormida} Nos teus registros, isso aconteceu depois de ${noite.hits} das ${noite.triggers} noites mal dormidas. ${outrosDias(noite.baseHits, noite.baseTotal)}`,
    });
  }

  const comEstufamento = regs.filter((r) => typeof r.symptoms?.estufamento === 'number');
  const estufou = (r: DayRecord) => (r.symptoms?.estufamento ?? 0) >= 4;
  const rapida = simple(
    comEstufamento.filter((r) => temTag(r, 'comi_correndo')),
    comEstufamento.filter((r) => !temTag(r, 'comi_correndo')),
    estufou,
  );
  if (aparece(rapida)) {
    out.push({
      id: 'refeicao_rapida',
      ...rapida,
      text: `${PADRAO_TEXTO.refeicao_rapida} Nos teus registros, o estufamento chegou a 4 ou mais em ${rapida.hits} dos ${rapida.triggers} dias em que você comeu correndo. ${outrosDias(rapida.baseHits, rapida.baseTotal)}`,
    });
  }

  const fds = simple(
    regs.filter((r) => isWeekend(r.date)),
    regs.filter((r) => !isWeekend(r.date)),
    foraDaFaixa,
  );
  if (aparece(fds)) {
    out.push({
      id: 'fim_de_semana',
      ...fds,
      text: `${PADRAO_TEXTO.fim_de_semana} Nos teus registros, em ${fds.hits} dos ${fds.triggers} dias de fim de semana você ficou sem evacuar ou teve fezes fora dos tipos 3 a 5. ${outrosDias(fds.baseHits, fds.baseTotal)}`,
    });
  }

  const semCiclo = regs.filter((r) => !temTag(r, 'pre_menstrual') && !temTag(r, 'menstruada'));
  const pre = simple(regs.filter((r) => temTag(r, 'pre_menstrual')), semCiclo, lento);
  if (aparece(pre)) {
    out.push({
      id: 'ciclo_pre',
      ...pre,
      text: `${PADRAO_TEXTO.ciclo_pre} Nos teus registros, em ${pre.hits} dos ${pre.triggers} dias pré-menstruais o intestino ficou mais preso. ${outrosDias(pre.baseHits, pre.baseTotal)}`,
    });
  }
  const menstr = simple(regs.filter((r) => temTag(r, 'menstruada')), semCiclo, acelerado);
  if (aparece(menstr)) {
    out.push({
      id: 'ciclo_menstruada',
      ...menstr,
      text: `${PADRAO_TEXTO.ciclo_menstruada} Nos teus registros, em ${menstr.hits} dos ${menstr.triggers} dias de menstruação as fezes ficaram do tipo 6 ou 7. ${outrosDias(menstr.baseHits, menstr.baseTotal)}`,
    });
  }

  const comNota = regs.filter((r) => dayScore(r) !== undefined);
  const est = comNota.filter((r) => temTag(r, 'estresse_alto'));
  const semEst = comNota.filter((r) => !temTag(r, 'estresse_alto'));
  const mEst = average(est.map((r) => dayScore(r) as number));
  const mOutros = average(semEst.map((r) => dayScore(r) as number));
  if (
    est.length >= PADRAO_MIN_OCORRENCIAS &&
    mEst !== undefined &&
    mOutros !== undefined &&
    mEst - mOutros >= PADRAO_DIFERENCA_NOTA - 1e-9
  ) {
    out.push({
      id: 'estresse',
      triggers: est.length,
      hits: est.length,
      baseHits: 0,
      baseTotal: semEst.length,
      text: `${PADRAO_TEXTO.estresse} Nos teus registros, a nota média de sintomas foi ${formatDecimal(mEst)} nos dias de estresse alto e ${formatDecimal(mOutros)} nos outros dias.`,
    });
  }

  const viagem = lagged(regs, 'viagem', lento);
  if (aparece(viagem)) {
    out.push({
      id: 'viagem',
      ...viagem,
      text: `${PADRAO_TEXTO.viagem} Nos teus registros, isso aconteceu em ${viagem.hits} dos ${viagem.triggers} dias de viagem, contando os dois dias seguintes. ${outrosDias(viagem.baseHits, viagem.baseTotal)}`,
    });
  }

  return out;
}

/** Tem dias suficientes para procurar padrões? */
export function enoughForPatterns(records: DayRecord[], end: DayKey, windowDays = JANELA_PADROES_DIAS): boolean {
  const start = addDays(end, -(windowDays - 1));
  return records.filter((r) => r.date >= start && r.date <= end && isRegistered(r)).length >= PADRAO_MIN_DIAS_REGISTRADOS;
}
