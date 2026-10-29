import { useId, type ReactNode } from 'react';
import styles from './Switch.module.css';

/** Interruptor liga e desliga (role="switch"), com o estado também em texto. */
export function Switch({
  label,
  detail,
  checked,
  onChange,
}: {
  label: ReactNode;
  detail?: ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const id = useId();
  return (
    <div className={styles.linha}>
      <span className={styles.texto}>
        <span id={`${id}-l`} className={styles.rotulo}>
          {label}
        </span>
        {detail ? (
          <span id={`${id}-d`} className={styles.detalhe}>
            {detail}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-l`}
        aria-describedby={detail ? `${id}-d` : undefined}
        className={styles.botao}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.trilho} aria-hidden="true">
          <span className={styles.bola} />
        </span>
        <span className={styles.estado} aria-hidden="true">
          {checked ? 'Ligado' : 'Desligado'}
        </span>
      </button>
    </div>
  );
}
