import { useState } from 'react';
import { Link } from 'react-router';
import {
  ANTES_DE_COMECAR,
  CINCO_ERROS,
  EFEITO_ACUMULATIVO,
  FASE1_TEXTOS,
  FASE2_TEXTOS,
  FASE3_TEXTOS,
  FODMAP_AVISOS,
  FODMAP_COMO_USAR,
  FODMAP_CUIDADO,
  RESULTADO_LABEL,
  TABELA_TESTE,
} from '../../content/fodmap';
import { useDays, useFodmap, useProfile } from '../../app/data';
import { useToday } from '../../app/useToday';
import { addDays, diffDays, formatDayMonth, isValidDayKey } from '../../logic/dates';
import {
  currentTestIndex,
  defaultEvaluationDate,
  earliestNextStart,
  evaluationRange,
  last7Average,
  pauseEnd,
  phase1Baseline,
  phase1Day,
  phase1Evaluation,
  suggestTestResult,
  testBaseline,
  testScores,
} from '../../logic/fodmap';
import { formatDecimal } from '../../logic/format';
import type { FodmapGroup, FodmapProtocol, FodmapResult, FodmapTest } from '../../types';
import { Button, ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList, RadioList } from '../../ui/CheckList';
import { BulletList, Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { ConsultInvite } from '../alertas/ConsultInvite';
import { CalendarButtons } from '../lembretes/CalendarButtons';
import { fodmapEvaluationEvent, fodmapRetestEvent } from '../lembretes/reminders';
import styles from '../processo/Processo.module.css';
import {
  acknowledgeCare,
  answerPhase1,
  concludeTest,
  repeatTest,
  resetProtocol,
  savePlanning,
  setAtypical,
  setPauseDays,
  startTest,
} from './fodmapActions';

const label = (g: FodmapGroup) => TABELA_TESTE.find((t) => t.group === g)?.label ?? g;
const nota = (n?: number) => (n === undefined ? 'sem dado' : formatDecimal(n));

/** Protocolo low FODMAP (seção 6.13). */
export function Component() {
  const today = useToday();
  const profile = useProfile();
  const protocol = useFodmap();
  const records = useDays(addDays(today, -120), today);
  if (!profile || protocol === undefined || !records) return null;
  const p = protocol ?? undefined;
  const needsCare =
    profile.careFlags.relacaoDificilComida ||
    profile.careFlags.gestanteOuAmamentando ||
    profile.careFlags.diagnosticoIntestinal;
  const phase = p?.phase ?? 'planejamento';
  const started = phase !== 'planejamento';

  return (
    <Screen title="Protocolo low FODMAP" back="/caminho" backLabel="Caminho">
      {profile.path !== 'gases_sii' ? (
        <Note>Esta parte é para quem tem estufamento, gases ou intestino irritável.</Note>
      ) : null}

      <details open={!started}>
        <summary
          className={styles.rotulo}
          style={{ minHeight: 44, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          Como usar esta lista e as três fases
        </summary>
        <div className={styles.pilha}>
          <p>{FODMAP_COMO_USAR.intro}</p>
          <BulletList items={FODMAP_COMO_USAR.fases.map((f) => `${f.titulo}: ${f.texto}`)} />
          <p>{FODMAP_COMO_USAR.temporaria}</p>
        </div>
      </details>

      {needsCare && !p?.acknowledgedCare ? (
        <Card tone="alerta" title="Antes de começar">
          {profile.careFlags.relacaoDificilComida ? <p>{FODMAP_CUIDADO.relacaoComida}</p> : null}
          {profile.careFlags.gestanteOuAmamentando || profile.careFlags.diagnosticoIntestinal ? (
            <p>{FODMAP_CUIDADO.gestanteDiagnostico}</p>
          ) : null}
          <Button variant="primary" onClick={() => void acknowledgeCare()}>
            Vou fazer com acompanhamento profissional
          </Button>
        </Card>
      ) : phase === 'planejamento' ? (
        <Planejamento today={today} />
      ) : phase === 'fase1' && p ? (
        <Fase1 p={p} today={today} records={records} />
      ) : phase === 'fase2' && p ? (
        <Fase2 p={p} today={today} records={records} />
      ) : phase === 'fase3' && p ? (
        <Fase3 p={p} today={today} />
      ) : phase === 'encerrado' ? (
        <Card title="Fase 1 encerrada">
          <p>{FASE1_TEXTOS.encerreNaoCaiu}</p>
          <ConsultInvite />
          <Button variant="ghost" onClick={() => void resetProtocol()}>
            Recomeçar o protocolo
          </Button>
        </Card>
      ) : null}

      <Card label="Os cinco erros mais comuns">
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          {CINCO_ERROS.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ol>
      </Card>
      {FODMAP_AVISOS.map((a) => (
        <Note key={a}>{a}</Note>
      ))}
      <Link to="/guia/fodmap">Ver a lista de FODMAPs</Link>
    </Screen>
  );
}

function Planejamento({ today }: { today: string }) {
  const [start, setStart] = useState(today);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [foods, setFoods] = useState<Partial<Record<FodmapGroup, string>>>({});
  const [prep, setPrep] = useState<Record<string, boolean>>({});
  const range = evaluationRange(start);
  const evalDate =
    evaluation && evaluation >= range.min && evaluation <= range.max
      ? evaluation
      : defaultEvaluationDate(start);
  return (
    <Card label="Planejamento" title="Calendário do protocolo">
      <div className={styles.pilha}>
        <div className={styles.campo}>
          <label htmlFor="f-inicio">Início da fase 1</label>
          <input
            id="f-inicio"
            type="date"
            min={today}
            value={start}
            onChange={(e) => isValidDayKey(e.target.value) && setStart(e.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor="f-avaliacao">Data da avaliação</label>
          <input
            id="f-avaliacao"
            type="date"
            min={range.min}
            max={range.max}
            value={evalDate}
            onChange={(e) => setEvaluation(e.target.value)}
          />
          <p className={styles.ajuda}>
            O padrão é o fim da semana 4. Pode ser entre {formatDayMonth(range.min)} (semana 2) e{' '}
            {formatDayMonth(range.max)} (semana 6).
          </p>
        </div>
        <p className={styles.rotulo}>Alimento-teste de cada grupo, na ordem</p>
        {TABELA_TESTE.map((t) => (
          <div key={t.group} className={styles.campo}>
            <label htmlFor={`f-${t.group}`}>{t.label}</label>
            <select
              id={`f-${t.group}`}
              value={foods[t.group] ?? t.foods[0]}
              onChange={(e) => setFoods((f) => ({ ...f, [t.group]: e.target.value }))}
            >
              {t.foods.map((food) => (
                <option key={food} value={food}>
                  {food}
                </option>
              ))}
            </select>
          </div>
        ))}
        <p className={styles.rotulo}>Antes de começar</p>
        <CheckList
          items={ANTES_DE_COMECAR.map((a) => ({ id: a, label: a }))}
          checked={(id) => Boolean(prep[id])}
          onToggle={(id, on) => setPrep((p) => ({ ...p, [id]: on }))}
        />
        <CalendarButtons
          label="Avaliação da fase 1 na agenda"
          event={fodmapEvaluationEvent(evalDate)}
        />
        <Button
          variant="primary"
          onClick={() =>
            void savePlanning({
              phase1Start: start,
              evaluationDate: evalDate,
              foods,
              preparations: prep,
            })
          }
        >
          Salvar o planejamento
        </Button>
      </div>
    </Card>
  );
}

function Fase1({
  p,
  today,
  records,
}: {
  p: FodmapProtocol;
  today: string;
  records: NonNullable<ReturnType<typeof useDays>>;
}) {
  const start = p.phase1Start ?? today;
  const day = phase1Day(p, today);
  const evalDate = p.evaluationDate ?? defaultEvaluationDate(start);
  const baseline = phase1Baseline(records, start);
  const current = last7Average(records, today);
  const suggestion = phase1Evaluation(baseline, current);
  const weeks4 = diffDays(today, start) >= 27;
  return (
    <>
      <Card
        title={
          today < start
            ? `A fase 1 começa em ${formatDayMonth(start)}`
            : `Fase 1 · dia ${day?.day} de ${day?.total}`
        }
      >
        <div className={styles.pilha}>
          <p>{FASE1_TEXTOS.completa}</p>
          <p>
            <strong>Registre todo dia:</strong> {FASE1_TEXTOS.registrar}
          </p>
          <div className={styles.linha}>
            <ButtonLink to="/registro" variant="primary">
              Registrar meu dia
            </ButtonLink>
            <ButtonLink to="/guia/fodmap">Lista de FODMAPs</ButtonLink>
          </div>
          <p className="secundario">Avaliação em {formatDayMonth(evalDate)}.</p>
        </div>
      </Card>
      {today >= evalDate ? (
        <Card label="Avaliação da fase 1" title="Os sintomas caíram de forma clara?">
          <div className={styles.pilha}>
            <p>
              Linha de base: {nota(baseline)}. Últimos 7 dias: {nota(current)}.
            </p>
            <p>
              Sugestão do app:{' '}
              {suggestion === 'sim' ? 'Sim, caíram de forma clara.' : 'Não ficou claro.'}
            </p>
            <div className={styles.linha}>
              <Button
                variant={suggestion === 'sim' ? 'primary' : 'secondary'}
                onClick={() => void answerPhase1(true, today, baseline)}
              >
                Sim, caíram de forma clara
              </Button>
              <Button
                variant={suggestion === 'nao' ? 'primary' : 'secondary'}
                onClick={() => void answerPhase1(false, today, baseline)}
              >
                Não ficou claro
              </Button>
            </div>
            {!weeks4 ? (
              <Note>
                Antes de 4 semanas, dá para seguir até completar as 4 semanas e avaliar de novo.
              </Note>
            ) : null}
            <Note>{FASE1_TEXTOS.restringirMais}</Note>
          </div>
        </Card>
      ) : null}
    </>
  );
}

function Fase2({
  p,
  today,
  records,
}: {
  p: FodmapProtocol;
  today: string;
  records: NonNullable<ReturnType<typeof useDays>>;
}) {
  const idx = currentTestIndex(p.tests);
  const t = idx >= 0 ? p.tests[idx] : undefined;
  return (
    <>
      <Card label="Fase 2" title="Um grupo por vez">
        <p>{FASE2_TEXTOS.umGrupo}</p>
        <ul className={styles.lista}>
          {p.tests.map((x, i) => (
            <li key={x.group} className={styles.item}>
              <span>
                {label(x.group)} ({x.food})
              </span>
              <span className={styles.numero}>
                {x.result
                  ? RESULTADO_LABEL[x.result]
                  : i === idx
                    ? x.start
                      ? 'em teste'
                      : 'próximo'
                    : ''}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      {t ? (
        <Teste
          key={`${t.group}-${t.start ?? 'novo'}`}
          p={p}
          t={t}
          idx={idx}
          today={today}
          records={records}
        />
      ) : null}
    </>
  );
}

function Teste({
  p,
  t,
  idx,
  today,
  records,
}: {
  p: FodmapProtocol;
  t: FodmapTest;
  idx: number;
  today: string;
  records: NonNullable<ReturnType<typeof useDays>>;
}) {
  const [chosen, setChosen] = useState<FodmapResult | undefined>(undefined);
  const earliest = earliestNextStart(p.tests, idx);
  if (!t.start) {
    const waiting = earliest !== undefined && today < earliest;
    return (
      <Card title={`Próximo grupo: ${label(t.group)}`}>
        <div className={styles.pilha}>
          <p>
            Alimento: {t.food}. Porções: {t.days.map((d) => d.portion).join(', ')}.
          </p>
          {waiting ? (
            <p>Pausa: volte ao baixo teor até {formatDayMonth(addDays(earliest, -1))}.</p>
          ) : null}
          <p className="secundario">{FASE2_TEXTOS.umPorVez}</p>
          <RadioList
            legend="Dias de pausa depois do teste"
            value={String(t.pauseDays) as '2' | '3'}
            onChange={(v) => void setPauseDays(idx, v === '2' ? 2 : 3)}
            options={[
              { value: '2', label: '2 dias' },
              { value: '3', label: '3 dias' },
            ]}
          />
          <Button variant="primary" disabled={waiting} onClick={() => void startTest(idx, today)}>
            Começar o teste de {label(t.group).toLowerCase()} hoje
          </Button>
        </div>
      </Card>
    );
  }
  const n = diffDays(today, t.start) + 1;
  const scores = testScores(records, t);
  const baseline = testBaseline(records, t.start, idx > 0 ? p.tests[idx - 1] : undefined);
  const atypical = t.days.some((d) => d.atypical);
  const suggestion = suggestTestResult(scores, baseline, atypical);
  const done = n > 3;
  return (
    <Card
      title={`Teste de ${label(t.group).toLowerCase()} · ${done ? 'conclusão' : `dia ${n} de 3`}`}
    >
      <div className={styles.pilha}>
        <ul className={styles.lista}>
          {t.days.map((d, i) => (
            <li key={i}>
              <div className={styles.item}>
                <strong>
                  Dia {i + 1} · {formatDayMonth(addDays(t.start as string, i))}
                </strong>
                <span className={styles.numero}>nota {scores[i] ?? 'sem dado'}</span>
              </div>
              <p style={{ margin: '4px 0' }}>
                {t.food}: {d.portion}
              </p>
              <CheckList
                items={[
                  {
                    id: 'atipico',
                    label: 'Foi um dia atípico?',
                    detail: 'Estresse, sono ruim, pré-menstrual',
                  },
                ]}
                checked={() => Boolean(d.atypical)}
                onToggle={(_, on) => void setAtypical(idx, i, on)}
              />
            </li>
          ))}
        </ul>
        {!done ? (
          <>
            <p className="secundario">
              Registre os sintomas de 0 a 10 e o tipo de Bristol no registro do dia.
            </p>
            <ButtonLink to="/registro" variant="primary">
              Registrar meu dia
            </ButtonLink>
          </>
        ) : (
          <>
            <p>
              Linha de base: {nota(baseline)}. Aumento em cada dia:{' '}
              {scores
                .map((s) =>
                  s === undefined || baseline === undefined
                    ? 'sem dado'
                    : formatDecimal(s - baseline),
                )
                .join(', ')}
              .
            </p>
            <p>
              <strong>Sugestão do app: {RESULTADO_LABEL[suggestion]}.</strong>
            </p>
            {suggestion === 'inconclusivo' ? <p>Vale repetir este grupo depois da pausa.</p> : null}
            <RadioList
              legend="Conclusão"
              value={chosen ?? (suggestion === 'inconclusivo' ? undefined : suggestion)}
              onChange={setChosen}
              options={(['liberado', 'quantidade', 'gatilho'] as FodmapResult[]).map((r) => ({
                value: r,
                label: RESULTADO_LABEL[r],
              }))}
            />
            <div className={styles.linha}>
              <Button
                variant="primary"
                disabled={!(chosen ?? (suggestion === 'inconclusivo' ? undefined : suggestion))}
                onClick={() => {
                  const r = chosen ?? (suggestion === 'inconclusivo' ? undefined : suggestion);
                  if (r) void concludeTest(idx, r, baseline, suggestion);
                }}
              >
                Salvar a conclusão
              </Button>
              <Button variant="ghost" onClick={() => void repeatTest(idx)}>
                Repetir depois da pausa
              </Button>
            </div>
            <p className="secundario">
              Pausa até {formatDayMonth(pauseEnd(t) ?? today)}, voltando ao baixo teor.
            </p>
          </>
        )}
      </div>
    </Card>
  );
}

function Fase3({ p, today }: { p: FodmapProtocol; today: string }) {
  const col = (r: FodmapResult) => p.tests.filter((t) => t.result === r);
  return (
    <>
      <Card label="Fase 3" title="O que eu aprendi">
        <div className={styles.pilha}>
          {(['liberado', 'quantidade', 'gatilho'] as FodmapResult[]).map((r) => (
            <div key={r}>
              <p className={styles.rotulo}>{RESULTADO_LABEL[r]}</p>
              {col(r).length === 0 ? (
                <p className="secundario">Nenhum grupo.</p>
              ) : (
                <BulletList items={col(r).map((t) => `${label(t.group)} (${t.food})`)} />
              )}
            </div>
          ))}
          <p>{EFEITO_ACUMULATIVO}</p>
          <p>{FASE3_TEXTOS.testeDeNovo}</p>
          <p className={styles.coracao}>{FASE3_TEXTOS.objetivo}</p>
          <CalendarButtons
            label="Testar de novo daqui a 3 meses"
            event={fodmapRetestEvent(addDays(today, 90))}
          />
        </div>
      </Card>
      <Button variant="ghost" onClick={() => void resetProtocol()}>
        Recomeçar o protocolo
      </Button>
    </>
  );
}
