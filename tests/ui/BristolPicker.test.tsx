import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import type { Bristol } from '../../src/types';
import { BristolPicker, BristolScale } from '../../src/ui/BristolPicker';

function Harness() {
  const [v, setV] = useState<Bristol | undefined>();
  return (
    <>
      <BristolPicker
        legend="Como estavam as fezes?"
        help="Se teve mais de um tipo, marque o que mais apareceu."
        value={v}
        onChange={setV}
      />
      <output data-testid="valor">{v ?? ''}</output>
    </>
  );
}

describe('seletor de Bristol', () => {
  it('mostra os sete tipos, sempre com número, nome e faixa', () => {
    render(<Harness />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(7);
    expect(screen.getByRole('radio', { name: /Tipo 1 · Bolinhas duras/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Tipo 7 · Totalmente líquida/ })).toBeInTheDocument();
    expect(screen.getAllByText('trânsito lento')).toHaveLength(2);
    expect(screen.getAllByText('faixa saudável')).toHaveLength(3);
    expect(screen.getAllByText('trânsito acelerado')).toHaveLength(2);
    expect(screen.getByRole('group', { name: 'Como estavam as fezes?' })).toBeInTheDocument();
  });

  it('marca o tipo escolhido', () => {
    render(<Harness />);
    const t4 = screen.getByRole('radio', { name: /Tipo 4 · Lisa e macia/ });
    fireEvent.click(t4);
    expect(t4).toBeChecked();
    expect(screen.getByTestId('valor')).toHaveTextContent('4');
    fireEvent.click(screen.getByRole('radio', { name: /Tipo 2/ }));
    expect(t4).not.toBeChecked();
    expect(screen.getByTestId('valor')).toHaveTextContent('2');
  });

  it('a escala completa traz a descrição e o selo do tipo ideal', () => {
    render(<BristolScale />);
    expect(
      screen.getByText('Formato de salsicha. É o tipo considerado ideal.'),
    ).toBeInTheDocument();
    expect(screen.getByText('tipo ideal')).toBeInTheDocument();
  });
});
