import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import styles from './Breathing.module.css';

const INSPIRA = 4;
const SOLTA = 6;
const CICLOS = 6;

/**
 * Respiração antes de comer (seção 6.11): o círculo cresce em 4 segundos e diminui em 6,
 * por 6 ciclos. Com "reduzir movimento" ligado, só o texto e a contagem.
 */
export function BreathingGuide() {
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = (INSPIRA + SOLTA) * CICLOS;

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => setT((x) => x + 1), 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running]);

  useEffect(() => {
    if (t >= total) {
      setRunning(false);
      if (timer.current) clearInterval(timer.current);
    }
  }, [t, total]);

  const inCycle = t % (INSPIRA + SOLTA);
  const breathingIn = inCycle < INSPIRA;
  const left = breathingIn ? INSPIRA - inCycle : INSPIRA + SOLTA - inCycle;
  const cycle = Math.min(CICLOS, Math.floor(t / (INSPIRA + SOLTA)) + 1);
  const finished = t >= total;

  return (
    <div className={styles.caixa}>
      <div className={styles.palco} aria-hidden="true">
        <div
          className={[
            styles.circulo,
            running ? (breathingIn ? styles.cresce : styles.diminui) : '',
          ].join(' ')}
        />
      </div>
      <p className={styles.texto} aria-live="polite">
        {running
          ? `${breathingIn ? 'Inspire' : 'Solte o ar'} · ${left} · ciclo ${cycle} de ${CICLOS}`
          : finished
            ? 'Pronto. Agora é a primeira garfada.'
            : 'Inspire em 4 segundos e solte o ar em 6. São 6 ciclos.'}
      </p>
      <Button
        variant={running ? 'ghost' : 'primary'}
        onClick={() => {
          if (running) {
            setRunning(false);
          } else {
            setT(0);
            setRunning(true);
          }
        }}
      >
        {running ? 'Parar' : finished ? 'Fazer de novo' : 'Começar a respiração'}
      </Button>
    </div>
  );
}
