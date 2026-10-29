import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { LESSONS, MODULES } from '../../content/curso';
import { lessonBadge, lessonState, LESSON_STATE_LABEL } from '../../logic/lessons';
import { effectiveStatus } from '../../logic/plan';
import {
  useCrisis,
  useFodmap,
  useLessons,
  useMeta,
  usePlan,
  useProfile,
  useReadings,
} from '../../app/data';
import { getLesson } from '../../content/curso';
import { formatDayCompact } from '../../logic/dates';
import { nextSteps, type NextStep } from '../../logic/nextStep';
import { useToday } from '../../app/useToday';
import { Card } from '../../ui/Card';
import { Filete } from '../../ui/Filete';
import { Screen } from '../../ui/Screen';
import styles from './Caminho.module.css';

const PLANO_SITUACAO = {
  nao_iniciado: 'Plano de 21 dias ainda não começou.',
  semana_zero: 'Preparando a semana zero.',
  ativo: 'Plano de 21 dias em andamento.',
  reavaliacao: 'Plano de 21 dias pronto para a reavaliação.',
  concluido: 'Plano de 21 dias concluído.',
};

export function LessonSeal({
  lessonId,
  path,
}: {
  lessonId: number;
  path: Parameters<typeof lessonBadge>[1];
}) {
  const badge = lessonBadge(lessonId, path);
  if (!badge) return null;
  return (
    <span className={[styles.selo, badge === 'opcional' ? styles.seloOpcional : ''].join(' ')}>
      {badge === 'recomendada' ? 'Recomendada para o teu caso' : 'Opcional para o teu caso'}
    </span>
  );
}

export function Component() {
  const profile = useProfile();
  const lessons = useLessons();
  const plan = usePlan();
  const today = useToday();
  const readings = useReadings();
  const crisis = useCrisis();
  const fodmap = useFodmap();
  const meta = useMeta();
  if (
    !profile ||
    !lessons ||
    plan === undefined ||
    !readings ||
    crisis === undefined ||
    fodmap === undefined ||
    !meta
  )
    return null;
  const steps = nextSteps({
    today,
    profile,
    plan: plan ?? undefined,
    lessons,
    readings,
    crisis,
    fodmap,
    meta,
  });
  const byId = new Map(lessons.map((l) => [l.lessonId, l]));
  const watched = lessons.filter((l) => l.watched).length;
  const status = effectiveStatus(plan ?? undefined, today);

  return (
    <Screen title="Caminho">
      <Card>
        <div className={styles.progresso}>
          <strong>
            {watched} de {LESSONS.length} aulas assistidas
          </strong>
          <div className={styles.barra} aria-hidden="true">
            <div
              className={styles.barraCheia}
              style={{ width: `${(watched / LESSONS.length) * 100}%` }}
            />
          </div>
          <span className="secundario">{PLANO_SITUACAO[status]}</span>
        </div>
      </Card>

      {steps.length > 0 ? (
        <Card label="Teu próximo passo">
          <ul className={styles.aulas}>
            {steps.map((st, i) => {
              const it = stepLink(st);
              return (
                <li key={`${st.kind}-${i}`}>
                  <Link to={it.to} className={styles.aula}>
                    <span className={styles.texto}>
                      <span className={styles.titulo}>{it.label}</span>
                    </span>
                    <ChevronRight size={20} aria-hidden="true" className="secundario" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      <Card label="Comece por aqui">
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          <li>Assista à aula na Kiwify e volte aqui para fazer a tarefa.</li>
          <li>Registre o teu dia uma vez por dia, de preferência à noite.</li>
          <li>No dia escolhido, faça a leitura da semana.</li>
          <li>Siga o próximo passo que aparece na tela Hoje.</li>
        </ol>
        <p className="secundario" style={{ marginTop: 12 }}>
          Se você gosta de papel, o caderno continua valendo. O app faz as contas por você.
        </p>
      </Card>

      {MODULES.map((m) => (
        <section key={m.id} className={styles.modulo} aria-labelledby={`modulo-${m.id}`}>
          <Filete level={2} id={`modulo-${m.id}`}>
            Módulo {m.id} · {m.title}
          </Filete>
          <ul className={styles.aulas}>
            {m.lessons.map((id) => {
              const lesson = LESSONS.find((l) => l.id === id);
              if (!lesson) return null;
              const state = lessonState(byId.get(id));
              const done = state !== 'nao_assistida';
              return (
                <li key={id}>
                  <Link to={`/aula/${id}`} className={styles.aula}>
                    <span
                      className={[styles.numero, done ? styles.feita : ''].join(' ')}
                      aria-hidden="true"
                    >
                      {id}
                    </span>
                    <span className={styles.texto}>
                      <span className={styles.titulo}>
                        <span className="sr-only">Aula {id}: </span>
                        {lesson.title}
                      </span>
                      <span className={styles.meta}>
                        <span>{LESSON_STATE_LABEL[state]}</span>
                        <LessonSeal lessonId={id} path={profile.path} />
                      </span>
                    </span>
                    <ChevronRight size={20} aria-hidden="true" className="secundario" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className={styles.modulo} aria-labelledby="depois">
        <Filete level={2} id="depois">
          Ferramentas do curso
        </Filete>
        <ul className={styles.aulas}>
          <li>
            <Link to="/plano" className={styles.aula}>
              <span className={styles.texto}>
                <span className={styles.titulo}>Plano de 21 dias</span>
                <span className={styles.meta}>
                  <span>{PLANO_SITUACAO[status]}</span>
                </span>
              </span>
              <ChevronRight size={20} aria-hidden="true" className="secundario" />
            </Link>
          </li>
          <li>
            <Link to="/guia/fodmap" className={styles.aula}>
              <span className={styles.texto}>
                <span className={styles.titulo}>Protocolo low FODMAP</span>
                {profile.path === 'gases_sii' ? (
                  <span className={styles.meta}>
                    <span className={styles.selo}>Recomendado para o teu caso</span>
                  </span>
                ) : null}
              </span>
              <ChevronRight size={20} aria-hidden="true" className="secundario" />
            </Link>
          </li>
          <li>
            <Link to={status === 'concluido' ? '/plano' : '/guia/plano'} className={styles.aula}>
              <span className={styles.texto}>
                <span className={styles.titulo}>Depois do plano</span>
                <span className={styles.meta}>
                  <span>Reavaliação, plano mínimo e revisão do mês</span>
                </span>
              </span>
              <ChevronRight size={20} aria-hidden="true" className="secundario" />
            </Link>
          </li>
        </ul>
      </section>
    </Screen>
  );
}

function stepLink(st: NextStep): { to: string; label: string } {
  switch (st.kind) {
    case 'crise':
      return { to: '/crise', label: 'Modo crise: a etapa do dia' };
    case 'reavaliacao':
      return { to: '/plano/reavaliacao', label: 'Fazer a reavaliação do dia 21' };
    case 'leitura':
      return { to: '/leitura', label: 'Leitura da semana pendente' };
    case 'plano_hoje':
      return { to: '/plano', label: `Hoje no plano · dia ${st.day}` };
    case 'plano_comeca':
      return { to: '/plano/semana-zero', label: `O plano começa em ${formatDayCompact(st.start)}` };
    case 'fodmap':
      return { to: '/guia/fodmap', label: 'Protocolo low FODMAP' };
    case 'tarefa':
      return {
        to: `/aula/${st.lessonId}`,
        label: st.ready
          ? `Aula ${st.lessonId}: ver o resultado da tarefa`
          : `Tarefa da aula ${st.lessonId}, dia ${st.day} de ${st.total}`,
      };
    case 'semana_zero':
      return {
        to: '/plano/semana-zero',
        label:
          st.missing === 0
            ? 'Semana zero pronta'
            : `Semana zero: ${st.missing === 1 ? 'falta 1 item' : `faltam ${st.missing} itens`}`,
      };
    case 'aula':
      return {
        to: `/aula/${st.lessonId}`,
        label: st.watched
          ? `Aula ${st.lessonId}: começar a tarefa`
          : `Próxima aula: ${st.lessonId}, ${getLesson(st.lessonId)?.title ?? ''}`,
      };
    case 'preparar_semana_zero':
      return { to: '/plano/semana-zero', label: 'Preparar a semana zero' };
    case 'revisao_mes':
      return { to: '/revisao', label: 'Revisão do mês' };
    case 'plano_minimo':
      return { to: '/plano/minimo', label: 'Teu plano mínimo' };
  }
}
