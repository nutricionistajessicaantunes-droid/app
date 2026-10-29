import { Check, ExternalLink as ExternalIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { buttonClass, type ButtonVariant } from './buttonClass';
import styles from './Misc.module.css';

export const SEM_INTERNET_AULA = 'Você está sem internet. A aula abre quando a conexão voltar.';
export const SEM_INTERNET = 'Você está sem internet. O link abre quando a conexão voltar.';

/** "Salvo" discreto, anunciado para leitores de tela. */
export function SavedIndicator({ visible }: { visible: boolean }) {
  return (
    <span className={styles.salvo} aria-live="polite" role="status">
      {visible ? (
        <>
          <Check size={16} aria-hidden="true" />
          Salvo
        </>
      ) : null}
    </span>
  );
}

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant | 'text';
  block?: boolean;
  offlineMessage?: string;
  icon?: boolean;
}

/** Link para fora do app (Kiwify, WhatsApp, Instagram). Sem internet, avisa em vez de abrir. */
export function ExternalLink({
  href,
  children,
  variant = 'text',
  block,
  offlineMessage = SEM_INTERNET,
  icon = true,
}: ExternalLinkProps) {
  const [offline, setOffline] = useState(false);
  const cls = variant === 'text' ? styles.linkExterno : buttonClass(variant, block);
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onClick={(e) => {
          if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            e.preventDefault();
            setOffline(true);
          } else {
            setOffline(false);
          }
        }}
      >
        {children}
        {icon ? <ExternalIcon size={16} aria-hidden="true" /> : null}
        <span className="sr-only"> (abre fora do app)</span>
      </a>
      <span role="status" aria-live="polite">
        {offline ? <span className={styles.semInternet}>{offlineMessage}</span> : null}
      </span>
    </>
  );
}

export function TopBanner({
  children,
  action,
  tone = 'acento',
}: {
  children: ReactNode;
  action?: ReactNode;
  tone?: 'acento' | 'aviso';
}) {
  return (
    <div
      className={[styles.faixaTopo, tone === 'aviso' ? styles.faixaAviso : ''].join(' ')}
      role="region"
      aria-label="Aviso"
    >
      <span>{children}</span>
      {action}
    </div>
  );
}

export function BannerButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={styles.faixaBotao} onClick={onClick}>
      {children}
    </button>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.nota}>{children}</p>;
}

export function Quote({ children }: { children: ReactNode }) {
  return <blockquote className={styles.citacao}>{children}</blockquote>;
}

export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className={styles.lista}>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
