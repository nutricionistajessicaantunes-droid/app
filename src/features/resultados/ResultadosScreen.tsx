import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { SEGUNDO_GRUPO_DETECCAO, type CareReason } from '../../content/alertas';
import { getLesson } from '../../content/curso';
import { RESULTADO_LABEL, TABELA_TESTE } from '../../content/fodmap';
import { PADROES_ORIENTACAO, PADROES_SEM_DADOS } from '../../content/padroes';
import { CENARIOS } from '../../content/reavaliacao';
import { addDays } from '../../logic/dates';
import { bristolByDay, weeklySummaries } from '../../logic/charts';
import { enoughForPatterns, findPatterns } from '../../logic/patterns';
import { BristolChart, EvacuationsChart, HabitsChart, SymptomEnergyChart } from './Charts';
import { Button } from '../../ui/Button';
import {
  useDays,
  useFodmap,
  useLessons,
  useNotices,
  usePlan,
  useProfile,
  useReadings,
  useStoredHabits,
} from '../../app/data';
import { useToday } from '../../app/useToday';
import { allHabits } from '../../logic/activeHabits';
import { formatDayMonth } from '../../logic/dates';
import { formatDecimal, joinPt } from '../../logic/format';
import { currentFreeWeek, shiftWeek } from '../../logic/weeks';
import { summarizeWeek } from '../../logic/week';
import { BristolBadge } from '../../ui/BristolPicker';
import { ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Screen } from '../../ui/Screen';
import styles from './Resultados.module.css';

export function Component() {
  const today = useToday();
  const profile = useProfile();
  const plan = usePlan();
  const stored = useStoredHabits();
  const [offset, setOffset] = useState(0);
  const base = currentFreeWeek(today, profile?.readingWeekday ?? 0);
  const week = shiftWeek(base, offset);
  const records = useDays(week.start, week.end);
  const history = useDays(addDays(today, -62), today);
  const readings = useReadings();
  const lessons = useLessons();
  const fodmap = useFodmap();
  const notices = useNotices();
  const [shareMsg, setShareMsg] = useState('');

  if (
    !profile ||
    plan === undefined ||
    !stored ||
    !records ||
    !history ||
    !readings ||
    !lessons ||
    fodmap === undefined ||
    !notices
  )
    return null;
  const habitsAll = allHabits(plan ?? undefined, stored);
  const weeks = weeklySummaries(history, habitsAll, today, profile.readingWeekday);
  const patterns = findPatterns(history, today);
  const doneTasks = [...lessons]
    .filter((l) => l.task.status === 'concluida')
    .sort((a, b) => a.lessonId - b.lessonId);
  const careNotices = notices.filter((n) => n.kind === 'acompanhamento');

  // Na semana em andamento, os dias que ainda não chegaram não contam.
  const inProgress = week.end > today;
  const s = summarizeWeek({
    records,
    habits: habitsAll,
    start: week.start,
    end: inProgress ? today : week.end,
  });
  const modes = s.bristol.modes;

  return (
    <Screen
      title="Resultados"
      subtitle="O padrão da semana é o que conta. O dia isolado não diz nada."
    >
      <Card label="Tua semana">
        <div className={styles.seletor}>
          <button
            type="button"
            className={styles.seta}
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Semana anterior"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <p className={styles.periodo} aria-live="polite">
            {offset === 0 ? 'Esta semana' : 'Semana'} · {formatDayMonth(week.start)} a{' '}
            {formatDayMonth(week.end)}
          </p>
          <button
            type="button"
            className={styles.seta}
            onClick={() => setOffset((o) => Math.min(0, o + 1))}
            disabled={offset >= 0}
            aria-label="Semana seguinte"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>

        <p className="secundario">
          {s.registeredDays === 1 ? '1 dia registrado' : `${s.registeredDays} dias registrados`} de{' '}
          {s.totalDays}
          {inProgress ? ' até hoje' : ''}.
        </p>

        <dl className={styles.dados}>
          <div>
            <dt>Tipo de Bristol mais frequente</dt>
            <dd>
              {modes.length === 1 && modes[0] ? (
                <BristolBadge type={modes[0]} size="md" />
              ) : modes.length > 1 ? (
                `Os tipos ${joinPt(modes.map(String))} apareceram o mesmo número de vezes.`
              ) : (
                'Nenhum tipo registrado nesta semana.'
              )}
            </dd>
          </div>
          <div>
            <dt>Evacuações</dt>
            <dd>
              {s.evacuations.total === 0
                ? 'Nenhuma registrada.'
                : `${s.evacuations.total} ${s.evacuations.total === 1 ? 'vez' : 'vezes'}, em ${s.evacuations.days} ${s.evacuations.days === 1 ? 'dia' : 'dias'}.`}
            </dd>
          </div>
          <div>
            <dt>Média de sintomas</dt>
            <dd>
              {s.symptomAverage === undefined
                ? 'Sem sintomas registrados.'
                : `${formatDecimal(s.symptomAverage)} de 10`}
            </dd>
          </div>
          <div>
            <dt>Média de energia</dt>
            <dd>
              {s.energyAverage === undefined
                ? 'Sem registro de energia.'
                : `${formatDecimal(s.energyAverage)} de 10`}
            </dd>
          </div>
        </dl>

        {s.habits.length > 0 ? (
          <>
            <h3 className={styles.subtitulo}>Hábitos</h3>
            <ul className={styles.habitos}>
              {s.habits.map((h) => (
                <li key={h.id}>
                  <span>{h.label}</span>
                  <span className={styles.contagem}>
                    {h.done} de {h.activeDays}
                    {h.reached ? (
                      <>
                        <Check size={16} aria-hidden="true" />
                        <span className="sr-only">, meta atingida</span>
                      </>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {s.weak ? (
          <p className="secundario">
            Com poucos dias registrados, a leitura fica fraca. Vale olhar mesmo assim.
          </p>
        ) : null}
      </Card>
      <ButtonLink to={`/leitura?inicio=${week.start}&fim=${inProgress ? today : week.end}`} block>
        Fazer a leitura desta semana
      </ButtonLink>

      <Card label="Gráficos">
        <h3 className={styles.subtitulo}>Tipo de Bristol por dia</h3>
        <BristolChart points={bristolByDay(history, today)} />
        <h3 className={styles.subtitulo}>Sintomas e energia por semana</h3>
        <SymptomEnergyChart weeks={weeks} />
        <h3 className={styles.subtitulo}>Dias de cada hábito por semana</h3>
        <HabitsChart weeks={weeks} />
        <h3 className={styles.subtitulo}>Evacuações por semana</h3>
        <EvacuationsChart weeks={weeks} />
      </Card>

      <Card label="Padrões encontrados">
        {!enoughForPatterns(history, today) ? (
          <p>{PADROES_SEM_DADOS}</p>
        ) : patterns.length === 0 ? (
          <p className="secundario">Nenhum padrão apareceu nas últimas 8 semanas.</p>
        ) : (
          <ul className={styles.habitos}>
            {patterns.map((p) => (
              <li key={p.id}>
                <strong>Possível padrão.</strong> {p.text}
              </li>
            ))}
          </ul>
        )}
        {patterns.length > 0 ? <p className="secundario">{PADROES_ORIENTACAO}</p> : null}
      </Card>

      <Card label="Histórico">
        {readings.length === 0 &&
        doneTasks.length === 0 &&
        !plan?.reevaluation &&
        careNotices.length === 0 ? (
          <p className="secundario">
            As leituras da semana, as tarefas concluídas e a reavaliação aparecem aqui.
          </p>
        ) : null}
        {readings.length > 0 ? (
          <>
            <h3 className={styles.subtitulo}>Leituras da semana</h3>
            <ul className={styles.habitos}>
              {[...readings]
                .sort((a, b) => (a.start < b.start ? 1 : -1))
                .map((r) => (
                  <li key={r.id}>
                    <Link to={`/leitura?inicio=${r.start}&fim=${r.end}`}>
                      {formatDayMonth(r.start)} a {formatDayMonth(r.end)}
                    </Link>
                    {r.keep ? <span className="secundario"> · Mantenho: {r.keep}</span> : null}
                    {r.adjust ? <span className="secundario"> · Ajusto: {r.adjust}</span> : null}
                  </li>
                ))}
            </ul>
          </>
        ) : null}
        {doneTasks.length > 0 ? (
          <>
            <h3 className={styles.subtitulo}>Tarefas concluídas</h3>
            <ul className={styles.habitos}>
              {doneTasks.map((l) => (
                <li key={l.lessonId}>
                  <Link to={`/aula/${l.lessonId}`}>
                    Aula {l.lessonId} · {getLesson(l.lessonId)?.task.name}
                  </Link>
                  {typeof l.task.data.resposta === 'string' && l.task.data.resposta ? (
                    <span className="secundario"> · {l.task.data.resposta}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {plan?.reevaluation?.chosen ? (
          <>
            <h3 className={styles.subtitulo}>Reavaliação</h3>
            <p>
              <Link to="/plano/reavaliacao">{CENARIOS[plan.reevaluation.chosen].titulo}</Link>
            </p>
          </>
        ) : null}
        {fodmap?.tests.some((t) => t.result) ? (
          <>
            <h3 className={styles.subtitulo}>Protocolo low FODMAP</h3>
            <ul className={styles.habitos}>
              {fodmap.tests
                .filter((t) => t.result)
                .map((t) => (
                  <li key={t.group}>
                    {TABELA_TESTE.find((x) => x.group === t.group)?.label} ({t.food}):{' '}
                    {RESULTADO_LABEL[t.result as keyof typeof RESULTADO_LABEL]}
                  </li>
                ))}
            </ul>
          </>
        ) : null}
        {careNotices.length > 0 ? (
          <>
            <h3 className={styles.subtitulo}>Sinais que pedem acompanhamento</h3>
            <ul className={styles.habitos}>
              {careNotices.map((n) => (
                <li key={n.id}>
                  {formatDayMonth(n.detectedAt)}: teus registros mostraram{' '}
                  {SEGUNDO_GRUPO_DETECCAO[n.reason as CareReason] ?? n.reason}.
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Card>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <ButtonLink to="/ficha" variant="primary">
          Ficha para a consulta
        </ButtonLink>
        <Button
          onClick={() => {
            const text = summaryText(s, inProgress);
            const nav = navigator as Navigator;
            if (typeof nav.share === 'function') {
              nav.share({ text }).catch(() => undefined);
            } else {
              nav.clipboard
                ?.writeText(text)
                .then(() => setShareMsg('Resumo copiado.'))
                .catch(() => setShareMsg('Não foi possível copiar.'));
            }
          }}
        >
          Compartilhar resumo
        </Button>
      </div>
      <p role="status" aria-live="polite" className="secundario">
        {shareMsg}
      </p>
    </Screen>
  );
}

function summaryText(s: ReturnType<typeof summarizeWeek>, inProgress: boolean): string {
  const lines = [
    `Minha semana, de ${formatDayMonth(s.start)} a ${formatDayMonth(s.end)}${inProgress ? ' (até hoje)' : ''}:`,
    `${s.registeredDays} dias registrados.`,
    s.bristol.modes.length > 0
      ? `Tipo de Bristol mais frequente: ${joinPt(s.bristol.modes.map(String))}.`
      : 'Nenhum tipo registrado.',
    `Evacuações: ${s.evacuations.total}.`,
    s.symptomAverage !== undefined
      ? `Média de sintomas: ${formatDecimal(s.symptomAverage)} de 10.`
      : '',
    s.energyAverage !== undefined
      ? `Média de energia: ${formatDecimal(s.energyAverage)} de 10.`
      : '',
    ...s.habits.map((h) => `${h.label}: ${h.done} de ${h.activeDays} dias.`),
  ];
  return lines.filter(Boolean).join('\n');
}
