import { Check } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Controls.module.css';

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onToggle'> {
  pressed: boolean;
  onToggle: (next: boolean) => void;
  children: ReactNode;
}

/** Chip de liga e desliga. Marcado mostra também um sinal de check, não só a cor. */
export function Chip({ pressed, onToggle, children, className, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, className ?? ''].filter(Boolean).join(' ')}
      aria-pressed={pressed}
      onClick={() => onToggle(!pressed)}
      {...rest}
    >
      {pressed ? <Check size={16} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function ChipGroup({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className={styles.chips} role={label ? 'group' : undefined} aria-label={label}>
      {children}
    </div>
  );
}
