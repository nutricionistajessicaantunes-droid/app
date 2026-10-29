import { useState } from 'react';
import { LEVEL_LABEL } from '../../content/fodmap';
import { searchFodmap, swapsFor, type FodmapEntry } from '../../logic/fodmapLookup';
import styles from '../processo/Processo.module.css';

export function FodmapResult({ e }: { e: FodmapEntry }) {
  const swaps = swapsFor(e);
  return (
    <li>
      <strong>{e.name}</strong>: {LEVEL_LABEL[e.level]}, {e.categoryTitle.toLowerCase()}.
      {swaps.length > 0 ? (
        <span className="secundario">
          {' '}
          Trocas de baixo teor do mesmo grupo: {swaps.join(', ')}.
        </span>
      ) : null}
    </li>
  );
}

/** Busca na lista de FODMAPs ("maçã" mostra o grupo, o teor e as trocas). */
export function FodmapSearch() {
  const [q, setQ] = useState('');
  const results = searchFodmap(q);
  return (
    <div className={styles.pilha}>
      <div className={styles.campo}>
        <label htmlFor="fodmap-busca">Procurar um alimento</label>
        <input
          id="fodmap-busca"
          type="search"
          value={q}
          placeholder="Ex.: maçã"
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {q.trim().length >= 2 ? (
        results.length > 0 ? (
          <ul className={styles.lista} aria-live="polite">
            {results.slice(0, 8).map((e) => (
              <FodmapResult key={`${e.categoryId}-${e.name}`} e={e} />
            ))}
          </ul>
        ) : (
          <p className="secundario" aria-live="polite">
            Esse alimento não está na lista do caderno.
          </p>
        )
      ) : null}
    </div>
  );
}
