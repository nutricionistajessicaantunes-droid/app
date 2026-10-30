import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  BASICOS,
  GRUPOS,
  INGREDIENTES,
  MEAL_KIND_LABEL,
  REFEICOES_TEXTOS as T,
  type MealKind,
} from '../../content/refeicoes';
import { matchRecipes, shoppingSuggestions, type MealFilters } from '../../logic/meals';
import { normalizeSearch } from '../../logic/text';
import { Button } from '../../ui/Button';
import { Chip, ChipGroup } from '../../ui/Chip';
import { Filete } from '../../ui/Filete';
import { HelpBox } from '../../ui/HelpBox';
import { Screen } from '../../ui/Screen';
import { Switch } from '../../ui/Switch';
import { clearPantry, setMealFilters, togglePantry } from './actions';
import { RecipeList } from './RecipeList';
import styles from './Refeicoes.module.css';
import { useMeals } from './useMeals';

type KindFilter = MealKind | 'todas';

const KINDS: { value: KindFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'cafe', label: MEAL_KIND_LABEL.cafe },
  { value: 'almoco', label: MEAL_KIND_LABEL.almoco },
  { value: 'lanche', label: MEAL_KIND_LABEL.lanche },
  { value: 'jantar', label: MEAL_KIND_LABEL.jantar },
];

const FILTROS: { key: keyof MealFilters; label: string }[] = [
  { key: 'semLactose', label: 'Sem lactose' },
  { key: 'semGluten', label: 'Sem glúten' },
  { key: 'vegetariano', label: 'Vegetariano' },
];

export function Component() {
  const ctx = useMeals();
  const [kind, setKind] = useState<KindFilter>('todas');
  const [copied, setCopied] = useState(false);
  const result = useMemo(
    () =>
      ctx
        ? matchRecipes(ctx.pantry, ctx.filters, {
            kind: kind === 'todas' ? undefined : kind,
            menu: ctx.menu,
          })
        : undefined,
    [ctx, kind],
  );
  if (!ctx || !result) return null;

  const { pantry, filters } = ctx;
  const shopping = shoppingSuggestions(result.almost);
  const lowDetail =
    filters.baixoFodmap && ctx.lowReason === 'fase1'
      ? T.baixoFodmapFase1
      : filters.baixoFodmap && ctx.lowReason === 'caminho'
        ? T.baixoFodmapCaminho
        : T.baixoFodmapDetalhe;

  const copyList = async () => {
    const text = shopping.map((s) => `- ${s.label}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Screen title="O que eu tenho em casa" back="/refeicoes">
      <div className={styles.pilha}>
        <HelpBox items={T.ajudaEmCasa} />

        <PantryPicker pantry={pantry} />

        <div>
          <Filete level={2}>Refeição</Filete>
          <ChipGroup label="Refeição">
            {KINDS.map((k) => (
              <Chip key={k.value} pressed={kind === k.value} onToggle={() => setKind(k.value)}>
                {k.label}
              </Chip>
            ))}
          </ChipGroup>
        </div>

        <div>
          <Filete level={2}>Filtros</Filete>
          {FILTROS.map((f) => (
            <Switch
              key={f.key}
              label={f.label}
              checked={filters[f.key]}
              onChange={(v) => void setMealFilters({ [f.key]: v })}
            />
          ))}
          <Switch
            label="Baixo FODMAP"
            detail={lowDetail}
            checked={filters.baixoFodmap}
            onChange={(v) => void setMealFilters({ baixoFodmap: v })}
          />
        </div>

        <section aria-live="polite" className={styles.pilha}>
          {pantry.size === 0 ? (
            <>
              <p>{T.listaVazia}</p>
              <RecipeList
                items={[...result.ready, ...result.almost, ...result.others]}
                limit={10}
              />
            </>
          ) : (
            <>
              <div>
                <Filete level={2}>{`Dá para fazer agora (${result.ready.length})`}</Filete>
                {result.ready.length > 0 ? (
                  <RecipeList items={result.ready} limit={8} />
                ) : (
                  <p>{T.nadaPronto}</p>
                )}
              </div>
              {result.almost.length > 0 ? (
                <div>
                  <Filete level={2}>{`Falta pouco (${result.almost.length})`}</Filete>
                  <RecipeList items={result.almost} showMissing limit={8} />
                </div>
              ) : null}
              {shopping.length > 0 ? (
                <div>
                  <Filete level={2}>Lista de compras</Filete>
                  <p>{T.compras}</p>
                  <ul>
                    {shopping.map((s) => (
                      <li key={s.label}>
                        {s.label}: completa {s.unlocks} {s.unlocks === 1 ? 'receita' : 'receitas'}
                      </li>
                    ))}
                  </ul>
                  <Button variant="secondary" onClick={() => void copyList()}>
                    {copied ? 'Lista copiada' : 'Copiar a lista'}
                  </Button>
                </div>
              ) : null}
              {result.others.length > 0 ? (
                <details>
                  <summary className={styles.resumo}>
                    {`Outras opções (${result.others.length})`}
                  </summary>
                  <div style={{ marginTop: 12 }}>
                    <RecipeList items={result.others} showMissing />
                  </div>
                </details>
              ) : null}
            </>
          )}
        </section>

        <p>
          <Link to="/refeicoes/meu-dia">Montar o meu dia com estas opções</Link>
        </p>
        <p className="secundario">{T.aviso}</p>
      </div>
    </Screen>
  );
}

/** A lista do que tem em casa. Abre sozinha só na primeira vez, quando ainda está vazia. */
function PantryPicker({ pantry }: { pantry: ReadonlySet<string> }) {
  const [startOpen] = useState(pantry.size === 0);
  const [q, setQ] = useState('');
  const query = normalizeSearch(q.trim());
  return (
    <details open={startOpen}>
      <summary className={styles.resumo}>
        {pantry.size === 0
          ? 'Marque o que você tem em casa'
          : `${pantry.size} ${pantry.size === 1 ? 'item marcado' : 'itens marcados'} · tocar para mudar`}
      </summary>
      <div className={styles.pilha} style={{ marginTop: 12 }}>
        <div className={styles.busca}>
          <label htmlFor="busca-ingrediente" style={{ fontWeight: 600 }}>
            Procurar ingrediente
          </label>
          <input
            id="busca-ingrediente"
            type="search"
            value={q}
            placeholder="Ex.: ovo, tapioca, frango"
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {GRUPOS.map((g) => {
          const items = INGREDIENTES.filter(
            (i) => i.grupo === g.id && (!query || normalizeSearch(i.nome).includes(query)),
          );
          if (items.length === 0) return null;
          return (
            <div key={g.id} className={styles.grupo}>
              <h2 className={styles.grupoTitulo}>{g.titulo}</h2>
              <ChipGroup label={g.titulo}>
                {items.map((i) => (
                  <Chip
                    key={i.id}
                    pressed={pantry.has(i.id)}
                    onToggle={(on) => void togglePantry(i.id, on)}
                  >
                    {i.nome}
                  </Chip>
                ))}
              </ChipGroup>
            </div>
          );
        })}
        <p className="secundario" style={{ margin: 0 }}>
          {BASICOS}
        </p>
        {pantry.size > 0 ? (
          <div>
            <Button variant="ghost" onClick={() => void clearPantry()}>
              Desmarcar tudo
            </Button>
          </div>
        ) : null}
      </div>
    </details>
  );
}
