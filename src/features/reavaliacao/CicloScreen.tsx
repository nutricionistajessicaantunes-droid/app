import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MANUTENCAO_TEXTOS } from '../../content/reavaliacao';
import { IMPLANTACAO, TABELA_IMPLANTACAO } from '../../content/rotina';
import { useToday } from '../../app/useToday';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList } from '../../ui/CheckList';
import { Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { startCycle, type HabitChoice } from '../processo/actions';
import styles from '../processo/Processo.module.css';

const MAX = 2;

/** Novo ciclo (seção 6.9): no máximo dois hábitos novos, com leitura da semana. */
export function Component() {
  const today = useToday();
  const navigate = useNavigate();
  const [list, setList] = useState<HabitChoice[]>([]);
  const [custom, setCustom] = useState('');
  const isOn = (label: string) => list.some((c) => c.label === label);
  const toggle = (c: HabitChoice) => {
    if (isOn(c.label)) setList(list.filter((x) => x.label !== c.label));
    else if (list.length < MAX) setList([...list, c]);
  };
  const options: HabitChoice[] = [
    ...TABELA_IMPLANTACAO.map((t) => ({
      label: t.habito,
      trigger: `${t.gatilho}, ${t.faco.toLowerCase()}`,
      isWater: t.isWater,
    })),
    ...list.filter((c) => !TABELA_IMPLANTACAO.some((t) => t.habito === c.label)),
  ];
  return (
    <Screen title="Novo ciclo" back="/plano" backLabel="Plano">
      <p>{MANUTENCAO_TEXTOS[1]}</p>
      <Card label={`Escolha até ${MAX} hábitos · ${list.length} de ${MAX}`}>
        <CheckList
          items={options.map((o) => ({ id: o.label, label: o.label, detail: o.trigger }))}
          checked={isOn}
          onToggle={(id) => {
            const o = options.find((x) => x.label === id);
            if (o) toggle(o);
          }}
        />
        <div className={styles.campo} style={{ marginTop: 12 }}>
          <label htmlFor="ciclo-outro">Escrever outro</label>
          <div className={styles.linha}>
            <input
              id="ciclo-outro"
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
            <Button
              disabled={!custom.trim() || list.length >= MAX}
              onClick={() => {
                toggle({ label: custom.trim() });
                setCustom('');
              }}
            >
              Incluir
            </Button>
          </div>
        </div>
        <Note>{IMPLANTACAO[0]}</Note>
      </Card>
      <Button
        variant="primary"
        block
        disabled={list.length === 0}
        onClick={() => void startCycle(today, list).then(() => navigate('/'))}
      >
        Começar o ciclo hoje
      </Button>
      <p className="secundario">
        No fim de cada semana do ciclo, a leitura da semana aparece na tela Hoje.
      </p>
    </Screen>
  );
}
