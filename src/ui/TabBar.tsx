import { BookOpen, ChartLine, Route, Sun } from 'lucide-react';
import { NavLink } from 'react-router';
import styles from './TabBar.module.css';

const ABAS = [
  { to: '/', label: 'Hoje', Icon: Sun, end: true },
  { to: '/caminho', label: 'Caminho', Icon: Route, end: false },
  { to: '/resultados', label: 'Resultados', Icon: ChartLine, end: false },
  { to: '/guia', label: 'Guia', Icon: BookOpen, end: false },
];

export function TabBar() {
  return (
    <nav className={styles.barra} aria-label="Principal">
      <ul className={styles.lista}>
        {ABAS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => [styles.aba, isActive ? styles.ativa : ''].join(' ')}
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
