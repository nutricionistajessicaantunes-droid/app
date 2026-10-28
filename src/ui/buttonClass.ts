import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSolid' | 'link';

/** Classes de botão, para links externos com cara de botão. */
export function buttonClass(variant: ButtonVariant, block?: boolean, extra?: string): string {
  return [styles.button, styles[variant], block ? styles.block : '', extra ?? '']
    .filter(Boolean)
    .join(' ');
}
