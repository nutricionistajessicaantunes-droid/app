import type { ReactNode } from 'react';
import styles from './Card.module.css';
import { Filete } from './Filete';

interface CardProps {
  /** Rótulo em caixa alta com linha fina (o "filete"). */
  label?: string;
  title?: ReactNode;
  tone?: 'banda' | 'alerta' | 'sucesso' | 'destaque';
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  id?: string;
  /** Nível do título, para manter a hierarquia da página. */
  level?: 2 | 3;
  role?: string;
  labelledBy?: string;
}

export function Card({
  label,
  title,
  tone,
  children,
  actions,
  className,
  id,
  level = 2,
  role,
  labelledBy,
}: CardProps) {
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <section
      id={id}
      role={role}
      aria-labelledby={labelledBy}
      className={[styles.card, tone ? styles[tone] : '', className ?? ''].filter(Boolean).join(' ')}
    >
      {label ? <Filete level={title ? undefined : level}>{label}</Filete> : null}
      {title ? <Title className={styles.title}>{title}</Title> : null}
      <div className={styles.body}>{children}</div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </section>
  );
}

export function CardActions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}
