import { INSTAGRAM_URL, WHATSAPP_URL } from '../../config';
import { MODULES } from '../../content/curso';
import { FIM_DO_CURSO } from '../../content/reavaliacao';
import { useLessons, usePlan } from '../../app/data';
import { ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { ExternalLink } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import styles from '../processo/Processo.module.css';

/** Fim do curso (seção 6.9). O único lugar do app com o coração branco. */
export function Component() {
  const lessons = useLessons();
  const plan = usePlan();
  if (!lessons || plan === undefined) return null;
  const watched = new Set(lessons.filter((l) => l.watched).map((l) => l.lessonId));
  return (
    <Screen title="O caminho que você fez" back="/" backLabel="Hoje">
      <Card>
        <ul className={styles.lista}>
          {MODULES.map((m) => (
            <li key={m.id} className={styles.item}>
              <span>
                Módulo {m.id} · {m.title}
              </span>
              <span className={styles.numero}>
                {m.lessons.filter((id) => watched.has(id)).length} de {m.lessons.length} aulas
              </span>
            </li>
          ))}
          <li className={styles.item}>
            <span>Plano de 21 dias</span>
            <span className={styles.numero}>
              {plan?.status === 'concluido' ? 'concluído' : 'em andamento'}
            </span>
          </li>
        </ul>
      </Card>
      <p className={styles.coracao}>{FIM_DO_CURSO.frase}</p>
      <Card>
        {/* voz-ok: o 🤍 é a exceção da seção 8.1, só na tela de fim do curso. */}
        <p>{FIM_DO_CURSO.convite} 🤍</p>
        <div className={styles.linha}>
          <ExternalLink href={WHATSAPP_URL} variant="primary">
            Contar no WhatsApp
          </ExternalLink>
          <ExternalLink href={INSTAGRAM_URL}>Contar no Instagram</ExternalLink>
        </div>
      </Card>
      {!plan?.minimumPlan?.length ? (
        <ButtonLink to="/plano/minimo" variant="primary" block>
          Escolher o plano mínimo
        </ButtonLink>
      ) : (
        <ButtonLink to="/" block>
          Voltar para Hoje
        </ButtonLink>
      )}
    </Screen>
  );
}
