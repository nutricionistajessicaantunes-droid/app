import { useState } from 'react';
import { DB_NAME, DB_NAME_DEMO } from '../config';
import { backupToFile, emergencyExport, shareOrDownload } from '../db/backup';
import { getPlatform } from './platform';
import styles from './App.module.css';

/**
 * Tela amigável quando algo quebra. O botão exporta direto do IndexedDB,
 * sem depender do estado do React (seção 3.3).
 */
export function ErrorScreen() {
  const [status, setStatus] = useState('');
  const save = async () => {
    setStatus('Preparando a cópia...');
    try {
      const demo = (() => {
        try {
          return Boolean(sessionStorage.getItem('modulacao:demo'));
        } catch {
          return false;
        }
      })();
      const backup = await emergencyExport(demo ? DB_NAME_DEMO : DB_NAME);
      let mobile = true;
      try {
        mobile = getPlatform().os !== 'outro';
      } catch {
        mobile = true;
      }
      const r = await shareOrDownload(backupToFile(backup), mobile);
      setStatus(
        r === 'cancelado'
          ? ''
          : 'Cópia salva. Guarde o arquivo em lugar seguro e envie só para você.',
      );
    } catch {
      setStatus(
        'Não foi possível salvar a cópia agora. Teus registros continuam guardados neste aparelho.',
      );
    }
  };
  return (
    <main className={styles.erroTela} id="conteudo">
      <h1>Algo não saiu como esperado</h1>
      <p>
        Teus registros continuam guardados neste aparelho. Antes de qualquer coisa, salve uma cópia
        de emergência.
      </p>
      <button type="button" className={styles.erroBotao} onClick={() => void save()}>
        Salvar uma cópia de emergência
      </button>
      <p role="status" aria-live="polite">
        {status}
      </p>
      <button type="button" className={styles.erroLink} onClick={() => window.location.assign('/')}>
        Abrir o app de novo
      </button>
    </main>
  );
}
