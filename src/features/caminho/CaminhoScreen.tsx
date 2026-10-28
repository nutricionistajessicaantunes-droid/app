import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { LESSONS, MODULES } from '../../content/curso';
import { lessonBadge, lessonState, LESSON_STATE_LABEL } from '../../logic/lessons';
import { effectiveStatus } from '../../logic/plan';
import { useLessons, usePlan, useProfile } from '../../app/data';
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
  if (!profile || !lessons || plan === undefined) return null;
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
            <Link to="/guia/plano" className={styles.aula}>
              <span className={styles.texto}>
                <span className={styles.titulo}>Plano de 21 dias</span>
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
        </ul>
      </section>
    </Screen>
  );
}
