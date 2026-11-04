import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useProfile } from '../../app/data';
import { CARDAPIOS } from '../../content/cardapios';
import { RECEITAS_FODMAP, REFEICOES_TEXTOS as T } from '../../content/refeicoes';
import { formatCompact } from '../../logic/format';
import { Card } from '../../ui/Card';
import { Filete } from '../../ui/Filete';
import { Screen } from '../../ui/Screen';
import guia from '../guia/Guia.module.css';
import { WaterCalculator } from '../guia/WaterCalculator';
import styles from './Refeicoes.module.css';

interface Entrada {
  to: string;
  titulo: string;
  detalhe?: string;
}

const REFEICOES: Entrada[] = [
  {
    to: '/refeicoes/meu-dia',
    titulo: 'Montar o meu dia',
    detalhe: 'Escolha o que vai comer em cada refeição',
  },
  {
    to: '/refeicoes/em-casa',
    titulo: 'O que eu tenho em casa',
    detalhe: 'Marque os ingredientes e veja o que dá para fazer',
  },
  {
    to: '/guia/receitas-fodmap',
    titulo: 'Receitas baixo FODMAP',
    detalhe: `${RECEITAS_FODMAP.length} receitas para a fase 1 do protocolo`,
  },
];

const CARDAPIOS_LINKS: Entrada[] = [
  ...CARDAPIOS.map((m) => ({ to: `/guia/cardapios/${m.id}`, titulo: m.titulo })),
  { to: '/guia/cardapios/gatilhos', titulo: 'Gatilhos e substituições' },
];

function Lista({ itens }: { itens: Entrada[] }) {
  return (
    <ul className={guia.indice}>
      {itens.map((e) => (
        <li key={e.to}>
          <Link to={e.to} className={guia.indiceLink}>
            <span className={guia.indiceTexto}>
              <span>{e.titulo}</span>
              {e.detalhe ? <span className={guia.indiceDetalhe}>{e.detalhe}</span> : null}
            </span>
            <ChevronRight size={20} aria-hidden="true" className="secundario" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Aba Refeições: cardápios modelo, as ferramentas de refeição e a água, numa tela só. */
export function Component() {
  const profile = useProfile();
  return (
    <Screen title="Refeições">
      <div className={styles.pilha}>
        <div>
          <Filete level={2}>Cardápios modelo</Filete>
          <Lista itens={CARDAPIOS_LINKS} />
        </div>
        <div>
          <Filete level={2}>Refeições</Filete>
          <Lista itens={REFEICOES} />
        </div>
        <div id="agua">
          <Filete level={2}>Água</Filete>
          {profile?.waterGoalMl ? (
            <Card tone="banda">
              <p>
                Tua meta: <strong>{formatCompact(profile.waterGoalMl)} ml por dia</strong>.{' '}
                {T.aguaMeta}
              </p>
            </Card>
          ) : null}
          {profile ? <WaterCalculator profile={profile} /> : null}
        </div>
        <p className="secundario">
          {T.semNumeros} {T.aviso}
        </p>
      </div>
    </Screen>
  );
}
