import { useState } from 'react';
import { getPlatform } from '../../app/platform';
import { backupToFile, exportAll, shareOrDownload } from '../../db/backup';
import { updateMeta } from '../../db/repo';

export const TEXTO_APOIO_COPIA =
  'Esse arquivo tem os teus registros de saúde. Guarde em lugar seguro e envie só para você.';

/** Salvar uma cópia: no celular compartilha o arquivo; no computador, baixa. */
export function useSaveBackup() {
  const [status, setStatus] = useState<'' | 'salvando' | 'salvo' | 'erro'>('');
  const save = async () => {
    setStatus('salvando');
    try {
      const file = backupToFile(await exportAll());
      const r = await shareOrDownload(file, getPlatform().os !== 'outro');
      if (r === 'cancelado') {
        setStatus('');
        return;
      }
      await updateMeta({ lastBackupAt: new Date().toISOString() });
      setStatus('salvo');
    } catch {
      setStatus('erro');
    }
  };
  const message =
    status === 'salvo'
      ? 'Cópia salva. Guarde o arquivo em lugar seguro.'
      : status === 'erro'
        ? 'Não foi possível salvar a cópia. Tente de novo.'
        : '';
  return { save, status, message };
}
