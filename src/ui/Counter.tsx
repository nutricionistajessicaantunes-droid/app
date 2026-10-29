import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './Controls.module.css';

interface CounterProps {
  value: number;
  onChange: (next: number) => void;
  /** Texto do valor, por exemplo "5 de 8 copos". */
  valueText: ReactNode;
  label: string;
  min?: number;
  max?: number;
}

export function Counter({ value, onChange, valueText, label, min = 0, max = 40 }: CounterProps) {
  return (
    <div className={styles.contador} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.contadorBotao}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Tirar um: ${label}`}
      >
        <Minus size={22} aria-hidden="true" />
      </button>
      <div className={styles.contadorValor} aria-live="polite">
        {valueText}
      </div>
      <button
        type="button"
        className={styles.contadorBotao}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Mais um: ${label}`}
      >
        <Plus size={22} aria-hidden="true" />
      </button>
    </div>
  );
}
