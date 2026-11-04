import { useRef, useState } from 'react';
import { getPlatform } from '../../app/platform';
import { backupToFile, exportAll, shareOrDownload } from '../../db/backup';
import { updateMeta } from '../../db/repo';

export const TEXTO_APOIO_COPIA =
  'Esse arquivo tem os teus registros de saúde. Guarde em lugar seguro e envie só para você.';

/**
 * Salvar uma cópia: no celular compartilha o arquivo; no computador, baixa.
 * Se o celular bloquear o compartilhamento (o arquivo demorou a ficar pronto), o arquivo
 * fica guardado e o próximo toque envia na hora.
 */
export function useSaveBackup() {
  const [status, setStatus] = useState<'' | 'salvando' | 'pronto' | 'salvo' | 'erro'>('');
  const pending = useRef<File | null>(null);
  const save = async () => {
    try {
      let file = pending.current;
      if (!file) {
        setStatus('salvando');
        file = backupToFile(await exportAll());
      }
      const r = await shareOrDownload(file, getPlatform().os !== 'outro');
      if (r === 'bloqueado') {
        pending.current = file;
        setStatus('pronto');
        return;
      }
      pending.current = null;
      if (r === 'cancelado') {
        setStatus('');
        return;
      }
      await updateMeta({ lastBackupAt: new Date().toISOString() });
      setStatus('salvo');
    } catch {
      pending.current = null;
      setStatus('erro');
    }
  };
  const message =
    status === 'salvo'
      ? 'Cópia salva. Guarde o arquivo em lugar seguro.'
      : status === 'pronto'
        ? 'A cópia está pronta. Toque de novo em "Salvar uma cópia" para enviar o arquivo.'
        : status === 'erro'
          ? 'Não foi possível salvar a cópia. Tente de novo.'
          : '';
  return { save, status, message };
}
