import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useDays, usePlan, useProfile, useStoredHabits } from '../../app/data';
import { useToday } from '../../app/useToday';
import { allHabits } from '../../logic/activeHabits';
import { formatDayMonth } from '../../logic/dates';
import { formatDecimal, joinPt } from '../../logic/format';
import { currentFreeWeek, shiftWeek } from '../../logic/weeks';
import { summarizeWeek } from '../../logic/week';
import { BristolBadge } from '../../ui/BristolPicker';
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

  if (!profile || plan === undefined || !stored || !records) return null;

  const s = summarizeWeek({
    records,
    habits: allHabits(plan ?? undefined, stored),
    start: week.start,
    end: week.end,
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
          {s.totalDays}.
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
    </Screen>
  );
}
