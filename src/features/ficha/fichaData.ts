import { FICHA_SINTOMAS, FICHA_TEXTOS } from '../../content/ficha';
import { APP_NAME, ASSINATURA } from '../../config';
import { getDb } from '../../db/index';
import { nowIso } from '../../db/repo';
import type { ConsultAutofill } from '../../logic/consult';
import { formatDayMonth } from '../../logic/dates';
import { formatDecimal, joinPt } from '../../logic/format';
import type { ConsultForm } from '../../types';

/** Ficha para a consulta (seção 6.14): campos, autopreenchimento e texto. */

export type FichaFields = Record<string, string>;

const num = (n?: number) => (n === undefined ? '' : formatDecimal(n));

/** Valores sugeridos pelos registros, usados enquanto a aluna não escreve por cima. */
export function autofillFields(a: ConsultAutofill, name?: string): FichaFields {
  const f: FichaFields = {
    nome: name ?? '',
    bristol: a.bristol,
    padrao: a.padrao,
    testado: a.testado,
    gatilhos: a.gatilhos,
    alertas: a.alertas,
  };
  for (const s of FICHA_SINTOMAS) {
    f[`sint_${s.id}_vezes`] = num(a.sintomas[s.id]?.timesPerWeek);
    f[`sint_${s.id}_int`] = num(a.sintomas[s.id]?.intensity);
  }
  return f;
}

export function fieldValue(stored: FichaFields, auto: FichaFields, key: string): string {
  return stored[key] ?? auto[key] ?? '';
}

export interface WeekRow {
  periodo: string;
  dias: string;
  tipo: string;
  evacuacoes: string;
  sintomas: string;
  energia: string;
}

export function weekRows(a: ConsultAutofill): WeekRow[] {
  return a.weeks.map((w) => ({
    periodo: `${formatDayMonth(w.start)} a ${formatDayMonth(w.end)}`,
    dias: String(w.registeredDays),
    tipo: w.bristol.modes.length ? joinPt(w.bristol.modes.map(String)) : '',
    evacuacoes: String(w.evacuations.total),
    sintomas: num(w.symptomAverage),
    energia: num(w.energyAverage),
  }));
}

export interface FichaSection {
  title: string;
  lines: [string, string][];
}

/** A ficha organizada em seções, para o PDF e para o texto copiado. */
export function fichaSections(v: (key: string) => string, today: string): FichaSection[] {
  const eventos = v('eventos').split('|').filter(Boolean);
  return [
    {
      title: 'Dados',
      lines: [
        ['Nome', v('nome')],
        ['Data de hoje', today],
        ['Data da consulta', v('dataConsulta')],
        ['Profissional', v('profissional')],
      ],
    },
    {
      title: 'A tua história',
      lines: [
        ['Há quanto tempo os sintomas aparecem', v('haQuantoTempo')],
        ['Começaram depois de', eventos.join(', ')],
      ],
    },
    {
      title: 'Sintomas (vezes por semana · intensidade de 0 a 10)',
      lines: FICHA_SINTOMAS.map((s) => {
        const vezes = v(`sint_${s.id}_vezes`);
        const int = v(`sint_${s.id}_int`);
        return [
          s.label,
          [vezes ? `${vezes} por semana` : '', int ? `intensidade ${int}` : '']
            .filter(Boolean)
            .join(' · '),
        ];
      }),
    },
    {
      title: 'O que você já observou',
      lines: [
        ['Tipo de Bristol mais frequente', v('bristol')],
        ['Alternância ou padrão', v('padrao')],
        ['O que você já testou e o que mudou', v('testado')],
        ['Alimentos que você identificou como gatilho', v('gatilhos')],
      ],
    },
    {
      title: 'Medicamentos, exames e família',
      lines: [
        ['Medicamentos e suplementos', v('medicamentos')],
        ['Exames já realizados', v('exames')],
        ['Doença intestinal na família', v('familia')],
      ],
    },
    { title: 'Sinais de alerta presentes', lines: [['', v('alertas') || 'Nenhum destes']] },
    { title: 'Perguntas que eu quero fazer', lines: [['', v('perguntas')]] },
  ];
}

export function fichaText(sections: FichaSection[], weeks: WeekRow[]): string {
  const out: string[] = ['Ficha para a consulta', APP_NAME, ''];
  for (const s of sections) {
    out.push(s.title.toUpperCase());
    for (const [k, val] of s.lines) out.push(k ? `${k}: ${val || '-'}` : val || '-');
    out.push('');
  }
  out.push('ÚLTIMAS 3 SEMANAS');
  for (const w of weeks)
    out.push(
      `${w.periodo}: ${w.dias} dias registrados; tipo ${w.tipo || '-'}; ${w.evacuacoes} evacuações; sintomas ${w.sintomas || '-'}; energia ${w.energia || '-'}`,
    );
  out.push('', 'O QUE LEVAR', ...FICHA_TEXTOS.oQueLevar.map((i) => `- ${i}`), '', ASSINATURA);
  return out.join('\n');
}

export async function saveConsultFields(fields: FichaFields, saved = false): Promise<void> {
  const db = getDb();
  const cur = await db.consult.get('consult');
  const next: ConsultForm = {
    id: 'consult',
    fields: { ...(cur?.fields ?? {}), ...fields },
    savedAt: saved ? nowIso() : cur?.savedAt,
    updatedAt: nowIso(),
  };
  await db.consult.put(next);
}
