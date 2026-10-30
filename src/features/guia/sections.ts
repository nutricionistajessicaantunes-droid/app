import type { Path } from '../../types';

export interface GuideSection {
  id: string;
  title: string;
  detail: string;
}

/** Seções do Guia (seção 6.11). */
export const GUIDE_SECTIONS: GuideSection[] = [
  { id: 'bristol', title: 'Escala de Bristol', detail: 'Os sete tipos e o que cada um indica' },
  {
    id: 'plano',
    title: 'Plano de 21 dias',
    detail: 'Mapa, regras, caminhos, semana zero e reavaliação',
  },
  {
    id: 'registro',
    title: 'Registro e leitura da semana',
    detail: 'As quatro perguntas e os padrões que costumam aparecer',
  },
  { id: 'agua', title: 'Água', detail: 'Calculadora e plano de água' },
  { id: 'fibras', title: 'Fibras', detail: 'Tabela, dia modelo e Meu dia de fibras' },
  {
    id: 'prebioticos',
    title: 'Prebióticos e probióticos',
    detail: 'Fontes, simbióticos e combinações prontas',
  },
  {
    id: 'prato',
    title: 'O prato, a compra e o comer fora',
    detail: 'Montagem do prato, lista base e restaurante',
  },
  {
    id: 'rotina',
    title: 'Rotina',
    detail: 'Roteiro da refeição, respiração, sono e hábitos com gatilho',
  },
  {
    id: 'fodmap',
    title: 'Lista de FODMAPs',
    detail: 'Alto e baixo teor por grupo, e o que usar sem contar',
  },
  {
    id: 'cardapios',
    title: 'Cardápios modelo',
    detail: 'Os quatro casos, gatilhos e substituições',
  },
  {
    id: 'refeicoes',
    title: 'Refeições',
    detail: 'O que eu tenho em casa, receitas e o meu dia montado',
  },
  {
    id: 'receitas-fodmap',
    title: 'Receitas baixo FODMAP',
    detail: 'Receitas para a fase 1 do protocolo',
  },
  {
    id: 'diarreia',
    title: 'Diarreia',
    detail: 'Primeiro a água, kit de crise e a volta depois da crise',
  },
  {
    id: 'alertas',
    title: 'Sinais de alerta',
    detail: 'Quando procurar avaliação e acompanhamento',
  },
  {
    id: 'avisos',
    title: 'Avisos importantes',
    detail: 'O que este app é e o que ele não substitui',
  },
  { id: 'sobre', title: 'Sobre a Jéssica e contato', detail: 'Atendimento on-line e presencial' },
];

/** O conteúdo do caminho da aluna aparece primeiro (seção 6.11). */
export const PATH_PRIORITY: Record<Path, string[]> = {
  preso: ['bristol', 'fibras', 'agua', 'cardapios', 'refeicoes', 'plano', 'rotina'],
  solto: ['bristol', 'diarreia', 'agua', 'cardapios', 'refeicoes', 'plano'],
  gases_sii: [
    'bristol',
    'fodmap',
    'receitas-fodmap',
    'cardapios',
    'refeicoes',
    'rotina',
    'prebioticos',
    'plano',
  ],
  refluxo: ['bristol', 'cardapios', 'refeicoes', 'rotina', 'prato', 'plano'],
  indefinido: ['bristol', 'plano', 'registro', 'refeicoes', 'alertas'],
};

/** Cardápio de cada caminho, para abrir direto na parte certa. */
export const PATH_MENU: Partial<Record<Path, string>> = {
  preso: 'preso',
  solto: 'crise',
  gases_sii: 'gases',
  refluxo: 'refluxo',
};

export function getSection(id: string): GuideSection | undefined {
  return GUIDE_SECTIONS.find((s) => s.id === id);
}
