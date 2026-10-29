import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CENARIOS, REAVALIACAO_TEXTOS } from '../../content/reavaliacao';
import { saveProfile } from '../../db/repo';
import { useAllDays, usePlan, useProfile, useStoredHabits } from '../../app/data';
import { useToday } from '../../app/useToday';
import { allHabits } from '../../logic/activeHabits';
import { formatDecimal, joinPt } from '../../logic/format';
import { effectiveStatus } from '../../logic/plan';
import { computeReevaluation, type ReevalWeek } from '../../logic/reevaluation';
import type { Scenario } from '../../types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { RadioList } from '../../ui/CheckList';
import { Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { ConsultInvite } from '../alertas/ConsultInvite';
import { concludeReevaluation } from '../processo/actions';
import styles from '../processo/Processo.module.css';

const num = (n?: number) => (n === undefined ? 'sem dado' : formatDecimal(n));
const moda = (w?: ReevalWeek) =>
  !w || w.modes.length === 0 ? 'sem dado' : `tipo ${joinPt(w.modes.map(String))}`;
const dias = (n?: number) => (n === undefined ? 'sem dado' : n === 1 ? '1 dia' : `${n} dias`);

/** Reavaliação do dia 21 (seção 6.9, aula 17). */
export function Component() {
  const today = useToday();
  const plan = usePlan();
  const profile = useProfile();
  const records = useAllDays();
  const stored = useStoredHabits();
  const navigate = useNavigate();
  const [chosen, setChosen] = useState<Scenario | undefined>(undefined);
  const [cmInicio, setCmInicio] = useState('');
  const [cmAgora, setCmAgora] = useState('');
  if (plan === undefined || !profile || !records || !stored) return null;
  const status = effectiveStatus(plan ?? undefined, today);
  if (!plan || (status !== 'reavaliacao' && status !== 'concluido')) {
    return (
      <Screen title="Reavaliação" back="/caminho" backLabel="Caminho">
        <Card>
          <p>Disponível no fim do plano de 21 dias.</p>
        </Card>
      </Screen>
    );
  }
  const r = computeReevaluation(plan, records, allHabits(plan, stored), profile);
  const done = status === 'concluido';
  const scenario = chosen ?? plan.reevaluation?.chosen ?? r.suggested;
  const c = CENARIOS[scenario];
  const w = (x?: ReevalWeek) => x && x.registeredDays > 0;
  const rows: [string, string, string][] = [
    ['Tipo de Bristol predominante', moda(r.s1), moda(r.s3)],
    [
      'Frequência semanal',
      w(r.s1) ? `${r.s1?.evacuations} vezes` : 'sem dado',
      w(r.s3) ? `${r.s3?.evacuations} vezes` : 'sem dado',
    ],
    [
      'Esforço',
      w(r.s1) ? dias(r.s1?.effortDays) : 'sem dado',
      w(r.s3) ? dias(r.s3?.effortDays) : 'sem dado',
    ],
    [
      'Evacuação incompleta',
      w(r.s1) ? dias(r.s1?.incompleteDays) : 'sem dado',
      w(r.s3) ? dias(r.s3?.incompleteDays) : 'sem dado',
    ],
    ['Sintomas, média de 0 a 10', num(r.s1?.symptomAverage), num(r.s3?.symptomAverage)],
    ['Energia e disposição, média de 0 a 10', num(r.s1?.energyAverage), num(r.s3?.energyAverage)],
  ];

  const saveAbdominal = () => {
    const parse = (t: string) => Number(t.replace(',', '.'));
    const a = parse(cmInicio);
    const b = parse(cmAgora);
    const list = [...(profile.abdominal ?? [])];
    if (a > 20 && a < 250 && r.s1) list.push({ date: r.s1.start, cm: a });
    if (b > 20 && b < 250) list.push({ date: today, cm: b });
    void saveProfile({ abdominal: list });
  };

  return (
    <Screen title="Reavaliação do dia 21" back="/plano" backLabel="Plano">
      <p>{REAVALIACAO_TEXTOS.intro}</p>

      <Card label="Semana 1 e semana 3">
        <div className={styles.tabelaCaixa}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th scope="col">O que comparar</th>
                <th scope="col">Semana 1</th>
                <th scope="col">Semana 3</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Hábitos cumpridos, média de dias</th>
                <td colSpan={2}>
                  Semana 1: {num(r.s1?.habitAverage)} · semana 2: {num(r.s2?.habitAverage)} · semana
                  3: {num(r.s3?.habitAverage)}
                </td>
              </tr>
              {r.abdominal ? (
                <tr>
                  <th scope="row">Circunferência abdominal</th>
                  <td>{formatDecimal(r.abdominal.first.cm)} cm</td>
                  <td>{formatDecimal(r.abdominal.last.cm)} cm</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {r.bigBristolChange ? <p>{REAVALIACAO_TEXTOS.bristolMudancaGrande}</p> : null}
        {r.s1?.weak || r.s3?.weak ? <Note>{REAVALIACAO_TEXTOS.poucosDias}</Note> : null}
        {r.abdominal ? <Note>{REAVALIACAO_TEXTOS.notaCircunferencia}</Note> : null}
      </Card>

      {!r.abdominal && !done ? (
        <Card label="Circunferência abdominal, se você mediu">
          <p className="secundario">{REAVALIACAO_TEXTOS.notaCircunferencia}</p>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="cm-inicio">No começo (cm)</label>
              <input
                id="cm-inicio"
                inputMode="decimal"
                type="text"
                value={cmInicio}
                onChange={(e) => setCmInicio(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="cm-agora">Agora (cm)</label>
              <input
                id="cm-agora"
                inputMode="decimal"
                type="text"
                value={cmAgora}
                onChange={(e) => setCmAgora(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={saveAbdominal} disabled={!cmInicio && !cmAgora}>
            Salvar as medidas
          </Button>
        </Card>
      ) : null}

      <Card label="Cenário">
        <p>
          Pelos teus registros, o cenário que mais combina é: {CENARIOS[r.suggested].titulo}. Você
          concorda?
        </p>
        <RadioList
          legend="Teu cenário"
          hideLegend
          value={scenario}
          onChange={(v) => setChosen(v)}
          options={(['bastante', 'em_parte', 'nao_mudou'] as Scenario[]).map((s) => ({
            value: s,
            label: CENARIOS[s].titulo,
          }))}
        />
      </Card>

      <Card title={c.titulo}>
        <div className={styles.pilha}>
          <p>{c.texto}</p>
          {c.detalhe ? <p className="secundario">{c.detalhe}</p> : null}
          {scenario === 'em_parte' ? (
            <Link to="/guia/fodmap">Ver o protocolo low FODMAP</Link>
          ) : null}
          {r.notTested ? <p>{REAVALIACAO_TEXTOS.planoNaoTestado}</p> : null}
          {scenario !== 'bastante' ? (
            <>
              <p>{REAVALIACAO_TEXTOS.conteudoFunciona}</p>
              <ConsultInvite text={REAVALIACAO_TEXTOS.convite} />
            </>
          ) : null}
          <p>{REAVALIACAO_TEXTOS.qualquerCenario}</p>
        </div>
      </Card>

      {done && plan.reevaluation?.chosen === scenario ? (
        <Note>Reavaliação concluída.</Note>
      ) : (
        <Button
          variant="primary"
          block
          onClick={() =>
            void concludeReevaluation(today, r.suggested, scenario).then(() => navigate('/fim'))
          }
        >
          {done ? 'Salvar o novo cenário' : 'Concluir a reavaliação'}
        </Button>
      )}
    </Screen>
  );
}
