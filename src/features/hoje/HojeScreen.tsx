import { Check, Settings } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ASSINATURA, LEMBRETE_COPIA_DIAS, LEMBRETE_COPIA_MIN_DIAS } from '../../config';
import { getBristol } from '../../content/bristol';
import { getLesson } from '../../content/curso';
import { CAMINHOS, PLAN_THEMES } from '../../content/plano';
import { SYMPTOM_LABEL } from '../../content/registro';
import { setDismissed } from '../../db/repo';
import { addDays, diffDays, formatDayCompact, formatDayLong, toDayKey } from '../../logic/dates';
import { habitsDoneCount, type ActiveHabit } from '../../logic/habits';
import {
  blockIndexOn,
  effectiveStatus,
  hasStarted,
  planBadge,
  planDayNumber,
} from '../../logic/plan';
import { dayScore, isRegistered } from '../../logic/records';
import type { DayRecord, Profile, PlanState, SymptomId } from '../../types';
import {
  useActiveHabits,
  useDays,
  useLessons,
  useMeta,
  useNotices,
  usePlan,
  useProfile,
  useRegisteredCount,
} from '../../app/data';
import { useToday } from '../../app/useToday';
import { Button, ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { TEXTO_APOIO_COPIA, useSaveBackup } from '../copia/useSaveBackup';
import { AlertCards } from '../alertas/AlertCards';
import { HabitsCard } from './HabitsCard';
import styles from './Hoje.module.css';

const MAX_CARTOES = 4;

interface CardEntry {
  key: string;
  node: ReactNode;
}

export function HojeScreen() {
  const today = useToday();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useProfile();
  const meta = useMeta();
  const plan = usePlan();
  const lessons = useLessons();
  const notices = useNotices();
  const registeredCount = useRegisteredCount();
  const habits = useActiveHabits(today);
  const recent = useDays(addDays(today, -7), today);
  const [showMore, setShowMore] = useState(false);
  const [justSaved, setJustSaved] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Hoje · Modulação';
  }, []);

  // "Dia registrado." vem do Registro do dia pelo estado da navegação.
  useEffect(() => {
    const state = location.state as { registrado?: string } | null;
    if (state?.registrado) {
      setJustSaved(state.registrado);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const todayRec = recent?.find((r) => r.date === today);
  const yesterday = addDays(today, -1);
  const yesterdayRec = recent?.find((r) => r.date === yesterday);
  const registeredLast7 = (recent ?? []).some((r) => r.date !== today && isRegistered(r));

  const cards: CardEntry[] = useMemo(() => {
    if (!profile || !meta || plan === undefined || !habits || !recent || notices === undefined)
      return [];
    const list: CardEntry[] = [];
    const alerts = <AlertCards notices={notices} key="alertas" />;
    if (notices.some((n) => !n.dismissedAt)) list.push({ key: 'alertas', node: alerts });
    list.push({
      key: 'registro',
      node: (
        <RegistroCard
          record={todayRec}
          habits={habits}
          profile={profile}
          showYesterday={!isRegistered(yesterdayRec) && registeredLast7}
          yesterday={yesterday}
        />
      ),
    });
    if (habits.length > 0 || profile.waterGoalMl) {
      list.push({
        key: 'habitos',
        node: <HabitsCard day={today} habits={habits} record={todayRec} profile={profile} />,
      });
    }
    const next = (
      <NextStepCard
        plan={plan ?? undefined}
        profile={profile}
        today={today}
        watched={(lessons ?? []).filter((l) => l.watched).map((l) => l.lessonId)}
      />
    );
    list.push({ key: 'proximo', node: next });
    const snoozed = meta.dismissed?.copia && meta.dismissed.copia > today;
    const lastBackupDay = meta.lastBackupAt ? toDayKey(new Date(meta.lastBackupAt)) : undefined;
    const backupDue =
      (registeredCount ?? 0) >= LEMBRETE_COPIA_MIN_DIAS &&
      (!lastBackupDay || diffDays(today, lastBackupDay) > LEMBRETE_COPIA_DIAS) &&
      !snoozed;
    if (backupDue)
      list.push({ key: 'copia', node: <BackupCard today={today} first={!lastBackupDay} /> });
    return list;
  }, [
    profile,
    meta,
    plan,
    habits,
    recent,
    notices,
    todayRec,
    yesterdayRec,
    registeredLast7,
    yesterday,
    today,
    lessons,
    registeredCount,
  ]);

  if (!profile || !meta) return null;

  const visible = cards.slice(0, MAX_CARTOES);
  const hidden = cards.slice(MAX_CARTOES);
  const badge = contextBadge(plan ?? undefined, today);

  return (
    <main className={styles.tela} id="conteudo">
      <header className={styles.cabecalho}>
        <div>
          <h1 className={styles.saudacao}>{profile.name ? `Oi, ${profile.name}` : 'Oi'}</h1>
          <p className={styles.data}>{formatDayLong(today)}</p>
          {badge ? <p className={styles.selo}>{badge}</p> : null}
        </div>
        <Link to="/ajustes" className={styles.engrenagem} aria-label="Ajustes">
          <Settings size={24} aria-hidden="true" />
        </Link>
      </header>

      {justSaved ? (
        <div style={{ marginBottom: 16 }}>
          <Card tone="sucesso">
            <div className={styles.confirmacao} role="status" aria-live="polite">
              <strong>Dia registrado.</strong>
              <p className={styles.frase}>{justSaved}</p>
            </div>
          </Card>
        </div>
      ) : null}

      <div className={styles.cartoes}>
        {visible.map((c) => (
          <div key={c.key}>{c.node}</div>
        ))}
        {hidden.length > 0 ? (
          <div>
            <Button
              variant="ghost"
              block
              onClick={() => setShowMore((s) => !s)}
              aria-expanded={showMore}
            >
              {showMore ? 'Ver menos' : 'Ver mais'}
            </Button>
            {showMore ? (
              <div className={styles.cartoes} style={{ marginTop: 16 }}>
                {hidden.map((c) => (
                  <div key={c.key}>{c.node}</div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className={styles.rodape}>{ASSINATURA}</p>
    </main>
  );
}

function contextBadge(plan: PlanState | undefined, today: string): string | undefined {
  const status = effectiveStatus(plan, today);
  if (plan && status === 'ativo') {
    if (!hasStarted(plan, today) && plan.blocks[0])
      return `O plano começa em ${formatDayCompact(plan.blocks[0].start)}`;
    return planBadge(plan, today);
  }
  if (status === 'reavaliacao') return 'Plano · reavaliação';
  if (status === 'concluido') return 'Manutenção';
  return undefined;
}

function topSymptom(r: DayRecord): { id: SymptomId; value: number } | undefined {
  if (!r.symptoms) return undefined;
  let best: { id: SymptomId; value: number } | undefined;
  for (const [k, v] of Object.entries(r.symptoms)) {
    if (typeof v === 'number' && (!best || v > best.value)) best = { id: k as SymptomId, value: v };
  }
  return best;
}

function RegistroCard({
  record,
  habits,
  profile,
  showYesterday,
  yesterday,
}: {
  record: DayRecord | undefined;
  habits: ActiveHabit[];
  profile: Profile;
  showYesterday: boolean;
  yesterday: string;
}) {
  const done = isRegistered(record);
  if (!done) {
    return (
      <Card label="Registro de hoje">
        <ButtonLink to="/registro" variant="primary" block>
          Registrar meu dia
        </ButtonLink>
        <p className={styles.legenda}>Leva um minuto</p>
        {showYesterday ? (
          <p style={{ marginTop: 12, textAlign: 'center' }}>
            <Link to={`/registro/${yesterday}`}>Registrar ontem</Link>
          </p>
        ) : null}
      </Card>
    );
  }
  const r = record as DayRecord;
  const chips: string[] = [];
  if (r.evacuated && r.bristol) chips.push(`Tipo ${r.bristol} · ${getBristol(r.bristol).name}`);
  else if (r.evacuated) chips.push('Evacuei');
  else chips.push('Não evacuei');
  const top = topSymptom(r);
  const score = dayScore(r);
  if (score !== undefined)
    chips.push(
      score === 0
        ? 'Sem sintomas'
        : top
          ? `${SYMPTOM_LABEL[top.id]} ${top.value}`
          : `Sintoma ${score}`,
    );
  if (typeof r.energy === 'number' && !profile.simpleMode) chips.push(`Energia ${r.energy}`);
  if (habits.length > 0) chips.push(`Hábitos ${habitsDoneCount(r, habits)} de ${habits.length}`);
  return (
    <Card label="Registro de hoje">
      <ul className={styles.resumo} aria-label="Resumo do dia">
        {chips.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <ButtonLink to="/registro">Editar</ButtonLink>
        {showYesterday ? <Link to={`/registro/${yesterday}`}>Registrar ontem</Link> : null}
      </div>
    </Card>
  );
}

function NextStepCard({
  plan,
  profile,
  today,
  watched,
}: {
  plan: PlanState | undefined;
  profile: Profile;
  today: string;
  watched: number[];
}) {
  const status = effectiveStatus(plan, today);
  if (plan && status === 'ativo' && hasStarted(plan, today)) {
    const idx = blockIndexOn(plan.blocks, today);
    const block = idx >= 0 ? plan.blocks[idx] : undefined;
    const n = planDayNumber(plan.blocks, today);
    if (block && n) {
      const theme = PLAN_THEMES[block.theme];
      const caminho = profile.path !== 'indefinido' ? CAMINHOS[profile.path] : undefined;
      return (
        <Card label="Teu próximo passo" title={`Hoje no plano · dia ${n}`}>
          <div className={styles.contexto}>
            <p>
              Semana {idx + 1}, {theme.name}: {theme.summary}
            </p>
            {caminho ? (
              <p className="secundario">
                <strong>{caminho.titulo}.</strong> {caminho.textos[0]}
              </p>
            ) : null}
          </div>
        </Card>
      );
    }
  }
  if (plan && status === 'ativo' && plan.blocks[0]) {
    return (
      <Card
        label="Teu próximo passo"
        title={`O plano começa em ${formatDayCompact(plan.blocks[0].start)}`}
      >
        <p>Até lá, siga com a semana zero e o registro do dia.</p>
      </Card>
    );
  }
  const nextLesson = [...Array(17).keys()].map((i) => i + 1).find((n) => !watched.includes(n));
  if (nextLesson) {
    const lesson = getLesson(nextLesson);
    return (
      <Card label="Teu próximo passo" title={`Próxima aula: ${nextLesson}, ${lesson?.title ?? ''}`}>
        <ButtonLink to={`/aula/${nextLesson}`}>Ver a aula</ButtonLink>
      </Card>
    );
  }
  return (
    <Card label="Teu próximo passo" title="Preparar a semana zero">
      <ButtonLink to="/caminho">Ver o caminho</ButtonLink>
    </Card>
  );
}

function BackupCard({ today, first }: { today: string; first: boolean }) {
  const { save, status, message } = useSaveBackup();
  return (
    <Card label="Cópia de segurança">
      <p>
        {first
          ? 'Teus registros ficam só neste celular. Salve uma cópia e mande para você, para não perder nada se trocar de celular.'
          : 'Faz mais de uma semana desde a última cópia dos teus registros.'}
      </p>
      <p className="secundario pequeno">{TEXTO_APOIO_COPIA}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Button
          onClick={() => void save()}
          disabled={status === 'salvando'}
          icon={status === 'salvo' ? <Check size={18} /> : undefined}
        >
          Salvar uma cópia
        </Button>
        <Button variant="ghost" onClick={() => void setDismissed('copia', addDays(today, 7))}>
          Lembrar daqui a 7 dias
        </Button>
      </div>
      <p role="status" aria-live="polite" className="secundario pequeno" style={{ marginTop: 8 }}>
        {message}
      </p>
    </Card>
  );
}
