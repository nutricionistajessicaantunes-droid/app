/** Rotina (seção 9.8, aula 13). */

export const ROTEIRO_REFEICAO = [
  { titulo: 'Sente para comer', texto: 'nada de comer em pé, na pia ou andando.' },
  { titulo: 'Tire a tela', texto: 'celular longe, televisão desligada, computador fechado.' },
  { titulo: 'Pouse o talher entre uma garfada e outra', texto: 'para forçar a pausa.' },
  {
    titulo: 'Mastigue até virar papa',
    texto: 'se ainda sente pedaço, ainda não é hora de engolir.',
  },
  {
    titulo: 'Mire em 20 minutos',
    texto: 'não precisa cronometrar sempre, só perceber se está correndo.',
  },
];

export const ROTEIRO_TESTE =
  'Faça este teste: aplique os cinco passos só no almoço, por três dias, e repare na diferença no estufamento da tarde.';

export const HORARIOS = {
  itens: [
    'Café da manhã como âncora',
    'Intervalos de 3 a 4 horas',
    'Jantar pelo menos 3 horas antes de deitar',
  ],
  turnos:
    'Se a tua rotina é de turnos: primeira refeição logo depois de acordar, seja que horas for, e um intervalo máximo entre refeições que você consiga manter.',
};

export const PLANO_SONO = {
  itens: [
    'Horário de dormir mais ou menos fixo, inclusive no fim de semana',
    'Tela longe na última meia hora antes de dormir',
    'Luz mais baixa em casa à noite',
    'Sem café depois do meio da tarde',
  ],
  fecho: 'Uma hora a mais de sono por noite, de forma consistente, já muda muita coisa.',
};

export const RESPIRACAO =
  'Sente-se antes da refeição, com os pés apoiados no chão. Inspire pelo nariz contando até quatro. Solte o ar pela boca contando até seis. Repita de cinco a seis vezes, o que leva cerca de um minuto. A expiração mais longa é o que sinaliza ao corpo que ele pode sair do modo alerta.';

export const ESTRESSE = {
  itens: [
    'Uma pausa real no meio do expediente, mesmo que de dez minutos, longe da tela',
    'Não usar a refeição para resolver problema',
  ],
  aviso:
    'Estresse ou sofrimento emocional em nível que atrapalha a rotina merece apoio de um profissional de saúde mental.',
};

export const MOVIMENTO = {
  texto:
    'Caminhada de 20 a 30 minutos na maior parte dos dias, ou 10 minutos de caminhada leve depois das refeições principais.',
  aviso: 'Quem tem refluxo deve evitar exercício intenso logo após refeições volumosas.',
};

export const IMPLANTACAO = [
  'Dois hábitos por vez. Cada hábito precisa de um gatilho, um momento que já existe na tua rotina: depois que eu faço X, eu faço Y.',
  'Ajuste o ambiente: a garrafa de água na mesa de trabalho, o banquinho já no banheiro, a fruta na fruteira à vista.',
];

/** Tabela de implantação de hábitos (sugestões da tarefa da aula 13). */
export const TABELA_IMPLANTACAO: {
  habito: string;
  gatilho: string;
  faco: string;
  isWater?: boolean;
}[] = [
  {
    habito: 'Roteiro da refeição',
    gatilho: 'Depois que eu sentar para almoçar',
    faco: 'Pouso o talher entre as garfadas',
  },
  {
    habito: 'Caminhada pós-refeição',
    gatilho: 'Depois que eu terminar de almoçar',
    faco: 'Caminho 10 minutos',
  },
  { habito: 'Respiração', gatilho: 'Antes da primeira garfada', faco: 'Faço 5 respirações 4 e 6' },
  {
    habito: 'Sono',
    gatilho: 'Depois que eu escovar os dentes à noite',
    faco: 'Deixo o celular fora do quarto',
  },
  {
    habito: 'Água',
    gatilho: 'Toda vez que eu sentar na mesa de trabalho',
    faco: 'Encho a garrafa',
    isWater: true,
  },
  {
    habito: 'Banheiro',
    gatilho: 'Depois do café da manhã',
    faco: 'Reservo 10 a 15 minutos sem pressa',
  },
];

export const TEMPO_RESULTADO = [
  {
    o_que: 'Mastigação e horário das refeições',
    quando: 'diferença em dias, principalmente no estufamento',
  },
  {
    o_que: 'Fibra e água bem ajustadas',
    quando: 'de uma a duas semanas para mudar consistência e frequência',
  },
  { o_que: 'Sono e estresse', quando: 'algumas semanas' },
  { o_que: 'O conjunto funcionando junto', quando: 'é quando o intestino estabiliza' },
];

export const COMECE_COM_DOIS =
  'Comece com dois hábitos. Tentar aplicar tudo de uma vez é a razão mais comum de abandono.';
