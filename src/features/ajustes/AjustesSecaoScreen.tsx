import { Trash2 } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import {
  APP_VERSION,
  ASSINATURA,
  INSTAGRAM_TEXTO,
  INSTAGRAM_URL,
  INSTAGRAM_USUARIO,
} from '../../config';
import { SOBRE_O_APP } from '../../content/sobre';
import { REAVALIACAO_TEXTOS } from '../../content/reavaliacao';
import { clearAllData, saveProfile } from '../../db/repo';
import { formatDayMonth } from '../../logic/dates';
import { formatCompact } from '../../logic/format';
import { useProfile, useRegisteredCount } from '../../app/data';
import { getPlatform } from '../../app/platform';
import { useToday } from '../../app/useToday';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Step, Steps } from '../../ui/FirstRun';
import { BulletList, ExternalLink } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { TEXTO_APOIO_COPIA, useSaveBackup } from '../copia/useSaveBackup';
import { WaterCalculator } from '../guia/WaterCalculator';
import { AndroidSteps, IOSSteps } from '../instalacao/InstallSteps';
import { promptInstall, useInstallPrompt } from '../instalacao/installPrompt';
import styles from './Ajustes.module.css';

const RestoreFlow = lazy(() => import('./RestoreFlow'));

export function Component() {
  const { secao } = useParams();
  switch (secao) {
    case 'agua':
      return <Agua />;
    case 'restaurar':
      return <Restaurar />;
    case 'trocar-celular':
      return <TrocarCelular />;
    case 'circunferencia':
      return <Circunferencia />;
    case 'instalar':
      return <Instalar />;
    case 'privacidade':
      return <Privacidade />;
    case 'sobre':
      return <Sobre />;
    case 'apagar':
      return <Apagar />;
    default:
      return <Navigate to="/ajustes" replace />;
  }
}

function Agua() {
  const profile = useProfile();
  if (!profile) return null;
  return (
    <Screen title="Meta de água" back="/ajustes">
      <WaterCalculator profile={profile} />
    </Screen>
  );
}

function Restaurar() {
  const count = useRegisteredCount();
  const navigate = useNavigate();
  if (count === undefined) return null;
  return (
    <Screen title="Restaurar uma cópia" back="/ajustes">
      <p>
        Escolha o arquivo da cópia que você salvou. O nome começa com modulacao-copia, seguido da
        data.
      </p>
      <Suspense fallback={null}>
        <RestoreFlow
          hasExistingData={count > 0}
          onDone={() => setTimeout(() => navigate('/'), 1200)}
        />
      </Suspense>
    </Screen>
  );
}

function TrocarCelular() {
  const { save, status, message } = useSaveBackup();
  return (
    <Screen title="Trocar de celular" back="/ajustes">
      <p>
        Os registros ficam neste aparelho. Para levar tudo para o celular novo, são quatro passos.
      </p>
      <Steps>
        <Step n={1} title="Salve uma cópia aqui" detail="Use o botão abaixo." />
        <Step
          n={2}
          title="Mande o arquivo para você"
          detail="Pelo WhatsApp (para você mesma), por e-mail, no Arquivos ou no Drive."
        />
        <Step
          n={3}
          title="Abra o app no celular novo"
          detail="Pelo link que está na área de membros do curso, na Kiwify. No iPhone, instale pela tela de início."
        />
        <Step
          n={4}
          title="Restaure a cópia"
          detail='Na primeira tela, toque em "Já usei o app em outro celular ou no navegador" e escolha o arquivo.'
        />
      </Steps>
      <Button variant="primary" block onClick={() => void save()} disabled={status === 'salvando'}>
        Salvar uma cópia
      </Button>
      <p className={styles.ajuda}>{TEXTO_APOIO_COPIA}</p>
      <p role="status" aria-live="polite" className={styles.ajuda}>
        {message}
      </p>
    </Screen>
  );
}

function Circunferencia() {
  const profile = useProfile();
  const today = useToday();
  const [cm, setCm] = useState('');
  const [date, setDate] = useState(today);
  if (!profile) return null;
  const list = [...(profile.abdominal ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1));
  const value = Number(cm.replace(',', '.'));
  const valid = cm.trim() !== '' && Number.isFinite(value) && value >= 30 && value <= 250;

  return (
    <Screen title="Circunferência abdominal" back="/ajustes">
      <Card tone="banda">
        <p>{REAVALIACAO_TEXTOS.notaCircunferencia}</p>
      </Card>
      <p>
        É opcional. Se quiser, meça no começo do plano e de novo no dia 21, no mesmo horário e do
        mesmo jeito.
      </p>
      <div className={styles.dupla}>
        <label className={styles.campo}>
          <span className={styles.rotulo}>Medida, em cm</span>
          <input
            type="text"
            inputMode="decimal"
            value={cm}
            onChange={(e) => setCm(e.target.value)}
          />
        </label>
        <label className={styles.campo}>
          <span className={styles.rotulo}>Data</span>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value || today)}
          />
        </label>
      </div>
      <Button
        variant="primary"
        block
        disabled={!valid}
        onClick={async () => {
          const others = (profile.abdominal ?? []).filter((m) => m.date !== date);
          await saveProfile({ abdominal: [...others, { date, cm: value }] });
          setCm('');
        }}
      >
        Guardar medida
      </Button>
      {list.length > 0 ? (
        <ul className={styles.lista}>
          {list.map((m) => (
            <li key={m.date} className={styles.item}>
              <span>
                {formatDayMonth(m.date)}: {formatCompact(m.cm)} cm
              </span>
              <Button
                variant="ghost"
                aria-label={`Apagar a medida de ${formatDayMonth(m.date)}`}
                onClick={() =>
                  void saveProfile({
                    abdominal: (profile.abdominal ?? []).filter((x) => x.date !== m.date),
                  })
                }
              >
                <Trash2 size={18} aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </Screen>
  );
}

function Instalar() {
  const platform = getPlatform();
  const count = useRegisteredCount();
  const { canPrompt, installed } = useInstallPrompt();
  return (
    <Screen title="Como instalar" back="/ajustes">
      {platform.standalone ? (
        <Card tone="sucesso">
          <p>Você já está usando o app instalado.</p>
        </Card>
      ) : null}
      {platform.os === 'ios' && !platform.standalone && (count ?? 0) > 0 ? (
        <Card tone="alerta" title="Antes de instalar, salve uma cópia">
          <p>
            No iPhone, o app instalado começa vazio. Salve uma cópia em Ajustes e, no app instalado,
            toque em "Já usei o app no navegador" para trazer os teus registros.
          </p>
        </Card>
      ) : null}
      {canPrompt && !installed ? (
        <Button variant="primary" block onClick={() => void promptInstall()}>
          Instalar o app
        </Button>
      ) : null}
      <Card label="No iPhone">
        <IOSSteps browser={platform.os === 'ios' ? platform.browser : 'safari'} />
      </Card>
      <Card label="No Android, com o Chrome">
        <AndroidSteps browser="chrome" />
      </Card>
      <Card label="No Android, com o Samsung Internet">
        <AndroidSteps browser="samsung" />
      </Card>
      <Card label="No computador">
        <p>
          O app funciona no navegador. Instalar é opcional: no Chrome, use o ícone de instalar na
          barra de endereço.
        </p>
      </Card>
    </Screen>
  );
}

function Privacidade() {
  return (
    <Screen title="Privacidade" back="/ajustes">
      <Card label="O que o app guarda">
        <BulletList
          items={[
            'Teus registros do dia, hábitos, tarefas das aulas, leituras da semana e o que você escreve no app.',
            'O peso, só se você calcular a meta de água. Ele não aparece em nenhuma outra tela.',
          ]}
        />
      </Card>
      <Card label="Onde guarda">
        <p>
          Só neste aparelho, dentro do navegador ou do app instalado. Não existe conta nem servidor.
        </p>
        <p>A Jéssica não tem acesso aos teus registros. Ninguém tem, além de você.</p>
      </Card>
      <Card label="Rastreamento">
        <p>
          O app não usa rastreamento, anúncio nem estatística de uso. Ele não envia nada para a
          internet.
        </p>
        <p>
          Os únicos acessos para fora são os links que você toca: Kiwify, WhatsApp, Instagram e
          Google Agenda.
        </p>
      </Card>
      <Card label="A cópia de segurança">
        <p>{TEXTO_APOIO_COPIA}</p>
      </Card>
      <Card label="Como apagar tudo">
        <p>
          Em Ajustes, toque em "Apagar todos os meus dados". O app pede confirmação duas vezes antes
          de apagar.
        </p>
      </Card>
    </Screen>
  );
}

function Sobre() {
  return (
    <Screen title="Sobre o app" back="/ajustes">
      <p>App do curso Modulação Intestinal na Prática. Versão {APP_VERSION}.</p>
      <p>{ASSINATURA}</p>
      <Card label="O que mudou">
        <BulletList items={SOBRE_O_APP} />
      </Card>
      <Card label="Dúvidas">
        <p>{INSTAGRAM_TEXTO}</p>
        <ExternalLink href={INSTAGRAM_URL}>{INSTAGRAM_USUARIO}</ExternalLink>
      </Card>
    </Screen>
  );
}

function Apagar() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const navigate = useNavigate();
  const { save, message } = useSaveBackup();
  return (
    <Screen title="Apagar todos os meus dados" back="/ajustes">
      <p>
        Isso apaga deste aparelho todos os teus registros, hábitos, tarefas, leituras e ajustes. Não
        tem como desfazer.
      </p>
      <p>Se quiser guardar alguma coisa, salve uma cópia antes.</p>
      <Button onClick={() => void save()}>Salvar uma cópia antes</Button>
      <p role="status" aria-live="polite" className={styles.ajuda}>
        {message}
      </p>
      {step === 0 ? (
        <Button variant="danger" block onClick={() => setStep(1)}>
          Quero apagar meus dados
        </Button>
      ) : null}
      {step === 1 ? (
        <Card tone="alerta" title="Tem certeza?">
          <p>Depois de apagar, o app volta para a primeira tela, como se fosse a primeira vez.</p>
          <div className={styles.pilha}>
            <Button
              variant="dangerSolid"
              block
              onClick={async () => {
                setStep(2);
                await clearAllData();
                navigate('/', { replace: true });
              }}
            >
              Sim, apagar tudo
            </Button>
            <Button variant="ghost" block onClick={() => setStep(0)}>
              Cancelar
            </Button>
          </div>
        </Card>
      ) : null}
    </Screen>
  );
}
