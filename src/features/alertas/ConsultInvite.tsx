import { Link } from 'react-router';
import { WHATSAPP_EXIBICAO, WHATSAPP_URL } from '../../config';
import { ExternalLink } from '../../ui/Misc';

/** Convite discreto para a consulta (seção 2, princípio 8). Nunca como pop-up. */
export function ConsultInvite({ withForm = true, text }: { withForm?: boolean; text?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
      <p style={{ margin: 0 }}>
        {text ??
          'Se quiser fazer esse acompanhamento comigo, atendo on-line e presencialmente em Palmeira das Missões e Ronda Alta.'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px' }}>
        <ExternalLink href={WHATSAPP_URL} variant="secondary">
          Chamar no WhatsApp
        </ExternalLink>
        {withForm ? <Link to="/ficha">Ficha para a consulta</Link> : null}
      </div>
      <p className="secundario pequeno" style={{ margin: 0, userSelect: 'text' }}>
        WhatsApp {WHATSAPP_EXIBICAO}
      </p>
    </div>
  );
}
