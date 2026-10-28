import { useState, type FormEvent } from 'react';
import { ACCESS_CODE_HASH } from '../../config';
import { ACESSO_TEXTOS } from '../../content/onboarding';
import { updateMeta } from '../../db/repo';
import { isCodeValid } from '../../logic/access';
import { Button } from '../../ui/Button';
import { FirstRun } from '../../ui/FirstRun';
import firstRunStyles from '../../ui/FirstRun.module.css';

/** Código de acesso (seção 3.5). */
export function AccessScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await isCodeValid(code, ACCESS_CODE_HASH);
    setBusy(false);
    if (ok) {
      await updateMeta({ unlocked: true });
    } else {
      setError(
        code.trim()
          ? 'Esse código não confere. Confira na área de membros e tente de novo.'
          : 'Digite o código para entrar.',
      );
    }
  };

  return (
    <FirstRun title="Boas-vindas ao app do curso" docTitle="Código de acesso">
      <form onSubmit={(e) => void submit(e)} noValidate>
        <label className={firstRunStyles.campo} htmlFor="codigo">
          <span className={firstRunStyles.rotulo}>{ACESSO_TEXTOS.instrucao}</span>
        </label>
        <input
          id="codigo"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'codigo-erro' : undefined}
          style={{ marginTop: 8, fontSize: '1.125rem', letterSpacing: '0.06em' }}
        />
        {error ? (
          <p id="codigo-erro" className={firstRunStyles.erro} role="alert">
            {error}
          </p>
        ) : null}
        <div style={{ marginTop: 16 }}>
          <Button type="submit" variant="primary" block disabled={busy}>
            {ACESSO_TEXTOS.entrar}
          </Button>
        </div>
      </form>
      <div>
        <Button variant="link" onClick={() => setHelp((h) => !h)} aria-expanded={help}>
          {ACESSO_TEXTOS.ajuda}
        </Button>
        {help ? <p className={firstRunStyles.texto}>{ACESSO_TEXTOS.ajudaResposta}</p> : null}
      </div>
    </FirstRun>
  );
}
