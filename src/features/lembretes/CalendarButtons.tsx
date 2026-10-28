import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { getPlatform } from '../../app/platform';
import type { CalendarEvent } from '../../logic/calendar';
import { Button } from '../../ui/Button';
import { openGoogle, openIcs } from './reminders';
import styles from './CalendarButtons.module.css';

/** Sempre dois botões: "Agenda do iPhone" e "Google Agenda" (seção 3.6). */
export function CalendarButtons({ event, label }: { event: CalendarEvent; label?: string }) {
  const [msg, setMsg] = useState('');
  return (
    <div className={styles.caixa}>
      {label ? <p className={styles.rotulo}>{label}</p> : null}
      <div className={styles.botoes}>
        <Button
          icon={<CalendarPlus size={18} />}
          onClick={() => {
            const r = openIcs(event, getPlatform());
            setMsg(
              r === 'sem_internet'
                ? 'Você está sem internet. Tente de novo quando a conexão voltar.'
                : r === 'baixado'
                  ? 'Arquivo de agenda salvo. Abra o arquivo para colocar na tua agenda.'
                  : '',
            );
          }}
        >
          Agenda do iPhone
        </Button>
        <Button
          icon={<CalendarPlus size={18} />}
          onClick={() => {
            const ok = openGoogle(event);
            setMsg(ok ? '' : 'Você está sem internet. Tente de novo quando a conexão voltar.');
          }}
        >
          Google Agenda
        </Button>
      </div>
      <p role="status" aria-live="polite" className={styles.msg}>
        {msg}
      </p>
    </div>
  );
}
