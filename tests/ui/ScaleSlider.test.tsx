import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { ScaleSlider } from '../../src/ui/ScaleSlider';

function Harness({ initial }: { initial?: number }) {
  const [v, setV] = useState<number | undefined>(initial);
  return <ScaleSlider label="Estufamento" value={v} onChange={setV} />;
}

describe('controle de 0 a 10', () => {
  it('começa como "não registrado", sem número', () => {
    render(<Harness />);
    const s = screen.getByRole('slider', { name: 'Estufamento' });
    expect(s).toHaveAttribute('aria-valuetext', 'não registrado');
    expect(s).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByText('não registrado')).toBeInTheDocument();
  });

  it('teclado: setas, Home, End, Page Up e Page Down', () => {
    render(<Harness />);
    const s = screen.getByRole('slider');
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(s).toHaveAttribute('aria-valuenow', '0');
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    fireEvent.keyDown(s, { key: 'ArrowUp' });
    expect(s).toHaveAttribute('aria-valuenow', '2');
    fireEvent.keyDown(s, { key: 'PageUp' });
    expect(s).toHaveAttribute('aria-valuenow', '4');
    fireEvent.keyDown(s, { key: 'PageDown' });
    fireEvent.keyDown(s, { key: 'ArrowLeft' });
    expect(s).toHaveAttribute('aria-valuenow', '1');
    fireEvent.keyDown(s, { key: 'End' });
    expect(s).toHaveAttribute('aria-valuenow', '10');
    expect(s).toHaveAttribute('aria-valuetext', '10 de 10');
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(s).toHaveAttribute('aria-valuenow', '10');
    fireEvent.keyDown(s, { key: 'Home' });
    fireEvent.keyDown(s, { key: 'ArrowDown' });
    expect(s).toHaveAttribute('aria-valuenow', '0');
    fireEvent.keyDown(s, { key: 'a' });
    expect(s).toHaveAttribute('aria-valuenow', '0');
  });

  it('toque marca o valor na posição tocada', () => {
    render(<Harness />);
    const s = screen.getByRole('slider');
    s.getBoundingClientRect = () => ({
      left: 0,
      width: 200,
      top: 0,
      height: 48,
      right: 200,
      bottom: 48,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(s, { pointerId: 1, pointerType: 'touch', clientX: 140, clientY: 20 });
    fireEvent.pointerUp(s, { pointerId: 1, pointerType: 'touch', clientX: 140, clientY: 20 });
    expect(s).toHaveAttribute('aria-valuenow', '7');
  });

  it('rolar a tela na vertical não muda o valor', () => {
    render(<Harness initial={3} />);
    const s = screen.getByRole('slider');
    s.getBoundingClientRect = () => ({
      left: 0,
      width: 200,
      top: 0,
      height: 48,
      right: 200,
      bottom: 48,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(s, { pointerId: 2, pointerType: 'touch', clientX: 180, clientY: 10 });
    fireEvent.pointerMove(s, { pointerId: 2, pointerType: 'touch', clientX: 181, clientY: 60 });
    fireEvent.pointerUp(s, { pointerId: 2, pointerType: 'touch', clientX: 181, clientY: 60 });
    expect(s).toHaveAttribute('aria-valuenow', '3');
  });

  it('arrastar na horizontal ajusta', () => {
    render(<Harness initial={1} />);
    const s = screen.getByRole('slider');
    s.getBoundingClientRect = () => ({
      left: 0,
      width: 100,
      top: 0,
      height: 48,
      right: 100,
      bottom: 48,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(s, { pointerId: 3, pointerType: 'touch', clientX: 10, clientY: 20 });
    fireEvent.pointerMove(s, { pointerId: 3, pointerType: 'touch', clientX: 50, clientY: 22 });
    expect(s).toHaveAttribute('aria-valuenow', '5');
    fireEvent.pointerMove(s, { pointerId: 3, pointerType: 'touch', clientX: 90, clientY: 22 });
    fireEvent.pointerUp(s, { pointerId: 3, pointerType: 'touch', clientX: 90, clientY: 22 });
    expect(s).toHaveAttribute('aria-valuenow', '9');
  });

  it('mouse marca no clique', () => {
    render(<Harness />);
    const s = screen.getByRole('slider');
    s.getBoundingClientRect = () => ({
      left: 0,
      width: 100,
      top: 0,
      height: 48,
      right: 100,
      bottom: 48,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(s, {
      pointerId: 4,
      pointerType: 'mouse',
      button: 0,
      clientX: 30,
      clientY: 20,
    });
    fireEvent.pointerUp(s, {
      pointerId: 4,
      pointerType: 'mouse',
      button: 0,
      clientX: 30,
      clientY: 20,
    });
    expect(s).toHaveAttribute('aria-valuenow', '3');
  });
});
