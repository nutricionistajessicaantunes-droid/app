import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { CAMINHOS, PLANO_TEXTOS, PLAN_HABITS, PLAN_THEMES, REGRAS } from '../../content/plano';
import { usePlan, useProfile, useReadings } from '../../app/data';
import { useToday } from '../../app/useToday';
import { formatDayMonth } from '../../logic/dates';
import {
  blockEnd,
  blockIndexOn,
  effectiveStatus,
  hasStarted,
  planDayNumber,
  planTotalDays,
  themeName,
} from '../../logic/plan';
import { pendingPlanReading } from '../../logic/readings';
import type { PlanState } from '../../types';
import { Button, ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { BulletList, Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { openSemanaZero } from '../processo/actions';
import styles from '../processo/Processo.module.css';

/** Plano de 21 dias (seção 6.7): visão geral em cada estado. */
export function Component() {
  const today = useToday();
  const plan = usePlan();
  const profile = useProfile();
  const readings = useReadings();
  const navigate = useNavigate();
  if (plan === undefined || !profile || !readings) return null;
  const p = plan ?? undefined;
  const status = effectiveStatus(p, today);
  const caminho = profile.path !== 'indefinido' ? CAMINHOS[profile.path] : undefined;

  return (
    <Screen title="Plano de 21 dias" back="/caminho" backLabel="Caminho">
      {status === 'nao_iniciado' || status === 'semana_zero' ? (
        <Card>
          <div className={styles.pilha}>
            <p>{PLANO_TEXTOS.comoFunciona}</p>
            <p className="secundario">{PLANO_TEXTOS.porQue21}</p>
            <Button
              variant="primary"
              block
              onClick={() => void openSemanaZero().then(() => navigate('/plano/semana-zero'))}
            >
              {status === 'semana_zero' ? 'Continuar a semana zero' : 'Preparar a semana zero'}
            </Button>
          </div>
        </Card>
      ) : null}

      {status === 'reavaliacao' ? (
        <Card tone="destaque" title="Tua reavaliação está pronta">
          <p>{PLANO_TEXTOS.acumulam}</p>
          <ButtonLink to="/plano/reavaliacao" variant="primary">
            Fazer a reavaliação do dia 21
          </ButtonLink>
        </Card>
      ) : null}

      {status === 'concluido' && p ? <Concluido plan={p} /> : null}

      {p && p.blocks.length > 0 && (status === 'ativo' || status === 'reavaliacao') ? (
        <Blocos
          plan={p}
          today={today}
          pendingIndex={pendingPlanReading(p, readings, today)?.planBlockIndex}
        />
      ) : (
        <Mapa />
      )}

      {caminho ? (
        <Card label="Meu caminho" title={caminho.titulo}>
          <BulletList items={caminho.textos} />
        </Card>
      ) : null}

      <Card label="As cinco regras">
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          {REGRAS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <Note>{PLANO_TEXTOS.anoteDiaRuim}</Note>
      </Card>
    </Screen>
  );
}

function Mapa() {
  return (
    <Card label="As três semanas">
      <ul className={styles.lista}>
        {([1, 2, 3] as const).map((t) => (
          <li key={t}>
            <strong>
              Semana {t}, {PLAN_THEMES[t].name}, {PLAN_THEMES[t].activeCount} hábitos ativos
            </strong>
            <p className="secundario" style={{ margin: '4px 0 0' }}>
              {PLAN_THEMES[t].summary.charAt(0).toUpperCase() + PLAN_THEMES[t].summary.slice(1)}
            </p>
          </li>
        ))}
      </ul>
      <Note>{PLANO_TEXTOS.acumulam}</Note>
    </Card>
  );
}

function Blocos({
  plan,
  today,
  pendingIndex,
}: {
  plan: PlanState;
  today: string;
  pendingIndex?: number;
}) {
  const started = hasStarted(plan, today);
  const idx = blockIndexOn(plan.blocks, today);
  const current =
    idx >= 0 ? plan.blocks[idx] : idx === -2 ? plan.blocks[plan.blocks.length - 1] : undefined;
  const n = planDayNumber(plan.blocks, today);
  const total = planTotalDays(plan.blocks);
  return (
    <>
      {started && n && n <= total ? (
        <Card title={`Dia ${n} de ${total}`}>
          {current ? (
            <p>
              Semana {idx + 1}, {themeName(current.theme)}: {PLAN_THEMES[current.theme].summary}
            </p>
          ) : null}
          {pendingIndex !== undefined ? (
            <ButtonLink to="/leitura" variant="primary">
              Fazer a leitura da semana
            </ButtonLink>
          ) : null}
        </Card>
      ) : !started && plan.blocks[0] ? (
        <Card title={`O plano começa em ${formatDayMonth(plan.blocks[0].start)}`}>
          <p>Até lá, siga com a semana zero e o registro do dia.</p>
          <ButtonLink to="/plano/semana-zero">Ver a semana zero</ButtonLink>
        </Card>
      ) : null}

      {plan.blocks.map((b, i) => {
        const future = !current || b.theme > current.theme;
        const habits = PLAN_HABITS.filter((h) => h.theme <= b.theme);
        return (
          <Card
            key={b.start}
            label={`Semana ${i + 1}${b.repeated ? ', repetição' : ''}`}
            title={`${themeName(b.theme).charAt(0).toUpperCase()}${themeName(b.theme).slice(1)} · ${formatDayMonth(b.start)} a ${formatDayMonth(blockEnd(b))}`}
          >
            <ul className={styles.lista}>
              {habits.map((h) => {
                const locked = future && h.theme > (current?.theme ?? 0);
                return (
                  <li key={h.id} className={locked ? styles.bloqueado : undefined}>
                    {locked ? <Lock size={16} aria-label="Bloqueado" /> : null}
                    {h.label}
                  </li>
                );
              })}
            </ul>
            {future && b.theme > (current?.theme ?? 0) ? (
              <Note>{PLANO_TEXTOS.naoAntecipe}</Note>
            ) : null}
            <p className="secundario pequeno" style={{ marginTop: 8 }}>
              {PLAN_THEMES[b.theme].note}
            </p>
          </Card>
        );
      })}
    </>
  );
}

function Concluido({ plan }: { plan: PlanState }) {
  return (
    <Card
      title={`Plano concluído${plan.concludedOn ? ` em ${formatDayMonth(plan.concludedOn)}` : ''}`}
    >
      <div className={styles.pilha}>
        <ButtonLink to="/plano/minimo" variant="primary">
          {plan.minimumPlan?.length ? 'Ver o meu plano mínimo' : 'Escolher o plano mínimo'}
        </ButtonLink>
        <div className={styles.linha}>
          <ButtonLink to="/revisao">Revisão do mês</ButtonLink>
          <ButtonLink to="/ciclo">Começar um novo ciclo</ButtonLink>
        </div>
        <div className={styles.linha}>
          <ButtonLink to="/plano/reavaliacao" variant="ghost">
            Ver a reavaliação
          </ButtonLink>
          <ButtonLink to="/fim" variant="ghost">
            Ver o encerramento do curso
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
