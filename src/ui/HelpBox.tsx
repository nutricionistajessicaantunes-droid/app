import { ChevronDown, CircleHelp } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './HelpBox.module.css';

/** "Como usar esta tela": orientação curta, recolhida, no topo das telas principais. */
export function HelpBox({
  items,
  title = 'Como usar esta tela',
  open,
  children,
}: {
  items?: string[];
  title?: string;
  open?: boolean;
  children?: ReactNode;
}) {
  return (
    <details className={styles.caixa} open={open}>
      <summary className={styles.resumo}>
        <CircleHelp size={20} aria-hidden="true" />
        <span>{title}</span>
        <ChevronDown size={20} aria-hidden="true" className={styles.seta} />
      </summary>
      <div className={styles.corpo}>
        {items ? (
          <ul>
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </details>
  );
}
