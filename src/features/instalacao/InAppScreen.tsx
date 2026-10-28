import { Copy, EllipsisVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import type { PlatformInfo } from '../../logic/platform';
import { Button } from '../../ui/Button';
import { FirstRun, Step, Steps } from '../../ui/FirstRun';
import firstRunStyles from '../../ui/FirstRun.module.css';

/** Navegador dentro de outro app (Instagram, Facebook, WebView): pedir para abrir no navegador. */
export function InAppScreen({ platform }: { platform: PlatformInfo }) {
  const [copied, setCopied] = useState<'ok' | 'manual' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const href = window.location.href;
  const browserName = platform.os === 'ios' ? 'Safari' : 'Chrome';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied('ok');
      return;
    } catch {
      /* tenta o jeito antigo */
    }
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.select();
      input.setSelectionRange(0, href.length);
      try {
        const ok = document.execCommand('copy');
        setCopied(ok ? 'ok' : 'manual');
      } catch {
        setCopied('manual');
      }
    }
  };

  return (
    <FirstRun
      title="Abra no navegador"
      footer={
        <Button variant="primary" block icon={<Copy size={20} />} onClick={() => void copy()}>
          Copiar link
        </Button>
      }
    >
      <p className={firstRunStyles.texto}>
        Você abriu o app por dentro{' '}
        {platform.inAppName ? `do ${platform.inAppName}` : 'de outro aplicativo'}. Aqui os teus
        registros se perdem com facilidade. Abra no {browserName} para guardar tudo com segurança.
      </p>
      <Steps>
        <Step
          n={1}
          title="Toque nos três pontinhos"
          detail="Ficam no canto da tela, em cima ou embaixo."
          icon={<EllipsisVertical size={24} />}
        />
        <Step
          n={2}
          title={`Toque em Abrir no ${browserName}`}
          detail="O nome pode ser Abrir no navegador."
        />
      </Steps>
      <p className={firstRunStyles.texto}>
        Se não encontrar essa opção, copie o link e cole no {browserName}.
      </p>
      <label className={firstRunStyles.campo}>
        <span className={firstRunStyles.rotulo}>Link do app</span>
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={href}
          onFocus={(e) => e.currentTarget.select()}
        />
      </label>
      <p role="status" aria-live="polite" className={firstRunStyles.texto}>
        {copied === 'ok'
          ? `Link copiado. Agora abra o ${browserName} e cole na barra de endereço.`
          : null}
        {copied === 'manual' ? 'Toque no link acima, segure e escolha Copiar.' : null}
      </p>
    </FirstRun>
  );
}
