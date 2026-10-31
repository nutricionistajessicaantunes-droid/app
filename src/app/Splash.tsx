import { useEffect, useState } from 'react';
import { BrandMark } from '../ui/Brand';
import { Button } from '../ui/Button';
import styles from './App.module.css';

export function Splash() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={styles.splash} aria-busy={!slow} aria-label="Carregando">
      <BrandMark size={64} />
      {slow ? (
        <div style={{ textAlign: 'center', marginTop: 24, padding: '0 16px' }}>
          <p>Está demorando mais que o normal.</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Tentar de novo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
