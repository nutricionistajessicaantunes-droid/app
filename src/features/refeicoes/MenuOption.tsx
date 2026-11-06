import { Check } from 'lucide-react';
import { Link } from 'react-router';
import { useMeta } from '../../app/data';
import type { MealId } from '../../content/agua-fibras';
import { Button } from '../../ui/Button';
import { setDayMeal } from './actions';

function slotOf(refeicao: string): MealId | undefined {
  if (refeicao.startsWith('Café')) return 'cafe';
  if (refeicao.startsWith('Lanche da manhã')) return 'lanche_manha';
  if (refeicao.startsWith('Lanche da tarde')) return 'lanche_tarde';
  if (refeicao.startsWith('Almoço')) return 'almoco';
  if (refeicao.startsWith('Jantar')) return 'jantar';
  return undefined;
}

/** Uma opção do cardápio modelo, com o botão para colocar no dia da aluna. */
export function MenuOption({
  texto,
  refeicao,
  recipeId,
}: {
  texto: string;
  refeicao: string;
  recipeId: string;
}) {
  const meta = useMeta();
  const slot = slotOf(refeicao);
  const chosen = slot ? meta?.myDay?.[slot] === recipeId : false;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span>{texto}</span>
      {slot ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {chosen ? (
            <>
              <span
                style={{ display: 'inline-flex', gap: 4, alignItems: 'center', fontWeight: 600 }}
              >
                <Check size={18} aria-hidden="true" /> No meu dia
              </span>
              <Link to="/refeicoes/meu-dia">Ver o meu dia</Link>
            </>
          ) : (
            <Button
              variant="secondary"
              onClick={() => void setDayMeal(slot, recipeId)}
              aria-label={`Usar no meu dia: ${texto}`}
            >
              Usar no meu dia
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
