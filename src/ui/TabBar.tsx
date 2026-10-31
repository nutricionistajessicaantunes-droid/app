import { BookOpen, ChartLine, Route, Sun, Utensils } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import styles from './TabBar.module.css';

const ABAS = [
  { to: '/', label: 'Hoje', Icon: Sun, end: true },
  { to: '/caminho', label: 'Caminho', Icon: Route, end: false },
  { to: '/resultados', label: 'Resultados', Icon: ChartLine, end: false },
  { to: '/refeicoes/meu-dia', label: 'Refeições', Icon: Utensils, end: false },
  { to: '/guia', label: 'Guia', Icon: BookOpen, end: false },
];

export function TabBar() {
  const { pathname } = useLocation();
  return (
    <nav className={styles.barra} aria-label="Principal">
      <ul className={styles.lista}>
        {ABAS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  styles.aba,
                  isActive || (to.startsWith('/refeicoes') && pathname.startsWith('/refeicoes'))
                    ? styles.ativa
                    : '',
                ].join(' ')
              }
            >
              <Icon size={24} aria-hidden="true" className={styles.icone} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
