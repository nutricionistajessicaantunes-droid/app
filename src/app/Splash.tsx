import { BrandMark } from '../ui/Brand';
import styles from './App.module.css';

export function Splash() {
  return (
    <div className={styles.splash} aria-busy="true" aria-label="Carregando">
      <BrandMark size={64} />
    </div>
  );
}
