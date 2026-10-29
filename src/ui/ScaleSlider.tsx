import { useId, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import styles from './ScaleSlider.module.css';

interface ScaleSliderProps {
  label: string;
  /** undefined = não registrado (sem número). */
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Rótulos das pontas, para leitores de tela. */
  describedBy?: string;
  /** Esconde o rótulo na tela (continua para leitores de tela), quando o cartão já diz o nome. */
  hideLabel?: boolean;
}

const LIMIAR_ARRASTE = 6;

/**
 * Controle de 0 a 10. Antes do primeiro toque fica "não registrado".
 * Toque marca o valor; arrastar na horizontal ajusta; rolar na vertical não muda nada.
 * Teclado: setas, Home, End, Page Up e Page Down.
 */
export function ScaleSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  describedBy,
  hideLabel,
}: ScaleSliderProps) {
  const labelId = useId();
  const areaRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; dragging: boolean; id: number } | null>(null);

  const valueFromX = (clientX: number): number => {
    const el = areaRef.current;
    if (!el) return min;
    const rect = el.getBoundingClientRect();
    const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    const v = Math.round(min + Math.min(1, Math.max(0, ratio)) * (max - min));
    return v;
  };

  const set = (v: number) => {
    const clamped = Math.min(max, Math.max(min, v));
    if (clamped !== value) onChange(clamped);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    gesture.current = { x: e.clientX, y: e.clientY, dragging: false, id: e.pointerId };
    if (e.pointerType === 'mouse') {
      gesture.current.dragging = true;
      areaRef.current?.setPointerCapture?.(e.pointerId);
      set(valueFromX(e.clientX));
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.dragging) {
      const dx = Math.abs(e.clientX - g.x);
      const dy = Math.abs(e.clientY - g.y);
      if (dx > LIMIAR_ARRASTE && dx > dy) {
        g.dragging = true;
        areaRef.current?.setPointerCapture?.(e.pointerId);
      } else if (dy > LIMIAR_ARRASTE) {
        gesture.current = null;
        return;
      }
    }
    if (g.dragging) set(valueFromX(e.clientX));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== e.pointerId) return;
    if (!g.dragging) set(valueFromX(e.clientX));
    areaRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = value;
    let next: number | undefined;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = cur === undefined ? min : cur + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = cur === undefined ? min : cur - 1;
        break;
      case 'PageUp':
        next = cur === undefined ? min : cur + 2;
        break;
      case 'PageDown':
        next = cur === undefined ? min : cur - 2;
        break;
      case 'Home':
        next = min;
        break;
      case 'End':
        next = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    set(next);
  };

  const pct = value === undefined ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className={[styles.linha, value === undefined ? styles.vazio : ''].join(' ')}>
      <div className={styles.topo}>
        <span id={labelId} className={hideLabel ? 'sr-only' : styles.rotulo}>
          {label}
        </span>
        {value === undefined ? (
          <span className={styles.semValor} aria-hidden="true">
            não registrado
          </span>
        ) : (
          <span className={styles.valor} aria-hidden="true">
            {value}
          </span>
        )}
      </div>
      <div
        ref={areaRef}
        className={styles.area}
        role="slider"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={value === undefined ? 'não registrado' : `${value} de ${max}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          gesture.current = null;
        }}
        onKeyDown={onKeyDown}
      >
        <div className={styles.trilho} />
        {value !== undefined ? (
          <>
            <div className={styles.preenchido} style={{ width: `calc(${pct}% + 14px)` }} />
            <div className={styles.polegar} style={{ left: `${pct}%` }} />
          </>
        ) : null}
      </div>
      <div className={styles.marcas} aria-hidden="true">
        <span>{min}</span>
        <span>{Math.round((min + max) / 2)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
