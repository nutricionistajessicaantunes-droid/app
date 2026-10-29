import { Check } from 'lucide-react';
import { useId } from 'react';
import { BAND_LABEL, BRISTOL, SELO_TIPO_IDEAL } from '../content/bristol';
import type { Bristol, BristolBand } from '../types';
import styles from './Bristol.module.css';
import { BristolDrawing } from './BristolDrawing';

export function BandTag({ band }: { band: BristolBand }) {
  return <span className={[styles.faixa, styles[band]].join(' ')}>{BAND_LABEL[band]}</span>;
}

interface BristolPickerProps {
  value: Bristol | undefined;
  onChange: (t: Bristol) => void;
  legend: string;
  help?: string;
  note?: string;
}

/** Seletor de Bristol: os sete desenhos, sempre com número, nome e faixa. */
export function BristolPicker({ value, onChange, legend, help, note }: BristolPickerProps) {
  const base = useId();
  return (
    <fieldset style={{ border: 'none', margin: 0, padding: 0, minWidth: 0 }}>
      <legend style={{ padding: 0, marginBottom: 8, fontWeight: 600, fontSize: '1.0625rem' }}>
        {legend}
      </legend>
      {help ? (
        <p className="secundario" style={{ margin: '-4px 0 12px', fontSize: '0.9375rem' }}>
          {help}
        </p>
      ) : null}
      {note ? (
        <p className="secundario" style={{ margin: '-4px 0 12px', fontSize: '0.9375rem' }}>
          {note}
        </p>
      ) : null}
      <ul className={styles.lista}>
        {BRISTOL.map((b) => {
          const id = `${base}-${b.type}`;
          const checked = value === b.type;
          return (
            <li className={styles.item} key={b.type}>
              <input
                type="radio"
                name={base}
                id={id}
                checked={checked}
                onChange={() => onChange(b.type)}
              />
              <label htmlFor={id}>
                <BristolDrawing type={b.type} size="sm" />
                <span className={styles.texto}>
                  <span className={styles.nome}>
                    <span className={styles.numero}>Tipo {b.type}</span> · {b.name}
                  </span>
                  <BandTag band={b.band} />
                </span>
                {checked ? <Check size={22} className={styles.check} aria-hidden="true" /> : null}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/** A escala completa, com descrição (folha "Como é cada tipo?" e Guia). */
export function BristolScale() {
  return (
    <ul className={styles.escala}>
      {BRISTOL.map((b) => (
        <li key={b.type} className={styles.escalaItem}>
          <BristolDrawing type={b.type} size="md" />
          <div className={styles.escalaTexto}>
            <span className={styles.nome}>
              <span className={styles.numero}>Tipo {b.type}</span> · {b.name}
              {b.ideal ? <span className={styles.ideal}>{SELO_TIPO_IDEAL}</span> : null}
            </span>
            <p className={styles.escalaDescricao}>{b.description}</p>
            <BandTag band={b.band} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** "Tipo 4 · Lisa e macia", com desenho e faixa, para resumos. */
export function BristolBadge({ type, size = 'sm' }: { type: Bristol; size?: 'sm' | 'md' }) {
  const b = BRISTOL[type - 1];
  if (!b) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <BristolDrawing type={type} size={size} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1 }}>
        <span className={styles.nome}>
          Tipo {type} · {b.name}
        </span>
        <BandTag band={b.band} />
      </span>
    </span>
  );
}
