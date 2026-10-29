import { useRegisterSW } from 'virtual:pwa-register/react';
import { BannerButton, TopBanner } from '../ui/Misc';

/** "Nova versão disponível" com o botão "Atualizar". Nunca recarrega sozinho. */
export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      // Confere se há versão nova quando o app volta para a frente.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible')
          void registration.update().catch(() => undefined);
      });
    },
  });
  if (!needRefresh) return null;
  return (
    <TopBanner
      action={<BannerButton onClick={() => void updateServiceWorker(true)}>Atualizar</BannerButton>}
    >
      Nova versão disponível
    </TopBanner>
  );
}
