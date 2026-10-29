import { useNavigate } from 'react-router';
import { CRISE_SUGESTAO_TEXTO, SEM_EVACUAR_TEXTO } from '../../content/alertas';
import { getLesson } from '../../content/curso';
import { DIARREIA, VOLTA_ETAPAS } from '../../content/diarreia';
import { CAMINHOS, PLANO_TEXTOS, PLAN_THEMES } from '../../content/plano';
import { saveDay, saveLesson, setDismissed } from '../../db/repo';
import { crisisNoImprovement, crisisStage } from '../../logic/crisis';
import { formatDayCompact, formatDayMonth } from '../../logic/dates';
import type { ActiveHabit } from '../../logic/habits';
import type { NextStep } from '../../logic/nextStep';
import type { PlanNote } from '../../logic/planNotes';
import type { ReadingPeriod } from '../../logic/readings';
import type { CrisisState, DayRecord, PlanState, Profile } from '../../types';
import { Button, ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Counter } from '../../ui/Counter';
import {
  markImproved,
  markNoteSeen,
  openSemanaZero,
  repeatCurrentWeek,
  skipTaskSuggestion,
  snoozeCrisisSuggestion,
  turnOnCrisis,
} from '../processo/actions';
import styles from '../processo/Processo.module.css';

/** Cartões da Fase 2 na tela Hoje (seções 6.3, 6.7, 6.12, 7.12 e 7.13). */

export function CrisisCard({
  crisis,
  today,
  record,
}: {
  crisis: CrisisState;
  today: string;
  record?: DayRecord;
}) {
  const stage = crisisStage(crisis, today);
  const cups = record?.crisisCups ?? 0;
  const etapa = stage ? VOLTA_ETAPAS[stage.stage - 1] : undefined;
  return (
    <Card tone="destaque" label="Modo crise" title={DIARREIA.primeiroAgua}>
      <div className={styles.pilha}>
        <Counter
          label="Copos de líquido hoje"
          value={cups}
          onChange={(n) => void saveDay(today, { crisisCups: n })}
          valueText={`${cups} ${cups === 1 ? 'copo' : 'copos'} de líquido hoje`}
        />
        {crisisNoImprovement(crisis, today) ? <p role="alert">{DIARREIA.semMelhora}</p> : null}
        {etapa ? (
          <div className={styles.recado}>
            <p>
              <strong>A volta depois da crise · {etapa.dias}</strong>
            </p>
            <p>{stage?.holding ? DIARREIA.segure : etapa.texto}</p>
          </div>
        ) : (
          <Button onClick={() => void markImproved(today)}>Melhorei</Button>
        )}
        <ButtonLink to="/crise">Abrir o modo crise</ButtonLink>
      </div>
    </Card>
  );
}

export function CrisisSuggestionCard({ today }: { today: string }) {
  const navigate = useNavigate();
  return (
    <Card tone="alerta">
      <p>{CRISE_SUGESTAO_TEXTO}</p>
      <div className={styles.linha}>
        <Button
          variant="primary"
          onClick={() => void turnOnCrisis(today).then(() => navigate('/crise'))}
        >
          Abrir
        </Button>
        <Button variant="ghost" onClick={() => void snoozeCrisisSuggestion(today)}>
          Agora não
        </Button>
      </div>
    </Card>
  );
}

export function NoEvacuationCard({ dismissKey }: { dismissKey: string }) {
  return (
    <Card title="Três dias sem evacuar">
      <p>{SEM_EVACUAR_TEXTO}</p>
      <Button
        variant="ghost"
        onClick={() => void setDismissed(dismissKey, new Date().toISOString())}
      >
        Entendi
      </Button>
    </Card>
  );
}

export function AbsenceCard({ today, dismissKey }: { today: string; dismissKey: string }) {
  const close = () => void setDismissed(dismissKey, new Date().toISOString());
  return (
    <Card title="Retome hoje">
      <p>{PLANO_TEXTOS.retomar}</p>
      <div className={styles.linha}>
        <Button variant="primary" onClick={close}>
          Entendi
        </Button>
        <Button onClick={() => void repeatCurrentWeek(today).then(close)}>
          Repetir esta semana
        </Button>
      </div>
    </Card>
  );
}

export function ReadingCard({ period }: { period: ReadingPeriod }) {
  return (
    <Card
      label="Leitura da semana"
      title={`${formatDayMonth(period.start)} a ${formatDayMonth(period.end)}`}
    >
      <p>Cinco minutos para ler a tua semana.</p>
      <ButtonLink to="/leitura" variant="primary">
        Fazer a leitura da semana
      </ButtonLink>
    </Card>
  );
}

function Notes({ notes }: { notes: PlanNote[] }) {
  if (notes.length === 0) return null;
  return (
    <>
      {notes.map((n) => (
        <div key={n.id} className={styles.recado}>
          <p>
            <strong>{n.title}</strong>
          </p>
          <p>{n.text}</p>
          <Button variant="ghost" onClick={() => void markNoteSeen(n.id)}>
            Entendi
          </Button>
        </div>
      ))}
    </>
  );
}

export function NextStepCard({
  step,
  plan,
  profile,
  habits,
  notes,
}: {
  step: NextStep;
  plan?: PlanState;
  profile: Profile;
  habits: ActiveHabit[];
  notes: PlanNote[];
}) {
  const navigate = useNavigate();
  const label = 'Teu próximo passo';
  switch (step.kind) {
    case 'reavaliacao':
      return (
        <Card label={label} title="Tua reavaliação está pronta">
          <ButtonLink to="/plano/reavaliacao" variant="primary">
            Fazer a reavaliação do dia 21
          </ButtonLink>
        </Card>
      );
    case 'leitura':
      return <ReadingCard period={step.period} />;
    case 'plano_hoje': {
      const block = plan?.blocks[step.blockIndex];
      const theme = block ? PLAN_THEMES[block.theme] : undefined;
      const caminho = profile.path !== 'indefinido' ? CAMINHOS[profile.path] : undefined;
      const planHabits = habits.filter((h) => h.source === 'plano');
      return (
        <Card label={label} title={`Hoje no plano · dia ${step.day}`}>
          <div className={styles.pilha}>
            {theme ? (
              <p>
                Semana {step.blockIndex + 1}, {theme.name}
                {block?.repeated ? ', repetição' : ''}. {planHabits.length} hábitos ativos:{' '}
                {planHabits.map((h) => h.label.toLowerCase()).join(', ')}.
              </p>
            ) : null}
            {caminho ? (
              <p className="secundario">
                <strong>{caminho.titulo}.</strong> {caminho.textos[0]}
              </p>
            ) : null}
            <Notes notes={notes} />
            <ButtonLink to="/plano" variant="ghost">
              Ver o plano
            </ButtonLink>
          </div>
        </Card>
      );
    }
    case 'plano_comeca':
      return (
        <Card label={label} title={`O plano começa em ${formatDayCompact(step.start)}`}>
          <p>Até lá, siga com a semana zero e o registro do dia.</p>
          <ButtonLink to="/plano/semana-zero">Ver a semana zero</ButtonLink>
        </Card>
      );
    case 'fodmap':
      return (
        <Card label={label} title="Protocolo low FODMAP">
          <ButtonLink to="/fodmap">Ver o protocolo</ButtonLink>
        </Card>
      );
    case 'tarefa':
      return (
        <Card
          label={label}
          title={
            step.ready
              ? `Aula ${step.lessonId}: ver o resultado da tarefa`
              : `Tarefa da aula ${step.lessonId}, dia ${step.day} de ${step.total}`
          }
        >
          <p className="secundario">{getLesson(step.lessonId)?.task.name}</p>
          <ButtonLink to={`/aula/${step.lessonId}`} variant={step.ready ? 'primary' : 'secondary'}>
            {step.ready ? 'Ver o resultado da tarefa' : 'Ver a tarefa'}
          </ButtonLink>
        </Card>
      );
    case 'semana_zero':
      return (
        <Card
          label={label}
          title={
            step.missing === 0
              ? 'Semana zero pronta'
              : `Semana zero: ${step.missing === 1 ? 'falta 1 item' : `faltam ${step.missing} itens`}`
          }
        >
          <ButtonLink to="/plano/semana-zero" variant="primary">
            Abrir a semana zero
          </ButtonLink>
        </Card>
      );
    case 'aula': {
      const lesson = getLesson(step.lessonId);
      if (!step.watched) {
        return (
          <Card label={label} title={`Próxima aula: ${step.lessonId}, ${lesson?.title ?? ''}`}>
            <div className={styles.linha}>
              <ButtonLink to={`/aula/${step.lessonId}`} variant="primary">
                Ver a aula
              </ButtonLink>
              <Button
                onClick={() =>
                  void saveLesson(step.lessonId, (c) => ({
                    ...c,
                    watched: true,
                    watchedAt: new Date().toISOString(),
                  }))
                }
              >
                Já assisti
              </Button>
            </div>
          </Card>
        );
      }
      return (
        <Card label={label} title={`Aula ${step.lessonId}: ${lesson?.task.name ?? ''}`}>
          <div className={styles.linha}>
            <ButtonLink to={`/aula/${step.lessonId}`} variant="primary">
              Começar a tarefa
            </ButtonLink>
            <Button variant="ghost" onClick={() => void skipTaskSuggestion(step.lessonId)}>
              Ir para a próxima aula
            </Button>
          </div>
        </Card>
      );
    }
    case 'preparar_semana_zero':
      return (
        <Card label={label} title="Preparar a semana zero">
          <Button
            variant="primary"
            onClick={() => void openSemanaZero().then(() => navigate('/plano/semana-zero'))}
          >
            Abrir a semana zero
          </Button>
        </Card>
      );
    case 'revisao_mes':
      return (
        <Card label={label} title="Revisão do mês">
          <ButtonLink to="/revisao" variant="primary">
            Fazer a revisão do mês
          </ButtonLink>
        </Card>
      );
    case 'plano_minimo': {
      const min = habits.filter((h) => h.source === 'plano_minimo');
      return (
        <Card label={label} title="Teu plano mínimo">
          {min.length > 0 ? (
            <p>{min.map((h) => h.label).join(', ')}.</p>
          ) : (
            <p>Escolha os três hábitos que você mantém mesmo na pior semana do ano.</p>
          )}
          <ButtonLink to="/plano/minimo">
            {min.length > 0 ? 'Ver o plano mínimo' : 'Escolher o plano mínimo'}
          </ButtonLink>
        </Card>
      );
    }
    default:
      return null;
  }
}
