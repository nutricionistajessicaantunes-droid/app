import { Check } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import styles from './Controls.module.css';

export interface CheckItem {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
}

interface CheckListProps {
  items: CheckItem[];
  checked: (id: string) => boolean;
  onToggle: (id: string, next: boolean) => void;
  /** Rótulo do grupo para leitores de tela. */
  label?: string;
}

/** Lista de marcar com linhas grandes. */
export function CheckList({ items, checked, onToggle, label }: CheckListProps) {
  const base = useId();
  return (
    <ul className={styles.linhas} aria-label={label}>
      {items.map((it) => {
        const id = `${base}-${it.id}`;
        const on = checked(it.id);
        return (
          <li className={styles.linha} key={it.id}>
            <input
              type="checkbox"
              id={id}
              checked={on}
              onChange={(e) => onToggle(it.id, e.target.checked)}
            />
            <label htmlFor={id}>
              <span className={styles.caixa} aria-hidden="true">
                {on ? <Check size={16} strokeWidth={3} /> : null}
              </span>
              <span className={styles.linhaTexto}>
                <span>{it.label}</span>
                {it.detail ? <span className={styles.linhaDetalhe}>{it.detail}</span> : null}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

interface RadioListProps<T extends string> {
  legend: ReactNode;
  hideLegend?: boolean;
  options: { value: T; label: ReactNode; detail?: ReactNode }[];
  value: T | undefined;
  onChange: (v: T) => void;
}

/** Escolha única em linhas grandes (por exemplo, o caminho). */
export function RadioList<T extends string>({
  legend,
  hideLegend,
  options,
  value,
  onChange,
}: RadioListProps<T>) {
  const base = useId();
  return (
    <fieldset className={styles.grupo}>
      <legend className={[styles.legenda, hideLegend ? 'sr-only' : ''].join(' ')}>{legend}</legend>
      <ul className={styles.linhas}>
        {options.map((o) => {
          const id = `${base}-${o.value}`;
          const on = value === o.value;
          return (
            <li className={styles.linha} key={o.value}>
              <input
                type="radio"
                name={base}
                id={id}
                checked={on}
                onChange={() => onChange(o.value)}
              />
              <label htmlFor={id}>
                <span className={[styles.caixa, styles.redonda].join(' ')} aria-hidden="true">
                  {on ? <Check size={16} strokeWidth={3} /> : null}
                </span>
                <span className={styles.linhaTexto}>
                  <span>{o.label}</span>
                  {o.detail ? <span className={styles.linhaDetalhe}>{o.detail}</span> : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
