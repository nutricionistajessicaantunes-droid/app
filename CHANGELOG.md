# Registro de mudanças

Tudo que muda no app fica anotado aqui, por fase.

## Fase 3 · Conhecimento e resultados (29/10/2026)

### O que ficou pronto

- **Busca no Guia**: procura em todo o conteúdo e na lista de FODMAPs, sem acento e sem diferença de maiúsculas. "maçã" mostra o grupo, o teor e as trocas de baixo teor do mesmo grupo.
- **Lista de FODMAPs** com busca própria e atalho para o protocolo.
- **Protocolo low FODMAP completo**: aviso de cuidado com "Vou fazer com acompanhamento profissional", planejamento (datas, alimento-teste de cada grupo, preparativos, agenda), fase 1 com contador e avaliação automática, fase 2 com um grupo por vez, porções do dia, "Foi um dia atípico?", conclusão sugerida e pausa, e fase 3 com a lista pessoal e o lembrete para testar de novo. Os cinco erros ficam visíveis em todas as fases.
- **Meu dia de fibras** no Guia: alimentos da tabela, medida caseira do dia modelo, atalhos de 50, 100 e 150 g, total do dia e faixa da meta.
- **Respiração guiada** antes de comer: círculo que cresce em 4 segundos e diminui em 6, por 6 ciclos, com versão sem animação para quem prefere menos movimento.
- **Ficha para a consulta** preenchida a partir dos registros e editável, com PDF (A4, com a fonte do app), texto para copiar e impressão.
- **Resultados** com os quatro gráficos (Bristol por dia, sintomas e energia, hábitos com a linha da meta, evacuações), padrões encontrados, histórico (leituras, tarefas, reavaliação, protocolo e sinais de acompanhamento) e "Compartilhar resumo".
- **Tarefas das aulas 9, 10 e 12** ligadas às ferramentas novas.
- **Modo demonstração completo**: diário de sintomas, protocolo em andamento e tarefa em andamento.
- **Testes**: 193 testes, incluindo os exemplos do protocolo da especificação.

### Próxima fase

Fase 4 · Acabamento e publicação: acessibilidade, desempenho, testes ponta a ponta, Lighthouse, README final, `docs/kiwify.md`, `docs/teste-no-celular.md` e publicação.

## Fase 2 · Processo (29/10/2026)

### O que ficou pronto

- **Tarefas das 17 aulas** dentro da tela da aula: configurar, começar, acompanhar ("Dia 2 de 7"), pausar e retomar, e a tela de resultado com o que o app calculou e a pergunta da aula já com sugestão. Aviso quando duas tarefas de vários dias andam juntas ("Pausar a anterior" ou "Fazer as duas").
- **Campos diários das tarefas dentro do Registro do dia**: sono, estresse e o que comi (aula 1), "Sentei?" (aula 2), fibra do dia (aula 4), mudanças e medidas como hábitos (aulas 5, 8 e 13), diário de sintomas com horário e sugestão pela lista de FODMAPs (aula 7), "Teve sintoma?" e "O que comi antes" (aula 8), prebiótico e fermentado (aula 11). Nota sobre a Escala de Bristol nas aulas 1 e 2.
- **Resultados das tarefas**: o que se repetiu (aula 1), dias em que sentou e evacuou (aula 2), tipo mais frequente e fatores em comum (aula 3), tipos por fibra (aula 4), a mudança mais fácil (aula 5), alimentos suspeitos com a classificação da lista de FODMAPs (aula 7), o que comi antes do sintoma (aula 8), gases e estufamento nos 7 dias e as combinações (aula 11), dias de cada hábito (aula 13).
- **Plano de 21 dias completo**: semana zero com os seis itens (calculadora de água, horário do banheiro, dia 1 e dia 21 na agenda), "Começar o plano em 9/11", visão das semanas com os hábitos futuros com cadeado, recados do plano (o que esperar de cada semana e o quarto dia), "Retome hoje" depois de 5 dias sem registro e repetir a semana.
- **Leitura da semana** com as quatro perguntas, fatores em comum, padrões, sugestões de "Mantenho" e "Ajusto", decisão de repetir ou avançar e convite para salvar a cópia.
- **Reavaliação do dia 21** com a tabela da semana 1 contra a semana 3, sugestão de cenário, texto de cada cenário, convite para o acompanhamento e a tela de fim do curso.
- **Plano mínimo**, **revisão do mês** e **novo ciclo** com dois hábitos.
- **Modo crise**: copos de líquido, lista de hidratação, sinais de desidratação, quando procurar atendimento e a volta depois da crise por etapas, com a pausa de dois dias se o tipo 6 ou 7 voltar.
- **Teu próximo passo** completo na tela Hoje e a lista inteira no Caminho.
- **Verificações automáticas**: sugestão do modo crise, três dias sem evacuar, diarreia por mais de duas semanas e os sinais que pedem acompanhamento (estufamento diário, alternância, intestino preso que não responde, sintomas que persistem).
- **Testes**: 182 testes, incluindo os exemplos de cálculo da especificação (cenários, repetir a semana, padrões, suspeitos).

### Próxima fase

Fase 3 · Conhecimento e resultados: Guia completo com busca, lista de FODMAPs e protocolo, ferramentas de água e fibra, respiração guiada, cardápios, ficha da consulta com PDF, Resultados com gráficos e padrões e o modo demonstração completo.

## Fase 1 · Base (28/10/2026)

### O que ficou pronto

- **Projeto** em Vite, React e TypeScript, com testes (Vitest), padrão de código (ESLint e Prettier) e publicação na Netlify (`netlify.toml` com os cabeçalhos de segurança).
- **Identidade visual**: vinho, blush e areia, títulos em Instrument Serif e texto em Figtree (fontes dentro do app, sem buscar nada na internet). Tema claro, escuro ou automático. Tons de significado ajustados para o contraste mínimo (AA).
- **Conteúdo do curso** transcrito em `src/content`: aulas, Escala de Bristol, plano de 21 dias, reavaliação, rotina, água e fibras, prebióticos, prato, FODMAPs, diarreia, cardápios, sinais de alerta, ficha e avisos.
- **Banco de dados no aparelho** (IndexedDB), com histórico de versões e teste de migração. Salvamento automático do registro em até 300 ms, sem botão de salvar.
- **Cópia de segurança**: salvar (arquivo `.txt`, compartilhado pelo celular ou baixado no computador), restaurar substituindo ou juntando, com confirmação em duas etapas, e cópia de emergência na tela de erro.
- **Primeira vez**: tela "Abra no navegador" para quem abre pelo Instagram ou outro app, código de acesso (link `?acesso=` ou digitado), guia de instalação no iPhone, sugestão de instalação no Android e no computador, e o onboarding em seis passos.
- **Tela Hoje**: saudação, data, selo do plano, cartões por prioridade (no máximo quatro), registro de hoje, hábitos com toque direto, água em copos, próximo passo, alerta e lembrete de cópia.
- **Registro do dia**: evacuação, quantas vezes, Escala de Bristol com desenhos próprios, sintomas e energia de 0 a 10, hábitos, água, o dia em uma linha, sinais de alerta e modo simples. O dia típico da semana 1 cabe em 12 toques.
- **Sinais de alerta** no onboarding e no registro, com cartão na tela Hoje.
- **Caminho** com as 17 aulas e o selo por caminho, **tela da aula** com o link da Kiwify e "Já assisti", **Resultados** com o resumo da semana e **Guia** com o conteúdo do curso.
- **Ajustes** completos: perfil, sintomas, ciclo, modo simples, meta de água, lembretes na agenda, tema, cópia, restaurar, trocar de celular, circunferência, como instalar, privacidade, sobre e apagar tudo.
- **Lembretes de agenda** com os dois botões ("Agenda do iPhone" e "Google Agenda") e a função da Netlify para o iPhone com o app instalado.
- **Modo demonstração** inicial (`?demo=1` e `?demo=plano`), com dados realistas num banco separado.
- **Testes**: 129 testes (cálculos, banco, migração, cópia, componentes e voz da interface).

### Próxima fase

Fase 2 · Processo: tarefas das 17 aulas, plano de 21 dias completo com semana zero, leitura da semana, reavaliação, cenário, plano mínimo, revisão do mês, modo crise, próximo passo completo e verificações automáticas.
