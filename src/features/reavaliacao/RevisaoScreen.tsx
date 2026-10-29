import { useNavigate } from 'react-router';
import { PLANO_MINIMO_TEXTOS } from '../../content/reavaliacao';
import { useDays, usePlan, useStoredHabits } from '../../app/data';
import { useToday } from '../../app/useToday';
import { allHabits } from '../../logic/activeHabits';
import { addDays, formatDayMonth } from '../../logic/dates';
import { formatDecimal, joinPt } from '../../logic/format';
import { habitStat } from '../../logic/habits';
import { monthlyWeeks } from '../../logic/monthly';
import { summarizeWeek } from '../../logic/week';
import { Button, ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { completeMonthlyReview } from '../processo/actions';
import styles from '../processo/Processo.module.css';

/** Revisão do mês (seção 6.9): as últimas 4 semanas e os hábitos do plano mínimo. */
export function Component() {
  const today = useToday();
  const plan = usePlan();
  const stored = useStoredHabits();
  const start = addDays(today, -27);
  const records = useDays(start, today);
  const navigate = useNavigate();
  if (plan === undefined || !stored || !records) return null;
  const habits = allHabits(plan ?? undefined, stored);
  const minimum = habits.filter((h) => plan?.minimumPlan?.includes(h.id));
  const weeks = monthlyWeeks(today).map((w) => summarizeWeek({ records, habits: minimum, ...w }));

  return (
    <Screen title="Revisão do mês" back="/" backLabel="Hoje">
      <p>{PLANO_MINIMO_TEXTOS.revisao}</p>
      <Card label="Últimas 4 semanas">
        <ul className={styles.lista}>
          {weeks.map((s) => (
            <li key={s.start}>
              <strong>
                {formatDayMonth(s.start)} a {formatDayMonth(s.end)}
              </strong>
              <p className="secundario" style={{ margin: '4px 0 0' }}>
                {s.registeredDays === 1
                  ? '1 dia registrado'
                  : `${s.registeredDays} dias registrados`}
                {s.bristol.modes.length > 0 ? ` · tipo ${joinPt(s.bristol.modes.map(String))}` : ''}
                {s.symptomAverage !== undefined
                  ? ` · sintomas ${formatDecimal(s.symptomAverage)}`
                  : ''}
              </p>
            </li>
          ))}
        </ul>
      </Card>
      <Card label="Plano mínimo">
        {minimum.length === 0 ? (
          <p>
            Você ainda não escolheu o plano mínimo.{' '}
            <ButtonLink to="/plano/minimo">Escolher</ButtonLink>
          </p>
        ) : (
          <ul className={styles.lista}>
            {minimum.map((h) => {
              const st = habitStat(records, h, start, today);
              return (
                <li key={h.id} className={styles.item}>
                  <span>{h.label}</span>
                  <span className={styles.numero}>
                    {st.done} de {st.activeDays} dias
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <Note>{PLANO_MINIMO_TEXTOS.retomeApenasEle}</Note>
      </Card>
      <Button
        variant="primary"
        block
        onClick={() => void completeMonthlyReview(today).then(() => navigate('/'))}
      >
        Concluir a revisão do mês
      </Button>
      <ButtonLink to="/ciclo" block>
        Começar um novo ciclo
      </ButtonLink>
    </Screen>
  );
}
