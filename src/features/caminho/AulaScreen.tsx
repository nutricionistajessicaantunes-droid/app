import { Check } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import { KIWIFY_AREA_URL, KIWIFY_AULA_URLS } from '../../config';
import { getLesson, getModule } from '../../content/curso';
import { saveLesson } from '../../db/repo';
import { lessonUrl } from '../../logic/lessons';
import { useLessons, useProfile } from '../../app/data';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Filete } from '../../ui/Filete';
import { BulletList, ExternalLink, Note, SEM_INTERNET_AULA } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { LessonSeal } from './CaminhoScreen';
import styles from './Caminho.module.css';

export function Component() {
  const { n } = useParams();
  const id = Number(n);
  const lesson = getLesson(id);
  const lessons = useLessons();
  const profile = useProfile();
  if (!lesson) return <Navigate to="/caminho" replace />;
  if (!lessons || !profile) return null;
  const progress = lessons.find((l) => l.lessonId === id);
  const watched = Boolean(progress?.watched);
  const module = getModule(lesson.module);
  const url = lessonUrl(id, KIWIFY_AULA_URLS, KIWIFY_AREA_URL);
  const durationText =
    lesson.task.durationDays === null
      ? 'Sem prazo'
      : lesson.task.durationDays === 'fim_do_plano'
        ? 'No fim do plano'
        : `${lesson.task.durationDays} dias`;

  return (
    <Screen
      title={`Aula ${id} · ${lesson.title}`}
      docTitle={`Aula ${id}`}
      back="/caminho"
      backLabel="Caminho"
    >
      {module ? (
        <Filete>
          Módulo {module.id} · {module.title}
        </Filete>
      ) : null}
      <LessonSeal lessonId={id} path={profile.path} />
      <p className={styles.descricao}>{lesson.description}</p>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {url ? (
            <ExternalLink href={url} variant="primary" block offlineMessage={SEM_INTERNET_AULA}>
              Ver a aula na Kiwify
            </ExternalLink>
          ) : (
            <p>Abra esta aula na área de membros da Kiwify.</p>
          )}
          <Button
            block
            icon={watched ? <Check size={18} /> : undefined}
            aria-pressed={watched}
            onClick={() =>
              void saveLesson(id, (c) => ({
                ...c,
                watched: !watched,
                watchedAt: !watched ? new Date().toISOString() : undefined,
              }))
            }
          >
            {watched ? 'Assistida' : 'Já assisti'}
          </Button>
          {watched ? <Note>Toque de novo para desmarcar.</Note> : null}
        </div>
      </Card>

      {lesson.material.length > 0 ? (
        <Card label="Material desta aula">
          <ul className={styles.materiais}>
            {lesson.material.map((m) => (
              <li key={m.label}>{m.to ? <Link to={m.to}>{m.label}</Link> : m.label}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card label={`Tarefa · ${durationText}`} title={lesson.task.name}>
        {lesson.task.instruction ? <p>{lesson.task.instruction}</p> : null}
        {lesson.task.fields ? <p className="secundario">{lesson.task.fields}</p> : null}
        {lesson.task.endQuestion ? (
          <p>
            <strong>No fim:</strong> {lesson.task.endQuestion}
            {lesson.task.endQuestion.endsWith('?') ? '' : '.'}
          </p>
        ) : null}
        {lesson.task.notes && lesson.task.notes.length > 0 ? (
          <BulletList items={lesson.task.notes} />
        ) : null}
      </Card>
    </Screen>
  );
}
