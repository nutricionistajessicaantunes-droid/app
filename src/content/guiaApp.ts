/**
 * Como usar o app: textos de orientação para quem não assistiu às aulas.
 * Textos novos da interface (listados em docs/textos-novos.md). O conteúdo clínico
 * continua vindo das aulas, em src/content.
 */

export const COMO_USAR = {
  intro:
    'O app guia você do primeiro dia até depois do plano de 21 dias. Você não precisa ter assistido às aulas para usar: cada tarefa explica o que fazer aqui mesmo. As aulas na Kiwify aprofundam o porquê de cada coisa.',
  passos: [
    {
      titulo: 'Registre o teu dia, todo dia',
      texto:
        'Uma vez por dia, de preferência à noite, toque em "Registrar meu dia" na tela Hoje. Leva um minuto: se você evacuou, o tipo de fezes pela Escala de Bristol, os sintomas de 0 a 10, a energia, os hábitos e uma linha sobre o dia. Tudo salva sozinho. Esqueceu um dia? Registre no dia seguinte pelo link "Registrar ontem".',
    },
    {
      titulo: 'Siga o "Teu próximo passo"',
      texto:
        'Na tela Hoje, o cartão "Teu próximo passo" mostra sempre a próxima coisa a fazer. Uma por vez, na ordem certa para o teu caso.',
    },
    {
      titulo: 'Faça as tarefas das aulas',
      texto:
        'O curso tem 17 aulas, e cada uma traz uma tarefa curta. A tela de cada tarefa mostra o passo a passo, e os campos aparecem dentro do registro do dia. No fim do prazo, o app mostra o resultado: o que se repetiu, o que mudou, o que funcionou melhor para você.',
    },
    {
      titulo: 'Leia a tua semana',
      texto:
        'A partir da tarefa da aula 16 e durante todo o plano de 21 dias, a tela Hoje mostra a leitura da semana no dia que você escolher: quatro perguntas que transformam o registro em decisão. Cinco minutos. Você também pode abrir a leitura quando quiser, em Resultados.',
    },
    {
      titulo: 'Faça o plano de 21 dias',
      texto:
        'Três semanas, com dois hábitos novos por semana. O app mostra os hábitos do dia, lembra as regras e, no fim, compara a tua semana 1 com a semana 3. O plano pode começar quando você quiser, em Caminho, "Plano de 21 dias".',
    },
    {
      titulo: 'Mantenha o que funcionou',
      texto:
        'Depois do plano, você escolhe o plano mínimo, os três hábitos que ficam mesmo na pior semana, e faz uma revisão de cinco minutos por mês.',
    },
  ],
  abas: [
    { nome: 'Hoje', texto: 'O que fazer hoje: registro, hábitos e o próximo passo.' },
    {
      nome: 'Caminho',
      texto: 'As 17 aulas com as tarefas, o plano de 21 dias e o protocolo low FODMAP.',
    },
    { nome: 'Resultados', texto: 'Tua semana, os gráficos, os padrões e a ficha para a consulta.' },
    { nome: 'Guia', texto: 'O conteúdo do curso para consulta rápida, com busca.' },
    {
      nome: 'Ajustes',
      texto:
        'A engrenagem no alto da tela Hoje: lembretes, meta de água, cópia de segurança e tema.',
    },
  ],
  cuidados: [
    'Teus registros ficam só neste celular. Salve uma cópia de segurança de vez em quando, em Ajustes.',
    'Se notar algo preocupante, use o link "Notou algo preocupante?" no fim do registro do dia.',
    'O app é educativo e não substitui consulta. Quando ele sugerir procurar atendimento, procure.',
  ],
};

/** Cartão da tela Hoje nos primeiros dias. */
export const PRIMEIROS_PASSOS = [
  'Registre o teu dia uma vez por dia. Leva um minuto.',
  'Siga o cartão "Teu próximo passo". Ele mostra o que fazer agora, uma coisa por vez.',
  'Cada tarefa explica o passo a passo aqui no app. Assistir à aula na Kiwify é opcional, para aprofundar.',
];

export interface EtapaGuia {
  passos: string[];
  resultado: string;
}

/** Como fazer cada tarefa no app, para quem não assistiu à aula. */
export const ETAPAS: Record<number, EtapaGuia> = {
  1: {
    passos: [
      'Toque em "Começar a tarefa".',
      'Nos próximos 3 dias, registre o teu dia à noite. No registro aparecem os campos desta tarefa: horas de sono, estresse de 0 a 10, copos de água e o que você comeu.',
      'Não precisa mudar nada na rotina. Aqui a ideia é só observar.',
    ],
    resultado: 'No fim, o app mostra os 3 dias lado a lado e destaca o que se repetiu.',
  },
  2: {
    passos: [
      'Escolha um horário fixo para sentar no banheiro, de preferência depois do café da manhã, e toque em "Começar a tarefa".',
      'Por 3 dias, sente nesse horário por 10 a 15 minutos, sem pressa e sem celular, com os pés apoiados num banquinho baixo.',
      'À noite, no registro, marque se sentou e como estavam as fezes.',
    ],
    resultado:
      'No fim, o app mostra em quantos dias você sentou, em quantos evacuou e os tipos de fezes do período.',
  },
  3: {
    passos: [
      'Toque em "Começar a tarefa".',
      'Por 7 dias, faça o registro do dia. Na Escala de Bristol, escolha o desenho mais parecido com as fezes do dia. Em "Como é cada tipo?" você vê o que cada tipo indica.',
      'Marque os chips do dia, como "Dormi mal" ou "Comi correndo", e escreva uma linha sobre o dia.',
    ],
    resultado:
      'No fim, o app mostra o tipo mais frequente, os dias com desconforto e o que esses dias tinham em comum.',
  },
  4: {
    passos: [
      'Escolha 3 fibras da lista e toque em "Começar a tarefa".',
      'Por 7 dias, coma uma delas por dia, sempre com água junto, e marque no registro qual foi a fibra do dia.',
      'Registre também o tipo de fezes.',
    ],
    resultado:
      'No fim, o app mostra os tipos de Bristol dos dias de cada fibra. Sete dias são uma pista, ainda não são conclusão.',
  },
  5: {
    passos: [
      'Escolha até 3 mudanças que cabem na tua rotina, como água distribuída, rotina de banheiro ou uma colher de linhaça por dia, e toque em "Começar a tarefa".',
      'Por 7 dias, marque no registro cada mudança que você cumpriu.',
      'Registre também o tipo de fezes.',
    ],
    resultado:
      'No fim, o app mostra o tipo mais frequente e qual mudança foi a mais fácil de manter.',
  },
  6: {
    passos: [
      'Monte hoje, enquanto você está bem, o kit com os 5 itens da lista e marque cada um.',
      'Anote onde guardou o kit.',
      'Se a diarreia vier, toque em "Se a crise vier". O app abre o modo crise, com a hidratação, os sinais que pedem atendimento e a volta depois da crise.',
    ],
    resultado: 'A tarefa conclui quando os 5 itens estão marcados.',
  },
  7: {
    passos: [
      'Toque em "Começar a tarefa".',
      'Por 7 dias, no registro do dia, use "+ Refeição" para anotar o que comeu e o horário, e "+ Sintoma" quando sentir gases, estufamento ou dor, com a intensidade de 0 a 10.',
      'Anote na hora ou logo depois, para o horário ficar certo.',
    ],
    resultado:
      'No fim, o app mostra os alimentos que apareceram antes do sintoma mais de uma vez, com a classificação da lista de FODMAPs.',
  },
  8: {
    passos: [
      'Escolha 3 medidas da lista, como refeições menores ou jantar 3 horas antes de deitar, e toque em "Começar a tarefa".',
      'Por 7 dias, marque no registro as medidas que cumpriu, se teve sintoma e o que comeu antes.',
    ],
    resultado:
      'No fim, o app mostra quantos dias você cumpriu cada medida e o que apareceu antes do sintoma mais de uma vez.',
  },
  9: {
    passos: [
      'Abra a ficha. Os campos que vêm dos teus registros já aparecem preenchidos.',
      'Complete o resto: medicamentos, exames, histórico da família e as perguntas que você quer fazer.',
      'Salve e, se quiser, gere o PDF para levar à consulta.',
    ],
    resultado: 'A tarefa conclui quando a ficha é salva.',
  },
  10: {
    passos: [
      'Calcule a tua meta de água com o teu peso.',
      'Monte o teu dia de fibras em "Meu dia de fibras", ou carregue o dia modelo e ajuste.',
      'Salve os dois.',
    ],
    resultado:
      'A meta de água vira copos no registro e na tela Hoje. A tarefa conclui quando os dois estão salvos.',
  },
  11: {
    passos: [
      'Toque em "Começar a tarefa".',
      'Por 7 dias, coma uma fonte prebiótica e um fermentado por dia, começando com meia porção, e marque no registro quais foram.',
      'Registre também gases e estufamento de 0 a 10.',
    ],
    resultado:
      'No fim, o app mostra como ficaram gases e estufamento nos 7 dias e as combinações que você usou.',
  },
  12: {
    passos: [
      'Esta tarefa é para quem tem estufamento, gases ou intestino irritável.',
      'Abra o planejamento do protocolo low FODMAP e escolha as datas e os alimentos de teste.',
      'O app acompanha cada fase com você: a restrição com data para acabar, a reintrodução de um grupo por vez e a tua lista pessoal.',
    ],
    resultado: 'A tarefa conclui quando o planejamento é salvo.',
  },
  13: {
    passos: [
      'Escolha 2 hábitos da lista e escreva o gatilho de cada um no formato "Depois que eu ___, eu ___".',
      'Escreva onde você vai deixar isso anotado, para ver todo dia, e toque em "Começar a tarefa".',
      'Por 7 dias, marque no registro os hábitos que cumpriu.',
    ],
    resultado:
      'No fim, o app mostra os dias de cada hábito. Se os dois pegarem, você escolhe mais dois.',
  },
  14: {
    passos: [
      'Faça a compra pela lista base e marque o que comprou.',
      'Escolha o dia de cada um dos três preparos: a leguminosa cozida, a proteína pronta e os legumes e folhas higienizados.',
      'Monte um prato e anote o que ficou parecido com o modelo e o que faltou.',
    ],
    resultado: 'Você marca como feita quando terminar. O app não guarda fotos.',
  },
  15: {
    passos: [
      'Abra a semana zero: são 6 itens para deixar tudo pronto antes do dia 1 do plano.',
      'Alguns itens se marcam sozinhos quando você conclui a ação, como a meta de água, o horário do banheiro e a agenda.',
      'Escolha o dia 1 e toque em "Começar o plano".',
    ],
    resultado: 'A tarefa conclui quando o plano começa.',
  },
  16: {
    passos: [
      'Escolha o horário do teu registro e o dia da leitura da semana e toque em "Começar a tarefa".',
      'Registre 7 dias seguidos.',
      'No dia da leitura, a tela Hoje mostra a leitura da semana: quatro perguntas, cinco minutos.',
    ],
    resultado: 'A tarefa conclui com a primeira leitura da semana salva.',
  },
  17: {
    passos: [
      'No fim do plano de 21 dias, o app compara a tua semana 1 com a semana 3.',
      'Você confirma o cenário que mais combina com o que aconteceu.',
      'Depois, escolhe o plano mínimo e o dia da revisão do mês.',
    ],
    resultado: 'Antes do fim do plano, esta tarefa fica só para leitura.',
  },
};

/** "Como usar esta tela", nas telas principais. */
export const AJUDA = {
  registro: [
    'Responda primeiro "Você evacuou?". O dia só conta como registrado com essa resposta.',
    'Na Escala de Bristol, escolha o desenho mais parecido com as fezes do dia. Se teve mais de um tipo, marque o que mais apareceu.',
    'Nos sintomas, toque no número de 0 a 10. Sem sintoma, use "Sem sintomas hoje".',
    'Tudo salva sozinho. "Pronto" volta para a tela Hoje.',
  ],
  resultados: [
    '"Tua semana" resume os dias registrados. Use as setas para ver as semanas anteriores.',
    'Os gráficos mostram a evolução das últimas semanas. Um dia isolado não diz nada. O padrão da semana é o que conta.',
    'Em "Ficha para a consulta", o app monta um resumo dos teus registros para levar a uma consulta.',
  ],
  caminho: [
    'Cada aula traz uma tarefa curta, com o passo a passo aqui no app. Faça na ordem, uma por vez.',
    'A aula na Kiwify aprofunda o porquê de cada tarefa. Assistir é opcional para usar o app.',
    'O selo "Recomendada para o teu caso" mostra as aulas mais importantes para a tua queixa. As opcionais ficam aqui se você quiser fazer.',
    'O plano de 21 dias pode começar quando você quiser.',
  ],
};
