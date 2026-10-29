import { useState } from 'react';
import { updateMeta } from '../../db/repo';
import type { PlatformInfo } from '../../logic/platform';
import { Button } from '../../ui/Button';
import { FirstRun } from '../../ui/FirstRun';
import firstRunStyles from '../../ui/FirstRun.module.css';
import { AndroidSteps } from './InstallSteps';
import { promptInstall, useInstallPrompt } from './installPrompt';

/** No Android e no computador: sugestão com "Instalar o app" e "Agora não" (seção 6.1). */
export function InstallSuggestionScreen({ platform }: { platform: PlatformInfo }) {
  const { canPrompt, installed } = useInstallPrompt();
  const [showSteps, setShowSteps] = useState(false);
  const desktop = platform.os !== 'android';
  const skip = () => updateMeta({ installPromptDismissedAt: new Date().toISOString() });

  if (installed) {
    return (
      <FirstRun
        title="App instalado"
        footer={
          <Button variant="primary" block onClick={skip}>
            Continuar
          </Button>
        }
      >
        <p className={firstRunStyles.texto}>
          Pronto. Daqui para frente, abra pelo ícone Modulação. Você também pode continuar por aqui
          agora.
        </p>
      </FirstRun>
    );
  }

  return (
    <FirstRun
      title={desktop ? 'Quer instalar o app?' : 'Instale o app no teu celular'}
      footer={
        <>
          {canPrompt ? (
            <Button variant="primary" block onClick={() => void promptInstall()}>
              Instalar o app
            </Button>
          ) : !desktop ? (
            <Button
              variant="primary"
              block
              onClick={() => setShowSteps(true)}
              aria-expanded={showSteps}
            >
              Instalar o app
            </Button>
          ) : null}
          <Button variant={canPrompt || !desktop ? 'ghost' : 'primary'} block onClick={skip}>
            {desktop && !canPrompt ? 'Continuar' : 'Agora não'}
          </Button>
        </>
      }
    >
      <p className={firstRunStyles.texto}>
        {desktop
          ? 'O app funciona aqui no navegador. Se quiser, dá para instalar e abrir pelo ícone, sem precisar do endereço.'
          : 'Instalado, o app abre pelo ícone na tela inicial, como os outros aplicativos, e funciona sem internet.'}
      </p>
      {showSteps && !canPrompt ? <AndroidSteps browser={platform.browser} /> : null}
    </FirstRun>
  );
}
