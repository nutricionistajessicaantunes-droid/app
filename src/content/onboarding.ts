import type { Path } from '../types';

/** Textos da primeira vez (seção 6.1). */
export const ONBOARDING = {
  boasVindas:
    'Este é o app do curso Modulação Intestinal na Prática. Aqui você registra o teu dia em um minuto, faz as tarefas das aulas e vê o que os teus registros mostram.',
  privacidade: 'Teus registros ficam só neste celular. Nem eu tenho acesso.',
  comecar: 'Começar',
  jaUsei: 'Já usei o app em outro celular ou no navegador',
  jaUseiNavegador: 'Já usei o app no navegador',
  nome: 'Como posso te chamar?',
  caminho: 'Qual é a tua queixa principal hoje?',
  caminhoNota: 'Você pode mudar depois. As aulas do módulo 2 ajudam a identificar o teu caso.',
  antes: 'Algum destes está acontecendo?',
  situacoes: 'Alguma destas situações vale para você?',
  ondeEsta: 'Onde você está no curso?',
  comecando: 'Estou começando',
  algumasAulas: 'Já assisti algumas aulas',
  noPlano: 'Já estou no plano de 21 dias',
  quando: 'Quando registrar',
  sugestaoAula16:
    'Escolha um momento fixo, de preferência à noite, e prenda o registro nele. Por exemplo: depois que eu escovar os dentes, eu registro.',
  domingo: 'Domingo à noite funciona bem para a maioria das pessoas.',
  fim: 'Pronto. Comece pelo registro de hoje.',
};

export const PATH_OPTIONS: { id: Path; label: string }[] = [
  { id: 'preso', label: 'Intestino preso' },
  { id: 'solto', label: 'Intestino solto' },
  { id: 'gases_sii', label: 'Estufamento, gases ou intestino irritável' },
  { id: 'refluxo', label: 'Refluxo ou gastrite' },
  { id: 'indefinido', label: 'Ainda não sei' },
];

export const PATH_LABEL: Record<Path, string> = Object.fromEntries(
  PATH_OPTIONS.map((p) => [p.id, p.label]),
) as Record<Path, string>;

/** Código de acesso (seção 3.5). */
export const ACESSO_TEXTOS = {
  instrucao: 'Digite o código que está na área de membros do curso',
  entrar: 'Entrar',
  ajuda: 'Onde encontro o código?',
  ajudaResposta: 'No módulo Materiais do curso, na Kiwify.',
};
