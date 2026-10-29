import { useState } from 'react';
import { DIA_MODELO_FIBRAS, FIBRAS, FIBRA_TEXTOS, getFiberFood } from '../../content/agua-fibras';
import { useLessons, useProfile } from '../../app/data';
import { fiberBand, fiberItemDisplay, fiberTotal } from '../../logic/fiber';
import { formatDecimal } from '../../logic/format';
import { Button } from '../../ui/Button';
import { Note } from '../../ui/Misc';
import { concludeTask, setTaskData } from '../processo/actions';
import styles from '../processo/Processo.module.css';

interface Item {
  foodId: string;
  grams: number;
}

const BAND_TEXT = {
  abaixo: 'Abaixo de 25 g.',
  meta: 'Entre 25 e 30 g, dentro da meta.',
  acima: 'Acima de 30 g.',
};

/** Meu dia de fibras (seção 7.14). Fica salvo junto da tarefa da aula 10. */
export function FiberDayTool() {
  const lessons = useLessons();
  const profile = useProfile();
  const saved = lessons?.find((l) => l.lessonId === 10)?.task.data;
  const [items, setItems] = useState<Item[] | null>(null);
  const [msg, setMsg] = useState('');
  if (!lessons || !profile) return null;
  const list = items ?? (saved?.fibras as Item[] | undefined) ?? [];
  const entries = list.map((i) => ({
    per100: getFiberFood(i.foodId)?.per100 ?? 0,
    grams: i.grams,
  }));
  const total = fiberTotal(entries);
  const update = (idx: number, patch: Partial<Item>) =>
    setItems(list.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const save = async () => {
    await setTaskData(10, { fibras: list, fibrasSalvas: true });
    if (profile.waterGoalMl || saved?.agua) await concludeTask(10);
    setMsg('Dia de fibras salvo.');
  };

  return (
    <div className={styles.pilha}>
      {list.length === 0 ? (
        <p className="secundario">Monte o teu dia ou carregue o dia modelo.</p>
      ) : null}
      <ul className={styles.lista}>
        {list.map((it, idx) => {
          const model = DIA_MODELO_FIBRAS.find((m) => m.foodId === it.foodId);
          return (
            <li key={idx} className={styles.pilha}>
              <div className={styles.campo}>
                <label htmlFor={`fib-${idx}`}>Alimento</label>
                <select
                  id={`fib-${idx}`}
                  value={it.foodId}
                  onChange={(e) => update(idx, { foodId: e.target.value })}
                >
                  {FIBRAS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.linha}>
                <div className={styles.campo}>
                  <label htmlFor={`fib-g-${idx}`}>Gramas</label>
                  <input
                    id={`fib-g-${idx}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={it.grams || ''}
                    onChange={(e) => update(idx, { grams: Number(e.target.value) || 0 })}
                    style={{ maxWidth: 110 }}
                  />
                </div>
                {model ? (
                  <Button variant="ghost" onClick={() => update(idx, { grams: model.grams })}>
                    {model.measure}
                  </Button>
                ) : (
                  [50, 100, 150].map((g) => (
                    <Button key={g} variant="ghost" onClick={() => update(idx, { grams: g })}>
                      {g} g
                    </Button>
                  ))
                )}
              </div>
              <div className={styles.item}>
                <span className={styles.numero}>
                  {formatDecimal(fiberItemDisplay(entries[idx] ?? { per100: 0, grams: 0 }))} g de
                  fibra
                </span>
                <Button variant="link" onClick={() => setItems(list.filter((_, i) => i !== idx))}>
                  Tirar
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.linha}>
        <Button onClick={() => setItems([...list, { foodId: FIBRAS[0]?.id ?? 'aveia', grams: 0 }])}>
          Incluir alimento
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setItems(DIA_MODELO_FIBRAS.map((m) => ({ foodId: m.foodId, grams: m.grams })))
          }
        >
          Carregar o dia modelo
        </Button>
      </div>
      <p>
        <strong>Total do dia: {total} g.</strong>{' '}
        {list.length > 0 ? BAND_TEXT[fiberBand(total)] : ''}
      </p>
      <Note>{FIBRA_TEXTOS.ferramenta}</Note>
      <Button variant="primary" disabled={list.length === 0} onClick={() => void save()}>
        Salvar meu dia de fibras
      </Button>
      <p role="status" aria-live="polite" className="secundario">
        {msg}
      </p>
    </div>
  );
}
