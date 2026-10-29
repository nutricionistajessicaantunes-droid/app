import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { readFileText, type BackupFile } from '../../db/backup';
import {
  parseBackup,
  previewBackup,
  restoreMerge,
  restoreReplace,
  type BackupPreview,
} from '../../db/restore';
import { getDb } from '../../db/index';
import { formatDayMonth, toDayKey } from '../../logic/dates';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import styles from './Ajustes.module.css';

type Mode = 'substituir' | 'juntar';

/**
 * Restaurar uma cópia (seção 3.3): escolher o arquivo (.txt ou .json), validar, mostrar a
 * prévia e oferecer "Substituir tudo" ou "Juntar com o que já tenho", com confirmação em
 * duas etapas.
 */
export function RestoreFlow({
  onDone,
  hasExistingData,
}: {
  onDone?: () => void;
  hasExistingData: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [backup, setBackup] = useState<BackupFile | null>(null);
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const pick = async (file: File | undefined) => {
    setError('');
    setBackup(null);
    setPreview(null);
    setMode(null);
    if (!file) return;
    const text = await readFileText(file);
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setBackup(parsed.backup);
    setPreview(previewBackup(parsed.backup));
  };

  const confirm = async () => {
    if (!backup || !mode) return;
    setBusy(true);
    try {
      if (mode === 'substituir') await restoreReplace(backup, getDb());
      else await restoreMerge(backup, getDb());
      setDone(true);
      onDone?.();
    } catch {
      setError(
        'Não foi possível restaurar. Teus registros atuais continuam como estavam. Tente de novo.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Card tone="sucesso" title="Cópia restaurada">
        <p>Teus registros estão de volta.</p>
      </Card>
    );
  }

  return (
    <div className={styles.pilha}>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.json,text/plain,application/json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void pick(e.target.files?.[0])}
      />
      {!preview ? (
        <Button
          variant="primary"
          block
          icon={<Upload size={20} />}
          onClick={() => inputRef.current?.click()}
        >
          Escolher o arquivo da cópia
        </Button>
      ) : null}
      {error ? (
        <p className={styles.erro} role="alert">
          {error}
        </p>
      ) : null}

      {preview && backup && !mode ? (
        <Card title="Cópia encontrada">
          <p>
            Cópia salva em {formatDayMonth(toDayKey(new Date(preview.exportedAt)))}, com{' '}
            {preview.registeredDays === 1
              ? '1 dia registrado'
              : `${preview.registeredDays} dias registrados`}
            {preview.firstDay && preview.lastDay
              ? `, de ${formatDayMonth(preview.firstDay)} a ${formatDayMonth(preview.lastDay)}`
              : ''}
            .
          </p>
          <div className={styles.pilha}>
            {hasExistingData ? (
              <>
                <Button variant="primary" block onClick={() => setMode('juntar')}>
                  Juntar com o que já tenho
                </Button>
                <Button block onClick={() => setMode('substituir')}>
                  Substituir tudo
                </Button>
              </>
            ) : (
              <Button variant="primary" block onClick={() => setMode('substituir')}>
                Restaurar esta cópia
              </Button>
            )}
            <Button variant="ghost" block onClick={() => inputRef.current?.click()}>
              Escolher outro arquivo
            </Button>
          </div>
        </Card>
      ) : null}

      {mode ? (
        <Card
          tone="destaque"
          title={
            mode === 'substituir' && hasExistingData
              ? 'Substituir tudo?'
              : mode === 'juntar'
                ? 'Juntar os registros?'
                : 'Restaurar a cópia?'
          }
        >
          <p>
            {mode === 'substituir' && hasExistingData
              ? 'Os registros que estão neste aparelho agora serão trocados pelos da cópia. Isso não pode ser desfeito.'
              : mode === 'juntar'
                ? 'Os registros da cópia entram junto com os deste aparelho. Quando o mesmo dia existe nos dois, fica a versão mais recente.'
                : 'Os registros da cópia vão para este aparelho.'}
          </p>
          <div className={styles.pilha}>
            <Button variant="primary" block onClick={() => void confirm()} disabled={busy}>
              {mode === 'substituir' && hasExistingData
                ? 'Sim, substituir tudo'
                : mode === 'juntar'
                  ? 'Sim, juntar'
                  : 'Sim, restaurar'}
            </Button>
            <Button variant="ghost" block onClick={() => setMode(null)} disabled={busy}>
              Cancelar
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export default RestoreFlow;
