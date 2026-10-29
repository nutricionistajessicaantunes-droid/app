import { Link } from 'react-router';
import {
  DIARREIA,
  HIDRATACAO_CRISE,
  SINAIS_DESIDRATACAO,
  VOLTA_ETAPAS,
} from '../../content/diarreia';
import { saveCrisis, saveDay } from '../../db/repo';
import { useCrisis, useDay } from '../../app/data';
import { useToday } from '../../app/useToday';
import { crisisNoImprovement, crisisStage, ULTIMA_ETAPA } from '../../logic/crisis';
import { formatDayMonth } from '../../logic/dates';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList } from '../../ui/CheckList';
import { Counter } from '../../ui/Counter';
import { BulletList, Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { endCrisis, markImproved, turnOnCrisis } from '../processo/actions';
import styles from '../processo/Processo.module.css';

/** Modo crise (seção 6.12). */
export function Component() {
  const today = useToday();
  const crisis = useCrisis();
  const record = useDay(today);
  if (crisis === undefined || record === undefined) return null;
  const active = Boolean(crisis?.active);

  if (!active) {
    return (
      <Screen title="Modo crise" back="/guia/diarreia" backLabel="Diarreia">
        <p>{DIARREIA.primeiroAgua}</p>
        <p className="secundario">
          O modo crise mostra na tela Hoje a hidratação, os sinais de desidratação e a volta depois
          da crise, etapa por etapa.
        </p>
        <Button variant="primary" block onClick={() => void turnOnCrisis(today)}>
          Estou com diarreia agora
        </Button>
        <QuandoProcurar />
      </Screen>
    );
  }

  const stage = crisisStage(crisis, today);
  const signs = crisis?.dehydrationSigns ?? [];
  const cups = record?.crisisCups ?? 0;
  return (
    <Screen title="Modo crise" back="/" backLabel="Hoje">
      <Card tone="destaque" title={DIARREIA.primeiroAgua}>
        <Counter
          label="Copos de líquido hoje"
          value={cups}
          onChange={(n) => void saveDay(today, { crisisCups: n })}
          valueText={`${cups} ${cups === 1 ? 'copo' : 'copos'} de líquido hoje`}
        />
        <BulletList items={HIDRATACAO_CRISE} />
        <p className="secundario">{DIARREIA.hidratacaoComo}</p>
        <Link to="/guia/cardapios/crise">Ver o cardápio da crise</Link>
      </Card>

      {crisisNoImprovement(crisis, today) ? (
        <Card tone="alerta" role="alert">
          <p>{DIARREIA.semMelhora}</p>
        </Card>
      ) : null}

      <Card label="Desidratação" title="Você está com algum destes?">
        <CheckList
          items={SINAIS_DESIDRATACAO.map((s) => ({ id: s.id, label: s.label }))}
          checked={(id) => signs.includes(id)}
          onToggle={(id, on) =>
            void saveCrisis({
              dehydrationSigns: on ? [...signs, id] : signs.filter((x) => x !== id),
            })
          }
        />
        {signs.length > 0 ? (
          <p role="alert" style={{ marginTop: 12 }}>
            <strong>{DIARREIA.sinaisPerda}</strong> Procure atendimento.
          </p>
        ) : null}
      </Card>

      {!stage ? (
        <Card title="Melhorou?">
          <p>
            Quando as fezes voltarem para o tipo 5 ou menos, começa a volta depois da crise. Se você
            já sente melhora, toque abaixo.
          </p>
          <Button variant="primary" onClick={() => void markImproved(today)}>
            Melhorei
          </Button>
        </Card>
      ) : (
        <Card label="A volta depois da crise" title={VOLTA_ETAPAS[stage.stage - 1]?.dias}>
          <p className="secundario">
            Desde a melhora em {formatDayMonth(crisis?.improvedAt ?? today)}.
          </p>
          {stage.holding ? <p role="status">{DIARREIA.segure}</p> : null}
          <ol className={styles.etapas}>
            {VOLTA_ETAPAS.map((e) => (
              <li key={e.id} className={e.id === stage.stage ? styles.etapaAtual : undefined}>
                <strong>{e.dias}</strong>
                {e.texto} {e.fecho ?? ''}
              </li>
            ))}
          </ol>
          <Note>{DIARREIA.acompanhe}</Note>
          {stage.stage === ULTIMA_ETAPA ? (
            <Button variant="primary" onClick={() => void endCrisis()}>
              Terminei a volta
            </Button>
          ) : null}
        </Card>
      )}

      <QuandoProcurar />
      <Note>{DIARREIA.temporaria}</Note>
      <Button variant="ghost" block onClick={() => void endCrisis()}>
        Encerrar o modo crise
      </Button>
    </Screen>
  );
}

function QuandoProcurar() {
  return (
    <Card label="Quando procurar atendimento">
      <p>{DIARREIA.quandoProcurar}</p>
      <p>{DIARREIA.quandoProcurarAula6}</p>
    </Card>
  );
}
