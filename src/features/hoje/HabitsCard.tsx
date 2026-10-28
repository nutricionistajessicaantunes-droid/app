import { Check } from 'lucide-react';
import { COPOS_POR_DIA } from '../../config';
import { formatInt } from '../../logic/format';
import { habitDone, habitsDoneCount, type ActiveHabit } from '../../logic/habits';
import { waterGoal } from '../../logic/water';
import type { DayKey, DayRecord, Profile } from '../../types';
import { setWaterCups, toggleHabit } from './habitActions';
import { Card } from '../../ui/Card';
import { Counter } from '../../ui/Counter';
import styles from './Hoje.module.css';

export function WaterCounter({
  day,
  cups,
  profile,
  waterHabitId,
}: {
  day: DayKey;
  cups: number;
  profile: Profile;
  waterHabitId?: string;
}) {
  const goal = profile.weightKg ? waterGoal(profile.weightKg) : undefined;
  const cupMl =
    goal?.cupMl ??
    (profile.waterGoalMl ? Math.round(profile.waterGoalMl / COPOS_POR_DIA / 10) * 10 : undefined);
  return (
    <div>
      <Counter
        label="Copos de água hoje"
        value={cups}
        onChange={(n) => void setWaterCups(day, n, waterHabitId)}
        valueText={
          <>
            <span className={styles.frase} style={{ fontSize: '1.75rem' }}>
              {cups}
            </span>{' '}
            de {COPOS_POR_DIA} copos
          </>
        }
      />
      <p className={styles.aguaTexto}>
        3 de manhã, 3 à tarde, 2 antes de dormir
        {cupMl ? ` · copo de cerca de ${formatInt(cupMl)} ml` : ''}
      </p>
    </div>
  );
}

export function HabitList({
  day,
  habits,
  record,
}: {
  day: DayKey;
  habits: ActiveHabit[];
  record: DayRecord | undefined;
}) {
  return (
    <ul className={styles.habitos}>
      {habits.map((h) => {
        const done = habitDone(record, h.id);
        return (
          <li key={h.id}>
            <button
              type="button"
              className={styles.habito}
              aria-pressed={done}
              onClick={() => void toggleHabit(day, h.id, !done)}
            >
              <span className={styles.marca} aria-hidden="true">
                {done ? <Check size={18} strokeWidth={3} /> : null}
              </span>
              <span>{h.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** "Teus hábitos de hoje", com toque direto e a água em copos (seção 6.3). */
export function HabitsCard({
  day,
  habits,
  record,
  profile,
}: {
  day: DayKey;
  habits: ActiveHabit[];
  record: DayRecord | undefined;
  profile: Profile;
}) {
  const water = habits.find((h) => h.isWater);
  return (
    <Card label="Teus hábitos de hoje">
      {habits.length > 0 ? (
        <>
          <HabitList day={day} habits={habits} record={record} />
          <p className={styles.legenda} style={{ textAlign: 'left' }}>
            {habitsDoneCount(record, habits)} de {habits.length} hoje. A meta é cinco dias de sete.
          </p>
        </>
      ) : null}
      {profile.waterGoalMl ? (
        <div className={habits.length > 0 ? styles.agua : undefined}>
          <WaterCounter
            day={day}
            cups={record?.waterCups ?? 0}
            profile={profile}
            waterHabitId={water?.id}
          />
        </div>
      ) : null}
    </Card>
  );
}
