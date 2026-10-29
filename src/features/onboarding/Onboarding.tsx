import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router';
import { useToday } from '../../app/useToday';
import {
  ALERTA_TEXTOS,
  RED_FLAGS,
  SITUACOES_CUIDADO,
  SITUACOES_CUIDADO_TEXTO,
} from '../../content/alertas';
import { LESSONS } from '../../content/curso';
import { ONBOARDING, PATH_OPTIONS } from '../../content/onboarding';
import { addDays, weekdayFullName } from '../../logic/dates';
import type { CourseStage, Path, RedFlagId } from '../../types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList, RadioList } from '../../ui/CheckList';
import { FirstRun } from '../../ui/FirstRun';
import firstRunStyles from '../../ui/FirstRun.module.css';
import { CalendarButtons } from '../lembretes/CalendarButtons';
import { leituraEvent, registroEvent } from '../lembretes/reminders';
import { finishOnboarding, initialAnswers, type OnboardingAnswers } from './finishOnboarding';

const RestoreFlow = lazy(() => import('../ajustes/RestoreFlow'));

const TOTAL = 6;
const NENHUM = 'nenhum';

export function Onboarding() {
  const today = useToday();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [restoring, setRestoring] = useState(false);
  const [a, setA] = useState<OnboardingAnswers>(initialAnswers);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<OnboardingAnswers>) => setA((cur) => ({ ...cur, ...patch }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  if (restoring) {
    return (
      <FirstRun title="Trazer meus registros" onBack={() => setRestoring(false)}>
        <p className={firstRunStyles.texto}>
          Escolha o arquivo da cópia que você salvou. Ele tem um nome como modulacao-copia, com a
          data.
        </p>
        <Suspense fallback={null}>
          <RestoreFlow hasExistingData={false} onDone={() => navigate('/', { replace: true })} />
        </Suspense>
      </FirstRun>
    );
  }

  if (step === 0) {
    return (
      <FirstRun
        title="Boas-vindas"
        footer={
          <>
            <Button variant="primary" block onClick={next}>
              {ONBOARDING.comecar}
            </Button>
            <Button variant="link" onClick={() => setRestoring(true)}>
              {ONBOARDING.jaUsei}
            </Button>
          </>
        }
      >
        <p className={firstRunStyles.texto}>{ONBOARDING.boasVindas}</p>
        <p className={firstRunStyles.texto}>{ONBOARDING.privacidade}</p>
      </FirstRun>
    );
  }

  const progress = { current: step, total: TOTAL };

  if (step === 1) {
    return (
      <FirstRun
        title={ONBOARDING.nome}
        onBack={back}
        step={progress}
        footer={
          <Button variant="primary" block onClick={next}>
            {a.name.trim() ? 'Continuar' : 'Pular'}
          </Button>
        }
      >
        <label className={firstRunStyles.campo} htmlFor="nome">
          <span className={firstRunStyles.rotulo}>Teu nome ou apelido (opcional)</span>
        </label>
        <input
          id="nome"
          type="text"
          autoComplete="given-name"
          value={a.name}
          maxLength={40}
          onChange={(e) => set({ name: e.target.value })}
        />
      </FirstRun>
    );
  }

  if (step === 2) {
    return (
      <FirstRun
        title={ONBOARDING.caminho}
        onBack={back}
        step={progress}
        footer={
          <Button variant="primary" block onClick={next} disabled={!a.path}>
            Continuar
          </Button>
        }
      >
        <RadioList<Path>
          legend={ONBOARDING.caminho}
          hideLegend
          options={PATH_OPTIONS.map((p) => ({ value: p.id, label: p.label }))}
          value={a.path}
          onChange={(path) => set({ path })}
        />
        <p className={firstRunStyles.texto}>{ONBOARDING.caminhoNota}</p>
      </FirstRun>
    );
  }

  if (step === 3) {
    const answered = a.noneOfThese || a.redFlags.length > 0;
    return (
      <FirstRun
        title="Antes de começar"
        onBack={back}
        step={progress}
        footer={
          <Button variant="primary" block onClick={next} disabled={!answered}>
            Continuar
          </Button>
        }
      >
        <p className={firstRunStyles.rotulo}>{ONBOARDING.antes}</p>
        <CheckList
          label={ONBOARDING.antes}
          items={[
            ...RED_FLAGS.map((f) => ({ id: f.id, label: f.label })),
            { id: NENHUM, label: ALERTA_TEXTOS.nenhumDestes },
          ]}
          checked={(id) => (id === NENHUM ? a.noneOfThese : a.redFlags.includes(id as RedFlagId))}
          onToggle={(id, on) => {
            if (id === NENHUM) {
              set({ noneOfThese: on, redFlags: on ? [] : a.redFlags });
            } else {
              const flags = on
                ? [...a.redFlags, id as RedFlagId]
                : a.redFlags.filter((f) => f !== id);
              set({ redFlags: flags, noneOfThese: flags.length > 0 ? false : a.noneOfThese });
            }
          }}
        />
        {a.redFlags.length > 0 ? (
          <Card tone="alerta" title="Esse sinal pede avaliação médica" role="alert">
            <p>{ALERTA_TEXTOS.cartao}</p>
            <p>{ALERTA_TEXTOS.naoSignificaGrave}</p>
            <p>Você pode continuar usando o app enquanto marca essa avaliação.</p>
          </Card>
        ) : null}
        <p className={firstRunStyles.rotulo} style={{ marginTop: 28 }}>
          {ONBOARDING.situacoes} <span className="secundario">(opcional)</span>
        </p>
        <CheckList
          label={ONBOARDING.situacoes}
          items={SITUACOES_CUIDADO.map((s) => ({ id: s.id, label: s.label }))}
          checked={(id) => Boolean(a.care[id as keyof typeof a.care])}
          onToggle={(id, on) => set({ care: { ...a.care, [id]: on || undefined } })}
        />
        <p className={firstRunStyles.texto}>{SITUACOES_CUIDADO_TEXTO}</p>
      </FirstRun>
    );
  }

  if (step === 4) {
    const minDay = addDays(today, -20);
    const ready =
      a.stage === 'comecando' ||
      (a.stage === 'aulas' && a.lastLesson) ||
      (a.stage === 'plano' && a.day1 && a.day1 >= minDay && a.day1 <= today);
    return (
      <FirstRun
        title={ONBOARDING.ondeEsta}
        onBack={back}
        step={progress}
        footer={
          <Button variant="primary" block onClick={next} disabled={!ready}>
            Continuar
          </Button>
        }
      >
        <RadioList<CourseStage>
          legend={ONBOARDING.ondeEsta}
          hideLegend
          options={[
            { value: 'comecando', label: ONBOARDING.comecando },
            { value: 'aulas', label: ONBOARDING.algumasAulas },
            { value: 'plano', label: ONBOARDING.noPlano },
          ]}
          value={a.stage}
          onChange={(stage) => set({ stage })}
        />
        {a.stage === 'aulas' ? (
          <label className={firstRunStyles.campo}>
            <span className={firstRunStyles.rotulo}>Qual foi a última aula que você assistiu?</span>
            <select
              value={a.lastLesson ?? ''}
              onChange={(e) =>
                set({ lastLesson: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">Escolha a aula</option>
              {LESSONS.map((l) => (
                <option key={l.id} value={l.id}>
                  Aula {l.id} · {l.title}
                </option>
              ))}
            </select>
            <span className="secundario pequeno">
              As aulas anteriores ficam marcadas como assistidas.
            </span>
          </label>
        ) : null}
        {a.stage === 'plano' ? (
          <label className={firstRunStyles.campo}>
            <span className={firstRunStyles.rotulo}>Qual foi o dia 1 do teu plano?</span>
            <input
              type="date"
              min={minDay}
              max={today}
              value={a.day1 ?? ''}
              onChange={(e) => set({ day1: e.target.value || undefined })}
            />
            <span className="secundario pequeno">Pode ser até 20 dias atrás.</span>
          </label>
        ) : null}
      </FirstRun>
    );
  }

  if (step === 5) {
    return (
      <FirstRun
        title={ONBOARDING.quando}
        onBack={back}
        step={progress}
        footer={
          <Button variant="primary" block onClick={next}>
            Continuar
          </Button>
        }
      >
        <label className={firstRunStyles.campo}>
          <span className={firstRunStyles.rotulo}>Horário do registro</span>
          <input
            type="time"
            value={a.registerTime}
            onChange={(e) => set({ registerTime: e.target.value || '21:30' })}
          />
        </label>
        <p className={firstRunStyles.texto}>{ONBOARDING.sugestaoAula16}</p>
        <label className={firstRunStyles.campo}>
          <span className={firstRunStyles.rotulo}>Dia da leitura da semana</span>
          <select
            value={a.readingWeekday}
            onChange={(e) => set({ readingWeekday: Number(e.target.value) })}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <option key={d} value={d}>
                {weekdayFullName(d)}
              </option>
            ))}
          </select>
        </label>
        <p className={firstRunStyles.texto}>{ONBOARDING.domingo}</p>
        <Card label="Lembretes na agenda (opcional)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CalendarButtons
              label="Registro do dia, todos os dias"
              event={registroEvent(today, a.registerTime)}
            />
            <CalendarButtons
              label="Leitura da semana"
              event={leituraEvent(today, a.readingWeekday, a.registerTime)}
            />
          </div>
        </Card>
      </FirstRun>
    );
  }

  return (
    <FirstRun
      title={ONBOARDING.fim}
      onBack={back}
      step={{ current: TOTAL, total: TOTAL }}
      footer={
        <Button
          variant="primary"
          block
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await finishOnboarding(a, today);
            navigate('/', { replace: true });
          }}
        >
          Ir para Hoje
        </Button>
      }
    >
      <p className={firstRunStyles.texto}>
        O registro leva um minuto. Toque em "Registrar meu dia" na tela Hoje.
      </p>
    </FirstRun>
  );
}
