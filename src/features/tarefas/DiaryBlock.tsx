import { useState } from 'react';
import { SYMPTOM_LABEL } from '../../content/registro';
import { useDiary } from '../../app/data';
import { formatTime, nowTime } from '../../logic/dates';
import { suggestFoods } from '../../logic/fodmapLookup';
import type { DayKey, SymptomId } from '../../types';
import { Button } from '../../ui/Button';
import { Chip, ChipGroup } from '../../ui/Chip';
import { Choice } from '../../ui/Choice';
import { ScaleSlider } from '../../ui/ScaleSlider';
import { addDiaryEntry, deleteDiaryEntry } from '../processo/actions';
import styles from '../processo/Processo.module.css';

type SymptomType = SymptomId | 'outro';
const TIPOS: { value: SymptomType; label: string }[] = [
  { value: 'estufamento', label: SYMPTOM_LABEL.estufamento },
  { value: 'gases', label: SYMPTOM_LABEL.gases },
  { value: 'dor', label: SYMPTOM_LABEL.dor },
  { value: 'azia', label: SYMPTOM_LABEL.azia },
  { value: 'urgencia', label: SYMPTOM_LABEL.urgencia },
  { value: 'outro', label: 'Outro' },
];

/** Diário de sintomas da aula 7: refeições e sintomas com horário. */
export function DiaryBlock({ date }: { date: DayKey }) {
  const entries = useDiary(date, date);
  const [mode, setMode] = useState<'refeicao' | 'sintoma' | null>(null);
  const [time, setTime] = useState(nowTime());
  const [foods, setFoods] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [type, setType] = useState<SymptomType | undefined>(undefined);
  const [intensity, setIntensity] = useState<number | undefined>(undefined);
  if (!entries) return null;
  const sorted = [...entries].sort((a, b) => (a.time < b.time ? -1 : 1));
  const last =
    text
      .split(/,|;| e /)
      .pop()
      ?.trim() ?? '';
  const suggestions = suggestFoods(last).filter((s) => !foods.includes(s));

  const open = (m: 'refeicao' | 'sintoma') => {
    setMode(m);
    setTime(nowTime());
    setFoods([]);
    setText('');
    setType(undefined);
    setIntensity(undefined);
  };
  const save = () => {
    if (mode === 'refeicao' && (foods.length > 0 || text.trim()))
      void addDiaryEntry({ date, time, kind: 'refeicao', foods, text: text.trim() || undefined });
    if (mode === 'sintoma' && type && intensity !== undefined)
      void addDiaryEntry({ date, time, kind: 'sintoma', symptom: { type, intensity } });
    setMode(null);
  };

  return (
    <div className={styles.pilha}>
      {sorted.length > 0 ? (
        <ul className={styles.lista}>
          {sorted.map((e) => (
            <li key={e.id} className={styles.entrada}>
              <span className={styles.hora}>{formatTime(e.time)}</span>
              <span style={{ flex: 1 }}>
                {e.kind === 'refeicao'
                  ? [...(e.foods ?? []), ...(e.text ? [e.text] : [])].join(', ')
                  : `${TIPOS.find((t) => t.value === e.symptom?.type)?.label ?? 'Sintoma'} ${e.symptom?.intensity ?? ''}`}
              </span>
              <Button variant="link" onClick={() => void deleteDiaryEntry(e.id)}>
                Apagar
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.ajuda}>Nenhuma anotação neste dia.</p>
      )}

      {mode === null ? (
        <div className={styles.linha}>
          <Button onClick={() => open('refeicao')}>+ Refeição</Button>
          <Button onClick={() => open('sintoma')}>+ Sintoma</Button>
        </div>
      ) : (
        <div className={styles.pilha}>
          <div className={styles.campo}>
            <label htmlFor="diario-hora">Horário</label>
            <input
              id="diario-hora"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          {mode === 'refeicao' ? (
            <>
              <div className={styles.campo}>
                <label htmlFor="diario-comi">O que você comeu</label>
                <input
                  id="diario-comi"
                  type="text"
                  value={text}
                  placeholder="Ex.: arroz, feijão, salada"
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              {suggestions.length > 0 ? (
                <ChipGroup label="Sugestões da lista de FODMAPs">
                  {suggestions.map((s) => (
                    <Chip
                      key={s}
                      pressed={false}
                      onToggle={() => {
                        setFoods([...foods, s]);
                        setText(text.replace(/[^,;]*$/, '').trim());
                      }}
                    >
                      {s}
                    </Chip>
                  ))}
                </ChipGroup>
              ) : null}
              {foods.length > 0 ? (
                <ChipGroup label="Alimentos marcados">
                  {foods.map((f) => (
                    <Chip key={f} pressed onToggle={() => setFoods(foods.filter((x) => x !== f))}>
                      {f}
                    </Chip>
                  ))}
                </ChipGroup>
              ) : null}
            </>
          ) : (
            <>
              <Choice legend="Sintoma" options={TIPOS} value={type} onChange={setType} />
              <ScaleSlider
                label="Intensidade, de 0 a 10"
                value={intensity}
                onChange={setIntensity}
              />
            </>
          )}
          <div className={styles.linha}>
            <Button variant="primary" onClick={save}>
              Salvar
            </Button>
            <Button variant="ghost" onClick={() => setMode(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
