import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { FONTE_LABEL, MEAL_KIND_LABEL } from '../../content/refeicoes';
import { reqLabel, type Match } from '../../logic/meals';
import { Button } from '../../ui/Button';
import guia from '../guia/Guia.module.css';
import styles from './Refeicoes.module.css';

/** Lista de receitas com o que falta, cada uma levando para o preparo. */
export function RecipeList({
  items,
  showMissing,
  limit,
}: {
  items: Match[];
  showMissing?: boolean;
  /** Mostra só as primeiras, com um botão para ver todas. */
  limit?: number;
}) {
  const [all, setAll] = useState(false);
  const shown = limit && !all ? items.slice(0, limit) : items;
  return (
    <>
      <ul className={guia.indice}>
        {shown.map(({ recipe, missing }) => (
          <li key={recipe.id}>
            <Link to={`/refeicoes/receita/${recipe.id}`} className={guia.indiceLink}>
              <span className={guia.indiceTexto}>
                <span>{recipe.titulo}</span>
                <span className={guia.indiceDetalhe}>
                  {MEAL_KIND_LABEL[recipe.refeicao]} · {FONTE_LABEL[recipe.fonte]}
                </span>
                {showMissing && missing.length > 0 ? (
                  <span className={styles.falta}>Falta: {missing.map(reqLabel).join('; ')}</span>
                ) : null}
              </span>
              <ChevronRight size={20} aria-hidden="true" className="secundario" />
            </Link>
          </li>
        ))}
      </ul>
      {shown.length < items.length ? (
        <Button variant="ghost" onClick={() => setAll(true)} style={{ marginTop: 8 }}>
          {`Mostrar todas (${items.length})`}
        </Button>
      ) : null}
    </>
  );
}
