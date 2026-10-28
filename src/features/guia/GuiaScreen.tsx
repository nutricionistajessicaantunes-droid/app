import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useProfile } from '../../app/data';
import { PATH_LABEL } from '../../content/onboarding';
import { Filete } from '../../ui/Filete';
import { Screen } from '../../ui/Screen';
import styles from './Guia.module.css';
import { GUIDE_SECTIONS, PATH_PRIORITY, PATH_MENU, type GuideSection } from './sections';

function hrefFor(s: GuideSection, menu?: string): string {
  if (s.id === 'cardapios' && menu) return `/guia/cardapios/${menu}`;
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

export function Component() {
  const profile = useProfile();
  if (profile === undefined) return null;
  const path = profile?.path ?? 'indefinido';
  const firstIds = PATH_PRIORITY[path];
  const first = firstIds
    .map((id) => GUIDE_SECTIONS.find((s) => s.id === id))
    .filter((s): s is GuideSection => Boolean(s));
  const rest = GUIDE_SECTIONS.filter((s) => !firstIds.includes(s.id));

  return (
    <Screen title="Guia" subtitle="Consulta rápida do conteúdo do curso. Funciona sem internet.">
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
    </Screen>
  );
}
