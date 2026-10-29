import { ALERTA_TEXTOS, RED_FLAGS } from '../../content/alertas';
import type { RedFlagId } from '../../types';
import { Card } from '../../ui/Card';
import { CheckList } from '../../ui/CheckList';

/** Lista dos sinais de alerta para marcar (registro e Ajustes). */
export function RedFlagChecklist({
  value,
  onChange,
}: {
  value: RedFlagId[];
  onChange: (flags: RedFlagId[]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CheckList
        label="Sinais de alerta"
        items={RED_FLAGS.map((f) => ({ id: f.id, label: f.label }))}
        checked={(id) => value.includes(id as RedFlagId)}
        onToggle={(id, on) =>
          onChange(on ? [...value, id as RedFlagId] : value.filter((f) => f !== id))
        }
      />
      {value.length > 0 ? (
        <Card tone="alerta" role="alert">
          <p>{ALERTA_TEXTOS.cartao}</p>
          <p className="secundario">{ALERTA_TEXTOS.naoSignificaGrave}</p>
        </Card>
      ) : (
        <p className="secundario">{ALERTA_TEXTOS.historicoFamilia}</p>
      )}
    </div>
  );
}
