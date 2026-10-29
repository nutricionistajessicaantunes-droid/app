import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PLAN_HABITS } from '../../content/plano';
import { PLANO_MINIMO_TEXTOS } from '../../content/reavaliacao';
import { usePlan, useProfile, useStoredHabits } from '../../app/data';
import { useToday } from '../../app/useToday';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList } from '../../ui/CheckList';
import { Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { CalendarButtons } from '../lembretes/CalendarButtons';
import { revisaoMesEvent } from '../lembretes/reminders';
import { saveMinimumPlan, type HabitChoice } from '../processo/actions';
import styles from '../processo/Processo.module.css';

const MAX = 3;

/** Plano mínimo (seção 6.9, página 16 do caderno). */
export function Component() {
  const today = useToday();
  const plan = usePlan();
  const profile = useProfile();
  const stored = useStoredHabits();
  const navigate = useNavigate();
  const current = (stored ?? []).filter((h) => plan?.minimumPlan?.includes(h.id));
  const [picked, setPicked] = useState<HabitChoice[] | null>(null);
  const [custom, setCustom] = useState('');
  const [day, setDay] = useState<number | undefined>(undefined);
  if (plan === undefined || !profile || !stored) return null;

  const list = picked ?? current.map((h) => ({ label: h.label, isWater: h.isWater }));
  const reviewDay = day ?? profile.monthlyReviewDay;
  const options = [
    ...PLAN_HABITS.map((h) => ({ id: h.id, label: h.label, isWater: h.isWater })),
    ...list
      .filter((c) => !PLAN_HABITS.some((h) => h.label === c.label))
      .map((c) => ({ id: `outro:${c.label}`, label: c.label, isWater: c.isWater })),
  ];
  const isOn = (label: string) => list.some((c) => c.label === label);
  const toggle = (label: string, isWater?: boolean) => {
    if (isOn(label)) setPicked(list.filter((c) => c.label !== label));
    else if (list.length < MAX) setPicked([...list, { label, isWater }]);
  };
  const examples =
    profile.path === 'refluxo'
      ? [...PLANO_MINIMO_TEXTOS.exemplos].reverse()
      : PLANO_MINIMO_TEXTOS.exemplos;

  return (
    <Screen title="Plano mínimo" back="/plano" backLabel="Plano">
      <p>{PLANO_MINIMO_TEXTOS.intro}</p>
      <Card label={`Escolha ${MAX} hábitos · ${list.length} de ${MAX}`}>
        <CheckList
          items={options.map((o) => ({ id: o.id, label: o.label }))}
          checked={(id) => isOn(options.find((o) => o.id === id)?.label ?? '')}
          onToggle={(id) => {
            const o = options.find((x) => x.id === id);
            if (o) toggle(o.label, o.isWater);
          }}
        />
        <div className={styles.campo} style={{ marginTop: 12 }}>
          <label htmlFor="pm-outro">Escrever outro</label>
          <div className={styles.linha}>
            <input
              id="pm-outro"
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
            <Button
              disabled={!custom.trim() || list.length >= MAX}
              onClick={() => {
                toggle(custom.trim());
                setCustom('');
              }}
            >
              Incluir
            </Button>
          </div>
        </div>
        <div className={styles.pilha} style={{ marginTop: 12 }}>
          {examples.map((e) => (
            <p key={e} className="secundario">
              {e}
            </p>
          ))}
        </div>
      </Card>

      <Card label="Dia da minha revisão do mês">
        <p>{PLANO_MINIMO_TEXTOS.revisao}</p>
        <div className={styles.campo}>
          <label htmlFor="pm-dia">Dia do mês, de 1 a 28</label>
          <select
            id="pm-dia"
            value={reviewDay ?? ''}
            onChange={(e) => setDay(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Escolher</option>
            {Array.from({ length: 28 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Dia {n}
              </option>
            ))}
          </select>
        </div>
        {reviewDay ? (
          <CalendarButtons
            label="Revisão do mês na agenda"
            event={revisaoMesEvent(today, reviewDay, profile.registerTime ?? '21:00')}
          />
        ) : null}
      </Card>

      <Button
        variant="primary"
        block
        disabled={list.length === 0}
        onClick={() => void saveMinimumPlan(today, list, reviewDay).then(() => navigate('/'))}
      >
        Salvar o plano mínimo
      </Button>
      {list.length > 0 && list.length < MAX ? <Note>Você pode escolher até três.</Note> : null}
    </Screen>
  );
}
