import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { RECEITAS, RECEITAS_FODMAP, REFEICOES_TEXTOS as T } from '../../content/refeicoes';
import { Screen } from '../../ui/Screen';
import guia from '../guia/Guia.module.css';
import styles from './Refeicoes.module.css';

const ENTRADAS = [
  {
    to: '/refeicoes/em-casa',
    titulo: 'O que eu tenho em casa',
    detalhe: 'Marque os ingredientes e veja o que dá para fazer, e o que falta comprar',
  },
  {
    to: '/refeicoes/meu-dia',
    titulo: 'Montar o meu dia',
    detalhe: 'Uma opção por refeição, conferida pelo prato, pela fibra e pela água',
  },
  {
    to: '/guia/receitas-fodmap',
    titulo: 'Receitas baixo FODMAP',
    detalhe: `${RECEITAS_FODMAP.length} receitas para a fase 1 do protocolo`,
  },
  {
    to: '/guia/cardapios',
    titulo: 'Cardápios modelo',
    detalhe: 'Os quatro casos do curso, com gatilhos e substituições',
  },
];

export function Component() {
  return (
    <Screen title="Refeições" subtitle={`${RECEITAS.length} opções para combinar.`} back="/guia">
      <div className={styles.pilha}>
        <p>{T.intro}</p>
        <ul className={guia.indice}>
          {ENTRADAS.map((e) => (
            <li key={e.to}>
              <Link to={e.to} className={guia.indiceLink}>
                <span className={guia.indiceTexto}>
                  <span>{e.titulo}</span>
                  <span className={guia.indiceDetalhe}>{e.detalhe}</span>
                </span>
                <ChevronRight size={20} aria-hidden="true" className="secundario" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="secundario">
          {T.semNumeros} {T.aviso}
        </p>
      </div>
    </Screen>
  );
}
