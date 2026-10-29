import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CAMINHOS, PLANO_TEXTOS, REGRAS, SEMANA_ZERO_ITENS } from '../../content/plano';
import { savePlan, saveProfile } from '../../db/repo';
import { usePlan, useProfile } from '../../app/data';
import { useToday } from '../../app/useToday';
import { addDays, formatDayCompact, formatDayMonth, isValidDayKey } from '../../logic/dates';
import { semanaZeroMissing } from '../../logic/nextStep';
import { CheckList } from '../../ui/CheckList';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { BulletList, Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { WaterCalculator } from '../guia/WaterCalculator';
import { CalendarButtons } from '../lembretes/CalendarButtons';
import { planDayEvent } from '../lembretes/reminders';
import { openSemanaZero, setSemanaZeroItem, startPlan } from '../processo/actions';
import styles from '../processo/Processo.module.css';

/** Semana zero (seção 6.7, aula 15): seis itens antes do dia 1. */
export function Component() {
  const today = useToday();
  const plan = usePlan();
  const profile = useProfile();
  const navigate = useNavigate();
  const [showWater, setShowWater] = useState(false);
  const [bathroom, setBathroom] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (plan === null || plan?.status === 'nao_iniciado') void openSemanaZero();
  }, [plan]);

  if (plan === undefined || !profile) return null;
  const done = (id: string) => Boolean(plan?.semanaZero?.[id]);
  const toggle = (id: string, v: boolean) => void setSemanaZeroItem(id, v);
  const min = addDays(today, -6);
  const chosen = plan?.day1 && plan.day1 >= min ? plan.day1 : today;
  const day21 = addDays(chosen, 20);
  const caminho = profile.path !== 'indefinido' ? CAMINHOS[profile.path] : undefined;
  const started = plan?.status === 'ativo' || plan?.status === 'concluido';
  const missing = semanaZeroMissing(plan ?? undefined);
  const item = (id: string) =>
    SEMANA_ZERO_ITENS.filter((i) => i.id === id).map((i) => ({
      id: i.id,
      label: i.text,
      detail: i.detail,
    }));

  return (
    <Screen title="Semana zero" back="/plano" backLabel="Plano">
      <p>{PLANO_TEXTOS.semanaZero}</p>

      <Card
        label={
          missing === 0 ? 'Tudo pronto' : `Faltam ${missing} ${missing === 1 ? 'item' : 'itens'}`
        }
      >
        <div className={styles.pilha}>
          <CheckList items={item('onde_registrar')} checked={done} onToggle={toggle} />

          <CheckList items={item('meta_agua')} checked={done} onToggle={toggle} />
          {profile.waterGoalMl && !showWater ? (
            <p className={styles.ajuda}>
              Tua meta está calculada. Você pode refazer a conta no Guia.
            </p>
          ) : null}
          <Button variant="ghost" onClick={() => setShowWater((s) => !s)} aria-expanded={showWater}>
            {showWater ? 'Fechar a calculadora' : 'Calcular a meta de água'}
          </Button>
          {showWater ? (
            <WaterCalculator
              profile={profile}
              onSaved={() => {
                toggle('meta_agua', true);
                setShowWater(false);
              }}
            />
          ) : null}

          <CheckList items={item('compra')} checked={done} onToggle={toggle} />
          <Link to="/guia/prato">Ver a lista base da aula 14</Link>

          <CheckList items={item('preparos')} checked={done} onToggle={toggle} />

          <CheckList items={item('horario_banheiro')} checked={done} onToggle={toggle} />
          <div className={styles.campo}>
            <label htmlFor="sz-banheiro">Horário da rotina de banheiro</label>
            <div className={styles.linha}>
              <input
                id="sz-banheiro"
                type="time"
                value={bathroom ?? profile.bathroomTime ?? ''}
                onChange={(e) => setBathroom(e.target.value)}
              />
              <Button
                disabled={!(bathroom ?? profile.bathroomTime)}
                onClick={() => {
                  const t = bathroom ?? profile.bathroomTime;
                  if (!t) return;
                  void saveProfile({ bathroomTime: t }).then(() =>
                    toggle('horario_banheiro', true),
                  );
                }}
              >
                Salvar o horário
              </Button>
            </div>
          </div>

          <CheckList items={item('calendario')} checked={done} onToggle={toggle} />
          <div className={styles.campo}>
            <label htmlFor="sz-dia1">Dia 1 do plano</label>
            <input
              id="sz-dia1"
              type="date"
              min={min}
              value={chosen}
              onChange={(e) => {
                const v = e.target.value;
                if (isValidDayKey(v) && v >= min) void savePlan({ day1: v });
              }}
            />
            <p className={styles.ajuda}>
              Pode ser hoje, um dia futuro ou até 6 dias atrás, para quem começou no papel. O dia 21
              é {formatDayMonth(day21)}.
            </p>
          </div>
          <CalendarButtons
            label="Dia 1 na agenda"
            event={planDayEvent(chosen, 1)}
            onAdded={() => toggle('calendario', true)}
          />
          <CalendarButtons
            label="Dia 21 na agenda"
            event={planDayEvent(day21, 21)}
            onAdded={() => toggle('calendario', true)}
          />
        </div>
      </Card>

      <Card label="Meu caminho" title={caminho?.titulo}>
        {caminho ? (
          <BulletList items={caminho.textos} />
        ) : (
          <p>
            Sem caminho definido. Você escolhe o teu caminho em <Link to="/ajustes">Ajustes</Link>.
          </p>
        )}
      </Card>

      <Card label="As cinco regras">
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          {REGRAS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <Note>{PLANO_TEXTOS.semanaComum}</Note>
      </Card>

      {started ? (
        <Note>O plano começou em {formatDayMonth(plan?.blocks[0]?.start ?? chosen)}.</Note>
      ) : (
        <Button
          variant="primary"
          block
          onClick={() => void startPlan(chosen).then(() => navigate('/'))}
        >
          Começar o plano em {formatDayCompact(chosen)}
        </Button>
      )}
      {!started && missing > 0 ? <Note>Os itens que faltam não impedem o começo.</Note> : null}
    </Screen>
  );
}
