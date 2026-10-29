import type { ReactNode } from 'react';
import styles from './Filete.module.css';

/**
 * O "filete" dos materiais: rótulo pequeno em caixa alta, com espaçamento entre letras,
 * seguido de uma linha fina.
 */
export function Filete({
  children,
  level,
  id,
  noLine,
}: {
  children: ReactNode;
  /** Sem nível, é só um rótulo visual (p). Com nível, vira título de seção. */
  level?: 2 | 3;
  id?: string;
  noLine?: boolean;
}) {
  const cls = [styles.filete, noLine ? styles.semLinha : ''].filter(Boolean).join(' ');
  if (level === 2) {
    return (
      <h2 id={id} className={cls}>
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3 id={id} className={cls}>
        {children}
      </h3>
    );
  }
  return (
    <p id={id} className={cls}>
      {children}
    </p>
  );
}
