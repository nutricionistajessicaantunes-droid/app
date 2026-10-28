import { EllipsisVertical, Menu, Share, SquarePlus } from 'lucide-react';
import type { PlatformInfo } from '../../logic/platform';
import { BrandMark } from '../../ui/Brand';
import { Step, Steps } from '../../ui/FirstRun';

/** Passos de instalação para cada navegador (seção 3.4). */
export function IOSSteps({ browser }: { browser: PlatformInfo['browser'] }) {
  const chrome = browser === 'chrome';
  return (
    <Steps>
      <Step
        n={1}
        title="Toque em Compartilhar"
        detail={
          chrome
            ? 'É o quadrado com a seta para cima, no canto de cima, ao lado do endereço.'
            : 'É o quadrado com a seta para cima, na barra do Safari. Se não aparecer, toque nos três pontinhos ao lado do endereço e depois em Compartilhar.'
        }
        icon={<Share size={24} />}
      />
      <Step
        n={2}
        title="Toque em Adicionar à Tela de Início"
        detail="Se não aparecer de cara, role a lista para baixo."
        icon={<SquarePlus size={24} />}
      />
      <Step n={3} title="Toque em Adicionar" detail="Fica no canto de cima, à direita." />
      <Step
        n={4}
        title="Abra o app pelo ícone novo"
        detail="Ele aparece na tela de início com o nome Modulação. Use sempre por ele."
        icon={<BrandMark size={32} />}
      />
    </Steps>
  );
}

export function AndroidSteps({ browser }: { browser: PlatformInfo['browser'] }) {
  if (browser === 'samsung') {
    return (
      <Steps>
        <Step
          n={1}
          title="Toque no menu"
          detail="São as três linhas, no canto de baixo, à direita."
          icon={<Menu size={24} />}
        />
        <Step
          n={2}
          title="Toque em Adicionar página a"
          detail="Depois escolha Tela inicial."
          icon={<SquarePlus size={24} />}
        />
        <Step n={3} title="Confirme em Adicionar" />
        <Step
          n={4}
          title="Abra o app pelo ícone novo"
          detail="Ele aparece na tela inicial com o nome Modulação."
          icon={<BrandMark size={32} />}
        />
      </Steps>
    );
  }
  return (
    <Steps>
      <Step
        n={1}
        title="Toque nos três pontinhos"
        detail="Ficam no canto de cima, à direita."
        icon={<EllipsisVertical size={24} />}
      />
      <Step
        n={2}
        title="Toque em Instalar app"
        detail="Em alguns celulares o nome é Adicionar à tela inicial."
        icon={<SquarePlus size={24} />}
      />
      <Step n={3} title="Confirme em Instalar" />
      <Step
        n={4}
        title="Abra o app pelo ícone novo"
        detail="Ele aparece na tela inicial com o nome Modulação."
        icon={<BrandMark size={32} />}
      />
    </Steps>
  );
}
