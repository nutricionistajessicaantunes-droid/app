import styles from './Brand.module.css';

/** Traço curvo contínuo do ícone do app. */
export function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={styles.marca}
    >
      <rect width="512" height="512" rx="112" fill="var(--vinho)" />
      <path
        d="M128 286 C 176 196, 240 196, 256 256 S 336 316, 384 226"
        fill="none"
        stroke="var(--sobre-vinho)"
        strokeWidth="34"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Brand() {
  return (
    <div className={styles.brand}>
      <BrandMark />
      <span className={styles.nome}>
        Modulação Intestinal
        <br />
        na Prática
      </span>
    </div>
  );
}
