import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { searchFodmap } from '../../logic/fodmapLookup';
import { FodmapResult } from './FodmapSearch';
import type { GuideHit } from './searchIndex';
import { Link } from 'react-router';
import { useProfile } from '../../app/data';
import { PATH_LABEL } from '../../content/onboarding';
import { Filete } from '../../ui/Filete';
import { Screen } from '../../ui/Screen';
import styles from './Guia.module.css';
import { GUIDE_SECTIONS, PATH_PRIORITY, PATH_MENU, type GuideSection } from './sections';

function hrefFor(s: GuideSection, menu?: string): string {
  if (s.id === 'cardapios' && menu) return `/guia/cardapios/${menu}`;
  if (s.id === 'refeicoes') return '/refeicoes';
  return `/guia/${s.id}`;
}

function Index({ items, menu }: { items: GuideSection[]; menu?: string }) {
  return (
    <ul className={styles.indice}>
      {items.map((s) => (
        <li key={s.id}>
          <Link to={hrefFor(s, menu)} className={styles.indiceLink}>
            <span className={styles.indiceTexto}>
              <span>{s.title}</span>
              <span className={styles.indiceDetalhe}>{s.detail}</span>
            </span>
            <ChevronRight size={20} aria-hidden="true" className="secundario" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

type Search = (q: string) => GuideHit[];

export function Component() {
  const profile = useProfile();
  const [q, setQ] = useState('');
  const [search, setSearch] = useState<{ fn: Search } | null>(null);
  if (profile === undefined) return null;
  const loadIndex = () => {
    if (!search) void import('./searchIndex').then((m) => setSearch({ fn: m.searchGuide }));
  };
  const typing = q.trim().length >= 2;
  const fodmapHits = typing ? searchFodmap(q).slice(0, 5) : [];
  const guideHits = typing && search ? search.fn(q) : [];
  const path = profile?.path ?? 'indefinido';
  const firstIds = PATH_PRIORITY[path];
  const first = firstIds
    .map((id) => GUIDE_SECTIONS.find((s) => s.id === id))
    .filter((s): s is GuideSection => Boolean(s));
  const rest = GUIDE_SECTIONS.filter((s) => !firstIds.includes(s.id));

  return (
    <Screen title="Guia" subtitle="Consulta rápida do conteúdo do curso. Funciona sem internet.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
        <label htmlFor="guia-busca" style={{ fontWeight: 600 }}>
          Procurar no Guia
        </label>
        <input
          id="guia-busca"
          type="search"
          value={q}
          placeholder="Ex.: maçã, sono, kit de crise"
          onFocus={loadIndex}
          onChange={(e) => {
            loadIndex();
            setQ(e.target.value);
          }}
        />
      </div>
      {typing ? (
        <div aria-live="polite">
          {fodmapHits.length > 0 ? (
            <>
              <Filete level={2}>Na lista de FODMAPs</Filete>
              <ul className={styles.resultados}>
                {fodmapHits.map((e) => (
                  <FodmapResult key={`${e.categoryId}-${e.name}`} e={e} />
                ))}
              </ul>
            </>
          ) : null}
          <Filete level={2}>No Guia</Filete>
          {guideHits.length === 0 ? (
            <p className="secundario">{search ? 'Nada encontrado no Guia.' : 'Procurando...'}</p>
          ) : (
            <ul className={styles.indice}>
              {guideHits.map((h) => {
                const s = GUIDE_SECTIONS.find((x) => x.id === h.section);
                if (!s) return null;
                return (
                  <li key={h.section}>
                    <Link to={hrefFor(s)} className={styles.indiceLink}>
                      <span className={styles.indiceTexto}>
                        <span>{s.title}</span>
                        {h.snippets.map((sn) => (
                          <span key={sn} className={styles.indiceDetalhe}>
                            {sn}
                          </span>
                        ))}
                      </span>
                      <ChevronRight size={20} aria-hidden="true" className="secundario" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <>
          <Link to="/como-usar" className={styles.indiceLink} style={{ marginBottom: 16 }}>
            <span className={styles.indiceTexto}>
              <span>Como usar o app</span>
              <span className={styles.indiceDetalhe}>O caminho inteiro, passo a passo</span>
            </span>
            <ChevronRight size={20} aria-hidden="true" className="secundario" />
          </Link>
          <Filete level={2}>
            {path === 'indefinido' ? 'Para começar' : `Para o teu caso · ${PATH_LABEL[path]}`}
          </Filete>
          <Index items={first} menu={PATH_MENU[path]} />
          <details>
            <summary
              style={{
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Outros temas
            </summary>
            <div style={{ marginTop: 12 }}>
              <Index items={rest} />
            </div>
          </details>
        </>
      )}
    </Screen>
  );
}
