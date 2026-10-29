import { useState } from 'react';
import { PESO_MAX_KG, PESO_MIN_KG } from '../../config';
import { AGUA_TEXTOS } from '../../content/agua-fibras';
import { getDb } from '../../db/index';
import { nowIso, saveProfile } from '../../db/repo';
import { formatCompact, formatInt } from '../../logic/format';
import { parseWeight, waterGoal } from '../../logic/water';
import type { Profile } from '../../types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import styles from './Guia.module.css';

/** Marca o item da semana zero quando a meta é salva (seção 6.7). */
async function markSemanaZero(item: string) {
  const db = getDb();
  await db.transaction('rw', db.plan, async () => {
    const plan = await db.plan.get('plan');
    if (!plan || plan.status === 'concluido') return;
    await db.plan.put({
      ...plan,
      semanaZero: { ...plan.semanaZero, [item]: true },
      updatedAt: nowIso(),
    });
  });
}

/**
 * Calculadora da meta de água (seção 7.14). O peso só serve para esta conta e não
 * aparece em nenhuma outra tela.
 */
export function WaterCalculator({ profile, onSaved }: { profile: Profile; onSaved?: () => void }) {
  const [text, setText] = useState(
    profile.weightKg ? String(profile.weightKg).replace('.', ',') : '',
  );
  const [saved, setSaved] = useState(false);
  const kg = parseWeight(text);
  const goal = kg !== undefined ? waterGoal(kg) : undefined;
  const invalid = text.trim() !== '' && !goal;

  return (
    <div className={styles.pilha}>
      <label className={styles.campo}>
        <span className={styles.rotulo}>Teu peso atual, em quilos</span>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSaved(false);
          }}
          aria-invalid={invalid || undefined}
          aria-describedby="peso-ajuda"
          style={{ maxWidth: 180 }}
        />
        <span id="peso-ajuda" className={styles.ajuda}>
          {invalid
            ? `Digite um peso entre ${PESO_MIN_KG} e ${PESO_MAX_KG} kg, só com números. Exemplo: 65 ou 65,5.`
            : 'O peso entra só nesta conta. Ele não aparece em nenhuma outra tela do app.'}
        </span>
      </label>

      {goal ? (
        <Card tone="banda">
          <p className={styles.destaqueNumero}>
            {formatCompact(goal.ml)} <span>ml por dia</span>
          </p>
          <p>
            São {goal.cups} copos de cerca de {formatInt(goal.cupMl)} ml: 3 pela manhã, 3 pela tarde
            e 2 antes de dormir.
          </p>
          <p className="secundario">{AGUA_TEXTOS.conferencia}</p>
          <p className="secundario">{AGUA_TEXTOS.avisoRenal}</p>
        </Card>
      ) : null}

      {goal && kg !== undefined ? (
        <Button
          variant="primary"
          block
          onClick={async () => {
            await saveProfile({ weightKg: kg, waterGoalMl: goal.ml });
            await markSemanaZero('meta_agua');
            setSaved(true);
            onSaved?.();
          }}
        >
          Salvar minha meta de água
        </Button>
      ) : null}
      <p role="status" aria-live="polite" className={styles.ajuda}>
        {saved ? 'Meta salva. Os copos aparecem na tela Hoje e no registro.' : ''}
      </p>
    </div>
  );
}
