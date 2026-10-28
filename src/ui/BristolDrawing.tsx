import type { ReactElement } from 'react';
import type { Bristol } from '../types';

/**
 * Desenhos originais da Escala de Bristol: formas simples, em marrom suave,
 * sem realismo. A cor vem de --desenho-bristol (tema claro e escuro).
 */
const SHAPES: Record<Bristol, ReactElement> = {
  1: (
    <g>
      <circle cx="20" cy="31" r="8" />
      <circle cx="40" cy="23" r="7" />
      <circle cx="59" cy="33" r="8.5" />
      <circle cx="80" cy="24" r="7.5" />
      <circle cx="100" cy="32" r="8" />
    </g>
  ),
  2: (
    <g>
      <circle cx="18" cy="31" r="9.5" />
      <circle cx="30" cy="28" r="10.5" />
      <circle cx="42" cy="26" r="9.5" />
      <circle cx="54" cy="25" r="10.5" />
      <circle cx="66" cy="25" r="9.5" />
      <circle cx="78" cy="26" r="10.5" />
      <circle cx="90" cy="28" r="9.5" />
      <circle cx="102" cy="31" r="10" />
    </g>
  ),
  3: (
    <g>
      <path
        d="M18 32 Q60 18 102 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <g fill="none" stroke="var(--desenho-bristol-claro)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M39 18.5 L41.5 23.5" />
        <path d="M51.5 16.5 L53.5 21.5" />
        <path d="M61 15.8 L62 21" />
        <path d="M71 16 L73 21" />
        <path d="M82 17.5 L84 22.5" />
        <path d="M93 19.8 L94.5 24" />
      </g>
    </g>
  ),
  4: (
    <path
      d="M16 34 C40 12 74 46 104 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    />
  ),
  5: (
    <g>
      <ellipse cx="26" cy="31" rx="15" ry="10.5" transform="rotate(-6 26 31)" />
      <ellipse cx="60" cy="27" rx="14" ry="10" transform="rotate(4 60 27)" />
      <ellipse cx="94" cy="31" rx="15" ry="10.5" transform="rotate(-3 94 31)" />
    </g>
  ),
  6: (
    <path d="M22 34 C16 26 26 18 34 22 C36 14 48 14 52 19 C58 12 70 13 72 19 C80 14 92 17 92 24 C102 23 106 32 98 37 C102 44 90 47 84 43 C78 49 66 48 62 43 C56 48 44 48 41 42 C33 46 24 42 26 37 C20 38 18 36 22 34 Z" />
  ),
  7: (
    <g>
      <path d="M14 37 C14 31 26 29 36 31 C46 27 60 28 70 30 C82 27 98 29 104 33 C110 37 104 43 94 42 C84 45 70 44 60 43 C48 45 32 45 24 43 C16 43 14 40 14 37 Z" />
      <circle cx="30" cy="19" r="3.2" />
      <circle cx="86" cy="17" r="2.6" />
      <circle cx="62" cy="14" r="2" />
    </g>
  ),
};

export function BristolDrawing({
  type,
  size = 'md',
  title,
}: {
  type: Bristol;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}) {
  const w = size === 'sm' ? 60 : size === 'lg' ? 132 : 84;
  return (
    <svg
      viewBox="0 0 120 56"
      width={w}
      height={(w * 56) / 120}
      fill="currentColor"
      style={{ color: 'var(--desenho-bristol)', flexShrink: 0 }}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {SHAPES[type]}
    </svg>
  );
}
