import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ACOMPANHAMENTO_TEXTO } from '../../content/alertas';
import { BAND_LABEL, getBristol } from '../../content/bristol';
import { LEITURA_TEXTOS } from '../../content/registro';
import { TAG_LABEL } from '../../content/registro';
import {
  useDays,
  useDiary,
  useLessons,
  usePlan,
  useProfile,
  useReadings,
  useStoredHabits,
} from '../../app/data';
import { useToday } from '../../app/useToday';
import { allHabits } from '../../logic/activeHabits';
import { hasAlternation } from '../../logic/bristol';
import { commonFactorsSentence, commonFactorsSuggestion } from '../../logic/commonFactors';
import { addDays, formatDayLong, formatDayMonth, isValidDayKey } from '../../logic/dates';
import { joinPt } from '../../logic/format';
import { findPatterns, JANELA_PADROES_DIAS } from '../../logic/patterns';
import {
  manualReadingPeriod,
  pendingReading,
  readingId,
  type ReadingPeriod,
} from '../../logic/readings';
import { bristolOf } from '../../logic/records';
import { summarizeWeek } from '../../logic/week';
import type { Bristol, WeeklyReading } from '../../types';
import { BristolBadge } from '../../ui/BristolPicker';
import { Button, ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { TEXTO_APOIO_COPIA, useSaveBackup } from '../copia/useSaveBackup';
import { saveReading, type ReadingAnswers } from '../processo/actions';
import styles from '../processo/Processo.module.css';

/** Leitura da semana (seção 6.8): quatro perguntas, cinco minutos. */
export function Component() {
  const today = useToday();
  const [params] = useSearchParams();
  const profile = useProfile();
  const plan = usePlan();
  const lessons = useLessons();
  const readings = useReadings();
  const stored = useStoredHabits();

  const period: ReadingPeriod | undefined = useMemo(() => {
    if (!profile || plan === undefined || !lessons || !readings) return undefined;
    const inicio = params.get('inicio');
    const fim = params.get('fim');
    if (inicio && fim && isValidDayKey(inicio) && isValidDayKey(fim) && inicio <= fim)
      return { context: 'livre', start: inicio, end: fim };
    if (params.get('manual') === '1') return manualReadingPeriod(today);
    return (
      pendingReading(profile, lessons, plan ?? undefined, readings, today) ??
      manualReadingPeriod(today)
    );
  }, [profile, plan, lessons, readings, params, today]);

  const records = useDays(
    addDays(period?.end ?? today, -(JANELA_PADROES_DIAS + 6)),
    period?.end ?? today,
  );
  const diary = useDiary(period?.start ?? today, period?.end ?? today);

  if (!period || !profile || plan === undefined || !stored || !records || !diary || !readings)
    return null;
  const existing = readings.find((r) => r.id === readingId(period));
  return (
    <Leitura
      key={readingId(period)}
      period={period}
      existing={existing}
      habits={allHabits(plan ?? undefined, stored)}
      records={records}
      diary={diary}
    />
  );
}

function Leitura({
  period,
  existing,
  habits,
  records,
  diary,
}: {
  period: ReadingPeriod;
  existing?: WeeklyReading;
  habits: ReturnType<typeof allHabits>;
  records: NonNullable<ReturnType<typeof useDays>>;
  diary: NonNullable<ReturnType<typeof useDiary>>;
}) {
  const s = summarizeWeek({ records, habits, start: period.start, end: period.end, diary });
  const below = s.habits.filter((h) => !h.reached);
  const reached = s.habits.filter((h) => h.reached);
  const modes = s.bristol.modes;
  // Alternância em duas semanas seguidas (seção 6.15, segundo grupo).
  const prevTypes = records
    .filter((r) => r.date >= addDays(period.start, -7) && r.date < period.start)
    .map((r) => bristolOf(r))
    .filter((t): t is Bristol => t !== undefined);
  const twoWeeksAlternation = s.bristol.alternation && hasAlternation(prevTypes);
  const patterns = findPatterns(records, period.end);
  const lowest = [...s.habits].sort((a, b) => a.done - b.done)[0];
  const adjustSuggestions = [
    lowest && !lowest.reached ? `Reforçar: ${lowest.label.toLowerCase()}` : undefined,
    s.commonFactors[0] ? `Cuidar de: ${s.commonFactors[0].label}` : undefined,
  ].filter((x): x is string => Boolean(x));

  const [answers, setAnswers] = useState<ReadingAnswers>({
    commonNotes: existing?.commonNotes ?? commonFactorsSuggestion(s.commonFactors),
    keep: existing?.keep ?? joinPt(reached.map((h) => h.label.toLowerCase())),
    adjust: existing?.adjust ?? '',
    decision: existing?.decision,
  });
  const [saved, setSaved] = useState(false);
  const inPlan = period.context === 'plano' || period.context === 'ciclo';

  const save = (decision?: 'avancar' | 'repetir') =>
    void saveReading(period, s, { ...answers, decision }).then(() => setSaved(true));

  const title =
    period.context === 'plano' && period.planBlockIndex !== undefined
      ? `Semana ${period.planBlockIndex + 1} do plano`
      : 'Tua semana';

  if (saved) return <Salva />;

  return (
    <Screen title="Leitura da semana" back="/" backLabel="Hoje">
      <p>{LEITURA_TEXTOS.intro}</p>
      <p className="secundario">
        {title} · {formatDayMonth(period.start)} a {formatDayMonth(period.end)} ·{' '}
        {s.registeredDays === 1 ? '1 dia registrado' : `${s.registeredDays} dias registrados`}
      </p>
      {s.weak ? <Note>{LEITURA_TEXTOS.poucosDias}</Note> : null}

      <Card label="Pergunta 1" title={LEITURA_TEXTOS.p1}>
        {s.habits.length === 0 ? (
          <p className="secundario">Nenhum hábito ativo nesta semana.</p>
        ) : (
          <ul className={styles.lista}>
            {s.habits.map((h) => (
              <li key={h.id} className={styles.item}>
                <span>{h.label}</span>
                <span className={styles.numero}>
                  {h.done} de {h.activeDays}{' '}
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
        )}
        {below.length > 0 ? <p>{LEITURA_TEXTOS.p1Abaixo}</p> : null}
      </Card>

      <Card label="Pergunta 2" title={LEITURA_TEXTOS.p2}>
        {modes.length === 1 && modes[0] ? (
          <div className={styles.pilha}>
            <BristolBadge type={modes[0]} size="md" />
            <p className="secundario">
              {getBristol(modes[0]).name} · {BAND_LABEL[s.bristol.band ?? 'saudavel']}
            </p>
          </div>
        ) : modes.length > 1 ? (
          <p>Os tipos {joinPt(modes.map(String))} apareceram o mesmo número de vezes.</p>
        ) : (
          <p className="secundario">Nenhum tipo registrado nesta semana.</p>
        )}
        {s.bristol.daysWithType > 0 ? (
          <ul className={styles.barras} aria-label="Tipos na semana">
            {s.bristol.distribution.map((n, i) => (
              <li key={i}>
                <span>Tipo {i + 1}</span>
                <span className={styles.trilho} aria-hidden="true">
                  <span
                    className={styles.cheio}
                    style={{ display: 'block', width: `${(n / s.bristol.daysWithType) * 100}%` }}
                  />
                </span>
                <span className={styles.numero}>{n}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p style={{ marginTop: 12 }}>
          {s.evacuations.total === 0
            ? 'Nenhuma evacuação registrada.'
            : `${s.evacuations.total} ${s.evacuations.total === 1 ? 'evacuação' : 'evacuações'} na semana, em ${s.evacuations.days} ${s.evacuations.days === 1 ? 'dia' : 'dias'}.`}
        </p>
        <Note>{LEITURA_TEXTOS.p2Nota}</Note>
        {s.bristol.alternation ? <p>{LEITURA_TEXTOS.p2Alternancia}</p> : null}
        {twoWeeksAlternation ? (
          <p>
            Teus registros mostram alternância entre preso e solto em duas semanas seguidas. Isso
            pede acompanhamento, sem urgência. {ACOMPANHAMENTO_TEXTO}{' '}
            <Link to="/alertas">Ver os sinais</Link>
          </p>
        ) : null}
      </Card>

      <Card label="Pergunta 3" title={LEITURA_TEXTOS.p3}>
        {s.symptomDays.length === 0 ? (
          <p className="secundario">
            {s.mildSymptomDays.length > 0
              ? `Nenhum dia chegou a 4. Teve ${s.mildSymptomDays.length === 1 ? '1 dia' : `${s.mildSymptomDays.length} dias`} com sintoma leve.`
              : 'Nenhum dia com sintoma nesta semana.'}
          </p>
        ) : (
          <ul className={styles.lista}>
            {s.symptomDays.map((d) => (
              <li key={d.date}>
                <div className={styles.item}>
                  <strong>{formatDayLong(d.date)}</strong>
                  <span className={styles.numero}>nota {d.score}</span>
                </div>
                {d.tags.length > 0 ? (
                  <p className="secundario" style={{ margin: '4px 0 0' }}>
                    {d.tags.map((t) => TAG_LABEL[t]).join(', ')}
                  </p>
                ) : null}
                {d.note ? <p style={{ margin: '4px 0 0' }}>{d.note}</p> : null}
              </li>
            ))}
          </ul>
        )}
        {s.commonFactors.length > 0 ? <p>{commonFactorsSentence(s.commonFactors)}</p> : null}
        <div className={styles.campo}>
          <label htmlFor="l-comum">{LEITURA_TEXTOS.p3Campo}</label>
          <textarea
            id="l-comum"
            className={styles.textarea}
            value={answers.commonNotes}
            onChange={(e) => setAnswers((a) => ({ ...a, commonNotes: e.target.value }))}
          />
        </div>
        {patterns.map((p) => (
          <p key={p.id} className={styles.recado} style={{ marginTop: 12 }}>
            {p.text}
          </p>
        ))}
      </Card>

      <Card label="Pergunta 4" title={LEITURA_TEXTOS.p4}>
        <div className={styles.pilha}>
          <div className={styles.campo}>
            <label htmlFor="l-mantenho">Mantenho</label>
            <textarea
              id="l-mantenho"
              className={styles.textarea}
              value={answers.keep}
              onChange={(e) => setAnswers((a) => ({ ...a, keep: e.target.value }))}
            />
          </div>
          <div className={styles.campo}>
            <label htmlFor="l-ajusto">Ajusto</label>
            <input
              id="l-ajusto"
              type="text"
              value={answers.adjust}
              onChange={(e) => setAnswers((a) => ({ ...a, adjust: e.target.value }))}
            />
            {adjustSuggestions.length > 0 ? (
              <div className={styles.linha}>
                {adjustSuggestions.map((sug) => (
                  <Button
                    key={sug}
                    variant="ghost"
                    onClick={() => setAnswers((a) => ({ ...a, adjust: sug }))}
                  >
                    {sug}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
          <Note>{LEITURA_TEXTOS.p4Nota}</Note>
        </div>
      </Card>

      {inPlan && below.length > 0 ? (
        <div className={styles.pilha}>
          <p>{LEITURA_TEXTOS.algumAbaixo}</p>
          <Button variant="primary" block onClick={() => save('repetir')}>
            Repetir a semana
          </Button>
          <Button block onClick={() => save('avancar')}>
            Avançar mesmo assim
          </Button>
        </div>
      ) : (
        <Button variant="primary" block onClick={() => save(inPlan ? 'avancar' : undefined)}>
          Salvar a leitura
        </Button>
      )}
    </Screen>
  );
}

function Salva() {
  const { save, status, message } = useSaveBackup();
  return (
    <Screen title="Leitura salva" back="/" backLabel="Hoje">
      <Card tone="sucesso">
        <p role="status">Leitura da semana salva.</p>
      </Card>
      <Card label="Cópia de segurança">
        <p>Bom momento para salvar uma cópia dos teus registros.</p>
        <p className="secundario pequeno">{TEXTO_APOIO_COPIA}</p>
        <div className={styles.linha} style={{ marginTop: 12 }}>
          <Button
            onClick={() => void save()}
            disabled={status === 'salvando'}
            icon={status === 'salvo' ? <Check size={18} /> : undefined}
          >
            Salvar uma cópia
          </Button>
          <ButtonLink to="/" variant="ghost">
            Voltar para Hoje
          </ButtonLink>
        </div>
        <p role="status" aria-live="polite" className="secundario pequeno">
          {message}
        </p>
      </Card>
    </Screen>
  );
}
