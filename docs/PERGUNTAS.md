# Perguntas e decisões

Este arquivo reúne o que precisa da tua confirmação e as decisões que tomei sozinho para seguir em frente. Ele é atualizado a cada fase.

## Pontos para eu confirmar (seção 9.17 da especificação)

O app já funciona com as escolhas abaixo. Você confirma ou corrige depois.

- **Diarreia:** a tarefa da aula 6 na Kiwify fala em procurar atendimento se a diarreia passar de dois dias sem melhorar; o caderno e o roteiro da aula 6 falam em duas semanas (diarreia crônica). O app mostra os dois (seção 7.13), sem contradição: dois dias sem melhora pedem atendimento, e duas semanas é o critério de diarreia crônica.
- **Lista de FODMAPs:** está igual à do caderno. A conferência da coluna de alto teor contra a lâmina de referência ainda estava pendente (ameixa, pêssego, nectarina, damasco, cereja, figo; alho-poró, aspargos, cogumelo, ervilha, repolho, quiabo; castanha de caju e pistache; maltitol e isomalte; critério das leguminosas de baixo teor). Qualquer correção no caderno precisa ser repetida em `src/content`.
- **Tabela de teste da fase 2:** as porções de sorbitol e frutanos seguem o material da aula 12, que é mais detalhado que a página 22 do caderno. As porções de alho e cebola nos dias 2 e 3 não estão definidas no material.
- **Limiares da seção 7.0**, em especial "dia com sintoma" a partir da nota 4.
- **Código de acesso** provisório NAPRATICA.
- **Links da Kiwify** (área de membros e as 17 aulas).
- **Endereço definitivo** do app, antes de entregar o link às alunas.
- **Nome curto** na tela de início: "Modulação".

## Para você preencher

- **Links da Kiwify:** em `src/config.ts`, preencha `KIWIFY_AREA_URL` (área de membros) e `KIWIFY_AULA_URLS` (uma linha por aula, de 1 a 17). Enquanto estiverem vazios, a tela da aula mostra "Abra esta aula na área de membros da Kiwify".
- **Porções de alho e cebola nos dias 2 e 3 do teste de frutanos:** aparecem como `[TEXTO A DEFINIR]` no app (arquivo `src/content/fodmap.ts`).

## Conteúdo com dúvida

- **Sorbitol, dia 2 com ameixa:** a tabela diz "1 fatia fina ou meia ameixa, 1 fatia, 2 fatias ou 2 ameixas". O dia 2 só fala em "1 fatia" (que serve para abacate). Para quem testa com ameixa, a porção do dia 2 não está clara. O app mostra o texto da tabela como está.
- **Data da avaliação da fase 1:** a aula 12 diz "entre a semana 2 e a 4"; a seção 6.13 da especificação diz "padrão: fim da semana 4; permitido entre a semana 2 e a semana 6". O app usa o padrão de 4 semanas e permite escolher entre a semana 2 e a semana 6, e mostra o texto da aula como está.
- **Dia modelo de fibras:** calculando pela tabela por 100 g, a couve dá 1,55 g (o app mostra 1,6 g na ferramenta "Meu dia de fibras"), enquanto a tabela do caderno mostra 1,5 g. O total continua "27 g". No Guia, a tabela aparece exatamente como no caderno.

## Testes que dependem de um aparelho de verdade

- **"Agenda do iPhone":** não consigo testar o iPhone daqui. No Safari, o app gera o arquivo do lembrete no próprio aparelho. No app instalado no iPhone, ele usa a função da Netlify (`netlify/functions/agenda.mjs`), que recebe só o título, o horário e a repetição. Teste os dois casos (roteiro em `docs/teste-no-celular.md`). Se o arquivo gerado no aparelho também funcionar no app instalado, dá para desligar a função trocando `ICS_MODO` para `'local'` em `src/config.ts`. Se o Safari não abrir o lembrete, troque para `'funcao'`.
- **Lighthouse:** vou medir na Fase 4.

## Decisões que tomei sozinho

### Visual

- **Contraste dos tons de significado.** No tema claro, os tons de Bristol 1 e 2 (`#9A6A12`), 3 a 5 (`#4F7A5E`) e 6 e 7 (`#3F6E8C`) não passavam no AA (4,5:1) sobre o fundo blush. Escureci só o necessário: `#885D10`, `#476E54` e `#3D6B88`. O verde de sucesso acompanha o tom saudável. O tema escuro passou sem ajuste.
- **Cor da barra do sistema** (`theme_color`): areia `#FAF5F3` no tema claro e `#1C0F14` no escuro, para a barra do celular combinar com o fundo do app. O vinho fica no ícone e nos botões.
- **Fontes:** só o conjunto latino da Figtree (400, 500, 600 e 700) e da Instrument Serif (400), copiados para `src/assets/fonts`. Cobre todos os acentos do português.

### Técnica

- **Versões:** Vite 7, React 19, React Router 7, Dexie 4, Vitest 3.2, TypeScript 5.9, Playwright 1.63. Escolhi versões estáveis e conhecidas em vez das mais novas, para reduzir risco.
- **Navegadores antigos:** o app é compilado para funcionar no iPhone com iOS 15 em diante.
- **Testes:** ficam na pasta `tests/` (unidade e componentes) e `e2e/` (ponta a ponta), separados do código do app.

### Conteúdo e regras

- **Frases depois do registro:** uso em rodízio as frases da seção 8.3 que combinam com o momento de registrar. Deixei de fora as que só fazem sentido em outro contexto ("Em diarreia, primeiro a água, depois a comida.", "Sede já é atraso.", "Meta sem distribuição não se cumpre.", "Saber a hora de pedir ajuda faz parte do autocuidado.", "Registro que ninguém lê não serve para nada."). Elas aparecem nas telas certas (modo crise, água, leitura da semana, acompanhamento).
- **A volta depois da crise, etapa "Por último":** a especificação não diz quando começa. Como as outras etapas têm dois dias, a etapa "Por último" começa no dia 9 depois da melhora. O modo crise termina quando a aluna toca "Terminei a volta" nessa etapa, ou "Encerrar o modo crise" a qualquer momento.
- **Medidas da aula 8:** as sugestões são os três exemplos da aula (refeições menores, jantar 3 horas antes de deitar, cabeceira da cama elevada) e mais três frases curtas tiradas das regras do refluxo (água entre as refeições, comer devagar e mastigar bem, não deitar nas duas horas seguintes).
- **Meta proporcional nos hábitos que começam no meio da semana:** a meta é cinco dias de sete. Quando um hábito ficou ativo só parte da semana (por exemplo, uma tarefa que começou na quinta), a meta é proporcional aos dias em que ele esteve ativo (3 dias pedem 3). Nos blocos do plano, os hábitos ficam ativos os 7 dias, então a meta é sempre 5.
- **"Tua semana" em Resultados:** a semana em andamento conta só os dias até hoje, para não mostrar "2 de 7" quando só passaram 3 dias.
- **Restaurar na primeira vez:** quando o app ainda não tem nenhum registro, a restauração mostra um botão só ("Restaurar esta cópia"), porque substituir e juntar dão no mesmo. Com registros no aparelho, aparecem as duas opções.
- **"Não" depois de "Sim" no registro:** se a aluna marca "Sim", escolhe o Bristol e depois troca para "Não", o tipo fica guardado mas não conta em nenhuma conta (só vale quando "Você evacuou?" é "Sim"). Assim, se o toque foi sem querer, nada se perde.
- **"Pronto" sem responder "Você evacuou?":** o app avisa que o dia só conta como registrado com essa resposta e leva até a pergunta. Um segundo toque em "Pronto" sai assim mesmo, sem cobrança.
- **Horário dos lembretes:** o registro do dia e a leitura da semana usam o horário do registro escolhido pela aluna. Dia 1, dia 21 e as datas do protocolo low FODMAP usam 8h.
- **Seção nova no Guia:** "Registro e leitura da semana", que junta as seções 9.4 e 9.5 (material das aulas 3 e 16). A especificação não listava essa seção no Guia, mas as aulas apontam para esse material.
- **Segurança da página:** a política de conteúdo (`Content-Security-Policy`) ficou só com `'self'`, inclusive para estilos. Testei o app inteiro com essa política e não houve erro.
- **Modo demonstração:** além de `?demo=1` (24 dias, plano concluído, leituras, tarefa concluída e reavaliação), criei `?demo=plano`, com o plano em andamento na semana 3, para as capturas e para você ver o app no meio do processo.
- **Busca da lista de FODMAPs:** acrescentei termos de busca que levam à mesma entrada do caderno (por exemplo, "pão francês" e "pão de forma" levam a "pão francês e de forma"; "amêndoa" leva a "amêndoa em quantidade"). A classificação mostrada é sempre o nome da entrada como está no caderno. Não criei nenhuma classificação nova.
