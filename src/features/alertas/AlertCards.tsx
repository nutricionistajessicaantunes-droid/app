import { Link } from 'react-router';
import {
  ACOMPANHAMENTO_TEXTO,
  ALERTA_TEXTOS,
  RED_FLAG_LABEL,
  SEGUNDO_GRUPO_DETECCAO,
  type CareReason,
} from '../../content/alertas';
import { dismissNotice } from '../../db/repo';
import { formatDayMonth } from '../../logic/dates';
import type { Notice, RedFlagId } from '../../types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { ConsultInvite } from './ConsultInvite';

/** Cartões de alerta da tela Hoje (seção 6.15). */
export function AlertCards({ notices }: { notices: Notice[] }) {
  const active = notices
    .filter((n) => !n.dismissedAt)
    .sort((a, b) => (a.detectedAt < b.detectedAt ? 1 : -1));
  const red = active.filter((n) => n.kind === 'alerta');
  const care = active.filter((n) => n.kind === 'acompanhamento');
  if (red.length === 0 && care.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {red.map((n) => (
        <RedFlagCard key={n.id} notice={n} />
      ))}
      {care.map((n) => (
        <CareCard key={n.id} notice={n} />
      ))}
    </div>
  );
}

function RedFlagCard({ notice }: { notice: Notice }) {
  const flags = notice.reason.split(',').filter(Boolean) as RedFlagId[];
  return (
    <Card tone="alerta" title="Sinal que pede avaliação médica" role="alert">
      {notice.id.startsWith('auto-') ? (
        <p>
          Teus registros mostram{' '}
          {flags.map((f) => (RED_FLAG_LABEL[f] ?? f).toLowerCase()).join('; ')}.
        </p>
      ) : (
        <p>
          Você marcou em {formatDayMonth(notice.detectedAt)}:{' '}
          {flags.map((f) => (RED_FLAG_LABEL[f] ?? f).toLowerCase()).join('; ')}.
        </p>
      )}
      <p>{ALERTA_TEXTOS.cartao}</p>
      <p className="secundario">{ALERTA_TEXTOS.naoSignificaGrave}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Button variant="secondary" onClick={() => void dismissNotice(notice.id)}>
          Entendi
        </Button>
        <Link to="/guia/alertas" style={{ alignSelf: 'center' }}>
          Ver os sinais de alerta
        </Link>
      </div>
    </Card>
  );
}

function CareCard({ notice }: { notice: Notice }) {
  const label = SEGUNDO_GRUPO_DETECCAO[notice.reason as CareReason] ?? notice.reason;
  return (
    <Card title="Vale buscar acompanhamento">
      <p>Teus registros mostram {label}.</p>
      <p>{ACOMPANHAMENTO_TEXTO}</p>
      <ConsultInvite />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Button variant="ghost" onClick={() => void dismissNotice(notice.id)}>
          Entendi
        </Button>
      </div>
    </Card>
  );
}
