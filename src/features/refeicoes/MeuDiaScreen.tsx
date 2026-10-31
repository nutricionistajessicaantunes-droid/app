import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { REFEICOES, type MealId } from '../../content/agua-fibras';
import { PRATO_POR_QUEIXA } from '../../content/prato';
import { FONTE_LABEL, REFEICOES_TEXTOS as T } from '../../content/refeicoes';
import { capitalize, formatCompact, joinPt } from '../../logic/format';
import { checkDay, fitsSlot, matchRecipes, recipeById, type PlateCheck } from '../../logic/meals';
import { normalizeSearch } from '../../logic/text';
import type { Path } from '../../types';
import { BottomSheet } from '../../ui/BottomSheet';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { HelpBox } from '../../ui/HelpBox';
import { Screen } from '../../ui/Screen';
import { Switch } from '../../ui/Switch';
import { clearDay, setDayMeal } from './actions';
import styles from './Refeicoes.module.css';
import { useMeals } from './useMeals';

const QUEIXA_DO_CAMINHO: Partial<Record<Path, string>> = {
  preso: 'Intestino preso',
  solto: 'Intestino solto',
  gases_sii: 'Gases e SII',
  refluxo: 'Refluxo e gastrite',
};

function plateText(p: PlateCheck): string {
  if (p.vegetal && p.proteina && p.carboidrato) return T.pratoCompleto;
  const faltas: string[] = [];
  if (!p.vegetal) faltas.push(T.faltaVegetal);
  if (!p.proteina) faltas.push(T.faltaProteina);
  if (!p.carboidrato) faltas.push(T.faltaCarboidrato);
  return faltas.join(' ');
}

function slotLabel(slot: MealId): string {
  return REFEICOES.find((s) => s.id === slot)?.label ?? '';
}

export function Component() {
  const ctx = useMeals();
  const [picking, setPicking] = useState<MealId | undefined>();
  const [onlyHome, setOnlyHome] = useState(true);
  const [q, setQ] = useState('');

  const options = useMemo(() => {
    if (!ctx || !picking) return [];
    const m = matchRecipes(ctx.pantry, ctx.filters, { menu: ctx.menu });
    const all = [...m.ready, ...m.almost, ...m.others].filter((x) => fitsSlot(x.recipe, picking));
    const query = normalizeSearch(q.trim());
    return all
      .filter((x) => !onlyHome || ctx.pantry.size === 0 || x.missing.length === 0)
      .filter((x) => !query || normalizeSearch(x.recipe.titulo).includes(query));
  }, [ctx, picking, onlyHome, q]);

  if (!ctx) return null;
  const check = checkDay(ctx.myDay, ctx.pantry, ctx.filters);
  const queixa = ctx.path ? QUEIXA_DO_CAMINHO[ctx.path] : undefined;
  const pratoCaso = PRATO_POR_QUEIXA.find((p) => p.queixa === queixa);

  const choose = async (recipeId: string) => {
    if (!picking) return;
    await setDayMeal(picking, recipeId);
    setPicking(undefined);
    setQ('');
  };

  return (
    <Screen title="Montar o meu dia">
      <div className={styles.pilha}>
        <HelpBox items={T.ajudaMeuDia} />

        <Card label="O meu dia">
          {REFEICOES.map((s) => {
            const r = recipeById(ctx.myDay[s.id]);
            return (
              <div key={s.id} className={styles.slot}>
                <div className={styles.slotTopo}>
                  <span className={styles.slotNome}>{s.label}</span>
                </div>
                {r ? (
                  <Link to={`/refeicoes/receita/${r.id}`}>{r.titulo}</Link>
                ) : (
                  <span className="secundario">Nada escolhido</span>
                )}
                <div className={styles.acoes}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOnlyHome(ctx.pantry.size > 0);
                      setPicking(s.id);
                    }}
                    aria-label={`${r ? 'Trocar' : 'Escolher'} ${s.label.toLowerCase()}`}
                  >
                    {r ? 'Trocar' : 'Escolher'}
                  </Button>
                  {r ? (
                    <Button
                      variant="ghost"
                      onClick={() => void setDayMeal(s.id, undefined)}
                      aria-label={`Tirar ${s.label.toLowerCase()}`}
                    >
                      Tirar
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </Card>

        <Card label="Como o teu dia ficou">
          {check.meals === 0 ? (
            <p>{T.diaVazio}</p>
          ) : (
            <ul className={styles.conferencia}>
              <li>
                <strong>Prato.</strong> {T.pratoAula14}
                {check.plates.length === 0 ? (
                  <> Escolha o almoço ou o jantar para conferir.</>
                ) : (
                  check.plates.map((p) => (
                    <span key={p.slot} style={{ display: 'block', marginTop: 4 }}>
                      {slotLabel(p.slot)}: {plateText(p)}
                    </span>
                  ))
                )}
              </li>
              <li>
                <strong>Leguminosa.</strong>{' '}
                {check.leguminosas.length > 0
                  ? `${capitalize(joinPt(check.leguminosas))}.`
                  : ctx.lowContext
                    ? 'Nenhuma no dia. Na fase 1, a leguminosa volta na reintrodução.'
                    : T.semLeguminosa}
              </li>
              <li>
                <strong>Fibras.</strong>{' '}
                {check.fibras.length > 0
                  ? `Fontes de fibra no dia: ${joinPt(check.fibras)}.`
                  : 'Nenhuma fonte de fibra no dia.'}{' '}
                <Link to="/guia/fibras#meu-dia">{T.fibrasLink}</Link>
              </li>
              <li>
                <strong>Água.</strong>{' '}
                {ctx.waterGoalMl ? (
                  <>
                    Tua meta: {formatCompact(ctx.waterGoalMl)} ml por dia. {T.aguaMeta}
                  </>
                ) : (
                  <>
                    {T.aguaSemMeta} <Link to="/ajustes/agua">Calcular a meta de água</Link>
                  </>
                )}
              </li>
              {ctx.lowContext && check.altoFodmap.length > 0 ? (
                <li>
                  <strong>Low FODMAP.</strong> {T.altoFodmap}{' '}
                  {check.altoFodmap
                    .map((a) => `${slotLabel(a.slot).toLowerCase()}: ${joinPt(a.nomes)}`)
                    .join('; ')}
                  . <Link to="/guia/fodmap">Ver as trocas na lista</Link>
                </li>
              ) : null}
              {ctx.lowContext ? check.notas.map((n) => <li key={n}>{n}</li>) : null}
              {pratoCaso ? (
                <li>
                  <strong>Para o teu caso.</strong> {pratoCaso.texto}
                </li>
              ) : null}
              {ctx.pantry.size > 0 && check.faltam.length > 0 ? (
                <li>
                  <strong>Para comprar.</strong> {joinPt(check.faltam)}.
                </li>
              ) : null}
            </ul>
          )}
        </Card>

        {check.meals > 0 ? (
          <div>
            <Button variant="ghost" onClick={() => void clearDay()}>
              Limpar o dia
            </Button>
          </div>
        ) : null}

        <p>
          <Link to="/refeicoes/em-casa">Marcar o que eu tenho em casa</Link>
        </p>
        <p>
          <Link to="/refeicoes">Receitas baixo FODMAP e cardápios modelo</Link>
        </p>
        <p className="secundario">
          {T.semNumeros} {T.aviso}
        </p>
      </div>

      <BottomSheet
        open={Boolean(picking)}
        onClose={() => setPicking(undefined)}
        title={picking ? `Escolher ${slotLabel(picking).toLowerCase()}` : 'Escolher'}
      >
        <div className={styles.pilha}>
          <div className={styles.busca}>
            <label htmlFor="busca-receita" style={{ fontWeight: 600 }}>
              Procurar receita
            </label>
            <input
              id="busca-receita"
              type="search"
              value={q}
              placeholder="Ex.: tapioca, frango"
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {ctx.pantry.size > 0 ? (
            <Switch
              label="Só o que dá para fazer com o que tenho"
              checked={onlyHome}
              onChange={setOnlyHome}
            />
          ) : null}
          {options.length === 0 ? (
            <p>Nenhuma opção com esses filtros.</p>
          ) : (
            <ul className={styles.ingredientes}>
              {options.map(({ recipe }) => (
                <li key={recipe.id}>
                  <Button
                    variant="link"
                    onClick={() => void choose(recipe.id)}
                    style={{ textAlign: 'left' }}
                  >
                    {recipe.titulo}
                    <span className="secundario" style={{ display: 'block', fontWeight: 400 }}>
                      {FONTE_LABEL[recipe.fonte]}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </BottomSheet>
    </Screen>
  );
}
