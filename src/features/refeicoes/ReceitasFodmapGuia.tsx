import { ORIENTACOES_FODMAP, RECEITAS_FODMAP } from '../../content/refeicoes';
import { BulletList } from '../../ui/Misc';
import { Filete } from '../../ui/Filete';
import { RecipeList } from './RecipeList';
import styles from './Refeicoes.module.css';

/** Seção do Guia com as receitas baixo FODMAP da Jéssica. */
export function ReceitasFodmapGuia() {
  return (
    <div className={styles.pilha}>
      <p>
        Receitas com baixo teor de FODMAP, para a fase 1 do protocolo. Toque numa receita para ver o
        preparo e colocar no teu dia.
      </p>
      <div>
        <Filete level={2}>Orientações práticas</Filete>
        <BulletList items={ORIENTACOES_FODMAP} />
      </div>
      <div>
        <Filete level={2}>Receitas</Filete>
        <RecipeList items={RECEITAS_FODMAP.map((recipe) => ({ recipe, missing: [] }))} />
      </div>
    </div>
  );
}
