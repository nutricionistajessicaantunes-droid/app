import { Check } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import styles from './Controls.module.css';

export interface ChoiceOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface ChoiceProps<T extends string> {
  legend: ReactNode;
  help?: ReactNode;
  options: ChoiceOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  vertical?: boolean;
  /** Legenda só para leitores de tela. */
  hideLegend?: boolean;
  name?: string;
}

/** Escolha única com botões grandes. Usa rádios de verdade por baixo. */
export function Choice<T extends string>({
  legend,
  help,
  options,
  value,
  onChange,
  vertical,
  hideLegend,
  name,
}: ChoiceProps<T>) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const helpId = `${groupName}-ajuda`;
  return (
    <fieldset className={styles.grupo} aria-describedby={help ? helpId : undefined}>
      <legend className={[styles.legenda, hideLegend ? 'sr-only' : ''].join(' ')}>{legend}</legend>
      {help ? (
        <p id={helpId} className={styles.ajuda}>
          {help}
        </p>
      ) : null}
      <div className={[styles.segmentos, vertical ? styles.segmentosVertical : ''].join(' ')}>
        {options.map((opt) => {
          const id = `${groupName}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <div className={styles.opcao} key={opt.value}>
              <input
                type="radio"
                id={id}
                name={groupName}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
              />
              <label htmlFor={id}>
                {checked && vertical ? (
                  <span className={styles.marca} aria-hidden="true">
                    <Check size={18} />
                  </span>
                ) : null}
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
