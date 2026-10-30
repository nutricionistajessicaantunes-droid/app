import { Check, Circle } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { REFEICOES, type MealId } from '../../content/agua-fibras';
import { FONTE_LABEL, MEAL_KIND_LABEL, REFEICOES_TEXTOS as T } from '../../content/refeicoes';
import { joinPt } from '../../logic/format';
import {
  fitsSlot,
  missingReqs,
  recipeById,
  recipeTags,
  reqLabel,
  reqOptions,
} from '../../logic/meals';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Filete } from '../../ui/Filete';
import { Screen } from '../../ui/Screen';
import { setDayMeal } from './actions';
import styles from './Refeicoes.module.css';
import { useMeals } from './useMeals';

const SELOS: { key: keyof ReturnType<typeof recipeTags>; label: string }[] = [
  { key: 'semLactose', label: 'Pode ser sem lactose' },
  { key: 'semGluten', label: 'Pode ser sem glúten' },
  { key: 'vegetariano', label: 'Vegetariano' },
  { key: 'baixoFodmap', label: 'Baixo FODMAP' },
];

export function Component() {
  const { id } = useParams();
  const ctx = useMeals();
  const [saved, setSaved] = useState<MealId | undefined>();
  const recipe = recipeById(id);
  if (!recipe) return <Navigate to="/refeicoes/em-casa" replace />;
  if (!ctx) return null;

  const tags = recipeTags(recipe);
  const missing = missingReqs(recipe, ctx.pantry, ctx.filters);
  const have = recipe.usa.filter((r) => !missing.includes(r));
  const slots = REFEICOES.filter((s) => fitsSlot(recipe, s.id));
  const alto = recipe.usa
    .map((req) => reqOptions(req))
    .filter((opts) => opts.length > 0 && opts.every((i) => i.fodmap === 'alto'))
    .map((opts) => opts[0]?.nome.toLowerCase() ?? '');
  const notas = [
    ...new Set(
      recipe.usa.flatMap((req) =>
        reqOptions(req)
          .filter((i) => i.nota && (Array.isArray(req) || !req.startsWith('qualquer-')))
          .map((i) => i.nota as string),
      ),
    ),
  ];

  const save = async (slot: MealId) => {
    await setDayMeal(slot, recipe.id);
    setSaved(slot);
  };

  return (
    <Screen
      title={recipe.titulo}
      subtitle={`${MEAL_KIND_LABEL[recipe.refeicao]} · ${FONTE_LABEL[recipe.fonte]}`}
      back
    >
      <div className={styles.pilha}>
        <ul className={styles.selos} aria-label="Esta receita">
          {SELOS.filter((s) => tags[s.key]).map((s) => (
            <li key={s.key}>
              <span className={styles.selo}>{s.label}</span>
            </li>
          ))}
        </ul>

        <div>
          <Filete level={2}>Ingredientes</Filete>
          <ul className={styles.ingredientes}>
            {recipe.itens.map((linha) =>
              linha.endsWith(':') ? (
                <li key={linha} className={styles.subtitulo}>
                  {linha.slice(0, -1)}
                </li>
              ) : (
                <li key={linha}>{linha}</li>
              ),
            )}
          </ul>
          <p className="secundario">{T.quantidades}</p>
        </div>

        {ctx.pantry.size > 0 ? (
          <Card label="Com o que você tem em casa">
            <ul className={styles.ingredientes}>
              {have.map((req) => (
                <li key={reqLabel(req)}>
                  <Check size={18} aria-hidden="true" className={styles.marca} />
                  <span>Tem: {reqLabel(req)}</span>
                </li>
              ))}
              {missing.map((req) => (
                <li key={reqLabel(req)}>
                  <Circle size={18} aria-hidden="true" className={styles.marca} />
                  <span>Falta: {reqLabel(req)}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {recipe.preparo ? (
          <div>
            <Filete level={2}>Modo de preparo</Filete>
            <ol className={styles.passos}>
              {recipe.preparo.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
            {recipe.rende ? <p>{recipe.rende}</p> : null}
          </div>
        ) : null}

        {recipe.troca ? (
          <Card tone="banda" label="O que mudou do material">
            <p>{recipe.troca}</p>
          </Card>
        ) : null}

        {ctx.lowContext && (alto.length > 0 || notas.length > 0) ? (
          <Card tone="banda" label="Protocolo low FODMAP">
            {alto.length > 0 ? (
              <p>
                {T.altoFodmap} {joinPt(alto)}. <Link to="/guia/fodmap">Ver as trocas na lista</Link>
              </p>
            ) : null}
            {notas.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </Card>
        ) : null}

        <div>
          <Filete level={2}>Usar no meu dia</Filete>
          <div className={styles.acoes}>
            {slots.map((s) => (
              <Button
                key={s.id}
                variant={ctx.myDay[s.id] === recipe.id ? 'primary' : 'secondary'}
                aria-pressed={ctx.myDay[s.id] === recipe.id}
                onClick={() => void save(s.id)}
              >
                {s.label}
              </Button>
            ))}
          </div>
          {saved ? (
            <p role="status">
              Salvo no teu dia como {REFEICOES.find((s) => s.id === saved)?.label.toLowerCase()}.{' '}
              <Link to="/refeicoes/meu-dia">Ver o meu dia</Link>
            </p>
          ) : null}
        </div>

        <p className="secundario">{T.aviso}</p>
      </div>
    </Screen>
  );
}
