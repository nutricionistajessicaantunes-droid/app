import { useEffect, useState, type ReactNode } from 'react';
import { ACCESS_CODE_ENABLED, ACCESS_CODE_HASH } from '../config';
import { checkIndexedDb } from '../db/index';
import { updateMeta } from '../db/repo';
import { AccessScreen } from '../features/acesso/AccessScreen';
import { InAppScreen } from '../features/instalacao/InAppScreen';
import { InstallSuggestionScreen } from '../features/instalacao/InstallSuggestionScreen';
import { IOSInstallScreen } from '../features/instalacao/IOSInstallScreen';
import { Onboarding } from '../features/onboarding/Onboarding';
import { isCodeValid } from '../logic/access';
import { useMeta, useRegisteredCount } from './data';
import { getPlatform } from './platform';
import { PrivateModeScreen } from './PrivateModeScreen';
import { Splash } from './Splash';

/** Tira parâmetros de uso único do endereço, sem recarregar. */
function stripParams(names: string[]) {
  const url = new URL(window.location.href);
  let changed = false;
  for (const n of names) {
    if (url.searchParams.has(n)) {
      url.searchParams.delete(n);
      changed = true;
    }
  }
  if (changed)
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}

/**
 * Ordem da primeira vez (seção 6.1): navegador de outro app, código de acesso,
 * instalação e onboarding. Mostra só o que se aplica.
 */
export function Gate({ children }: { children: ReactNode }) {
  const platform = getPlatform();
  const meta = useMeta();
  const registered = useRegisteredCount();
  const [dbOk, setDbOk] = useState<boolean | undefined>(undefined);
  const [codeChecked, setCodeChecked] = useState(false);

  useEffect(() => {
    void checkIndexedDb().then(setDbOk);
  }, []);

  useEffect(() => {
    if (dbOk !== true) return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('acesso');
    void (async () => {
      if (code && ACCESS_CODE_ENABLED && (await isCodeValid(code, ACCESS_CODE_HASH))) {
        await updateMeta({ unlocked: true });
      }
      // No navegador de outro app o link completo precisa ficar para o "Copiar link".
      if (!platform.inApp) stripParams(['acesso', 'origem']);
      setCodeChecked(true);
    })();
  }, [dbOk, platform.inApp]);

  if (dbOk === false) return <PrivateModeScreen />;
  if (dbOk === undefined || meta === undefined || registered === undefined || !codeChecked)
    return <Splash />;

  if (platform.inApp) return <InAppScreen platform={platform} />;
  if (ACCESS_CODE_ENABLED && !platform.standalone && !meta.unlocked) return <AccessScreen />;
  if (platform.os === 'ios' && !platform.standalone && !meta.installSkipped) {
    return <IOSInstallScreen platform={platform} hasData={registered > 0} />;
  }
  if (
    !platform.standalone &&
    platform.os !== 'ios' &&
    !meta.onboardingDone &&
    !meta.installPromptDismissedAt
  ) {
    return <InstallSuggestionScreen platform={platform} />;
  }
  if (!meta.onboardingDone) return <Onboarding />;
  return <>{children}</>;
}
