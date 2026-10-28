import { useState } from 'react';
import { updateMeta } from '../../db/repo';
import type { PlatformInfo } from '../../logic/platform';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { FirstRun } from '../../ui/FirstRun';
import firstRunStyles from '../../ui/FirstRun.module.css';
import { IOSSteps } from './InstallSteps';

/** No iPhone fora do app instalado, o guia de instalação é a tela principal (seção 3.4). */
export function IOSInstallScreen({
  platform,
  hasData,
}: {
  platform: PlatformInfo;
  hasData: boolean;
}) {
  const [confirm, setConfirm] = useState(false);
  const other = platform.browser !== 'safari' && platform.browser !== 'chrome';

  if (confirm) {
    return (
      <FirstRun
        title="Usar no navegador"
        onBack={() => setConfirm(false)}
        footer={
          <>
            <Button variant="primary" block onClick={() => setConfirm(false)}>
              Voltar e instalar
            </Button>
            <Button variant="ghost" block onClick={() => updateMeta({ installSkipped: true })}>
              Continuar no navegador
            </Button>
          </>
        }
      >
        <p className={firstRunStyles.texto}>
          No navegador do iPhone, os registros podem se perder. O iPhone pode apagar os dados de
          sites que ficam sete dias sem ser abertos.
        </p>
        <p className={firstRunStyles.texto}>
          Se for usar assim, salve uma cópia dos teus registros de vez em quando. O app vai lembrar
          você.
        </p>
      </FirstRun>
    );
  }

  return (
    <FirstRun
      title="Instale o app no teu iPhone"
      footer={
        <Button variant="link" onClick={() => setConfirm(true)}>
          Usar no navegador mesmo assim
        </Button>
      }
    >
      <p className={firstRunStyles.texto}>
        Instalado, o app abre pelo ícone na tela de início e guarda os teus registros com mais
        segurança. Leva menos de um minuto.
      </p>
      {hasData ? (
        <Card tone="alerta" title="Antes de instalar, salve uma cópia">
          <p>
            No iPhone, o app instalado começa vazio, porque ele guarda os dados separado do
            navegador. Salve uma cópia aqui e, no app instalado, toque em "Já usei o app no
            navegador" para trazer os teus registros.
          </p>
        </Card>
      ) : null}
      {other ? (
        <p className={firstRunStyles.texto}>
          Para instalar, abra este endereço no Safari e siga os passos abaixo.
        </p>
      ) : null}
      <IOSSteps browser={platform.browser} />
    </FirstRun>
  );
}
