import { ChevronLeft } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Brand } from './Brand';
import styles from './FirstRun.module.css';

interface FirstRunProps {
  title: ReactNode;
  docTitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  step?: { current: number; total: number };
  showBrand?: boolean;
}

/** Moldura das telas da primeira vez: marca, uma pergunta por tela, progresso e voltar. */
export function FirstRun({
  title,
  docTitle,
  children,
  footer,
  onBack,
  step,
  showBrand = true,
}: FirstRunProps) {
  useEffect(() => {
    const t = docTitle ?? (typeof title === 'string' ? title : '');
    document.title = t ? `${t} · Modulação` : 'Modulação Intestinal na Prática';
  }, [docTitle, title]);

  return (
    <main className={styles.tela} id="conteudo">
      <div className={styles.topo}>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              minHeight: 44,
              minWidth: 44,
              padding: '0 10px 0 0',
              border: 'none',
              background: 'none',
              color: 'var(--acento)',
              fontWeight: 500,
            }}
          >
            <ChevronLeft size={22} aria-hidden="true" />
            Voltar
          </button>
        ) : showBrand ? (
          <Brand />
        ) : null}
        {step ? (
          <div className={styles.progresso} aria-label={`Passo ${step.current} de ${step.total}`}>
            <div className={styles.barra} aria-hidden="true">
              <div
                className={styles.barraCheia}
                style={{ width: `${(step.current / step.total) * 100}%` }}
              />
            </div>
            <span aria-hidden="true">
              {step.current} de {step.total}
            </span>
          </div>
        ) : null}
      </div>
      <div className={styles.corpo}>
        <h1 className={styles.titulo}>{title}</h1>
        {children}
      </div>
      {footer ? <div className={styles.rodape}>{footer}</div> : null}
    </main>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className={styles.passos}>{children}</ol>;
}

export function Step({
  n,
  title,
  detail,
  icon,
}: {
  n: number;
  title: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <li className={styles.passo}>
      <span className={styles.passoNumero} aria-hidden="true">
        {n}
      </span>
      <span className={styles.passoTexto}>
        <span className={styles.passoTitulo}>
          <span className="sr-only">Passo {n}: </span>
          {title}
        </span>
        {detail ? <span className={styles.passoDetalhe}>{detail}</span> : null}
      </span>
      {icon ? (
        <span className={styles.passoIcone} aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </li>
  );
}
