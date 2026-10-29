import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FIBRAS } from '../../content/agua-fibras';
import { MEDIDAS_REFLUXO } from '../../content/cardapios';
import { AULA14, AULA5_SUGESTOES, KIT_CRISE_ITENS, type Lesson } from '../../content/curso';
import { TABELA_IMPLANTACAO } from '../../content/rotina';
import { saveProfile } from '../../db/repo';
import { useDays, useLessons, usePlan, useProfile, useStoredHabits } from '../../app/data';
import { useToday } from '../../app/useToday';
import { allHabits } from '../../logic/activeHabits';
import { formatDayMonth, weekdayFullName } from '../../logic/dates';
import { effectiveStatus } from '../../logic/plan';
import {
  isTaskActiveOn,
  isTaskResultReady,
  otherRunningTask,
  taskProgress,
  taskWindow,
} from '../../logic/tasks';
import type { LessonProgress, Profile } from '../../types';
import { Button, ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList } from '../../ui/CheckList';
import { BulletList, Note } from '../../ui/Misc';
import { WaterCalculator } from '../guia/WaterCalculator';
import { CalendarButtons } from '../lembretes/CalendarButtons';
import { leituraEvent, registroEvent } from '../lembretes/reminders';
import {
  concludeTask,
  openSemanaZero,
  pauseTask,
  resetTask,
  resumeTask,
  setTaskData,
  startTask,
  type HabitChoice,
} from '../processo/actions';
import styles from '../processo/Processo.module.css';
import { TaskResult } from './TaskResults';
import { suggestionFor } from './taskSuggestion';

/** A tarefa da aula: configurar, começar, acompanhar e ver o resultado (seção 6.6). */
export function TaskPanel({ lesson }: { lesson: Lesson }) {
  const today = useToday();
  const lessons = useLessons();
  const profile = useProfile();
  const plan = usePlan();
  const stored = useStoredHabits();
  const p = lessons?.find((l) => l.lessonId === lesson.id);
  const w = taskWindow(p);
  const records = useDays(w?.start ?? today, w?.end ?? today);
  if (!lessons || !profile || plan === undefined || !stored || !records) return null;
  const t = lesson.task;
  const durationText =
    t.durationDays === null
      ? 'Sem prazo'
      : t.durationDays === 'fim_do_plano'
        ? 'No fim do plano'
        : `${t.durationDays} dias`;
  const status = p?.task.status ?? 'nao_iniciada';
  const habits = allHabits(plan ?? undefined, stored).filter(
    (h) => h.source === `aula${lesson.id}` && w && h.activeFrom === w.start,
  );

  let body: React.ReactNode;
  if (lesson.id === 17) {
    const st = effectiveStatus(plan ?? undefined, today);
    body =
      st === 'reavaliacao' || st === 'concluido' ? (
        <ButtonLink to="/plano/reavaliacao" variant="primary">
          {status === 'concluida' ? 'Ver a reavaliação' : 'Fazer a reavaliação do dia 21'}
        </ButtonLink>
      ) : (
        <p>Disponível no fim do plano de 21 dias.</p>
      );
  } else if (lesson.id === 15) {
    body = <SemanaZeroLink done={status === 'concluida'} />;
  } else if (lesson.id === 9) {
    body = (
      <div className={styles.pilha}>
        {status === 'concluida' ? <p>Ficha salva.</p> : null}
        <ButtonLink to="/ficha" variant="primary">
          Abrir a ficha para a consulta
        </ButtonLink>
      </div>
    );
  } else if (lesson.id === 12) {
    body = (
      <div className={styles.pilha}>
        {status === 'concluida' ? <p>Planejamento salvo.</p> : null}
        <ButtonLink to="/fodmap" variant="primary">
          Abrir o planejamento do protocolo
        </ButtonLink>
      </div>
    );
  } else if (lesson.id === 10) {
    body = <Aula10 p={p} profile={profile} />;
  } else if (lesson.id === 6) {
    body = <Aula6 p={p} />;
  } else if (lesson.id === 14) {
    body = <Aula14 p={p} />;
  } else if (status === 'concluida') {
    body = <Concluida p={p as LessonProgress} today={today} />;
  } else if (status === 'pausada' && p) {
    body = (
      <div className={styles.pilha}>
        <p>Tarefa pausada.</p>
        <Button variant="primary" onClick={() => void resumeTask(p, today)}>
          Retomar a tarefa
        </Button>
        <Note>A contagem recomeça hoje.</Note>
      </div>
    );
  } else if (p && w && isTaskResultReady(p, today)) {
    body = <Resultado p={p} records={records} habits={habits} />;
  } else if (p && w && isTaskActiveOn(p, today)) {
    const prog = taskProgress(p, today);
    body = (
      <div className={styles.pilha}>
        <p className={styles.selo}>
          Dia {prog?.day} de {prog?.total}
        </p>
        {habits.length > 0 ? (
          <BulletList
            items={habits.map((h) => (h.trigger ? `${h.label}: ${h.trigger}` : h.label))}
          />
        ) : null}
        {lesson.id === 16 ? (
          <p>
            No dia da leitura ({weekdayFullName(profile.readingWeekday)}), faça a primeira leitura
            da semana pela tela Hoje.
          </p>
        ) : (
          <p>Os campos da tarefa aparecem dentro do Registro do dia.</p>
        )}
        <div className={styles.linha}>
          <ButtonLink to="/registro" variant="primary">
            Registrar meu dia
          </ButtonLink>
          <Button variant="ghost" onClick={() => void pauseTask(lesson.id, today)}>
            Pausar a tarefa
          </Button>
        </div>
      </div>
    );
  } else {
    body = <Configurar lessonId={lesson.id} lessons={lessons} profile={profile} p={p} />;
  }

  return (
    <Card label={`Tarefa · ${durationText}`} title={t.name}>
      <div className={styles.pilha}>
        {t.instruction ? <p>{t.instruction}</p> : null}
        {t.fields ? <p className="secundario">{t.fields}</p> : null}
        {t.notes && t.notes.length > 0 ? <BulletList items={t.notes} /> : null}
        {body}
      </div>
    </Card>
  );
}

function SemanaZeroLink({ done }: { done: boolean }) {
  const navigate = useNavigate();
  return (
    <div className={styles.pilha}>
      {done ? <p>Tarefa concluída: o plano começou.</p> : null}
      <Button
        variant={done ? 'secondary' : 'primary'}
        onClick={() => void openSemanaZero().then(() => navigate('/plano/semana-zero'))}
      >
        Abrir a semana zero
      </Button>
    </div>
  );
}

function Concluida({ p, today }: { p: LessonProgress; today: string }) {
  const answer = typeof p.task.data.resposta === 'string' ? p.task.data.resposta : '';
  const date = p.task.completedAt ? p.task.completedAt.slice(0, 10) : undefined;
  return (
    <div className={styles.pilha}>
      <p>Tarefa concluída{date ? ` em ${formatDayMonth(date)}` : ''}.</p>
      {answer ? <p className="secundario">{answer}</p> : null}
      {p.lessonId === 13 ? (
        <Button onClick={() => void resetTask(13, today)}>Escolher mais dois</Button>
      ) : (
        <Button variant="ghost" onClick={() => void resetTask(p.lessonId, today)}>
          Refazer a tarefa
        </Button>
      )}
    </div>
  );
}

function Resultado({
  p,
  records,
  habits,
}: {
  p: LessonProgress;
  records: NonNullable<ReturnType<typeof useDays>>;
  habits: ReturnType<typeof allHabits>;
}) {
  const w = taskWindow(p);
  const lesson = p.lessonId;
  const [answer, setAnswer] = useState<string | null>(null);
  if (!w) return null;
  const question =
    lesson === 1
      ? 'O que se repetiu?'
      : lesson === 3
        ? 'O que esses dias tinham em comum?'
        : lesson === 5
          ? 'A mudança mais fácil de manter'
          : undefined;
  const value = answer ?? suggestionFor(lesson, records, w, habits);
  const bothReached = lesson === 13 && habits.length >= 2;
  return (
    <div className={styles.pilha}>
      <p className={styles.selo}>Resultado</p>
      <TaskResult p={p} records={records} w={w} habits={habits} />
      {question ? (
        <div className={styles.campo}>
          <label htmlFor="t-resposta">{question}</label>
          <textarea
            id="t-resposta"
            className={styles.textarea}
            value={value}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      ) : null}
      {bothReached ? <p>Se os dois pegarem, você escolhe mais dois na semana seguinte.</p> : null}
      <Button variant="primary" onClick={() => void concludeTask(lesson, { resposta: value })}>
        Concluir a tarefa
      </Button>
    </div>
  );
}

/** Configuração antes de começar (horário, fibras, mudanças, medidas, hábitos com gatilho). */
function Configurar({
  lessonId,
  lessons,
  profile,
  p,
}: {
  lessonId: number;
  lessons: LessonProgress[];
  profile: Profile;
  p?: LessonProgress;
}) {
  const today = useToday();
  const [warned, setWarned] = useState(false);
  const [time, setTime] = useState(profile.bathroomTime ?? '');
  const [regTime, setRegTime] = useState(profile.registerTime ?? '21:30');
  const [weekday, setWeekday] = useState(profile.readingWeekday);
  const [picked, setPicked] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [triggers, setTriggers] = useState<Record<string, string>>({});
  const [where, setWhere] = useState('');
  const previous =
    lessonId === 13 ? ((p?.task.data.habits as HabitChoice[] | undefined) ?? []) : [];
  const other = otherRunningTask(lessons, lessonId, today);

  const options: {
    id: string;
    label: string;
    detail?: string;
    isWater?: boolean;
    trigger?: string;
  }[] =
    lessonId === 4
      ? FIBRAS.map((f) => ({ id: f.name, label: f.name }))
      : lessonId === 5
        ? AULA5_SUGESTOES.map((s) => ({ id: s.label, label: s.label, isWater: s.isWater }))
        : lessonId === 8
          ? MEDIDAS_REFLUXO.map((m) => ({ id: m, label: m }))
          : lessonId === 13
            ? TABELA_IMPLANTACAO.filter((t) => !previous.some((x) => x.label === t.habito)).map(
                (t) => ({
                  id: t.habito,
                  label: t.habito,
                  detail: `${t.gatilho}, ${t.faco.toLowerCase()}`,
                  isWater: t.isWater,
                  trigger: `${t.gatilho}, ${t.faco.toLowerCase()}`,
                }),
              )
            : [];
  const max = lessonId === 5 || lessonId === 8 ? 3 : lessonId === 4 ? 3 : lessonId === 13 ? 2 : 0;
  const customs = picked.filter((x) => !options.some((o) => o.id === x));
  type Option = (typeof options)[number];
  const allOptions: Option[] = [...options, ...customs.map((c): Option => ({ id: c, label: c }))];
  const toggle = (id: string) =>
    setPicked((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < max ? [...cur, id] : cur,
    );

  const ready =
    max === 0
      ? lessonId === 2
        ? Boolean(time)
        : true
      : lessonId === 4
        ? picked.length === 3
        : lessonId === 8
          ? picked.length === 3
          : lessonId === 13
            ? picked.length === 2
            : picked.length > 0;

  const start = async () => {
    if (other && !warned) {
      setWarned(true);
      return;
    }
    const choices: HabitChoice[] = allOptions
      .filter((o) => picked.includes(o.id))
      .map((o) => ({
        label: o.label,
        isWater: o.isWater,
        trigger: lessonId === 13 ? (triggers[o.id] ?? o.trigger) : undefined,
        whereWritten: lessonId === 13 ? where || undefined : undefined,
      }));
    if (lessonId === 2 && time) await saveProfile({ bathroomTime: time });
    if (lessonId === 16) await saveProfile({ registerTime: regTime, readingWeekday: weekday });
    await startTask(
      lessonId,
      today,
      lessonId === 4 ? { fibras: picked } : lessonId === 2 ? { horario: time } : {},
      lessonId === 13 ? [...previous, ...choices] : choices,
    );
  };

  return (
    <div className={styles.pilha}>
      {lessonId === 2 ? (
        <div className={styles.campo}>
          <label htmlFor="t2-hora">Horário da rotina de banheiro</label>
          <input id="t2-hora" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      ) : null}
      {lessonId === 16 ? (
        <>
          <div className={styles.campo}>
            <label htmlFor="t16-hora">Horário do registro</label>
            <input
              id="t16-hora"
              type="time"
              value={regTime}
              onChange={(e) => setRegTime(e.target.value)}
            />
          </div>
          <div className={styles.campo}>
            <label htmlFor="t16-dia">Dia da leitura da semana</label>
            <select
              id="t16-dia"
              value={weekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <option key={d} value={d}>
                  {weekdayFullName(d)}
                </option>
              ))}
            </select>
          </div>
          {regTime ? (
            <CalendarButtons label="Lembrete do registro" event={registroEvent(today, regTime)} />
          ) : null}
          {regTime ? (
            <CalendarButtons
              label="Lembrete da leitura"
              event={leituraEvent(today, weekday, regTime)}
            />
          ) : null}
        </>
      ) : null}
      {lessonId === 13 && previous.length > 0 ? (
        <p>Continuam: {previous.map((h) => h.label).join(' e ')}. Escolha mais dois.</p>
      ) : null}
      {max > 0 ? (
        <>
          <p className={styles.rotulo}>
            {lessonId === 4
              ? 'Escolha 3 fibras'
              : lessonId === 13
                ? 'Escolha 2 hábitos'
                : `Escolha até ${max}`}{' '}
            · {picked.length} de {max}
          </p>
          <CheckList
            items={allOptions.map((o) => ({ id: o.id, label: o.label, detail: o.detail }))}
            checked={(id) => picked.includes(id)}
            onToggle={(id) => toggle(id)}
          />
          {lessonId !== 4 ? (
            <div className={styles.campo}>
              <label htmlFor="t-outro">Escrever outro</label>
              <div className={styles.linha}>
                <input
                  id="t-outro"
                  type="text"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                />
                <Button
                  disabled={!custom.trim() || picked.length >= max}
                  onClick={() => {
                    toggle(custom.trim());
                    setCustom('');
                  }}
                >
                  Incluir
                </Button>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
      {lessonId === 13 && picked.length > 0 ? (
        <>
          {picked.map((id) => (
            <div key={id} className={styles.campo}>
              <label htmlFor={`t13-${id}`}>Gatilho de {id.toLowerCase()}</label>
              <input
                id={`t13-${id}`}
                type="text"
                placeholder="Depois que eu ___, eu ___"
                value={triggers[id] ?? options.find((o) => o.id === id)?.trigger ?? ''}
                onChange={(e) => setTriggers((t) => ({ ...t, [id]: e.target.value }))}
              />
            </div>
          ))}
          <div className={styles.campo}>
            <label htmlFor="t13-onde">Onde você vai ver isso escrito?</label>
            <input
              id="t13-onde"
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
            />
          </div>
        </>
      ) : null}
      {warned && other ? (
        <div className={styles.recado} role="status">
          <p>
            Você já está com a tarefa da aula {other}. Duas coisas novas por vez funcionam melhor.
          </p>
          <div className={styles.linha}>
            <Button
              variant="primary"
              onClick={() => void pauseTask(other, today).then(() => start())}
            >
              Pausar a anterior
            </Button>
            <Button onClick={() => void start()}>Fazer as duas</Button>
          </div>
        </div>
      ) : (
        <Button variant="primary" disabled={!ready} onClick={() => void start()}>
          Começar a tarefa
        </Button>
      )}
    </div>
  );
}

function Aula6({ p }: { p?: LessonProgress }) {
  const kit = (p?.task.data.kit as string[] | undefined) ?? [];
  const where = typeof p?.task.data.ondeGuardei === 'string' ? p.task.data.ondeGuardei : '';
  const [local, setLocal] = useState<string | null>(null);
  const done = p?.task.status === 'concluida';
  return (
    <div className={styles.pilha}>
      <CheckList
        items={KIT_CRISE_ITENS.map((i) => ({ id: i, label: i }))}
        checked={(id) => kit.includes(id)}
        onToggle={(id, on) => {
          const next = on ? [...kit, id] : kit.filter((x) => x !== id);
          void setTaskData(6, { kit: next }).then(() => {
            if (next.length === KIT_CRISE_ITENS.length) void concludeTask(6);
          });
        }}
      />
      <div className={styles.campo}>
        <label htmlFor="t6-onde">Onde eu guardei o kit</label>
        <input
          id="t6-onde"
          type="text"
          value={local ?? where}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={() => local !== null && void setTaskData(6, { ondeGuardei: local })}
        />
      </div>
      {done ? <p>Kit montado.</p> : null}
      <ButtonLink to="/crise">Se a crise vier</ButtonLink>
    </div>
  );
}

function Aula10({ p, profile }: { p?: LessonProgress; profile: Profile }) {
  const [open, setOpen] = useState(false);
  const agua = Boolean(p?.task.data.agua) || Boolean(profile.waterGoalMl);
  return (
    <div className={styles.pilha}>
      <p>{agua ? 'Meta de água calculada.' : 'Calcule a tua meta de água.'}</p>
      <Button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Fechar a calculadora' : 'Calcular a meta de água'}
      </Button>
      {open ? (
        <WaterCalculator
          profile={profile}
          onSaved={() => {
            setOpen(false);
            void setTaskData(10, { agua: true }).then(() => {
              if (p?.task.data.fibrasSalvas) void concludeTask(10);
            });
          }}
        />
      ) : null}
      <p className={styles.rotulo}>Meu dia de fibras</p>
      <p>
        {p?.task.data.fibrasSalvas ? 'Dia de fibras salvo.' : 'Monte o teu dia de fibras no Guia.'}
      </p>
      <ButtonLink to="/guia/fibras#meu-dia">Abrir Meu dia de fibras</ButtonLink>
    </div>
  );
}

function Aula14({ p }: { p?: LessonProgress }) {
  const data = p?.task.data ?? {};
  const lista = (data.lista as string[] | undefined) ?? [];
  const preparos = (data.preparos as Record<string, string> | undefined) ?? {};
  const [parecido, setParecido] = useState<string | null>(null);
  const [faltou, setFaltou] = useState<string | null>(null);
  const done = p?.task.status === 'concluida';
  return (
    <div className={styles.pilha}>
      <p className={styles.rotulo}>Lista base</p>
      <CheckList
        items={AULA14.listaBase.map((i) => ({ id: i, label: i }))}
        checked={(id) => lista.includes(id)}
        onToggle={(id, on) =>
          void setTaskData(14, { lista: on ? [...lista, id] : lista.filter((x) => x !== id) })
        }
      />
      <p className={styles.rotulo}>Os três preparos</p>
      {AULA14.preparos.map((pr) => (
        <div key={pr} className={styles.campo}>
          <label htmlFor={`t14-${pr}`}>{pr}</label>
          <select
            id={`t14-${pr}`}
            value={preparos[pr] ?? ''}
            onChange={(e) =>
              void setTaskData(14, { preparos: { ...preparos, [pr]: e.target.value } })
            }
          >
            <option value="">Dia do preparo</option>
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <option key={d} value={weekdayFullName(d)}>
                {weekdayFullName(d)}
              </option>
            ))}
          </select>
        </div>
      ))}
      <CheckList
        items={[{ id: 'foto', label: 'Tirei a foto do prato' }]}
        checked={() => Boolean(data.foto)}
        onToggle={(_, on) => void setTaskData(14, { foto: on })}
      />
      <Note>O app não guarda fotos.</Note>
      <div className={styles.campo}>
        <label htmlFor="t14-parecido">O que ficou parecido com o modelo</label>
        <input
          id="t14-parecido"
          type="text"
          value={parecido ?? (data.parecido as string) ?? ''}
          onChange={(e) => setParecido(e.target.value)}
          onBlur={() => parecido !== null && void setTaskData(14, { parecido })}
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="t14-faltou">O que faltou</label>
        <input
          id="t14-faltou"
          type="text"
          value={faltou ?? (data.faltou as string) ?? ''}
          onChange={(e) => setFaltou(e.target.value)}
          onBlur={() => faltou !== null && void setTaskData(14, { faltou })}
        />
      </div>
      {done ? (
        <p>Tarefa concluída.</p>
      ) : (
        <Button
          variant="primary"
          onClick={() =>
            void concludeTask(14, {
              parecido: parecido ?? data.parecido,
              faltou: faltou ?? data.faltou,
            })
          }
        >
          Marcar como feita
        </Button>
      )}
    </div>
  );
}
