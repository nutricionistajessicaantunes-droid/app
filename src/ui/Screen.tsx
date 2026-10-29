import { ChevronLeft } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import styles from './Screen.module.css';

interface ScreenProps {
  title: ReactNode;
  /** Texto para a aba do navegador, quando o título não é texto simples. */
  docTitle?: string;
  subtitle?: ReactNode;
  /** Caminho para voltar. true volta para a tela anterior (ou para Hoje). */
  back?: string | true;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
  /** Telas sem a barra de abas (registro, primeira vez). */
  noTabs?: boolean;
  /** Esconde o título visualmente (continua para leitores de tela). */
  hideTitle?: boolean;
}

export function Screen({
  title,
  docTitle,
  subtitle,
  back,
  backLabel = 'Voltar',
  actions,
  children,
  noTabs,
  hideTitle,
}: ScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = docTitle ?? (typeof title === 'string' ? title : '');
    document.title = t ? `${t} · Modulação` : 'Modulação Intestinal na Prática';
  }, [docTitle, title]);

  const backEl =
    back === undefined ? null : typeof back === 'string' ? (
      <Link to={back} className={styles.voltar}>
        <ChevronLeft size={22} aria-hidden="true" />
        {backLabel}
      </Link>
    ) : (
      <button
        type="button"
        className={styles.voltar}
        onClick={() => (location.key === 'default' ? navigate('/') : navigate(-1))}
      >
        <ChevronLeft size={22} aria-hidden="true" />
        {backLabel}
      </button>
    );

  return (
    <main className={[styles.screen, noTabs ? styles.semAbas : ''].join(' ')} id="conteudo">
      {backEl || actions ? (
        <div className={styles.topo}>
          {backEl}
          {actions ? <div className={styles.acoes}>{actions}</div> : null}
        </div>
      ) : null}
      <header className={styles.cabecalho}>
        <h1 className={[styles.titulo, hideTitle ? 'sr-only' : ''].join(' ')}>{title}</h1>
        {subtitle ? <p className={styles.subtitulo}>{subtitle}</p> : null}
      </header>
      <div className={styles.conteudo}>{children}</div>
    </main>
  );
}
