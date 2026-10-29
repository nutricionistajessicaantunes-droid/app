import { getLesson } from '../../content/curso';
import {
  PREBIOTICOS,
  PREBIOTICOS_TEXTOS,
  PREBIOTICO_BANANA_VERDE,
  PROBIOTICOS,
} from '../../content/prebioticos';
import { SYMPTOM_LABEL } from '../../content/registro';
import { habitDone, type ActiveHabit } from '../../logic/habits';
import { TASK_FIELD, taskProgress, type TaskFieldKey } from '../../logic/tasks';
import type { DayKey, DayRecord, LessonProgress, Profile, SymptomId } from '../../types';
import { Card } from '../../ui/Card';
import { Chip } from '../../ui/Chip';
import { Choice } from '../../ui/Choice';
import { Counter } from '../../ui/Counter';
import { ScaleSlider } from '../../ui/ScaleSlider';
import { DiaryBlock } from './DiaryBlock';
import styles from '../processo/Processo.module.css';

type Draft = Partial<DayRecord>;

/** Campos diários das tarefas, dentro do Registro do dia (seção 6.6). */
export function TaskDailyFields({
  date,
  draft,
  update,
  lessons,
  ids,
  profile,
  habits,
  symptomsShown,
  waterShown,
}: {
  date: DayKey;
  draft: Draft;
  update: (patch: Partial<DayRecord>) => void;
  lessons: LessonProgress[];
  ids: number[];
  profile: Profile;
  habits: ActiveHabit[];
  symptomsShown: SymptomId[];
  waterShown: boolean;
}) {
  const fields = draft.taskFields ?? {};
  const set = (key: TaskFieldKey, value: unknown) =>
    update({ taskFields: { ...fields, [key]: value === '' ? undefined : value } });
  const text = (key: TaskFieldKey) =>
    typeof fields[key] === 'string' ? (fields[key] as string) : '';
  const yesNo = (key: TaskFieldKey) =>
    typeof fields[key] === 'boolean' ? (fields[key] ? 'sim' : 'nao') : undefined;
  const habitChips = (source: string) => {
    const list = habits.filter((h) => h.source === source);
    if (list.length === 0) return null;
    return (
      <ul className={styles.lista}>
        {list.map((h) => (
          <li key={h.id}>
            <Chip
              pressed={habitDone(draft as DayRecord, h.id)}
              onToggle={(on) => update({ habits: { ...(draft.habits ?? {}), [h.id]: on } })}
            >
              Cumpri: {h.label}
            </Chip>
          </li>
        ))}
      </ul>
    );
  };
  const slider = (id: SymptomId) =>
    symptomsShown.includes(id) ? null : (
      <ScaleSlider
        key={id}
        label={SYMPTOM_LABEL[id]}
        value={draft.symptoms?.[id]}
        onChange={(v) => update({ symptoms: { ...(draft.symptoms ?? {}), [id]: v } })}
      />
    );

  return (
    <>
      {ids.map((id) => {
        const p = lessons.find((l) => l.lessonId === id);
        const prog = taskProgress(p, date);
        const label = `Tarefa da aula ${id}${prog ? ` · dia ${prog.day} de ${prog.total}` : ''}`;
        const name = getLesson(id)?.task.name;
        let body: React.ReactNode = null;
        if (id === 1) {
          body = (
            <>
              <div className={styles.campo}>
                <label htmlFor="t1-sono">Horas de sono</label>
                <input
                  id="t1-sono"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={16}
                  step={0.5}
                  value={
                    typeof fields[TASK_FIELD.sono] === 'number'
                      ? String(fields[TASK_FIELD.sono])
                      : ''
                  }
                  onChange={(e) =>
                    set(
                      TASK_FIELD.sono,
                      e.target.value === '' ? undefined : Number(e.target.value.replace(',', '.')),
                    )
                  }
                />
              </div>
              <ScaleSlider
                label="Estresse do dia, de 0 a 10"
                value={
                  typeof fields[TASK_FIELD.estresse] === 'number'
                    ? (fields[TASK_FIELD.estresse] as number)
                    : undefined
                }
                onChange={(v) => set(TASK_FIELD.estresse, v)}
              />
              {!waterShown ? (
                <Counter
                  label="Copos de água"
                  value={draft.waterCups ?? 0}
                  onChange={(n) => update({ waterCups: n })}
                  valueText={`${draft.waterCups ?? 0} ${draft.waterCups === 1 ? 'copo' : 'copos'} de água`}
                />
              ) : null}
              <div className={styles.campo}>
                <label htmlFor="t1-comi">O que comi</label>
                <input
                  id="t1-comi"
                  type="text"
                  value={text(TASK_FIELD.comi)}
                  onChange={(e) => set(TASK_FIELD.comi, e.target.value)}
                />
              </div>
            </>
          );
        } else if (id === 2) {
          body = (
            <Choice
              legend="Sentei?"
              options={[
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' },
              ]}
              value={yesNo(TASK_FIELD.sentei)}
              onChange={(v) => set(TASK_FIELD.sentei, v === 'sim')}
            />
          );
        } else if (id === 4) {
          const fibras = (p?.task.data.fibras as string[] | undefined) ?? [];
          body = (
            <Choice
              legend="Fibra do dia"
              vertical
              options={fibras.map((f) => ({ value: f, label: f }))}
              value={text(TASK_FIELD.fibra) || undefined}
              onChange={(v) => set(TASK_FIELD.fibra, v)}
            />
          );
        } else if (id === 5 || id === 13) {
          body = habitChips(id === 5 ? 'aula5' : 'aula13');
        } else if (id === 7) {
          body = <DiaryBlock date={date} />;
        } else if (id === 8) {
          body = (
            <>
              {habitChips('aula8')}
              <Choice
                legend="Teve sintoma?"
                options={[
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' },
                ]}
                value={yesNo(TASK_FIELD.teveSintoma)}
                onChange={(v) => set(TASK_FIELD.teveSintoma, v === 'sim')}
              />
              <div className={styles.campo}>
                <label htmlFor="t8-comi">O que comi antes</label>
                <input
                  id="t8-comi"
                  type="text"
                  value={text(TASK_FIELD.comiAntes)}
                  onChange={(e) => set(TASK_FIELD.comiAntes, e.target.value)}
                />
              </div>
            </>
          );
        } else if (id === 11) {
          const sii = profile.path === 'gases_sii';
          const pre = [
            ...PREBIOTICOS.filter((x) => !(sii && x.alhoCebola)).map((x) => x.label),
            ...(sii ? [PREBIOTICO_BANANA_VERDE] : []),
          ];
          body = (
            <>
              {sii ? <p className={styles.ajuda}>{PREBIOTICOS_TEXTOS.comecePor}</p> : null}
              <Choice
                legend="Prebiótico do dia"
                vertical
                options={pre.map((x) => ({ value: x, label: x }))}
                value={text(TASK_FIELD.prebiotico) || undefined}
                onChange={(v) => set(TASK_FIELD.prebiotico, v)}
              />
              <Choice
                legend="Fermentado do dia"
                vertical
                options={PROBIOTICOS.map((x) => ({ value: x, label: x }))}
                value={text(TASK_FIELD.fermentado) || undefined}
                onChange={(v) => set(TASK_FIELD.fermentado, v)}
              />
              {slider('gases')}
              {slider('estufamento')}
            </>
          );
        }
        return (
          <Card key={id} label={label} title={name}>
            <div className={styles.pilha}>{body}</div>
          </Card>
        );
      })}
    </>
  );
}
