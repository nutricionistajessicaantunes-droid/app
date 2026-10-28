# App Modulação Intestinal na Prática: especificação completa

Você vai construir, do zero, o aplicativo web (PWA) que acompanha o meu curso online. Leia este documento inteiro antes de escrever qualquer código. Ele é a fonte da verdade do projeto e vale para esta sessão e para as próximas.

## 0. Contexto

**Quem sou eu.** Jéssica Antunes, nutricionista (CRN2 21581D), com atuação em nutrição comportamental e esportiva. Atendo presencialmente em Palmeira das Missões e Ronda Alta (RS) e on-line.

**O curso.** "Modulação Intestinal na Prática", vendido na Kiwify por R$ 47, com acesso vitalício. São 17 aulas gravadas em 4 módulos, um caderno de 40 páginas e uma planilha. O curso ensina processo: entender o intestino, identificar o próprio caso, aplicar ajustes de rotina e manter o resultado, com registro diário, leitura semanal e um plano de 21 dias com reavaliação.

**O app.** Um companheiro do curso, instalado na tela de início do celular, que:
- guia a aluna em todas as etapas, mostrando sempre o que fazer hoje e qual é o próximo passo;
- recebe o registro do dia em menos de um minuto;
- faz todas as contas sozinho (leitura da semana, médias, tipo de Bristol mais frequente, hábitos cumpridos, meta de água, fibras, reavaliação do dia 21, testes do protocolo low FODMAP);
- mostra resultados e padrões usando o conhecimento do curso, em linguagem simples;
- transforma a tarefa de cada aula numa ferramenta interativa;
- guarda tudo com segurança no próprio celular, sem conta e sem servidor.

As aulas em vídeo continuam na Kiwify. O app abre a aula certa por link.

**Quem usa.** Principalmente mulheres de 25 a 55 anos, muitas vindas de anúncio pago (não me conhecem), com familiaridade variada com tecnologia, quase sempre pelo celular. O tema é íntimo e costuma dar vergonha. Muitas chegam ansiosas e cansadas de tentar sozinhas. O app precisa ser óbvio desde a primeira tela: ninguém pode ficar perdida.

**Prazo.** Publicado e testado até 05/11/2026. Trabalhe por fases (seção 12) e entregue primeiro o que é P0.

## 1. Como você deve trabalhar

1. **Primeira ação:** salve este documento inteiro, sem mudar nada, em `docs/especificacao.md` e faça commit. Nas próximas sessões, comece sempre lendo esse arquivo, o `docs/PERGUNTAS.md` e o `CHANGELOG.md`.
2. **Autonomia.** Não pare para perguntar. Quando algo não estiver definido aqui, escolha a opção mais simples e segura para a aluna, siga em frente e registre a decisão em `docs/PERGUNTAS.md` (seção "Decisões que tomei sozinho"). Só pare se for impossível continuar.
3. **Conteúdo clínico é sagrado.** Use exatamente os textos da seção 9. Não invente orientação, número, alimento, porção, sinal de alerta ou promessa. Se faltar algum conteúdo, coloque `[TEXTO A DEFINIR]` e liste em `docs/PERGUNTAS.md`.
4. **Textos de interface** (botões, avisos curtos, estados vazios, confirmações) você pode escrever, seguindo a seção 8. Liste todos os textos novos que você criar, com a tela onde aparecem, em `docs/textos-novos.md`, para eu revisar.
5. **Fases.** Ao fim de cada fase (seção 12): rode testes e build, gere capturas das telas principais em `docs/telas/` (390 x 844, tema claro e escuro), atualize o `CHANGELOG.md`, faça commit, atualize o pull request (item 9) e me escreva um resumo curto em português: o que ficou pronto, o que eu devo testar no celular e qual é a próxima fase. Depois do resumo, continue para a próxima fase sem esperar, a menos que eu peça para parar.
6. **Economia.** Prefira poucas dependências e bem conhecidas. Não reescreva arquivos grandes sem necessidade. Nunca pule os testes da lógica de cálculo.
7. **Idioma.** Código e nomes técnicos podem ficar em inglês. Tudo que a aluna vê, os commits, a documentação e as mensagens para mim ficam em português do Brasil.
8. **Repositório.** Se o repositório estiver vazio ou só com um README, crie o projeto na raiz. Se houver arquivos de outro projeto, crie o app na pasta `app/` e ajuste o `netlify.toml` para essa pasta.
9. **GitHub e Netlify.** Trabalhe na branch que o ambiente usar. No fim de cada fase, envie para o GitHub e abra (ou atualize) um pull request para a `main`. A Netlify gera um endereço de prévia para cada pull request, e é nele que eu testo no celular. Quando eu aprovar, faço o merge e a Netlify publica no endereço definitivo. No resumo da fase, mande o link do pull request e explique em uma linha como fazer o merge pelo celular.

## 2. Princípios do produto

Estes princípios vêm do curso e decidem qualquer dúvida de design.

1. **Um minuto por dia.** O registro diário precisa caber em um minuto, com toques em vez de digitação.
2. **Sempre um próximo passo.** Em qualquer tela importante, a aluna sabe o que fazer agora. A tela Hoje mostra no máximo quatro cartões, por prioridade.
3. **Padrão da semana acima do dia isolado.** Resultados são semanais. Um dia ruim nunca vira alarme, a não ser que seja sinal de alerta.
4. **Registro sem cobrança.** Nada de sequência quebrada, vermelho de erro, contagem de dias perdidos ou frase de culpa. Dia em branco fica em branco, sem julgamento. O app repete: "Falhou um dia? Anote mesmo assim. O dia em que você não cumpriu nada é o que mais ensina." Se registrar pesar, existe o modo simples (só Bristol e uma linha sobre o dia).
5. **Dois hábitos por vez, um ajuste por vez, meta de cinco dias em sete.**
6. **Segurança primeiro.** Sinais de alerta sempre visíveis e sempre levados a sério. O app nunca dá diagnóstico, nunca prescreve e nunca promete cura. Cardápios são modelos educativos. Low FODMAP é sempre temporário e em três fases. Probiótico depende da cepa.
7. **Privacidade total.** Os registros ficam só no celular da aluna. Sem conta, sem servidor, sem rastreamento, sem chamadas externas em segundo plano.
8. **Venda indireta.** O convite para consulta comigo aparece só em momentos certos (cenários 2 e 3 da reavaliação, sinais de que precisa de acompanhamento, ficha da consulta, fim do curso) e sempre depois de dizer que o conteúdo do curso funciona por conta própria. Nunca como pop-up, nunca como pressão.
9. **Este curso não é sobre emagrecer.** O peso entra só para calcular a meta de água e não aparece em nenhuma outra tela. Sem calorias, sem IMC. A circunferência abdominal, opcional, serve só para observar o inchaço.

## 3. Arquitetura técnica

### 3.1 Stack (decidido)

- Vite + React + TypeScript em modo `strict`.
- React Router com rotas carregadas sob demanda.
- Dexie (IndexedDB) com `dexie-react-hooks` (`useLiveQuery`) como única fonte de dados.
- `vite-plugin-pwa` (Workbox) para manifesto e service worker.
- `date-fns` com locale `ptBR` para datas.
- Fontes locais com `@fontsource` (Instrument Serif e Figtree), sem Google Fonts em tempo de execução.
- CSS com variáveis (tokens da seção 4) e CSS Modules. Sem framework de UI pesado.
- Ícones de linha leves (por exemplo `lucide-react`, importando só os usados).
- Gráficos em SVG próprio, simples e acessíveis. Sem biblioteca de gráficos.
- `zod` para validar a cópia de segurança na importação.
- PDF da ficha da consulta com `jspdf` carregado só nessa tela, com a fonte Figtree embutida para os acentos saírem certos.
- Testes: Vitest e Testing Library; Playwright com os perfis iPhone 13 e Pixel 7.
- ESLint e Prettier.

Sem backend. Em tempo de execução, o app não faz nenhuma requisição externa. Os únicos acessos externos são links que a aluna toca (Kiwify, WhatsApp, Instagram, Google Agenda).

### 3.2 Organização do código

```
src/
  config.ts            nome do app, links, código de acesso, limiares (seção 7.0)
  content/             todo o conteúdo do curso (seção 9), tipado, sem lógica
  logic/               funções puras de cálculo e regras (seção 7), 100% testadas
  db/                  Dexie, esquema, migrações, cópia de segurança
  features/            hoje, registro, caminho, tarefas, plano, leitura,
                       reavaliacao, resultados, guia, crise, fodmap, ficha,
                       alertas, ajustes, onboarding, instalacao
  ui/                  componentes base (botão, cartão, slider 0 a 10,
                       seletor de Bristol, chips, folha inferior, gráficos)
  styles/              tokens.css, base.css
```

Separe conteúdo (src/content) do motor (src/logic e src/features). Os próximos cursos (emagrecimento, GLP-1) vão reaproveitar o motor de registro, hábitos, plano e leitura semanal. Não construa nada genérico além do necessário agora, só mantenha essa separação.

### 3.3 Dados e persistência (crítico: nenhum registro pode se perder)

- Banco IndexedDB `modulacao-intestinal` via Dexie, com versão de esquema e migrações. Toda mudança de esquema tem migração e teste que prova que os dados antigos continuam lá.
- **Salvamento automático** a cada alteração (com debounce de 300 ms). A aluna nunca precisa apertar "salvar" para não perder. Mostre "Salvo" discreto, com `aria-live`.
- **Datas do dia** sempre como texto `AAAA-MM-DD` no fuso do aparelho. Proibido usar `toISOString().slice(0, 10)` para chave de dia (isso troca o dia à noite no Brasil). Crie `toDayKey(date)` e `fromDayKey(key)` em `src/logic/dates.ts` e teste com horário de 23h30.
- Peça `navigator.storage.persist()` depois do onboarding e mostre em Ajustes se o armazenamento está protegido.
- **Cópia de segurança.** Botão "Salvar uma cópia dos meus registros" gera o arquivo `modulacao-copia-AAAA-MM-DD.txt` (conteúdo em JSON, tipo `text/plain`) com versão do esquema, versão do app, data e todos os dados. Use `.txt` porque o Chrome do Android não compartilha arquivos `.json` pela Web Share API. No celular, compartilhe o arquivo pela Web Share API (confira antes com `navigator.canShare({ files })`) para a aluna mandar para ela mesma no WhatsApp, e-mail, Arquivos ou Drive. Sem suporte, faça o download. Texto de apoio: "Esse arquivo tem os teus registros de saúde. Guarde em lugar seguro e envie só para você."
- **Restaurar.** Escolher o arquivo (`.txt` ou `.json`), validar com zod, mostrar prévia (período e quantidade de dias registrados) e oferecer "Substituir tudo" ou "Juntar com o que já tenho" (por dia, vence a versão com `updatedAt` mais recente). Confirmação em duas etapas dentro da própria tela.
- **Lembrete de cópia:** cartão na tela Hoje quando a última cópia tem mais de 7 dias e existem pelo menos 3 dias registrados, e um convite ao fim de cada leitura da semana. Pode ser adiado por 7 dias.
- **Trocar de celular:** guia curto em Ajustes (salvar cópia, mandar para você, abrir o app no celular novo, restaurar).
- Se o IndexedDB não estiver disponível (modo privado), mostre um aviso fixo explicando que os registros não ficam salvos nesse modo e como abrir no navegador normal.
- **Proteção contra falhas:** um error boundary com tela amigável e o botão "Salvar uma cópia de emergência", que exporta direto do IndexedDB sem depender do estado do React.
- **Modo demonstração** (`?demo=1`): usa outro banco (`modulacao-demo`), gera 24 dias de dados realistas (com plano de 21 dias, leituras, uma tarefa concluída e uma reavaliação), mostra uma faixa fixa "Modo demonstração" com botão "Sair da demonstração". Serve para eu mostrar o app e para conferir os resultados. Nunca mistura com dados reais.

### 3.4 Instalação, navegadores e iPhone (crítico)

- Manifesto: `name` "Modulação Intestinal na Prática", `short_name` "Modulação", `lang` pt-BR, `start_url` "/?origem=app", `display` standalone, `orientation` portrait, cores do tema, ícones 192, 512, maskable e `apple-touch-icon` 180.
- Service worker com precache de tudo. O app inteiro funciona sem internet, menos os links externos (mostre "Você está sem internet. A aula abre quando a conexão voltar.").
- Atualização: quando houver versão nova, mostre "Nova versão disponível" com o botão "Atualizar". Nunca recarregue sozinho no meio de um registro.
- **No iPhone, o Safari e o app da tela de início têm armazenamentos separados**, e o Safari pode apagar dados de um site depois de sete dias de uso sem abrir aquele site. O app adicionado à tela de início tem contagem própria. Por isso:
  - iPhone no navegador (fora do modo standalone): a primeira tela, depois do código de acesso, é o guia de instalação em três passos, com desenhos dos ícones: tocar em Compartilhar, tocar em "Adicionar à Tela de Início", tocar em "Adicionar", e depois abrir pelo ícone novo. Ajuste o texto para Safari e para Chrome no iPhone. Opção secundária: "Usar no navegador mesmo assim", com aviso de que os registros podem se perder.
  - Se a aluna já tiver dados no navegador, mostre um aviso para salvar uma cópia antes de instalar. No onboarding do app instalado, ofereça "Já usei o app no navegador" para restaurar a cópia.
- **Navegadores dentro de outros apps** (Instagram, Facebook, o app da Kiwify se ele abrir links por dentro, e outros WebViews; no Android, user agent com `; wv)`; no iPhone, user agent sem "Safari"): tela "Abra no navegador" com os passos e o botão "Copiar link", que copia o endereço completo, com o código de acesso. Nesses navegadores os dados se perdem com facilidade. Antes dessa verificação, confira se o app já está instalado (`navigator.standalone` no iPhone ou `display-mode: standalone`), porque o app instalado no iPhone também não tem "Safari" no user agent e não pode cair nessa tela.
- **Android (Chrome):** use o evento `beforeinstallprompt` para o botão "Instalar o app". Sem o evento, mostre os passos (menu de três pontinhos, "Instalar app" ou "Adicionar à tela inicial"). Inclua o caso do Samsung Internet.
- **Computador:** funciona no navegador; instalar é opcional.
- Em Ajustes, a seção "Como instalar" fica sempre disponível.

### 3.5 Código de acesso (deterrente simples)

- `ACCESS_CODE_ENABLED = true` em `config.ts`. Guarde só o hash SHA-256 do código normalizado (minúsculas, sem acento, sem espaços). Código provisório: **NAPRATICA**. Crie o script `npm run gerar-codigo -- PALAVRA` que imprime o hash, para eu trocar depois.
- Desbloqueio pelo link `?acesso=PALAVRA` (é o link que vou colocar dentro da Kiwify) ou digitando o código. Depois de desbloqueado, fica salvo.
- A tela do código não aparece no app instalado (modo standalone), para a aluna do iPhone não precisar digitar duas vezes.
- Tela: marca do curso, "Digite o código que está na área de membros do curso", campo, botão "Entrar" e a ajuda "Onde encontro o código?" ("No módulo Materiais do curso, na Kiwify.").
- Explique no README que isso desencoraja o compartilhamento do link, mas não é segurança forte.

### 3.6 Lembretes sem servidor

Não use notificação push. Ofereça eventos de calendário, sempre com dois botões: "Agenda do iPhone" (arquivo `.ics` gerado no próprio app, com alarme na hora do evento) e "Google Agenda" (link `calendar.google.com/calendar/render?action=TEMPLATE` com `recur`). Eventos:
- registro do dia, no horário que a aluna escolheu, todos os dias por 60 dias;
- leitura da semana, no dia escolhido, toda semana;
- dia 1 e dia 21 do plano;
- data de avaliação da fase 1 do low FODMAP e data para testar de novo os gatilhos;
- revisão do mês, no dia escolhido, todo mês.

Teste os dois botões no iPhone, no Safari e no app instalado. Se no app instalado o `.ics` gerado no aparelho não abrir a tela do Calendário, crie uma Netlify Function sem estado que recebe só o título, o horário e a repetição (nunca dado de saúde) e devolve o `.ics` com `Content-Type: text/calendar`, aberta em nova aba. É a única exceção permitida à regra de não ter servidor. Registre o que funcionou em `docs/PERGUNTAS.md`.

Dentro do app, a tela Hoje mostra o que está pendente (registro de ontem, leitura da semana, cópia).

### 3.7 Publicação e endereço

- Hospedagem estática na Netlify. Crie `netlify.toml` com build `npm run build`, pasta `dist`, redirecionamento de rotas para `index.html` e cabeçalhos: Content-Security-Policy restrita a `'self'` (com `data:` e `blob:` para imagens e para o arquivo de cópia), `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, `Permissions-Policy` desligando câmera, microfone e localização, cache longo para arquivos com hash e sem cache para `index.html` e `sw.js`.
- **Endereço definitivo.** Os registros ficam presos ao endereço do site. Se o endereço mudar depois que as alunas começarem, elas abrem o app novo vazio. Escreva isso em destaque no README: o endereço precisa ser decidido antes de entregar o link às alunas, e qualquer mudança depois exige que cada aluna salve uma cópia e restaure. O endereço gratuito da Netlify (por exemplo `modulacao-intestinal.netlify.app`) pode ser o definitivo. Se eu quiser domínio próprio, ele precisa estar configurado antes.
- O README explica, passo a passo e para quem não é programadora, como ligar o repositório à Netlify (Add new site, Import from GitHub, escolher o repositório, confirmar build e pasta) e como cada atualização publica sozinha depois do merge do pull request.
- Prévias: cada pull request ganha um endereço de prévia na Netlify. Os dados de teste ficam presos a esse endereço e não passam para o definitivo. Isso é o esperado.

### 3.8 Privacidade, desempenho e acessibilidade

- Tela "Privacidade" em Ajustes: o que o app guarda, onde guarda (só neste aparelho), que eu não tenho acesso, que não há rastreamento, como apagar tudo e o cuidado com o arquivo de cópia.
- JavaScript inicial de até 250 KB comprimido. Fontes só com os caracteres latinos usados.
- WCAG 2.1 AA: áreas de toque de pelo menos 44 px, texto base de 16 px ou mais, contraste adequado nos dois temas, rótulos em todos os campos, foco visível, `prefers-reduced-motion` respeitado, layout que aguenta fonte grande do sistema, cor nunca como único sinal (Bristol sempre com número e nome).
- Metas no Lighthouse (celular): desempenho 90 ou mais, acessibilidade 95 ou mais, boas práticas 95 ou mais, PWA instalável.

## 4. Identidade visual

Use a mesma identidade do meu site e dos materiais do curso: vinho, blush e areia, com títulos em Instrument Serif e texto em Figtree. Calma, editorial, acolhedora, com muito respiro. Nada de visual genérico de app de saúde.

### 4.1 Tokens

```css
:root {
  --vinho: #6E2B3D; --vinho-forte: #521E2C; --vinho-fundo: #3B1420;
  --blush: #E8D6D3; --blush-claro: #F1E4E1; --areia: #FAF5F3; --papel: #FFFFFF;
  --tinta: #2B1A20; --tinta-media: #6B565B; --linha: #DCC9C6; --linha-fina: #EADCD9;
  --sobre-vinho: #F7ECE9; --sucesso: #4F7A5E;

  --texto: var(--tinta); --texto-secundario: var(--tinta-media);
  --fundo: var(--areia); --superficie: var(--papel);
  --borda: var(--linha); --borda-fina: var(--linha-fina);
  --acento: var(--vinho); --acento-texto: var(--sobre-vinho); --banda: var(--blush-claro);

  /* cores de significado, separadas do acento */
  --faixa-lenta: #9A6A12;     /* Bristol 1 e 2 */
  --faixa-saudavel: #4F7A5E;  /* Bristol 3, 4 e 5 */
  --faixa-rapida: #3F6E8C;    /* Bristol 6 e 7 */
  --alerta: #A12C2C;          /* sinais de alerta */

  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Figtree", ui-sans-serif, -apple-system, "Segoe UI", Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --texto: #F2E5E2; --texto-secundario: #BFA5A8; --fundo: #1C0F14; --superficie: #27151C;
    --borda: #4A2B36; --borda-fina: #35202A; --acento: #D08B9B; --acento-texto: #221218;
    --banda: #24131A; --sucesso: #7FB292;
    --faixa-lenta: #E0B25C; --faixa-saudavel: #7FB292; --faixa-rapida: #8DB6D1; --alerta: #F08A8A;
    color-scheme: dark;
  }
}
```

Confira o contraste de todas as combinações nos dois temas e ajuste os tons de significado se algum não passar no AA. Em Ajustes, a aluna pode escolher tema claro, escuro ou automático.

### 4.2 Tipografia e forma

- Títulos de tela em Instrument Serif. Todo o resto em Figtree (400, 500, 600, 700). Texto base de 17 px, altura de linha 1,5. Números com `tabular-nums`.
- Assinatura visual dos meus materiais: o "filete", um rótulo pequeno em caixa alta com espaçamento entre letras, seguido de uma linha fina (ex.: "SEMANA 2 · ALIMENTAÇÃO" e, ao lado, a linha fina). Use nos cabeçalhos de seção.
- Cartões com borda fina e raio de 10 px, sem sombra pesada. Botão principal vinho, largo, com 52 px de altura. Só um botão principal por tela.
- Barra de abas inferior fixa, respeitando `env(safe-area-inset-bottom)`.

### 4.3 Ilustrações e ícone

- **Escala de Bristol:** sete desenhos originais em SVG, simples e elegantes, em tom marrom suave, sem realismo e sem nada que cause nojo. Cada tipo aparece sempre com número, nome e faixa (cor e texto). Não copie desenhos de terceiros.
- **Ícone do app:** fundo vinho com um traço curvo contínuo em tom claro, discreto. Nada de desenho explícito de intestino, porque o ícone fica na tela de início da aluna. Gere 192, 512, versão maskable com área de segurança e `apple-touch-icon` 180. Tela de abertura em areia.

## 5. Modelo de dados

Use estes tipos como ponto de partida (pode refinar, mantendo os nomes de campo em inglês e as regras).

```ts
type DayKey = string; // 'AAAA-MM-DD', fuso do aparelho
type Path = 'preso' | 'solto' | 'gases_sii' | 'refluxo' | 'indefinido';
type Bristol = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type SymptomId = 'estufamento' | 'gases' | 'dor' | 'azia' | 'urgencia';
type TagId = 'dormi_mal' | 'estresse_alto' | 'comi_correndo' | 'comi_fora' | 'viagem'
  | 'pre_menstrual' | 'menstruada' | 'treinei' | 'bebi_pouca_agua' | 'dia_corrido';
type RedFlagId = 'sangue_ou_fezes_escuras' | 'febre' | 'perda_de_peso' | 'anemia'
  | 'dor_forte_noturna' | 'vomito_persistente' | 'diarreia_mais_de_2_semanas'
  | 'mudanca_duradoura' | 'inicio_depois_dos_50';

interface Profile {
  id: 'me';
  name?: string;
  path: Path;
  careFlags: { diagnosticoIntestinal?: boolean; medicacaoContinua?: boolean;
               gestanteOuAmamentando?: boolean; relacaoDificilComida?: boolean };
  weightKg?: number;            // só para a meta de água, nunca exibido fora dela
  waterGoalMl?: number;
  bathroomTime?: string;        // 'HH:mm'
  registerTime?: string;        // horário do lembrete do registro
  readingWeekday: number;       // 0 = domingo (padrão)
  simpleMode: boolean;
  trackedSymptoms: SymptomId[]; // padrão por caminho (seção 6.4)
  showCycleTags: boolean;       // padrão true
  theme: 'auto' | 'claro' | 'escuro';
  monthlyReviewDay?: number;    // 1 a 28
  abdominal?: { date: DayKey; cm: number }[]; // opcional
  courseStage: 'comecando' | 'aulas' | 'plano';
  createdAt: string; updatedAt: string;
}

interface DayRecord {
  date: DayKey;
  evacuated?: boolean;          // undefined = não respondeu (nunca tratar como "não")
  evacuationCount?: 1 | 2 | 3;  // 3 = três ou mais
  bristol?: Bristol;            // o tipo que mais apareceu no dia
  effort?: boolean;             // fiz esforço
  incomplete?: boolean;         // senti que não esvaziei
  symptoms?: Partial<Record<SymptomId, number>>; // 0 a 10; ausente = não registrado
  energy?: number;              // 0 a 10
  habits?: Record<string, boolean>; // id do hábito -> cumprido
  waterCups?: number;
  tags?: TagId[];
  note?: string;                // "o dia em uma linha"
  taskFields?: Record<string, unknown>; // campos da tarefa da aula ativa
  redFlags?: RedFlagId[];
  createdAt: string; updatedAt: string;
}

interface DiaryEntry {          // diário com horário (aula 7 e protocolo low FODMAP)
  id: string; date: DayKey; time: string; // 'HH:mm'
  kind: 'refeicao' | 'sintoma';
  foods?: string[];             // itens com sugestão automática da lista de FODMAPs
  text?: string;
  symptom?: { type: SymptomId | 'outro'; intensity: number };
  createdAt: string; updatedAt: string;
}

interface Habit {
  id: string; label: string; detail?: string;
  source: 'plano' | 'aula5' | 'aula8' | 'aula13' | 'plano_minimo' | 'ciclo';
  trigger?: string;             // "Depois que eu ___, eu ___"
  activeFrom: DayKey; activeTo?: DayKey;
}

interface LessonProgress {
  lessonId: number;             // 1 a 17
  watched: boolean; watchedAt?: string;
  task: { status: 'nao_iniciada' | 'em_andamento' | 'concluida';
          startDate?: DayKey; data: Record<string, unknown>; completedAt?: string };
}

interface PlanState {
  status: 'nao_iniciado' | 'semana_zero' | 'ativo' | 'reavaliacao' | 'concluido';
  semanaZero: Record<string, boolean>;
  day1?: DayKey;
  blocks: { theme: 1 | 2 | 3; start: DayKey; repeated: boolean }[]; // blocos de 7 dias
  reevaluation?: Reevaluation;
  minimumPlan?: string[];       // 3 hábitos
  cycles?: { start: DayKey; habitIds: string[] }[]; // novos ciclos depois do plano
}

interface WeeklyReading {
  id: string; start: DayKey; end: DayKey;
  context: 'livre' | 'plano';
  planBlockIndex?: number;
  computed: WeeklySummary;      // seção 7.4, congelado no momento da leitura
  commonNotes: string;          // pergunta 3
  keep: string; adjust: string; // pergunta 4, um ajuste só
  decision?: 'avancar' | 'repetir';
  createdAt: string;
}

interface FodmapProtocol {
  phase: 'planejamento' | 'fase1' | 'fase2' | 'fase3' | 'encerrado';
  acknowledgedCare?: boolean;   // confirmou acompanhamento quando havia alerta de cuidado
  phase1Start?: DayKey; evaluationDate?: DayKey;
  baseline?: number; responded?: boolean;
  tests: { group: 'lactose' | 'frutose' | 'sorbitol' | 'manitol' | 'frutanos' | 'galactanos';
           food: string; start?: DayKey; pauseDays: 2 | 3;
           days: { portion: string; score?: number; atypical?: boolean }[];
           baseline?: number;
           suggested?: 'liberado' | 'quantidade' | 'gatilho' | 'inconclusivo';
           result?: 'liberado' | 'quantidade' | 'gatilho' }[];
  retestDate?: DayKey;
}

interface CrisisState { active: boolean; startedAt?: DayKey; improvedAt?: DayKey; holdUntil?: DayKey }
interface ConsultForm { /* campos da seção 9.15, com autopreenchimento */ }
interface Meta { id: 'meta'; schemaVersion: number; unlocked?: boolean; lastBackupAt?: string;
                 onboardingDone?: boolean; dismissed?: Record<string, string> }
```

## 6. Telas e fluxos

### 6.1 Primeira vez

Ordem das telas, mostrando só o que se aplica:

1. **Navegador dentro de outro app** (seção 3.4): tela "Abra no navegador".
2. **Código de acesso** (seção 3.5), se ativo e ainda não desbloqueado.
3. **Instalação:** no iPhone fora do app instalado, o guia de instalação é a tela principal. No Android e no computador, sugestão com "Instalar o app" e "Agora não".
4. **Onboarding**, uma pergunta por tela, com indicador de progresso e botão voltar:
   - **Boas-vindas.** "Este é o app do curso Modulação Intestinal na Prática. Aqui você registra o teu dia em um minuto, faz as tarefas das aulas e vê o que os teus registros mostram." Logo abaixo: "Teus registros ficam só neste celular. Nem eu tenho acesso." Botão "Começar". Link "Já usei o app em outro celular ou no navegador" (abre a restauração da cópia).
   - **Nome.** "Como posso te chamar?" Opcional.
   - **Caminho.** "Qual é a tua queixa principal hoje?" Opções: Intestino preso; Intestino solto; Estufamento, gases ou intestino irritável; Refluxo ou gastrite; Ainda não sei. Nota: "Você pode mudar depois. As aulas do módulo 2 ajudam a identificar o teu caso."
   - **Antes de começar.** "Algum destes está acontecendo?" com a lista de sinais de alerta da seção 9.15 e a opção "Nenhum destes". Se marcar qualquer um, mostre a mensagem de alerta (seção 6.15) e deixe seguir. Na mesma tela, opcional: "Alguma destas situações vale para você?" (Tenho diagnóstico intestinal; Uso medicação contínua; Estou gestante ou amamentando; Tenho ou já tive uma relação difícil com a comida), com o texto "Nesses casos, o plano é adaptado com acompanhamento profissional."
   - **Onde você está no curso.** "Estou começando" / "Já assisti algumas aulas" (escolher a última assistida; as anteriores ficam marcadas) / "Já estou no plano de 21 dias" (escolher a data do dia 1, até 20 dias atrás).
   - **Quando registrar.** Horário do registro (padrão 21h30) com a sugestão da aula 16: "Escolha um momento fixo, de preferência à noite, e prenda o registro nele. Por exemplo: depois que eu escovar os dentes, eu registro." Dia da leitura da semana (padrão domingo; "Domingo à noite funciona bem para a maioria das pessoas."). Botões opcionais para colocar os lembretes na agenda.
   - **Fim.** "Pronto. Comece pelo registro de hoje." e vai para Hoje.

Só o caminho e os sinais de alerta pedem resposta ("Ainda não sei" e "Nenhum destes" contam como resposta). O resto pode ser pulado.

### 6.2 Navegação

Quatro abas fixas embaixo: **Hoje**, **Caminho**, **Resultados**, **Guia**. Ajustes pelo ícone de engrenagem no topo da tela Hoje. Toda tela interna tem botão voltar claro. Rotas com endereço próprio (por exemplo `/registro/2026-11-03`, `/aula/7`, `/guia/fodmap`) para eu poder linkar de dentro da Kiwify.

### 6.3 Hoje

Cabeçalho: "Oi, {nome}" (ou só "Oi"), a data por extenso ("terça, 3 de novembro") e um selo de contexto ("Plano · dia 5 de 21 · semana 1, base", "Aula 3 · tarefa, dia 2 de 7" ou "Manutenção").

Cartões, nesta ordem de prioridade, no máximo quatro visíveis e o resto em "Ver mais":

1. **Alerta** ativo (seção 6.15).
2. **Modo crise** ativo (seção 6.12).
3. **Registro de hoje.** Sem registro: botão principal "Registrar meu dia" e o texto "Leva um minuto". Com registro: resumo em chips (tipo de Bristol com nome, sintoma do dia, energia, hábitos x de y) e "Editar". Se ontem ficou sem registro e a aluna registrou algum dia nos últimos 7: link "Registrar ontem".
4. **Teus hábitos de hoje**, com toque direto (grava no registro do dia) e a água em copos quando houver meta: "5 de 8 copos · 3 de manhã, 3 à tarde, 2 antes de dormir · copo de cerca de 280 ml". Ao chegar na meta de copos, marque o hábito de água se ele estiver ativo (a aluna pode desmarcar).
5. **Teu próximo passo**, pelo algoritmo da seção 7.12.
6. **Leitura da semana** pendente.
7. **Cópia de segurança** pendente.

Os recados do plano (dia 4, começo da semana 2 e outros da seção 9.6) aparecem dentro do cartão do contexto, uma vez cada, com "Entendi".

Rodapé discreto: "Jéssica Antunes · Nutricionista · CRN2 21581D".

### 6.4 Registro do dia

Uma tela só, com blocos em sequência, controles grandes e salvamento automático.

- **Cabeçalho:** "Registro de hoje", "Registro de ontem" ou "Registro de 26/10", com setas para voltar até 30 dias. Datas futuras não são permitidas.
- **Intestino.** "Você evacuou?" [Sim] [Não]. Se Sim: "Quantas vezes?" [1] [2] [3 ou mais]; "Como estavam as fezes?" com o seletor de Bristol (os sete desenhos com número e nome) e a ajuda "Se teve mais de um tipo, marque o que mais apareceu."; os chips "Fiz esforço" e "Senti que não esvaziei"; o link "Como é cada tipo?" abre a Escala de Bristol numa folha inferior.
- **Sintomas, de 0 a 10.** Um controle deslizante grande por sintoma, com o número visível. Antes do primeiro toque o controle fica no estado "não registrado", sem número. Botão "Sem sintomas hoje" zera todos. Sintomas padrão por caminho: preso e indefinido (estufamento, gases, dor); solto e gases_sii (estufamento, gases, dor, urgência); refluxo (estufamento, gases, dor, azia). A aluna muda em Ajustes.
- **Energia e disposição, de 0 a 10.**
- **Hábitos de hoje.** Todos os hábitos ativos naquele dia (plano, tarefa, plano mínimo, ciclo), com a nota "A meta é cinco dias de sete."
- **Água.** Contador de copos, se houver meta.
- **O dia em uma linha.** Chips: Dormi mal, Estresse alto, Comi correndo, Comi fora, Viagem, Pré-menstrual, Menstruada, Treinei, Bebi pouca água, Dia corrido. Os chips do ciclo só aparecem com `showCycleTags`. Campo de uma linha com o exemplo "Ex.: dormi mal, almocei correndo no trabalho".
- **Tarefa da aula N**, quando houver tarefa ativa com campos diários (seção 6.6).
- No fim, o link discreto **"Notou algo preocupante?"**, que abre a lista de sinais de alerta.
- Botão **"Pronto"**. Mostra "Dia registrado." com uma frase do curso da seção 8.3 e volta para Hoje. Em seguida rode as verificações da seção 7.13.
- **Modo simples:** só "Você evacuou?", Bristol e "O dia em uma linha". Liga em Ajustes ou pelo link "Simplificar meu registro" no fim do registro, que mostra o texto da aula 16: "Se anotar começar a te deixar ansiosa, simplifique. Ficar só com o tipo de Bristol e uma linha sobre o dia já resolve. E se mesmo assim continuar pesado, pare de registrar e siga com os hábitos."
- O dia conta como registrado quando "Você evacuou?" foi respondida.

### 6.5 Caminho

- Topo com o progresso: aulas assistidas (x de 17) e a situação do plano.
- Bloco "Comece por aqui": como usar o app em quatro linhas e o lembrete de que o caderno continua valendo para quem gosta de papel.
- Os quatro módulos com as aulas (seção 9.2). Cada aula mostra número, título, estado (não assistida, assistida, tarefa em andamento, tarefa concluída) e o selo "Recomendada para o teu caso" ou "Opcional para o teu caso" (regra na seção 6.6).
- **Tela da aula:** título, descrição, "Ver a aula na Kiwify" (link de `config.ts`; sem link, abre a área de membros; sem nenhum link, mostra "Abra esta aula na área de membros da Kiwify"), "Já assisti", "Material desta aula" com atalhos para o Guia, e a tarefa com "Começar a tarefa", progresso ("Dia 2 de 7") e a tela de resultado no fim.
- Se a aluna começar uma tarefa de vários dias com outra em andamento: "Você já está com a tarefa da aula N. Duas coisas novas por vez funcionam melhor." com [Pausar a anterior] e [Fazer as duas].
- Abaixo dos módulos: "Plano de 21 dias", "Protocolo low FODMAP" (em destaque para gases_sii) e "Depois do plano".

### 6.6 Tarefas das aulas

Cada tarefa vira uma ferramenta. Os campos diários aparecem dentro do Registro do dia enquanto a tarefa estiver ativa. Ao fim do prazo, a aluna vê a tela de resultado com o que o app calculou e as perguntas da tarefa, já com sugestões que ela pode editar. Textos de instrução na seção 9.2.

| Aula | Tarefa | Duração | Configuração | Campos diários | Resultado automático e perguntas |
|---|---|---|---|---|---|
| 1 | 3 dias de observação | 3 dias | nenhuma | evacuou e Bristol, horas de sono, estresse 0 a 10, copos de água, o que comi | tabela dos 3 dias lado a lado; destaques do que se repetiu (ex.: sono abaixo de 6 h em 2 dias, estresse 7 ou mais, dias sem evacuar); pergunta "O que se repetiu?" |
| 2 | 3 dias de rotina de banheiro | 3 dias | horário da rotina | "Sentei?" sim ou não, evacuou e Bristol, o dia em uma linha | dias em que sentou, dias em que evacuou, tipos do período |
| 3 | 7 dias de registro | 7 dias | nenhuma | o registro do dia | tipo mais frequente e faixa; dias com desconforto; pergunta "O que esses dias tinham em comum?" com os fatores em comum (seção 7.5) |
| 4 | Uma fibra por dia | 7 dias | escolher 3 fibras da tabela de fibras | "Fibra do dia" (uma das 3) | para cada fibra, os tipos de Bristol dos dias em que ela entrou, com a nota "Sete dias são uma pista, ainda não são conclusão." |
| 5 | 3 mudanças por 7 dias | 7 dias | escolher até 3 mudanças (sugestões: água distribuída, rotina de banheiro, uma colher de linhaça por dia, ou escrever outra) | cumpri 1, 2, 3 (viram hábitos `aula5`) | tipo mais frequente; "A mudança mais fácil de manter" sugerida pela que teve mais dias |
| 6 | Kit de crise | sem prazo | checklist dos 5 itens e "Onde eu guardei o kit" | nenhum | conclui quando o checklist fica completo; botão "Se a crise vier" abre o modo crise |
| 7 | Diário de sintomas | 7 dias | nenhuma | entradas com horário: "+ Refeição" (alimentos com sugestão automática da lista de FODMAPs, e texto livre) e "+ Sintoma" (tipo e intensidade 0 a 10) | "Alimentos que apareceram antes do sintoma mais de uma vez" (seção 7.10), cada um com a classificação da lista de FODMAPs quando existir |
| 8 | 3 medidas por 7 dias | 7 dias | escolher 3 medidas (sugestões da seção 9.14, regras do refluxo) | cumpri 1, 2, 3 (hábitos `aula8`), "Teve sintoma?", "O que comi antes" | "O que apareceu antes do sintoma mais de uma vez" (seção 7.11) |
| 9 | Ficha para a consulta | sem prazo | abre a ficha (seção 6.14) | nenhum | conclui quando a ficha é salva |
| 10 | Água e fibra | sem prazo | calculadora de água e "Meu dia de fibras" | nenhum | conclui quando as duas são salvas |
| 11 | Prebiótico e fermentado | 7 dias | nenhuma | "Prebiótico do dia" e "Fermentado do dia" (listas da seção 9.10), gases e estufamento | gráfico de gases e estufamento nos 7 dias e as combinações usadas. Para gases_sii, esconda alho e cebola e mostre "Comece por aveia, kiwi e banana mais verde." |
| 12 | Calendário do protocolo | sem prazo | abre o planejamento do protocolo (seção 6.13) | nenhum | conclui quando o planejamento é salvo |
| 13 | Dois hábitos com gatilho | 7 dias | escolher 2 hábitos da tabela de implantação (seção 9.8) ou escrever outro; gatilho no formato "Depois que eu ___, eu ___"; "Onde você vai ver isso escrito?" | hábito 1 e hábito 2 (hábitos `aula13`) | dias de cada hábito; "Se os dois pegarem, você escolhe mais dois na semana seguinte." com o botão "Escolher mais dois" |
| 14 | Compra e preparos | sem prazo | checklist da lista base, os três preparos com o dia, "Tirei a foto do prato", "O que ficou parecido com o modelo", "O que faltou" | nenhum | conclui quando a aluna marca como feita. O app não guarda fotos. |
| 15 | Semana zero | sem prazo | abre a semana zero do plano (seção 6.7) | nenhum | conclui quando o plano começa |
| 16 | Registro e leitura da semana | 7 dias | gatilho do registro e dia da leitura | o registro do dia | conclui com a primeira leitura da semana salva |
| 17 | Reavaliação do dia 21 | no fim do plano | abre a reavaliação (seção 6.9) | nenhum | antes do fim do plano mostra "Disponível no fim do plano de 21 dias" |

**Selo por caminho.** Aula 5: recomendada para preso. Aula 6: recomendada para solto. Aulas 7 e 12: recomendadas para gases_sii. Aula 8: recomendada para refluxo. Nos outros caminhos, essas aulas aparecem como opcionais. Com caminho "indefinido", nenhuma tem selo. As demais aulas não levam selo, porque valem para todas.

**Bristol antes da aula 3.** Nas tarefas das aulas 1 e 2, o seletor de Bristol aparece com a nota "Você vai aprender a escala na aula 3. Por enquanto, escolha o desenho mais parecido com o teu dia."

### 6.7 Plano de 21 dias

**Estados:** não iniciado, semana zero, ativo, reavaliação, concluído.

**Semana zero** (aula 15 e página 9 do caderno): checklist de seis itens, com atalhos que marcam sozinhos quando a aluna conclui a ação:
1. "Defini onde vou registrar: no app ou nas folhas impressas do caderno."
2. "Calculei a minha meta de água" (abre a calculadora; marca ao salvar).
3. "Fiz a compra pela lista base da aula 14" (abre a lista).
4. "Deixei os três preparos prontos" (uma leguminosa cozida em quantidade, uma proteína desfiada e os legumes higienizados).
5. "Defini o horário da minha rotina de banheiro" (relógio; marca ao salvar).
6. "Marquei o dia 1 e o dia 21 no calendário" (escolher o dia 1; o dia 21 é o dia 1 mais 20 dias; botões de agenda).

Na mesma tela: "Meu caminho" com o ajuste do caminho (seção 9.6), as cinco regras e o aviso "Comece numa semana comum, sem viagem, festa ou mudança." Botão "Começar o plano em {data}". O dia 1 pode ser hoje, uma data futura ou até 6 dias atrás (para quem começou no papel). Itens não marcados não bloqueiam o início.

**Plano ativo.**
- O plano é uma lista de blocos de 7 dias. Começa com [tema 1, tema 2, tema 3] em sequência a partir do dia 1.
- Hábitos por tema, acumulando: tema 1 ativa os hábitos 1 e 2; tema 2 ativa de 1 a 4; tema 3 ativa de 1 a 6 (textos na seção 9.6). Hábitos de semanas futuras aparecem com cadeado e o texto da regra 3: "Não antecipe hábitos. Dois por semana, na ordem."
- O cartão do contexto mostra "Dia N", o tema da semana, os hábitos ativos e o ajuste do caminho para aquela semana.
- No fim de cada bloco, a leitura da semana do plano (seção 6.8). Se algum hábito ficou abaixo de cinco dias, o app recomenda repetir a semana (regra 5) e oferece "Repetir a semana" (botão principal) e "Avançar mesmo assim". Repetir insere um bloco do mesmo tema logo depois e empurra os seguintes em 7 dias.
- Sem leitura feita, o plano avança pela data e a leitura fica pendente na tela Hoje. Se a aluna fizer a leitura atrasada e escolher repetir, o bloco atual vira a repetição.
- Recados, uma vez cada: dia 4 do primeiro bloco ("o dia mais perigoso"), início do tema 2 (gases nos primeiros dias), início do tema 3, e "o que esperar" de cada semana (seção 9.6).
- Se a aluna ficar 5 dias ou mais sem registrar durante o plano, ao voltar: "Retome hoje. Falhou um dia, retoma no dia seguinte. Não existe recomeçar do zero." com a opção "Repetir esta semana".
- Quando o último bloco termina, o plano entra em reavaliação e a tela Hoje mostra "Tua reavaliação está pronta".

### 6.8 Leitura da semana

Cinco minutos, uma vez por semana. Abre pelo cartão da tela Hoje (no dia escolhido ou no fim de um bloco do plano) ou por Resultados.

- **Período.** No plano: o bloco de 7 dias. Fora do plano: os 7 dias que terminam no dia da leitura (com domingo, de segunda a domingo, como no caderno). Aberta à mão, os últimos 7 dias completos.
- **Pergunta 1. Quantos dias cumpri cada hábito?** Lista com "x de 7" e marca de meta quando chegar a 5. Se algum ficou abaixo de 5: "Abaixo de cinco dias, repita a semana antes de avançar. Repetir funciona melhor do que seguir com base frágil."
- **Pergunta 2. Qual foi o tipo de Bristol mais frequente?** Tipo com desenho, nome e faixa; distribuição dos tipos na semana; evacuações na semana; e "O padrão da semana é o que conta. O dia isolado não diz nada." Com alternância (seção 7.2): "Teve dia de fezes ressecadas e dia de fezes amolecidas na mesma semana." e, se acontecer em duas semanas seguidas, a nota do segundo grupo de sinais (seção 6.15).
- **Pergunta 3. Em que dias apareceu sintoma?** Lista dos dias com sintoma (seção 7.3), cada um com nota, chips do dia e a linha escrita, e os fatores em comum calculados (seção 7.5). Campo "O que esses dias tinham em comum?" já preenchido com a sugestão, editável. Se houver um padrão da seção 7.6, ele aparece aqui.
- **Pergunta 4. O que eu mantenho e o que eu ajusto?** Campo "Mantenho" sugerido com os hábitos que chegaram a 5 dias. Campo "Ajusto" com uma linha só e sugestões (o hábito com menos dias, o fator em comum mais forte). Texto: "Apenas um ajuste por vez, para saber a que atribuir o resultado."
- Dados insuficientes: com menos de 4 dias registrados, a leitura mostra o que tiver e avisa "Com poucos dias registrados, a leitura fica fraca. Vale olhar mesmo assim."
- Ao salvar: guarda o resumo calculado junto das respostas e convida a salvar a cópia de segurança.

### 6.9 Reavaliação, cenário, plano mínimo e manutenção

**Reavaliação do dia 21** (aula 17 e página 14 do caderno). "Compare a tua semana 1 com a tua semana 3, com dado e não com impressão." Tabela calculada (seção 7.7) comparando o primeiro bloco do tema 1 com o último bloco do tema 3:
- tipo de Bristol predominante;
- frequência semanal (quantas vezes);
- esforço e evacuação incompleta (dias com cada um);
- sintomas, média de 0 a 10;
- energia e disposição, média de 0 a 10;
- hábitos cumpridos: média de dias nas semanas 1, 2 e 3;
- circunferência abdominal, se medida no início e agora, com a nota "O objetivo aqui é observar o inchaço abdominal, e não avaliar o teu corpo. Este curso não é sobre emagrecer."
Com Bristol, use a frase da aula 17 quando couber: "Sair do tipo 1 ou 2 para o 3 ou 4 é uma mudança grande, mesmo que a frequência não tenha mudado."

**Cenário.** O app sugere o cenário pela regra da seção 7.8 ("Pelos teus registros, o cenário que mais combina é: Melhorou em parte. Você concorda?") e a aluna escolhe entre os três. Depois mostra o texto do cenário (seção 9.7):
- Melhorou bastante: manter os seis hábitos e, se quiser, um novo ciclo com dois hábitos novos.
- Melhorou em parte: trabalhar o que sobrou com o curso (para estufamento, o protocolo low FODMAP, com atalho) ou buscar atendimento individual.
- Não mudou quase nada: começa por "Isso não é falha tua." e explica as possibilidades. Se a média de hábitos cumpridos ficou abaixo de 4 dias, inclua a nota da aula 17: "Pode ser que a tua rotina, naquele momento, não permitiu aplicar o plano. Aí a conclusão é outra: o plano ainda não foi testado."
- Nos cenários 2 e 3, depois do texto e da frase "O conteúdo do curso é teu e funciona por conta própria.", o convite discreto: "Se quiser fazer esse acompanhamento comigo, atendo on-line e presencialmente em Palmeira das Missões e Ronda Alta." com o botão "Chamar no WhatsApp" e o atalho para a ficha da consulta.
- Em qualquer cenário: "Em qualquer um dos três, você terminou com três semanas de informação organizada sobre o teu próprio corpo."

**Plano mínimo** (página 16). Escolher três hábitos (os seis do plano ou escrever outro), com os exemplos por caminho. Escolher o "Dia da minha revisão do mês" (1 a 28) e colocar na agenda.

**Manutenção.** Depois do plano, a tela Hoje mostra os três hábitos do plano mínimo e o registro continua opcional (o app sugere o modo simples). No dia da revisão do mês, o cartão "Revisão do mês": resumo das últimas 4 semanas e dias de cada hábito do plano mínimo, com "Se um hábito caiu, retome apenas ele." Opção "Começar um novo ciclo": escolher no máximo dois hábitos novos, com blocos de 7 dias e leitura da semana.

**Fim do curso.** Ao concluir a reavaliação: tela de encerramento com o caminho percorrido nos quatro módulos, a frase "Constância vale mais do que intensidade." e o convite "Se o curso te ajudou, me conta o que mudou." com botões para WhatsApp e Instagram. É o único lugar do app com o emoji 🤍.

### 6.10 Resultados

- **Tua semana** (semana atual e anteriores, com seletor): Bristol mais frequente com faixa, evacuações, média de sintomas, média de energia, hábitos.
- **Gráficos em SVG**, legíveis nos dois temas, com texto alternativo:
  1. Bristol por dia, últimos 28 dias: um ponto por dia na altura do tipo, com as três faixas pintadas ao fundo e legenda; dia sem registro fica vazio.
  2. Sintomas e energia por semana, até 8 semanas.
  3. Dias de cada hábito por semana, com a linha da meta de 5.
  4. Evacuações por semana.
- **Padrões encontrados** (seção 7.6), cada um como "possível padrão", com os números e a orientação "Leve para a leitura da semana e decida um ajuste só." Sem dados suficientes: "Os padrões aparecem com três semanas de registro. Nenhum deles aparece em um dia."
- **Histórico:** leituras da semana, tarefas concluídas com os resultados, reavaliação, resultados do protocolo low FODMAP.
- Botões "Ficha para a consulta" e "Compartilhar resumo" (texto pela Web Share API, ou copiar).

### 6.11 Guia

Consulta rápida, offline, com busca no topo (procura em todo o Guia e na lista de FODMAPs). O conteúdo do caminho da aluna aparece primeiro; os outros ficam recolhidos.
- Escala de Bristol (seção 9.3).
- Plano de 21 dias: mapa, regras, caminhos, semana zero (seção 9.6).
- Água: calculadora e plano de água (seção 9.9).
- Fibras: tabela, dia modelo e a ferramenta "Meu dia de fibras" (seção 9.9).
- Prebióticos e probióticos (seção 9.10).
- O prato, a compra e o comer fora (seção 9.11).
- Rotina: roteiro da refeição, respiração antes de comer com o guia animado (círculo que cresce em 4 segundos e diminui em 6, por 6 ciclos, com versão sem animação para `prefers-reduced-motion`), plano de sono, hábitos com gatilho, tempo de resultado (seção 9.8).
- Lista de FODMAPs com busca ("maçã" mostra o grupo, alto teor e as trocas de baixo teor do mesmo grupo) e a seção "Use sem contar" (seção 9.12).
- Cardápios modelo dos quatro casos e gatilhos e substituições (seção 9.14), sempre com o aviso de modelo educativo.
- Diarreia: primeiro a água, kit de crise, volta depois da crise (seção 9.13), com o botão "Estou com diarreia agora".
- Sinais de alerta e quando procurar acompanhamento (seção 9.15).
- Avisos importantes (seção 9.16).
- Sobre a Jéssica e contato: nome, CRN, atendimento on-line e presencial, Instagram para dúvidas sobre o conteúdo do curso e WhatsApp para consulta.

### 6.12 Modo crise (diarreia)

- Liga pelo botão "Estou com diarreia agora" (Guia, tarefa da aula 6) ou pela sugestão automática da seção 7.13.
- Cartão fixo na tela Hoje: "Em diarreia, primeiro a água, depois a comida." Contador "Copos de líquido hoje" e a lista de hidratação (soro de reidratação oral em pequenos goles ao longo do dia, água de coco, caldos e sopas leves, sucos diluídos, isotônicos). Atalho para o cardápio da crise.
- Verificação de desidratação: "Você está com algum destes?" (sede intensa, fraqueza, boca muito seca, tontura, pouca urina ou urina escura). Qualquer um mostra o alerta para procurar atendimento.
- Mensagem de quando procurar atendimento (seção 9.13), sempre visível no modo crise.
- Quando o Bristol volta para 5 ou menos, ou a aluna toca "Melhorei", começa **A volta depois da crise**: o app conta os dias desde a melhora e mostra a etapa do dia (dias 1 e 2, 3 e 4, 5 e 6, dia 7 em diante, por último). Se aparecer tipo 6 ou 7 depois de começar uma etapa: "Segure a reintrodução por mais dois dias antes de tentar de novo." e a etapa fica parada por 2 dias.
- Termina quando a última etapa é concluída ou a aluna toca "Encerrar o modo crise".

### 6.13 Protocolo low FODMAP

- **Entrada:** "Como usar esta lista" e as três fases (seção 9.12). Se a aluna marcou relação difícil com a comida, gestação ou amamentação, ou diagnóstico intestinal, antes de começar aparece o aviso da seção 9.12 e o botão "Vou fazer com acompanhamento profissional". Só com essa confirmação o protocolo abre. Para quem não é do caminho gases_sii: "Esta parte é para quem tem estufamento, gases ou intestino irritável."
- **Planejamento** (tarefa da aula 12): data de início da fase 1, data da avaliação (padrão: fim da semana 4; permitido entre a semana 2 e a semana 6), alimento-teste de cada grupo na ordem sugerida, os três preparativos da aula 12 e os botões de agenda.
- **Fase 1:** contador "Fase 1 · dia 9 de 28", lembrete do que registrar todo dia (o que comeu, sintomas de 0 a 10, tipo de Bristol), atalho para a lista de FODMAPs e para o diário com horário.
- **Avaliação:** comparação automática (seção 7.9) e a pergunta "Os sintomas caíram de forma clara?" com a sugestão do app. Sim: segue para a fase 2. Não, com 4 semanas ou mais: "Encerre a fase 1, volte a comer normal e leve essa informação para uma consulta. Saber que não funcionou também é uma informação valiosa." Não, antes de 4 semanas: pode seguir até completar 4 semanas e avaliar de novo.
- **Fase 2:** um grupo por vez, na ordem. Cada grupo: três dias de teste com a porção do dia (tabela da seção 9.12) e 2 ou 3 dias de pausa. Em cada dia de teste: sintomas de 0 a 10 (estufamento, gases, dor, urgência), Bristol e "Foi um dia atípico?" (estresse, sono ruim, pré-menstrual). O app sugere a conclusão (seção 7.9) e a aluna confirma: Liberado, Só em quantidade menor ou Gatilho. Inconclusivo ou semana atípica: sugere repetir depois da pausa. O próximo grupo só começa depois da pausa, com a explicação "Um grupo por vez, para saber exatamente de quem foi o sintoma."
- **Fase 3:** a lista pessoal em três colunas (Liberado, Só em quantidade menor, Gatilho), a nota do efeito acumulativo e o lembrete na agenda para testar de novo os gatilhos daqui a 3 meses. Frase da aula 12: "a maior variedade possível com o menor sintoma possível".
- Os cinco erros mais comuns ficam visíveis em todas as fases.
- Os gatilhos e as quantidades entram automaticamente na ficha da consulta.

### 6.14 Ficha para a consulta

Formulário da página 23 a 28 do caderno (seção 9.15), com autopreenchimento a partir dos registros, sempre editável:
- Tipo de Bristol mais frequente nas últimas 3 semanas, alternância entre tipos ou padrão sempre igual.
- Para cada sintoma da ficha, vezes por semana e intensidade média (seção 7.3). Esforço e sensação de evacuação incompleta vêm dos chips do registro.
- "O que você já testou e o que mudou": rascunho com as tarefas concluídas e a reavaliação (ex.: "Plano de 21 dias: tipo de Bristol predominante foi de 2 para 4; sintomas de 6,1 para 3,0").
- "Alimentos que você identificou como gatilho": resultados da aula 7 confirmados e do protocolo low FODMAP.
- Sinais de alerta já marcados.
- A aluna completa: dados, história, medicamentos e suplementos (o quê, para quê, há quanto tempo), exames (exame e data), doença intestinal na família, perguntas.
- Saídas: "Gerar PDF" (A4, com a identidade do curso, a tabela das últimas 3 semanas e a lista "O que levar"), compartilhado pela Web Share API para a aluna salvar ou enviar; "Copiar texto"; e uma visualização para imprimir.
- Abaixo da ficha, fora do PDF: "Se quiser fazer essa consulta comigo, atendo on-line e presencialmente em Palmeira das Missões e Ronda Alta." com "Chamar no WhatsApp".

### 6.15 Sinais de alerta e acompanhamento

- **Onde aparecem:** onboarding, link "Notou algo preocupante?" no registro, verificação de desidratação do modo crise, ficha da consulta e as regras automáticas da seção 7.13.
- **Primeiro grupo** (pedem avaliação médica): cartão de alerta no topo da tela Hoje, com fundo de alerta e texto da seção 9.15: "Qualquer um deles pede avaliação médica, e não ajuste de cardápio. Isso não espera o fim do plano." Fica até a aluna tocar "Entendi" e volta se o sinal for marcado de novo. A data entra na ficha.
- **Segundo grupo** (pedem acompanhamento, sem urgência), detectados pela seção 7.13: cartão sem tom de alarme com a frase "Procurar ajuda não é fracasso. Saber a hora de pedir ajuda faz parte do autocuidado.", o atalho para a ficha e o convite para consulta. Aparece uma vez por detecção e fica guardado em Resultados.
- Nunca use linguagem de diagnóstico ("você tem"). Sempre "teus registros mostram".

### 6.16 Ajustes

Nome; caminho; sintomas acompanhados; marcadores do ciclo menstrual; modo simples; meta de água; horário do registro e dia da leitura (com botões de agenda); tema; dia da revisão do mês; circunferência abdominal (opcional, com a nota do curso); cópia de segurança (salvar, restaurar, data da última cópia, trocar de celular); armazenamento protegido; como instalar; privacidade; avisos importantes; sobre o app (versão e CHANGELOG resumido); "Apagar todos os meus dados" com confirmação em duas etapas dentro da tela.

## 7. Regras de cálculo

Tudo nesta seção vira função pura em `src/logic/`, com testes unitários usando os exemplos da seção 7.15. Os números de corte ficam em `config.ts`, com o nome e o valor abaixo, para eu poder ajustar depois.

### 7.0 Constantes

```ts
LIMIAR_DIA_COM_SINTOMA = 4        // nota do dia a partir da qual o dia conta como "com sintoma"
META_DIAS_HABITO = 5              // cinco dias de sete
MIN_DIAS_LEITURA = 4              // abaixo disso, a leitura avisa que está fraca
FATOR_COMUM_DIFERENCA = 0.30      // seção 7.5
PADRAO_MIN_DIAS_REGISTRADOS = 14  // seção 7.6
PADRAO_MIN_OCORRENCIAS = 3
PADRAO_DIFERENCA_PROPORCAO = 0.25
PADRAO_DIFERENCA_NOTA = 2
JANELA_SUSPEITOS_HORAS = 6        // seção 7.10
SINTOMA_SUSPEITO_MIN = 4
FODMAP_AUMENTO_CLARO = 3          // seção 7.9
FODMAP_AUMENTO_LEVE = 2
FODMAP_QUEDA_PONTOS = 2
FODMAP_QUEDA_PROPORCAO = 0.7
REAV_QUEDA_SINTOMA = 2            // seção 7.8
REAV_SINTOMA_BAIXO = 3
REAV_ENERGIA_SUBIU = 1
REAV_ESFORCO_CAIU = 2
REAV_HABITOS_BAIXOS = 4
DIAS_SEM_EVACUAR_AVISO = 3
CRISE_SUGERIR_DIAS = 2
CRISE_SEM_MELHORA_DIAS = 2
DIARREIA_PERSISTENTE_DIAS = 14
ESTUFAMENTO_DIARIO = { nota: 4, diasNaSemana: 6, semanasSeguidas: 2 }
ALTERNANCIA_SEMANAS_SEGUIDAS = 2
ML_POR_KG = 35; COPOS_POR_DIA = 8; DISTRIBUICAO_COPOS = [3, 3, 2]
FIBRA_META_MIN = 25; FIBRA_META_MAX = 30
LEMBRETE_COPIA_DIAS = 7
```

### 7.1 Dias e semanas

- Chave do dia: `AAAA-MM-DD` no fuso do aparelho (seção 3.3).
- Semana livre: os 7 dias que terminam no dia da leitura. Semana do plano: o bloco de 7 dias.
- Dia sem registro é "sem dado". Nunca conte como "não evacuou" nem como nota zero.

### 7.2 Bristol e frequência

- Faixa: tipos 1 e 2 "constipação" (texto: "trânsito lento"); 3, 4 e 5 "faixa saudável"; 6 e 7 "trânsito acelerado".
- Tipo mais frequente: a moda entre os dias com tipo registrado. Empate devolve todos os empatados ("Os tipos 2 e 4 apareceram o mesmo número de vezes").
- Alternância na semana: pelo menos um dia com tipo 1 ou 2 e pelo menos um dia com tipo 6 ou 7.
- Evacuações na semana: soma de `evacuationCount` (Sim sem quantidade conta 1). Também: dias com evacuação.
- Dias seguidos sem evacuar: só dias registrados com "Não", em sequência.

### 7.3 Sintomas e energia

- Nota do dia: o maior valor entre os sintomas registrados naquele dia. Sem sintoma registrado, o dia fica sem nota.
- Média da semana: média das notas dos dias com nota, com uma casa decimal e vírgula.
- Dia com sintoma: nota igual ou maior que `LIMIAR_DIA_COM_SINTOMA`. Se nenhum dia chegar lá, mas houver notas de 1 a 3, mostre "dias com sintoma leve".
- Por sintoma (para a ficha): vezes por semana = média, por semana, dos dias com aquele sintoma maior que zero; intensidade = média dos valores maiores que zero.
- Energia: média dos dias registrados.

### 7.4 Resumo da semana

`summarizeWeek(records, habits, start, end)` devolve: dias registrados; para cada hábito ativo, dias cumpridos e dias em que estava ativo; tipo mais frequente, distribuição de 1 a 7, faixa e alternância; evacuações (dias e total); dias com esforço e dias com evacuação incompleta; média de sintomas; dias com sintoma (data, nota, chips, linha); média por sintoma; média de energia; fatores em comum (7.5); hábitos abaixo da meta. A leitura da semana congela esse resumo quando é salva.

### 7.5 Fatores em comum nos dias com sintoma

Para cada chip (e cada alimento do diário com horário, quando houver): conte em quantos dias com sintoma ele aparece e a proporção nos outros dias registrados. Mostre os que aparecem em pelo menos 2 dias com sintoma e cuja proporção nos dias com sintoma supera a dos outros dias em `FATOR_COMUM_DIFERENCA` ou mais (se não houver outros dias, basta aparecer em 2). Ordene pelo número de dias. Frase: "Nos dias com sintoma, apareceu mais: dormi mal (3 de 4 dias), comi correndo (2 de 4)."

### 7.6 Padrões que costumam aparecer (página 6 do caderno)

Só calcule com pelo menos `PADRAO_MIN_DIAS_REGISTRADOS` dias registrados. Cada padrão exige pelo menos `PADRAO_MIN_OCORRENCIAS` ocorrências do gatilho e compara com a linha de base (os outros dias registrados):
- **Noite mal dormida:** para cada dia com "Dormi mal", olhe o próprio dia e os dois seguintes. Resultado = algum desses dias com "Não" evacuou ou tipo 1 ou 2. Aparece se a taxa superar a da linha de base em `PADRAO_DIFERENCA_PROPORCAO`.
- **Refeição rápida:** dias com "Comi correndo"; resultado = estufamento 4 ou mais no mesmo dia.
- **Fim de semana:** sábados e domingos contra os outros dias; resultado = sem evacuação ou tipo fora de 3 a 5.
- **Ciclo menstrual:** dias com "Pré-menstrual" (resultado = sem evacuação ou tipo 1 ou 2) e dias com "Menstruada" (resultado = tipo 6 ou 7), cada um contra a linha de base.
- **Semana de estresse:** dias com "Estresse alto"; aparece se a média da nota de sintomas superar a dos outros dias em `PADRAO_DIFERENCA_NOTA`.
- **Viagem:** dias com "Viagem" e os dois seguintes; resultado = sem evacuação ou tipo 1 ou 2.

Cada padrão usa o texto do caderno com os números da aluna. Exemplo: "Noite mal dormida: o intestino trava, às vezes com 1 ou 2 dias de atraso. Nos teus registros, isso aconteceu depois de 3 das 4 noites mal dormidas. Nos outros dias, em 1 de cada 5."

### 7.7 Reavaliação

Compare o primeiro bloco do tema 1 (S1) com o último bloco do tema 3 (S3), e use os blocos do tema 2 para os hábitos da semana 2:
- tipo predominante (moda) de S1 e S3;
- evacuações por semana;
- dias com esforço e dias com evacuação incompleta;
- média de sintomas; média de energia;
- média de dias cumpridos por hábito em cada semana (ex.: semana 2 com quatro hábitos em 6, 5, 3 e 4 dias dá 4,5 dias);
- circunferência abdominal inicial e final, quando houver.
S1 ou S3 com menos de 4 dias registrados: mostre o que tiver e o aviso "Poucos dias registrados nesta semana. Use também a tua percepção."

### 7.8 Sugestão de cenário

Sinais, calculados com S1 e S3:
- `bristolMelhorou`: moda de S1 fora de 3 a 5 e moda de S3 dentro, ou moda de S3 mais perto de 4 do que a de S1;
- `bristolSaudavelS3`: moda de S3 entre 3 e 5;
- `sintomasCairam`: média de S1 menos média de S3 maior ou igual a `REAV_QUEDA_SINTOMA`;
- `sintomasBaixosS3`: média de S3 até `REAV_SINTOMA_BAIXO`;
- `energiaSubiu`: média de S3 menos média de S1 maior ou igual a `REAV_ENERGIA_SUBIU`;
- `esforcoCaiu`: dias com esforço ou evacuação incompleta caíram `REAV_ESFORCO_CAIU` ou mais.

Regra:
- **Melhorou bastante:** `bristolSaudavelS3` e `sintomasBaixosS3` (quando houver sintomas registrados) e pelo menos um entre `bristolMelhorou`, `sintomasCairam` e "S1 já estava na faixa saudável".
- **Não mudou quase nada:** nenhum entre `bristolMelhorou`, `sintomasCairam`, `energiaSubiu` e `esforcoCaiu`, e não se encaixa em "Melhorou bastante".
- **Melhorou em parte:** todos os outros casos.
Sinal sem dado conta como falso. A aluna sempre pode escolher outro cenário. Média de hábitos abaixo de `REAV_HABITOS_BAIXOS` acrescenta a nota do plano não testado (seção 6.9).

### 7.9 Protocolo low FODMAP

- **Linha de base da fase 1:** média das notas diárias dos 7 dias anteriores ao início. Sem esses dados, média dos 3 primeiros dias da fase 1.
- **Avaliação da fase 1:** compare a linha de base com a média dos últimos 7 dias. Sugestão "Sim, caíram de forma clara" quando a queda é de pelo menos `FODMAP_QUEDA_PONTOS` e a média atual fica em até `FODMAP_QUEDA_PROPORCAO` da linha de base. Caso contrário, "Não ficou claro".
- **Linha de base de cada teste:** média das notas dos dias de pausa antes do teste (para o primeiro grupo, os 3 últimos dias da fase 1).
- **Aumento de cada dia de teste:** nota do dia menos a linha de base.
- **Conclusão sugerida:**
  - Gatilho: aumento de `FODMAP_AUMENTO_CLARO` ou mais no dia 1 ou no dia 2.
  - Só em quantidade menor: aumentos dos dias 1 e 2 até `FODMAP_AUMENTO_LEVE` e aumento do dia 3 de `FODMAP_AUMENTO_LEVE` ou mais.
  - Liberado: todos os aumentos até 1.
  - Inconclusivo: qualquer outro caso, ou algum dia de teste marcado como atípico. Sugere repetir o teste depois da pausa.
- A aluna confirma ou muda a conclusão.

### 7.10 Suspeitos do diário de sintomas (aula 7)

Para cada sintoma com intensidade de `SINTOMA_SUSPEITO_MIN` ou mais, pegue os alimentos das refeições do mesmo dia nas `JANELA_SUSPEITOS_HORAS` horas anteriores. Liste os alimentos que aparecem antes de sintoma em pelo menos 2 dias diferentes, com o contexto "apareceu antes de sintoma em 3 das 5 vezes em que você comeu". Compare nomes sem acento, sem diferença de maiúsculas e tolerando singular e plural. Cruze com a lista de FODMAPs e mostre "alto teor" ou "baixo teor" e o grupo, quando o alimento estiver na lista.

### 7.11 "O que comi antes" (aula 8)

Separe o texto por vírgula, ponto e vírgula e " e ", normalize como em 7.10 e conte os itens nos dias com sintoma. Mostre os que aparecem em 2 dias ou mais.

### 7.12 Teu próximo passo

Na ordem, o primeiro que se aplicar vira o cartão da tela Hoje. A tela Caminho mostra a lista completa.
1. Modo crise ativo: a etapa do dia (o próprio cartão do modo crise faz esse papel, sem repetir).
2. Plano em reavaliação: "Fazer a reavaliação do dia 21".
3. Leitura da semana pendente.
4. Plano ativo: "Hoje no plano" com os hábitos da semana.
5. Protocolo low FODMAP ativo: fase e dia.
6. Tarefa em andamento: "Tarefa da aula N, dia X de Y", ou "Ver o resultado da tarefa" quando o prazo termina.
7. Semana zero começada: "Semana zero: faltam X itens".
8. Próxima aula não assistida: "Próxima aula: N, título" com "Ver a aula" e "Já assisti". Depois de assistida, "Começar a tarefa".
9. Todas as aulas assistidas e plano não iniciado: "Preparar a semana zero".
10. Plano concluído: no dia da revisão do mês, "Revisão do mês"; nos outros dias, "Teu plano mínimo".

### 7.13 Verificações automáticas

Rodam depois de salvar um registro e ao abrir o app:
- Sinal de alerta marcado: cartão de alerta (primeiro grupo).
- Tipo 6 ou 7 em `CRISE_SUGERIR_DIAS` dias registrados seguidos, com o modo crise desligado: "Teus registros mostram fezes tipo 6 ou 7 há dois dias. Quer abrir o guia da crise?" com [Abrir] e [Agora não]. Recusada, não aparece de novo por 3 dias.
- Modo crise ativo e tipo ainda 6 ou 7 depois de `CRISE_SEM_MELHORA_DIAS` dias: "Se a diarreia não melhora em dois dias, procure atendimento." (texto da tarefa da aula 6).
- Tipo 6 ou 7 em todos os dias com evacuação dos últimos `DIARREIA_PERSISTENTE_DIAS` dias, com pelo menos 10 dias registrados: alerta "diarreia por mais de duas semanas".
- `DIAS_SEM_EVACUAR_AVISO` dias registrados seguidos com "Não": recado na tela Hoje: "Três dias sem evacuar ficam fora da faixa considerada normal, que vai de três vezes por dia a três vezes por semana. Reforce a água, a fibra e a rotina de banheiro. Se vier junto dor forte ou vômito persistente, procure atendimento."
- Segundo grupo (acompanhamento): estufamento de `ESTUFAMENTO_DIARIO.nota` ou mais em `diasNaSemana` dias de 7 por `semanasSeguidas` semanas seguidas ("estufamento diário"); alternância em `ALTERNANCIA_SEMANAS_SEGUIDAS` semanas seguidas ("alternância constante entre preso e solto"); caminho preso com plano concluído e moda de S3 em 1 ou 2 ("intestino preso que não responde a fibra, água e rotina"); cenário "Não mudou quase nada" ("sintomas que persistem mesmo aplicando o que você aprendeu").

### 7.14 Água e fibra

- **Água:** meta em ml = peso x 35 (sem arredondar a meta). Copo = meta dividida por 8, arredondada para múltiplo de 10 ml. Distribuição 3 de manhã, 3 à tarde e 2 antes de dormir. Aceite peso entre 30 e 300 kg. O aviso de condição renal ou cardíaca aparece sempre junto do resultado. Mostre também a conferência pela cor da urina.
- **Fibra:** gramas de fibra = valor por 100 g x gramas do alimento / 100. Itens com uma casa decimal, total do dia arredondado para inteiro. Faixas: abaixo de 25 g, entre 25 e 30 g (meta), acima de 30 g. Para os alimentos do dia modelo, ofereça a medida caseira da tabela (seção 9.9); para os outros, campo em gramas com atalhos de 50, 100 e 150 g. Botão "Carregar o dia modelo". Texto fixo: "Valores aproximados, por 100 g. Aumente a fibra aos poucos e sempre com água junto."

### 7.15 Exemplos que viram testes

- `toDayKey` de 03/11/2026 às 23h30 no fuso de São Paulo devolve `2026-11-03`.
- Bristol da semana [4, 4, 2, 4, 6, sem registro, 3]: moda 4, faixa saudável, alternância verdadeira, 6 dias com tipo.
- Bristol [2, 2, 4, 4]: moda [2, 4].
- Nota do dia com {estufamento 5, gases 2}: 5. Sem sintomas registrados: sem nota.
- Notas da semana [5, sem nota, 3, 4]: média 4,0.
- Notas [5, 2, 4, 0, 7]: dias com sintoma nas posições 1, 3 e 5.
- Hábito [sim, sim, não, sim, sim, sim, sem registro]: 5 dias, meta atingida.
- Água: 60 kg dá 2.100 ml e copo de 260 ml; 65 kg dá 2.275 ml e copo de 280 ml.
- Dia modelo de fibras, calculado pela tabela por 100 g: total exibido "27 g".
- Teste FODMAP com linha de base 2: [2, 3, 7] dá "Só em quantidade menor"; [6, 7, 8] dá "Gatilho"; [2, 2, 3] dá "Liberado"; [4, 2, 2] dá "Inconclusivo".
- Avaliação da fase 1: linha de base 6,0 e últimos 7 dias 3,5 dá "Sim, caíram de forma clara"; linha de base 6,0 e 5,0 dá "Não ficou claro".
- Cenário: S1 {moda 2, sintomas 6,1, energia 4,0, esforço 5} e S3 {moda 4, sintomas 2,5, energia 6,5, esforço 1} dá "Melhorou bastante". S1 {2; 6,0} e S3 {2; 5,5}, energia e esforço iguais, dá "Não mudou quase nada". S1 {2; 6,0} e S3 {4; 5,0} dá "Melhorou em parte".
- Plano com dia 1 em 02/11/2026 e repetição do tema 1: blocos [tema 1 em 02/11, tema 1 em 09/11, tema 2 em 16/11, tema 3 em 23/11], reavaliação a partir de 30/11.

## 8. Voz e escrita da interface

### 8.1 Regras

- Português do Brasil, conversado, direto e acolhedor, como uma nutricionista que vive a prática. Sem tom de professora e sem linguagem de sistema.
- "Você" como sujeito e "teu" e "tua" como possessivo. Nunca "seu" ou "sua". Os textos do caderno usam "seu" e "sua": converta para "teu" e "tua" ao transcrever.
- Frases curtas. Cada frase precisa ter função.
- Proibido: travessão e meia-risca (os caracteres Unicode U+2014 e U+2013); a construção "não é X, é Y" e "isso não é sobre..., é sobre..."; frases motivacionais prontas ("você consegue", "acredite", "jornada", "transformação"); exclamação; emoji (a única exceção é o 🤍 na tela de fim do curso); termos em inglês na interface ("backup", "check-in", "streak", "dashboard"); jargão sem explicação.
- Nunca use linguagem de diagnóstico ("você tem SII"). Use "teus registros mostram".
- O público é majoritariamente feminino. Prefira formas neutras e, quando não der, use o feminino, como o curso faz.
- Números com vírgula decimal, datas como "3 de novembro", horas como "21h30".
- Botões dizem exatamente o que acontece ("Registrar meu dia", "Salvar uma cópia", "Começar o plano em 9/11"). Mensagens de erro dizem o que houve e o que fazer.

### 8.2 Nomes fixos

Registro do dia · Leitura da semana · Plano de 21 dias · Semana zero · Reavaliação · Plano mínimo · Revisão do mês · Teu próximo passo · Cópia de segurança · Escala de Bristol · Ficha para a consulta · Modo crise · Protocolo low FODMAP · Meu dia de fibras · Meta de água.

### 8.3 Frases do curso para reaproveitar

Use estas frases na mensagem depois do registro (uma por vez, em rodízio), em estados vazios e nos recados. Elas são minhas e já estão aprovadas:
- "Falhou um dia? Anote mesmo assim. O dia em que você não cumpriu nada é o que mais ensina."
- "Um dia isolado não diz nada. O padrão da semana é o que conta."
- "Apenas um ajuste por vez, para saber a que atribuir o resultado."
- "A meta é cinco dias de sete. Perfeição não é requisito."
- "Falhou um dia, retoma no dia seguinte. Não existe recomeçar do zero."
- "Dois hábitos que você mantém valem mais do que quinze que você abandona."
- "Meta sem distribuição não se cumpre."
- "Sede já é atraso."
- "Em diarreia, primeiro a água, depois a comida."
- "Três semanas de registro transformam memória em dado."
- "Registro que ninguém lê não serve para nada."
- "Qualidade vale mais do que frequência."
- "Ambiente resolve o que a força de vontade não resolve."
- "Saber a hora de pedir ajuda faz parte do autocuidado."
- "Constância vale mais do que intensidade."

## 9. Conteúdo do curso (fonte da verdade)

Transcreva para `src/content/` exatamente como está aqui. Onde o texto citar página do caderno, o app troca por um atalho para a tela correspondente e pode manter "(página N do caderno)" como informação secundária.

### 9.1 Identidade e contatos (vão para `config.ts`)

- Curso: Modulação Intestinal na Prática.
- Assinatura: Jéssica Antunes · Nutricionista · CRN2 21581D.
- Atendimento: on-line (Google Meet) e presencial em Palmeira das Missões (R. Pinheiro Machado, 678) e Ronda Alta (R. 15 de Novembro, 667, Centro).
- WhatsApp para consulta: `https://wa.me/5554991929487?text=` com a mensagem "Oi, Nutri, sou aluna do curso Modulação Intestinal na Prática e gostaria de saber sobre a consulta." Mostre também o número (54) 99192-9487 como texto selecionável.
- Instagram: @nutri.jessicaantunes (`https://instagram.com/nutri.jessicaantunes`), com o texto "Dúvidas sobre o conteúdo do curso, me chame no Instagram."
- Kiwify: `KIWIFY_AREA_URL` e `KIWIFY_AULA_URLS` (1 a 17) ficam vazios para eu preencher. Liste isso em `docs/PERGUNTAS.md`.
- Código de acesso provisório: NAPRATICA.

### 9.2 Módulos e aulas

**Módulo 1 · Entenda o teu intestino** (aulas 1 a 4) · **Módulo 2 · Identifique o teu caso** (aulas 5 a 9) · **Módulo 3 · Modulação na prática** (aulas 10 a 14) · **Módulo 4 · Plano de 21 dias** (aulas 15 a 17).

**Aula 1 · Intestino, o nosso segundo cérebro.** Descrição: "Por que o intestino tem uma rede de neurônios própria, como ela conversa com o teu cérebro nos dois sentidos e por que isso muda a forma de cuidar dele. Aqui você entende que cuidar do intestino envolve rotina e não só lista de alimento." Material: nenhum. Tarefa, 3 dias de observação: "Anote uma vez por dia, de preferência à noite." Campos: como estavam as fezes, horas de sono, estresse do dia de 0 a 10, copos de água, o que comi. No fim: "O que se repetiu?"

**Aula 2 · Como o intestino funciona, da boca até o banheiro.** Descrição: "O caminho completo do alimento, etapa por etapa, com cada sintoma que você já sentiu ligado ao lugar onde ele aparece. Você descobre em que ponto do processo o teu desconforto nasce e por que segurar a vontade resseca as fezes." Material: nenhum. Tarefa, 3 dias de rotina de banheiro: "Depois do café da manhã, sente no vaso de 10 a 15 minutos. Sem pressa e sem celular. Não force nada. Se vier, veio. Se não vier, tudo bem." Campos: sentei, evacuei, como estavam as fezes, como foi o dia.

**Aula 3 · Escala de Bristol, como está o teu intestino hoje.** Descrição: "A escala usada em consultório para classificar as fezes em sete tipos, o que cada tipo indica sobre o trânsito intestinal e quais sinais pedem avaliação. Aqui você aprende a ler uma informação que o teu corpo te dá todo dia." Material: Escala de Bristol, registro e leitura da semana. Tarefa, 7 dias de registro: "Tipo de Bristol de 1 a 7." Campos: evacuei, tipo, o dia em uma linha. No fim: tipo que mais apareceu, dias com desconforto, o que esses dias tinham em comum.

**Aula 4 · Disbiose, quando a microbiota sai do equilíbrio.** Descrição: "O que é disbiose, como ela é avaliada, o que danifica a barreira intestinal e o que ajuda a reequilibrar esse ambiente. Você sai sabendo reconhecer promessa exagerada sobre disbiose na internet." Material: tabela de fibras. Tarefa, uma fibra por dia: "Escolha três fibras na tabela de fibras." Campos: fibra do dia, tipo de Bristol.

**Aula 5 · Intestino preso.** Descrição: "Os critérios de constipação, as causas que estão na tua rotina e as mudanças que mais costumam ajudar. A diferença entre fibra solúvel e insolúvel, como combinar fibra com água e como organizar a rotina de banheiro." Material: cardápio do intestino preso. Tarefa, 3 mudanças por 7 dias: "Só três, as que mais cabem na tua rotina. Exemplo: água, rotina de banheiro e uma colher de linhaça por dia." Campos: cumpri 1, 2, 3, tipo de Bristol. No fim: tipo que mais apareceu, a mudança mais fácil de manter.

**Aula 6 · Intestino solto e diarreia.** Descrição: "A diferença entre diarreia aguda e crônica, como cuidar da hidratação, o que comer durante a crise e como reintroduzir alimentos sem reacender o quadro. Inclui os sinais de desidratação que pedem atenção." Material: cardápio da crise e a volta depois dela. Tarefa, kit de crise: "Monte hoje, enquanto você está bem." Itens: soro de reidratação oral, um sachê na gaveta; arroz branco; cenoura; banana; base para caldo leve: batata, abobrinha, frango. Campo "Onde eu guardei o kit". "Se a crise vier, anote: data, tipo de Bristol durante a crise, copos de líquido no dia, boca seca, tontura ou pouco xixi, tipo de Bristol nos dias seguintes." Aviso: "Procure atendimento se tiver sangue nas fezes, febre alta, vômito que impede de beber líquido ou se a diarreia passar de dois dias sem melhorar."

**Aula 7 · Gases, estufamento e Síndrome do Intestino Irritável.** Descrição: "O que é SII, o que são FODMAPs e como funciona o protocolo de baixo FODMAP, com a ressalva de que ele é temporário e precisa de acompanhamento. Você aprende a diferenciar gases comuns de SII e a identificar os teus gatilhos." Material: lista de FODMAPs e cardápio de gases e SII. Tarefa, diário de sintomas de 7 dias: "Anote o que comeu e o que sentiu, com o horário de cada um. Sintoma de 0 a 10." No fim: alimentos que apareceram antes do sintoma mais de uma vez; marcar na lista de FODMAPs.

**Aula 8 · Refluxo e gastrite.** Descrição: "O que é cada um dos dois quadros, as causas, os hábitos de rotina que mais aliviam e os alimentos que costumam disparar sintoma. Aqui você entende por que mexer no volume e no horário costuma ajudar mais do que cortar alimento." Material: cardápio de refluxo e gatilhos. Tarefa, 3 medidas por 7 dias: "As três mais fáceis de encaixar na tua rotina. Exemplo: refeições menores, jantar 3 horas antes de deitar e cabeceira da cama elevada." Campos: cumpri 1, 2, 3, teve sintoma, o que comi antes. No fim: o que apareceu antes do sintoma mais de uma vez.

**Aula 9 · Sinais de alerta e casos que precisam de acompanhamento.** Descrição: "SIBO, IMO, doenças inflamatórias intestinais e diverticulite explicadas de forma simples e os sinais que mostram quando o teu caso sai do alcance do autocuidado. É a aula que te ensina a chegar preparada numa consulta." Material: preparação para a consulta. Tarefa, ficha para a consulta: "Preencha em casa olhando o teu registro e mostre no começo da consulta."

**Aula 10 · Fibras e água do jeito certo.** Descrição: "Sai do conceito e vai para a conta. Quanta fibra tem em cada alimento, como fechar a meta do dia com comida comum e como calcular e distribuir a tua meta de água ao longo do dia." Material: meta de água e tabela de fibras. Tarefa, água e fibra: minha água (peso x 35, copos de manhã, à tarde e antes de dormir) e meu dia de fibras (café da manhã, lanche da manhã, almoço, lanche da tarde, jantar, total com meta de 25 a 30 g). Aviso: "Quem tem condição renal ou cardíaca precisa de orientação individual sobre a quantidade de água."

**Aula 11 · Prebióticos, probióticos e simbióticos.** Descrição: "A diferença entre os três, as fontes alimentares de cada um e como montar combinações simbióticas no dia a dia. Inclui como ler o rótulo do iogurte e o que os estudos permitem afirmar sobre suplemento." Material: prebióticos e probióticos. Tarefa, 7 dias de prebiótico e fermentado: "Uma fonte prebiótica e uma fermentada por dia. Comece com meia porção. Se você tem intestino irritável, deixe alho e cebola de fora nessa fase." Campos: prebiótico, fermentado, gases ou estufamento de 0 a 10.

**Aula 12 · Low FODMAP na prática, fase por fase.** Descrição: "Como executar o protocolo: conduzir a restrição com prazo, testar um grupo por vez e chegar na alimentação personalizada. Com a tabela de teste e o calendário do protocolo para preencher." Material: lista de FODMAPs e tabela de teste. Tarefa, calendário do protocolo: "Se você tem ou já teve uma relação difícil com a comida, faça este protocolo com acompanhamento." Fase 1: data de início, data da avaliação (entre a semana 2 e a 4), "Os sintomas caíram de forma clara?", "Se não caíram em 4 semanas, encerre a fase 1, volte a comer normal e leve essa informação para uma consulta." Fase 2: um grupo por semana, 3 dias de teste com porção crescente, depois 2 a 3 dias de pausa, sintoma de 0 a 10. Fase 3, o que eu aprendi: liberado, só em quantidade menor, gatilho.

**Aula 13 · A rotina que segura o resultado.** Descrição: "Mastigação, horários, sono, estresse e movimento virando técnica aplicável, com o roteiro da refeição em cinco passos. E como implantar isso sem sobrecarregar a tua semana." Material: nenhum novo, continue o registro. Tarefa, dois hábitos com gatilho por 7 dias: "Escreva o gatilho no formato: depois que eu faço X, eu faço Y."

**Aula 14 · Montando o prato e o cardápio do dia a dia.** Descrição: "Um método de montagem que funciona sem cardápio fechado, com adaptação por queixa, planejamento de semana, lista de compras base e o que fazer quando você come fora." Material: o prato, a lista de compras e o comer fora. Tarefa, compra e preparos. Lista base: leguminosas, ovos, proteína animal, arroz, batata ou mandioca, aveia, uma semente, frutas, folhas, legumes, iogurte natural, azeite. Os três preparos, com o dia: uma leguminosa cozida e congelada em porções; uma proteína desfiada ou pronta; legumes e folhas higienizados. A foto do prato: tirei a foto, o que ficou parecido com o modelo, o que faltou.

**Aula 15 · Como usar o plano de 21 dias.** Descrição: "A lógica do plano, o ajuste por queixa e as regras que evitam o abandono no meio do caminho. Como escolher a data de início e preparar a semana zero." Material: o plano de 21 dias. Tarefa: semana zero, meu caminho e os hábitos das três semanas.

**Aula 16 · Checklist diário e diário intestinal.** Descrição: "Como registrar em dois minutos por dia e, principalmente, como ler o que foi registrado. A leitura semanal em quatro perguntas e os padrões que costumam aparecer." Material: registro, leitura da semana e padrões. Tarefa: registrar sete dias seguidos e fazer a primeira leitura da semana, com o gatilho do registro e o dia da leitura definidos.

**Aula 17 · Reavaliação e próximos passos.** Descrição: "A reavaliação do dia 21 comparando com o teu ponto de partida, os três cenários possíveis e o que fazer em cada um. E como manter o resultado depois que o plano acaba." Material: reavaliação, cenários e plano mínimo. Tarefa: reavaliação, meu cenário, meu plano mínimo e o dia da revisão do mês.

### 9.3 Escala de Bristol

| Tipo | Nome | Descrição | Faixa |
|---|---|---|---|
| 1 | Bolinhas duras | Separadas, difíceis de sair. É o extremo da constipação. | constipação |
| 2 | Linguiça encaroçada | Com pequenas bolinhas grudadas. Também é constipação. | constipação |
| 3 | Linguiça com rachaduras | Rachaduras na superfície. Já entra na faixa saudável. | saudável |
| 4 | Lisa e macia | Formato de salsicha. É o tipo considerado ideal. (selo "tipo ideal") | saudável |
| 5 | Pedaços macios | Bordas bem definidas, fáceis de sair. | saudável |
| 6 | Massa pastosa | Bordas irregulares. O trânsito já está acelerado. | acelerado |
| 7 | Totalmente líquida | Sem pedaços sólidos. É a diarreia. | acelerado |

- "Faixa saudável: tipos 3, 4 e 5. Tipos 1 e 2 indicam constipação e tipos 6 e 7 indicam trânsito acelerado."
- "O tipo das fezes é o retrato da velocidade do teu intestino."
- "A faixa considerada normal vai de três vezes por dia até três vezes por semana, desde que venha com conforto, sem esforço excessivo, sem dor e sem sensação de evacuação incompleta."
- "Qualidade vale mais do que frequência. Ir todo dia com muito esforço, em bolinhas, é pior do que ir dia sim, dia não, com fezes tipo 4 e sem sofrimento."
- "Ninguém tem tipo 4 todos os dias da vida. Um dia diferente não significa nada sozinho. O que a gente procura é padrão."

### 9.4 Registro e leitura da semana

- Campos do registro do dia (aula 16): hábitos da semana; evacuou hoje; tipo de Bristol de 1 a 7; sintomas de 0 a 10 (estufamento, gases, dor, azia, o que for o teu caso); o dia em uma linha (sono, estresse, comeu fora, ciclo menstrual, treino); energia e disposição de 0 a 10.
- "Falhou um dia? Anote mesmo assim. O dia em que você não cumpriu nada é o que mais ensina."
- Leitura da semana: "Cinco minutos, uma vez por semana, sempre no mesmo dia. É aqui que o registro vira informação."
  1. "Quantos dias cumpri cada hábito?" com "Abaixo de cinco dias, repita a semana antes de avançar."
  2. "Qual foi o tipo de Bristol mais frequente?" com "O padrão da semana é o que conta. O dia isolado não diz nada."
  3. "Em que dias apareceu sintoma?" com "E o que esses dias tinham em comum entre si."
  4. "O que eu mantenho e o que eu ajusto?" com "Apenas um ajuste por vez, para saber a que atribuir o resultado."
  - "Algum hábito ficou abaixo de cinco dias? Repita a semana antes de avançar. Repetir funciona melhor do que seguir com base frágil."
- Uso na consulta (aula 16): "Quando você leva três semanas de anotação para um atendimento, o profissional deixa de trabalhar com a tua memória e passa a trabalhar com dado."

### 9.5 Padrões que costumam aparecer

"Nenhum deles aparece em um dia. Todos aparecem em três semanas de registro."
- Noite mal dormida: o intestino trava, às vezes com 1 ou 2 dias de atraso.
- Refeição rápida: estufamento e sensação de peso logo na sequência.
- Fim de semana: rotina e horários diferentes desorganizam o funcionamento.
- Ciclo menstrual: mais preso antes da menstruação e mais solto quando ela chega. "Isso tem explicação hormonal e é esperado."
- Semana de estresse: piora mesmo mantendo a alimentação igual.
- Viagem: muda água, comida, horário e banheiro. O trânsito desacelera.
"Marcou um padrão? Leve para a leitura da semana, na pergunta 3, e decida um ajuste só."

### 9.6 Plano de 21 dias

- **Como funciona:** "São três semanas, com dois hábitos novos por semana. Os hábitos acumulam: na semana 2 você soma em vez de trocar. No dia 21 você tem seis hábitos ativos."
- **Por que 21 dias (aula 15):** "É tempo suficiente para o teu intestino mostrar resposta às mudanças e é um período que cabe na vida real. Três semanas você consegue enxergar do começo ao fim."
- **As cinco regras:**
  1. A meta é cinco dias de sete. Perfeição não é requisito.
  2. Falhou um dia, retoma no dia seguinte. Não existe recomeçar do zero.
  3. Não antecipe hábitos. Dois por semana, na ordem.
  4. Comece numa semana comum, sem viagem, festa ou mudança.
  5. Se um hábito não pegou, repita a semana antes de avançar.
  - "Anote inclusive o dia ruim. É o dia que mais ensina."
- **Caminhos:**
  - Intestino preso: "Reforce fibra e água desde a semana 1. A rotina de banheiro é o hábito mais importante do teu plano."
  - Intestino solto: "Entre com a fibra de forma mais suave na semana 2, prefira legumes cozidos e mantenha a hidratação como foco." E (aula 15): "Saindo de crise, faça a volta depois da crise antes de começar."
  - Estufamento, gases ou intestino irritável: "Cuide da porção das leguminosas e use a respiração antes das refeições desde a semana 1. A lista de FODMAPs foi feita para o teu caso." E (aula 15): "Se você já conhece teus gatilhos, mantenha as escolhas de baixo FODMAP dentro do plano."
  - Refluxo ou gastrite: "Some ao plano as regras de volume e horário: refeições menores e a última pelo menos 3 horas antes de deitar."
- **Semana zero:** "Faça estes seis itens antes do dia 1. Sem eles, o primeiro dia vira dia de compra e o plano começa devendo." Os três preparos: "uma leguminosa cozida em quantidade, uma proteína desfiada e os legumes higienizados."
- **Mapa das três semanas:**
  - Semana 1, base, 2 hábitos ativos: água distribuída no dia e rotina de banheiro depois do café.
  - Semana 2, alimentação, 4 hábitos ativos: uma leguminosa e uma fonte de fibra por dia, e o roteiro da refeição no almoço.
  - Semana 3, ajuste fino, 6 hábitos ativos: caminhada na maior parte dos dias e horário de dormir mais fixo.
  - "Os hábitos acumulam. Na semana 3 você está mantendo os seis, e não apenas os dois últimos."
- **Os seis hábitos** (rótulo curto, depois o texto completo):
  1. Água distribuída no dia: "Beba a tua meta ao longo do dia, em três copos pela manhã, três à tarde e dois antes de dormir. Um copo cheio ao acordar e um antes de cada refeição já resolve boa parte."
  2. Rotina de banheiro depois do café: "Reserve de 10 a 15 minutos depois do café da manhã, todos os dias no mesmo horário, sem pressa e sem celular. Apoie os pés num banquinho baixo, com os joelhos um pouco acima do quadril. Quando a vontade aparecer em outro momento, vá."
  - Nota da semana 1: "Por que esses dois primeiro? Porque são os que dão resultado mais rápido e não dependem de mudar o que você come."
  3. Uma leguminosa e uma fonte de fibra: "Inclua uma leguminosa por dia, como feijão, lentilha, grão-de-bico ou ervilha, e mais uma fonte de fibra, como uma colher de sopa de aveia, linhaça ou chia, ou uma fruta com casca."
  4. Roteiro da refeição no almoço: "No almoço, aplique os cinco passos: sente, tire a tela, pouse o talher entre as garfadas, mastigue até virar papa e mire em 20 minutos."
  - Nota da semana 2: "É normal sentir um pouco mais de gases nos primeiros dias. Se ficar desconfortável, diminua a quantidade e aumente mais devagar. Lembre que fibra sem água piora."
  5. Caminhada de 20 a 30 minutos: "Caminhada de 20 a 30 minutos na maior parte dos dias, ou 10 minutos depois das refeições principais. Não precisa de academia."
  6. Horário de dormir mais fixo: "Horário de dormir mais ou menos fixo, inclusive no fim de semana, tela longe na última meia hora e nada de café depois do meio da tarde."
  - Nota da semana 3: "Esses dois dão resultado mais sutil no curto prazo e são os que mais sustentam o resultado no longo prazo."
- **O que esperar (aula 15):**
  - Semana 1: "Muita gente já percebe diferença na facilidade de evacuar. É a semana de menor esforço e de resultado mais rápido."
  - Semana 2: "Você pode sentir um pouco mais de gases nos primeiros dias. Isso é esperado e passa conforme o intestino se adapta. Se estiver muito desconfortável, diminua a quantidade e aumente mais devagar."
  - Semana 3: "O resultado é mais sutil no curto prazo e é o que mais sustenta o longo prazo. É também quando as anotações começam a mostrar padrão de verdade."
  - Dia 4: "O dia mais perigoso do plano é o quarto ou quinto dia. É quando a novidade passa e o cansaço aparece. Se você chegar no dia 7 com o plano em pé, a chance de terminar é muito alta."

### 9.7 Reavaliação, cenários e plano mínimo

- "Compare a tua semana 1 com a tua semana 3, com dado e não com impressão."
- O que comparar: tipo de Bristol predominante; frequência semanal; esforço e evacuação incompleta; sintomas, média de 0 a 10; energia e disposição, média de 0 a 10; hábitos cumpridos nas semanas 1, 2 e 3, quantos dias em média.
- "Se você usou fotos ou circunferência abdominal, compare também. O objetivo ali é observar o inchaço abdominal." O app não guarda fotos.
- **Cenários:**
  - Melhorou bastante: "Mantenha os seis hábitos. Se quiser, inicie um novo ciclo com dois hábitos novos." (aula 17: fezes na faixa de 3 a 5, frequência confortável, menos esforço e menos sintoma.)
  - Melhorou em parte: "Trabalhe o que sobrou com o conteúdo do curso, ou busque atendimento individual para essa parte." (aula 17: por exemplo, o protocolo low FODMAP se o estufamento é o problema.)
  - Não mudou quase nada: "Isso não é falha tua. Pode ser um quadro que precisa de diagnóstico, uma causa não alimentar, como medicação ou tireoide, ou uma rotina que não permitiu aplicar o plano. Leve o teu registro e a ficha para a consulta."
  - "Em qualquer um dos três, você terminou com três semanas de informação organizada sobre o teu próprio corpo."
- **Plano mínimo:** "Escolha os três hábitos que você mantém mesmo na pior semana do ano. Em viagem, em festa, em semana de mudança." Exemplos: "Para intestino preso: água, uma fonte de fibra por dia e a rotina de banheiro. Para refluxo: refeições menores, jantar cedo e não deitar depois de comer." "Uma revisão de cinco minutos por mês, olhando o teu registro, é o que mantém tudo de pé. Se um hábito caiu, retome apenas ele."
- Manutenção (aula 17): "Depois do dia 21, os seis hábitos continuam." "A cada novo ciclo, acrescente no máximo dois hábitos novos." "Procure atendimento se aparecerem sinais de alerta ou se o quadro persistir mesmo com o plano aplicado."

### 9.8 Rotina (aula 13)

- **Roteiro da refeição em 5 passos:**
  1. Sente para comer: nada de comer em pé, na pia ou andando.
  2. Tire a tela: celular longe, televisão desligada, computador fechado.
  3. Pouse o talher entre uma garfada e outra, para forçar a pausa.
  4. Mastigue até virar papa: se ainda sente pedaço, ainda não é hora de engolir.
  5. Mire em 20 minutos: não precisa cronometrar sempre, só perceber se está correndo.
  - "Faça este teste: aplique os cinco passos só no almoço, por três dias, e repare na diferença no estufamento da tarde."
- **Horários:** café da manhã como âncora; intervalos de 3 a 4 horas; jantar pelo menos 3 horas antes de deitar. "Se a tua rotina é de turnos: primeira refeição logo depois de acordar, seja que horas for, e um intervalo máximo entre refeições que você consiga manter."
- **Plano de sono:** horário de dormir mais ou menos fixo, inclusive no fim de semana; tela longe na última meia hora antes de dormir; luz mais baixa em casa à noite; sem café depois do meio da tarde. "Uma hora a mais de sono por noite, de forma consistente, já muda muita coisa."
- **Respiração antes de comer:** "Sente-se antes da refeição, com os pés apoiados no chão. Inspire pelo nariz contando até quatro. Solte o ar pela boca contando até seis. Repita de cinco a seis vezes, o que leva cerca de um minuto. A expiração mais longa é o que sinaliza ao corpo que ele pode sair do modo alerta."
- **Estresse:** uma pausa real no meio do expediente, mesmo que de dez minutos, longe da tela; não usar a refeição para resolver problema. "Estresse ou sofrimento emocional em nível que atrapalha a rotina merece apoio de um profissional de saúde mental."
- **Movimento:** caminhada de 20 a 30 minutos na maior parte dos dias, ou 10 minutos de caminhada leve depois das refeições principais. "Quem tem refluxo deve evitar exercício intenso logo após refeições volumosas."
- **Implantação:** "Dois hábitos por vez. Cada hábito precisa de um gatilho, um momento que já existe na tua rotina: depois que eu faço X, eu faço Y." "Ajuste o ambiente: a garrafa de água na mesa de trabalho, o banquinho já no banheiro, a fruta na fruteira à vista."
- **Tabela de implantação de hábitos** (sugestões da tarefa da aula 13):

| Hábito | Gatilho: depois que eu... | Eu faço... |
|---|---|---|
| Roteiro da refeição | Depois que eu sentar para almoçar | Pouso o talher entre as garfadas |
| Caminhada pós-refeição | Depois que eu terminar de almoçar | Caminho 10 minutos |
| Respiração | Antes da primeira garfada | Faço 5 respirações 4 e 6 |
| Sono | Depois que eu escovar os dentes à noite | Deixo o celular fora do quarto |
| Água | Toda vez que eu sentar na mesa de trabalho | Encho a garrafa |
| Banheiro | Depois do café da manhã | Reservo 10 a 15 minutos sem pressa |

- **Em quanto tempo aparece resultado:** mastigação e horário das refeições, diferença em dias, principalmente no estufamento; fibra e água bem ajustadas, de uma a duas semanas para mudar consistência e frequência; sono e estresse, algumas semanas; o conjunto funcionando junto, é quando o intestino estabiliza.
- "Comece com dois hábitos. Tentar aplicar tudo de uma vez é a razão mais comum de abandono."

### 9.9 Água e fibras (aula 10)

- **Meta de água:** peso atual em quilos multiplicado por 35, em mililitros. Exemplo: 65 kg, cerca de 2.275 ml.
- **Distribuição:** 3 copos pela manhã, 3 copos pela tarde e 2 copos antes de dormir.
- **Conferência:** urina clara ao longo do dia. Tons amarelados ou escuros indicam que falta água.
- "Um copo cheio ao acordar e um antes de cada refeição já resolve boa parte da meta." "Frutas e vegetais com bastante água, como melancia, melão e abobrinha, também contam na hidratação." Dicas: carregar sempre uma garrafa; usar a garrafa ou um copo de referência para saber quanto já foi; se tiver muita dificuldade, aumentar aos poucos; usar lembretes visuais.
- "Quem tem condição renal ou cardíaca precisa de orientação individual sobre a quantidade."
- **Meta de fibra:** entre 25 e 30 gramas por dia.
- **Tabela de fibras, por 100 g:** semente de linhaça 33,5 g; soja cozida 20 g; aveia em flocos 9,1 g; feijão cozido 8,5 g; grão-de-bico cozido 7,6 g; ervilha em vagem 7,5 g; abacate 6,3 g; goiaba 6,2 g; quinoa 6 g; milho cozido 3,9 g; brócolis cozido 3,4 g; beterraba crua 3,4 g; cenoura crua 3,2 g; couve crua 3,1 g; pera 3 g; espinafre cozido 2,5 g; farinha de trigo 2,3 g; batata-doce cozida 2,2 g; banana 2 g; maçã 1,3 g.
- **Dia modelo de fibras (cerca de 27 g):**

| Refeição | O que entra | Fibra |
|---|---|---|
| Café da manhã | 3 col. de sopa de aveia em flocos (30 g) | 2,7 g |
| Café da manhã | 1 col. de sopa de linhaça (15 g) | 5 g |
| Lanche da manhã | 1 banana média (100 g) | 2 g |
| Almoço | 1 concha de feijão cozido (100 g) | 8,5 g |
| Almoço | 1 pires de couve crua picada (50 g) | 1,5 g |
| Almoço | 1 cenoura média crua ralada (75 g) | 2,4 g |
| Lanche da tarde | 1 maçã com casca (130 g) | 1,7 g |
| Jantar | 1 batata-doce média cozida (150 g) | 3,3 g |

- "As campeãs são as sementes e as leguminosas. Uma colher de sopa de linhaça entrega mais fibra do que uma maçã inteira." "A fruta, sozinha, não fecha a meta." "Tire o feijão do dia e você perde quase um terço da meta." "Aumente fibra e água juntas, e aumente aos poucos."
- Avisos: "Os valores de fibra são aproximados, por 100 g do alimento." "Quem tem diagnóstico intestinal, estenose ou restrição alimentar precisa de orientação individual antes de aumentar fibras."

### 9.10 Prebióticos e probióticos

- "Probiótico é a bactéria viva. Prebiótico é o alimento dela. Os dois na mesma refeição formam um simbiótico."
- **Probióticos:** iogurte com culturas vivas, kefir, kombucha, missô, chucrute e coalhada. "Prefira as versões naturais, com pouco ou nenhum açúcar."
- **Prebióticos:** alho, cebola, alcachofra, aspargos, chicória, aveia, soja e kiwi. "Quem tem intestino irritável começa por aveia, kiwi e banana mais verde."
- **Simbióticos:** iogurte com fruta e aveia, kefir com linhaça ou chia, coalhada com banana, kombucha com fruta. "Uma combinação por dia já aplica o conceito."
- **Quatro combinações prontas:** café da manhã, 1 pote de iogurte natural com 1 banana picada e 2 col. de sopa de aveia; café da manhã, 1 copo de kefir com 1 col. de sopa de linhaça ou chia; lanche da tarde, 1 pote de coalhada com 1 banana amassada ou 1 col. de chá de mel; lanche da tarde, 1 copo de kombucha com fruta picada e 1 col. de sopa de aveia.
- Aviso: "Os efeitos dos probióticos dependem da cepa. Resultado de estudo com uma cepa específica não se aplica a qualquer fermentado nem a qualquer cápsula. Suplemento tem cepa e dose para cada situação, e isso é indicação individual."

### 9.11 O prato, a compra e o comer fora

- **Montagem do prato:** "Uma estrutura que funciona em casa, no restaurante e na casa da tua mãe. Vale a proporção, sem medida exata." Metade do prato: vegetais e verduras (salada crua, legumes refogados ou cozidos, variando as cores). Um quarto: proteína (ovo, frango, carne, peixe ou combinação vegetal). Um quarto: carboidrato (arroz, batata, mandioca, batata-doce, macarrão, cuscuz). Fora do prato: gordura boa (azeite na salada, abacate, sementes) e leguminosa (uma concha de feijão, lentilha, grão-de-bico ou ervilha).
- **O mesmo prato por queixa:** intestino preso, mais vegetais, leguminosa diária, integrais e água junto com a fibra; intestino solto, menos fibra temporariamente, legumes cozidos, arroz branco e volta gradual; gases e SII, mesma estrutura com itens de baixo FODMAP, ervas no lugar de alho e cebola, atenção à porção das leguminosas; refluxo e gastrite, porções menores e mais refeições, sem fritura, última refeição 3 horas antes de deitar.
- **Lista base da semana:** leguminosas (feijão, lentilha, grão-de-bico ou ervilha); proteínas (ovos, frango, carne moída, peixe e queijo branco); carboidratos (arroz, batata, mandioca, batata-doce, cuscuz de milho e macarrão); cereais e sementes (aveia, linhaça ou chia); frutas variadas, priorizando as que você realmente come; folhas (alface, couve, repolho e espinafre); legumes (cenoura, abobrinha, chuchu, abóbora, beterraba e tomate); iogurte natural ou coalhada, e azeite de oliva. "A lista base é o que sustenta qualquer um dos cardápios. Compre isso e o resto se resolve."
- **Comendo fora:** por quilo, "Comece enchendo metade do prato com salada e legumes, depois a proteína e por último o carboidrato."; à la carte, "Procure o prato que tenha os três componentes. Grelhado com arroz e salada resolve em quase todo lugar."; lanche, "Escolha o mais simples da lista e coma devagar."; casa da família, "Coma do que tem, ajustando a proporção: mais salada e porção menor do que costuma pesar para você."; viagem, "Leve fruta e uma fonte de fibra, como um pote pequeno de aveia, para não depender só do que aparecer." "O objetivo é constância. Uma refeição diferente não compromete o processo."

### 9.12 FODMAPs e protocolo

- **Como usar:** "Esta parte é para quem tem estufamento, gases ou intestino irritável. A lista sozinha vira uma lista de proibições, e ela só funciona dentro das três fases."
  - Fase 1, restrição: "De 2 a 6 semanas, com data marcada para acabar. Troque o alto teor pelo baixo teor e observe se os sintomas caem."
  - Fase 2, reintrodução: "Um grupo por vez, 3 dias de teste com porção crescente e 2 a 3 dias de pausa antes do próximo."
  - Fase 3, personalização: "Mantenha tudo que você tolerou e restrinja só o que causou sintoma, na quantidade que causou."
  - "A restrição é temporária. Se depois de quatro semanas os sintomas não caíram de forma clara, encerre a fase 1, volte a comer normal e leve essa informação para a consulta."
  - Na lista, a coluna de alto teor sai durante a fase 1 e a de baixo teor entra no lugar.
- **Lista por grupo** (alto teor | baixo teor | dica):
  - Frutas. Alto: maçã, pera, manga, melancia, abacate, ameixa, pêssego, nectarina, damasco, cereja, figo, frutas secas. Baixo: banana mais verde, uva, melão, kiwi, laranja, tangerina, limão, abacaxi, morango, maracujá, carambola, mirtilo. Dica: "Fruta em pedaço grande pesa mais do que fruta em porção pequena. Comece com meia porção."
  - Vegetais e temperos. Alto: alho, cebola, alho-poró, brócolis, couve-flor, beterraba, aspargos, alcachofra, cogumelo, ervilha, repolho, quiabo. Baixo: cenoura, pepino, berinjela, abobrinha, alface, espinafre, tomate, pimentão, acelga, nabo, batata, batata-baroa. Dica: "Alho e cebola são os gatilhos mais comuns e os mais presentes na comida brasileira."
  - Cereais, massas e pães. Alto: trigo, centeio, cevada, pão francês e de forma, massas de trigo, biscoitos de trigo. Baixo: arroz, tapioca, quinoa, painço, macarrão de arroz, farinha de milho, mandioca, pão e massa sem glúten. Dica: "Aqui a restrição é do FODMAP do trigo, e não do glúten. São coisas diferentes."
  - Leguminosas. Alto: feijão, grão-de-bico, lentilha, soja em grão, ervilha seca. Baixo: grão-de-bico em conserva, tofu firme, broto de feijão. Dica: "O grão-de-bico em conserva vale bem enxaguado e em porção pequena. É o grupo que mais faz falta, e volta na fase 2."
  - Leite e derivados. Alto: leite, iogurte comum, ricota, cottage, minas frescal, creme de leite, leite condensado, sorvete. Baixo: leite sem lactose, iogurte sem lactose, leite de arroz, leite de coco, leite de amêndoas, manteiga, parmesão, brie e camembert. Dica: "Queijo curado tem pouca lactose. Queijo fresco tem bastante."
  - Oleaginosas e sementes. Alto: castanha de caju, pistache, amêndoa em quantidade, avelã em quantidade. Baixo: castanha-do-pará, noz-pecã, macadâmia, semente de abóbora, semente de girassol, chia, linhaça em porção pequena. Dica: "Aqui a quantidade decide quase tudo. Um punhado pequeno costuma passar."
  - Adoçantes e açúcares. Alto: mel, agave, xarope de milho, sorbitol, manitol, xilitol, maltitol, isomalte. Baixo: açúcar cristal, açúcar mascavo, xarope de bordo, chocolate amargo, estévia, sucralose. Dica: "Tudo que termina em ol no rótulo costuma ser FODMAP. Olhe bala, chiclete e produto diet."
  - Use sem contar, em qualquer fase. Proteínas e gorduras: carne bovina, frango, peru, porco, peixe, frutos do mar, ovos, tofu firme, azeite, óleos em geral. No lugar de alho e cebola: parte verde da cebolinha, cebolinha-capim, manjericão, orégano, salsa, alecrim, tomilho, gengibre, açafrão. Dica: "O azeite aromatizado com o dente de alho, tirando os pedaços antes de usar, entrega o sabor sem o FODMAP."
- **Tabela de teste da fase 2** (porções dos dias 1, 2 e 3):
  - Lactose: leite ou iogurte comum; meio copo, 1 copo, 1 copo e meio.
  - Frutose: mel ou manga; 1 colher de chá, 1 colher de sopa, 2 colheres de sopa.
  - Sorbitol: abacate ou ameixa; 1 fatia fina ou meia ameixa, 1 fatia, 2 fatias ou 2 ameixas.
  - Manitol: cogumelo ou couve-flor; 2 colheres de sopa, meia xícara, 1 xícara.
  - Frutanos: pão de trigo, alho ou cebola; meia fatia ou 1 colher de chá, 1 fatia, 2 fatias.
  - Galactanos: feijão, lentilha ou grão-de-bico; 2 colheres de sopa, meia concha, 1 concha.
  - "Anote os sintomas de 0 a 10 nos três dias. Sintoma claro significa gatilho. Sintoma só na porção maior significa questão de quantidade. Nada significa liberado." "Ordem sugerida: lactose, frutose, sorbitol, manitol, frutanos e galactanos." "Cada grupo leva cerca de uma semana entre teste e pausa. A fase 2 leva algo em torno de seis semanas."
- **Antes de começar (aula 12):** escolha uma semana comum, sem viagem, festa, prova, mudança ou trabalho muito pesado; tenha o registro pronto; planeje a compra e duas ou três preparações.
- **Cuidado (aula 12):** "Se você tem ou já teve uma relação difícil com a comida, com restrição, contagem ou culpa, esse protocolo não é para ser feito sozinha. Ele é restritivo por natureza e pode reativar esse tipo de padrão. Nesse caso, faça com acompanhamento profissional." "Quem está gestante ou amamentando, e quem tem doença intestinal diagnosticada, deve fazer o protocolo apenas com acompanhamento profissional."
- **Fase 1 (aula 12):** "A alimentação continua completa, com carboidrato, proteína, gordura, verdura e fruta. Não é fase de comer menos." O que registrar todo dia: o que comeu, os sintomas de 0 a 10 e o tipo de Bristol. "Restringir mais e por mais tempo não vai fazer aparecer um resultado que não apareceu." "Saber que não funcionou também é uma informação valiosa, porque aponta para outra direção."
- **Fase 2 (aula 12):** "Você testa um grupo por vez, durante três dias, enquanto mantém o resto da alimentação com baixo teor. Assim, se aparecer sintoma, você sabe exatamente de quem foi." "Depois de cada teste, dois ou três dias de pausa, voltando ao baixo teor, antes do próximo grupo."
- **Efeito acumulativo:** "Você pode tolerar bem uma porção de cada grupo, mas se juntar quatro alimentos fermentáveis na mesma refeição, o sintoma aparece. Observe também a combinação, e não só o alimento isolado."
- **Fase 3:** "Teste de novo daqui a alguns meses o que deu problema. A tolerância muda, principalmente se o teu intestino melhorou no meio tempo." "O objetivo final é a maior variedade possível com o menor sintoma possível."
- **Os cinco erros mais comuns:** ficar na fase 1 para sempre, que é o mais comum e o que empobrece a microbiota; testar dois grupos ao mesmo tempo; testar numa semana atípica, com estresse alto, noites mal dormidas ou no período pré-menstrual; cortar alimento porque viu numa lista na internet, sem nunca ter testado em você; confundir com alergia alimentar ("FODMAP causa desconforto digestivo por fermentação e osmolaridade. Alergia envolve o sistema imunológico e pode ser grave. Suspeita de alergia é investigação médica.").
- Avisos: "A fase de restrição dura de 2 a 6 semanas. Restringir por tempo indefinido empobrece a diversidade da tua microbiota." "O diagnóstico de SII é médico."

### 9.13 Diarreia: crise e volta

- "Em diarreia, primeiro a água, depois a comida."
- **Sintomas que merecem atenção:** fezes líquidas frequentes; dor ou cólica abdominal; náuseas ou vômitos; fraqueza e sede intensa; pouca urina ou urina escura. "Sede intensa, fraqueza, urina escura e em pouca quantidade são sinais de que o corpo já está perdendo mais líquido do que recebendo."
- **Aguda e crônica:** aguda, mais de quatro evacuações líquidas por dia, início súbito, dura menos de duas semanas; crônica, evacuações frequentes ou volumosas que passam de duas semanas. "Passou de duas semanas, é caso para investigação médica, e não para ajuste de cardápio por conta própria."
- **Quando procurar atendimento:** "Procure atendimento médico se houver sangue nas fezes, febre alta, vômito que impeça beber líquido, sinais de desidratação ou diarreia por mais de duas semanas. Criança pequena, pessoa idosa, gestante e quem tem doença crônica desidratam mais rápido." E, da tarefa da aula 6: "Procure atendimento também se a diarreia passar de dois dias sem melhorar."
- **Hidratação na crise:** "Água pura sozinha não dá conta, porque você está perdendo também sódio e potássio." Entram soro de reidratação oral (sachê de farmácia, diluído como diz a embalagem), água de coco, caldos e sopas leves, sucos diluídos e isotônicos, em pequenos goles ao longo do dia inteiro.
- **Na crise, o que entra:** caldos e sopas leves, arroz branco, pão, carnes magras, banana, maçã sem casca e cenoura cozida. **O que sai por enquanto:** leite e derivados, frituras e gordura, feijão e grãos em geral, frutas muito doces, café, álcool, doces e alimentos com muita fibra.
- **A volta depois da crise:** "A reintrodução é por etapas, e não de uma vez. Cada passo só acontece se o anterior passou bem."
  - Dias 1 e 2 depois da melhora: alimentos leves e de pouco resíduo, como arroz, batata, cenoura cozida, frango e banana.
  - Dias 3 e 4: outros legumes cozidos e frutas sem casca, como maçã e pera cozidas.
  - Dias 5 e 6: cereais integrais em pequena quantidade e saladas cruas mais leves.
  - Dia 7 em diante: leguminosas, como feijão e lentilha, começando com meia concha.
  - Por último: leite e derivados, frituras, café e álcool. "Se algum reacender o sintoma, anote e leve para a consulta."
  - "Acompanhe pela Escala de Bristol. Se voltar ao tipo 6 ou 7 depois de um alimento, segure a reintrodução por mais dois dias antes de tentar de novo."
- "Esta fase é temporária. Ficar muito tempo nessa alimentação restritiva prejudica a nutrição e a microbiota."
- **Intestino sempre solto:** "Fezes tipo 6 todos os dias, urgência e medo de sair de casa sem saber onde tem banheiro pedem avaliação individual."
- **Kit de crise:** soro de reidratação oral, um sachê na gaveta; arroz branco; cenoura; banana; base para caldo leve (batata, abobrinha, frango). "Monte hoje, enquanto você está bem. No dia que acontecer, você não vai ter cabeça nem disposição para resolver isso."

### 9.14 Cardápios modelo e gatilhos

**Como ler um dia modelo:** "Escolha uma opção de cada refeição e monte o teu dia. As três opções valem a mesma coisa. As quantidades são medidas caseiras, como referência. Ajuste ao teu apetite e à tua rotina. Troque o que você não come pelo que aparece na mesma linha. Comida que você não gosta não vira rotina. A meta de água é a mesma em qualquer um dos cardápios." Aviso fixo: "Nenhum destes é plano alimentar. São modelos educativos, para você ver como um dia bem montado se parece. Plano individual sai de consulta, com a tua história na mesa."

**Intestino preso.** "Fibra, água e rotina no mesmo dia. Aumente a fibra ao longo de duas a três semanas, sempre com a água junto."
- Café da manhã: 2 ovos mexidos, 1 fatia de pão 100% integral e 1 laranja com bagaço | Mingau de aveia: 3 col. de sopa de aveia com leite, 1 banana amassada, canela e 1 col. de sopa de linhaça | 1 xícara de cuscuz de milho com 1 ovo e tomate picado, e 1 fatia de mamão.
- Lanche da manhã: 1 banana com 1 col. de sopa de aveia | 1 pote de iogurte natural com 1 col. de sopa de linhaça e 1 col. de chá de mel | 1 maçã com casca e 1 fatia de queijo branco.
- Almoço: Salada de folhas com talos, tomate e cenoura ralada, 4 col. de sopa de arroz integral, 1 concha de feijão, frango desfiado e brócolis refogado | Salada de repolho com laranja, arroz cozido com cenoura e abobrinha raladas, 1 concha de lentilha e carne moída com legumes | Salada de folhas com beterraba ralada, 1 pedaço de batata-doce ou mandioca cozida, grão-de-bico refogado e peixe ou ovo.
- Lanche da tarde: 2 ameixas pretas hidratadas num copo de água durante o dia, consumidas com a água, e 1 pote de iogurte natural | Vitamina de mamão com 1 col. de sopa de aveia e 1 col. de chá de linhaça | 1 fatia de pão integral com ovo mexido ou queijo branco e 1 fruta.
- Jantar: Sopa de legumes com feijão ou grão-de-bico e couve picada, com 1 fatia de pão integral | Omelete com espinafre e tomate, 3 col. de sopa de arroz integral e salada crua | Arroz integral, feijão, legumes cozidos e frango ou ovo.
- Ceia, se quiser: 1 copo de leite morno com canela | 1 pote pequeno de iogurte natural com 1 col. de chá de chia | 1 ameixa preta hidratada com um pouco da água.
- O que dá para trocar: frutas que ajudam mais (laranja com bagaço, mamão, manga, abacaxi, ameixa, kiwi, banana, uva e maçã com casca; frutas secas também entram); para acrescentar fibra, 1 a 2 colheres de sopa por dia de aveia, farelo de trigo, linhaça ou chia, na fruta, no iogurte, na salada ou no arroz; leguminosas (feijão de qualquer tipo, lentilha, grão-de-bico e ervilha; revezar na semana e usar a panela de pressão rende vários dias); integrais (arroz integral, batata-doce, mandioca, cuscuz de milho, pão e massa integrais; no rótulo, o primeiro ingrediente precisa ser farinha integral). "Os mais baratos da lista são os que mais aparecem: aveia, linhaça, feijão, ovo, banana e repolho."

**Diarreia, fase de crise.** "Na crise a prioridade é a hidratação, o dia inteiro, entre as refeições. A comida vem depois e fica leve de propósito."
- Ao acordar: 1 copo de soro de reidratação oral | 1 copo de água de coco | 1 copo de chá morno sem açúcar.
- Café da manhã: 2 fatias de pão branco com um fio de azeite e chá morno | Creme de arroz feito com água e uma pitada de sal | 1 banana bem madura amassada com 2 torradas.
- Lanche da manhã: 1 maçã sem casca, cozida ou raspada | 1 banana | 1 porção pequena de batata cozida com sal.
- Almoço: Arroz branco, cenoura cozida e frango desfiado cozido | Caldo de legumes coado com arroz e frango desfiado | Purê de batata feito com a água do cozimento e carne magra desfiada.
- Lanche da tarde: Chá morno sem açúcar com 3 biscoitos água e sal | 1 banana amassada | 1 xícara de caldo leve de legumes.
- Jantar: Canja com arroz branco, cenoura e frango | Sopa de batata, cenoura e abobrinha com peixe cozido | Arroz branco com cenoura cozida e ovo cozido.
- Ao longo do dia: Soro de reidratação oral em pequenos goles | Água, água de coco e sucos diluídos em água | Caldos leves e isotônico.
- Avisos: os de "Quando procurar atendimento" (seção 9.13) e "Esta fase é temporária."

**Gases, estufamento e SII.** "Dia modelo de baixo teor de FODMAP, para a fase 1 do protocolo. Cinco refeições menores, porque o intestino irritável responde melhor assim."
- Café da manhã: Tapioca com 1 ovo mexido e 1 laranja | Mingau de aveia feito com leite sem lactose, banana mais verde e canela | 2 fatias de pão sem glúten com pasta de amendoim e 1 kiwi.
- Lanche da manhã: 1 banana mais verde | 1 pote de iogurte sem lactose com morangos picados | 10 uvas e 1 fatia de queijo parmesão.
- Almoço: Arroz, frango grelhado, cenoura e abobrinha refogadas no azeite e salada de alface com tomate | Batata cozida, peixe assado, espinafre refogado e salada de pepino | Macarrão de arroz com molho de tomate caseiro, carne moída e salada de alface.
- Lanche da tarde: Tapioca com queijo | 1 fatia de melão ou 1 xícara de abacaxi | 1 pote de iogurte sem lactose com 1 col. de sopa de aveia.
- Jantar: Omelete com espinafre e tomate, com arroz | Canja de arroz com frango e cenoura | Batata-baroa cozida, frango desfiado e abobrinha refogada.
- "As trocas de cada grupo estão na lista de FODMAPs. Não corte tudo de uma vez: a lista serve para testar." "A fase de restrição dura de 2 a 6 semanas e é temporária. Restringir por tempo indefinido empobrece a microbiota. O diagnóstico de SII é médico."

**Refluxo e gastrite.** "Cinco refeições menores, sem os gatilhos mais comuns. A água fica principalmente entre as refeições."
- Café da manhã: Mingau de aveia feito com água ou bebida vegetal, com banana amassada e canela | 1 tapioca com 1 ovo mexido e 1 maçã | 2 fatias de pão integral com ovo cozido e chá de camomila.
- Lanche da manhã: 1 banana | 1 maçã cozida com canela | Chá de erva-doce com 3 biscoitos água e sal.
- Almoço: 4 col. de sopa de arroz integral, 1 concha de feijão, frango grelhado e cenoura e abóbora cozidas | Arroz integral, 1 concha de lentilha, patinho cozido e abobrinha refogada no azeite | Purê de abóbora, peixe assado, arroz integral e salada de folhas com azeite.
- Lanche da tarde: Vitamina de banana com 1 col. de sopa de aveia, feita com água ou bebida vegetal | 1 tapioca pequena com ovo | Chá de camomila com 1 fatia de pão integral e ovo mexido.
- Jantar, 3 h antes de deitar: Sopa de abóbora com frango desfiado e arroz | Canja leve com arroz, cenoura e frango | Arroz integral com legumes cozidos e omelete simples.
- **As regras que valem mais que o cardápio** (também são as sugestões de medidas da tarefa da aula 8): "Quatro ou mais refeições por dia, em porções menores. Refeição volumosa aumenta a pressão no estômago." "Água principalmente entre as refeições, e não em grande quantidade durante a refeição." "Coma devagar e mastigue bem. A digestão começa na boca." "Última refeição pelo menos três horas antes de deitar, e nada de deitar nas duas horas seguintes a qualquer refeição." "Eleve a cabeceira da cama em torno de quinze centímetros, com calços embaixo do colchão. Mais travesseiro não resolve."

**Gatilhos e substituições.** "A lista abaixo é ponto de partida. A resposta é individual, e o objetivo é chegar à tua própria lista."
- Evite enquanto o sintoma estiver ativo: café, chá mate e chocolate; refrigerante e bebida alcoólica; fritura e excesso de gordura; enlatados e embutidos; leite e derivados, enquanto o sintoma estiver ativo; pimenta-do-reino e condimentos fortes; no refluxo, some cítricos, tomate, menta e hortelã.
- Use no lugar: chá de camomila, erva-doce ou cidreira no lugar do café; água com gás sem açúcar ou água saborizada com fruta no lugar do refrigerante; assado, cozido e grelhado no lugar da fritura; manjericão, orégano, salsa e alecrim no lugar da pimenta; bebida vegetal ou versão sem lactose enquanto o sintoma estiver ativo.
- Aviso: "Quem usa antiácido com frequência precisa de acompanhamento, porque o uso prolongado pode prejudicar a absorção de vitamina B12, ferro e ácido fólico. O diagnóstico de refluxo, gastrite e H. pylori é médico, e o tratamento também."

### 9.15 Sinais de alerta e ficha para a consulta

- **Primeiro grupo, pedem avaliação médica** (aula 9, aula 3 e caderno): sangue nas fezes ou fezes muito escuras; perda de peso sem explicação; febre junto com alteração intestinal; anemia; dor abdominal forte, principalmente se acorda à noite; diarreia por mais de duas semanas; vômito persistente; mudança importante e duradoura no padrão intestinal; sintomas que começaram depois dos 50 anos.
  - "Qualquer um deles pede avaliação médica, e não ajuste de cardápio."
  - "Se você tem histórico de câncer de intestino na família, ou já passou dos 45 anos, isso vale ainda mais atenção."
  - "Nada disso significa que você tem alguma coisa grave. Significa que essas situações precisam de investigação médica."
- **Segundo grupo, pedem acompanhamento** (sem urgência): sintomas que persistem mesmo depois de aplicar o que você aprendeu no curso; intestino preso que não responde a fibra, água e rotina; estufamento diário; alternância constante entre preso e solto. "Procurar ajuda não é fracasso. Saber a hora de pedir ajuda faz parte do autocuidado."
- **Ficha para a consulta:**
  - Como usar: "Preencha antes de ir, em casa, olhando o teu registro. Entregue para o profissional no começo da consulta. Em vinte minutos, chegar organizada muda o que dá para fazer com o tempo." Dicas: leve o registro junto; não invente resposta ("Não lembro é uma resposta válida e útil."); escreva as tuas perguntas ("Todo mundo esquece na hora.").
  - Dados: nome, data de hoje, data da consulta, profissional.
  - A tua história: há quanto tempo os sintomas aparecem; começaram depois de algum evento (infecção intestinal, viagem, período de estresse, uso de antibiótico, mudança de rotina, não sei dizer).
  - Sintomas, com vezes por semana e intensidade de 0 a 10: dor abdominal, estufamento, gases, urgência para ir ao banheiro, esforço para evacuar, sensação de evacuação incompleta.
  - O que você já observou: tipo de Bristol mais frequente (1 a 7); há alternância entre tipos ou o padrão é sempre o mesmo; o que você já testou e o que mudou; alimentos que você identificou como gatilho.
  - Medicamentos e suplementos em uso, com o quê, para quê e há quanto tempo ("Inclua antiácido, laxante, anti-inflamatório, ferro, cálcio e o que você toma por conta."); exames já realizados, com data; histórico de doença intestinal na família.
  - Sinais de alerta presentes (lista do primeiro grupo, mais "nenhum destes").
  - Perguntas que eu quero fazer ("Escreva agora. Na hora da consulta todo mundo esquece.").
  - O que levar: a ficha preenchida; o registro das últimas semanas; exames e resultados; caixas dos medicamentos. "Três semanas de registro transformam memória em dado. É a diferença entre dizer que sente mal e mostrar quando, quanto e depois do quê."

### 9.16 Avisos importantes

- "Este app é educativo e não substitui consulta, diagnóstico nem plano alimentar individual."
- "O registro é uma ferramenta de observação. Se ele gerar ansiedade, simplifique ou interrompa."
- "Um dia isolado não define nada. O que interessa é o padrão da semana."
- "A fase 1 do protocolo de FODMAPs dura de 2 a 6 semanas. Restringir por tempo indefinido empobrece a diversidade da tua microbiota."
- "Quem tem ou já teve relação difícil com a comida faz qualquer protocolo de restrição com acompanhamento."
- "Quem tem diagnóstico intestinal, usa medicação contínua, está gestante ou amamentando adapta o plano com acompanhamento."
- "Sangue nas fezes, febre, perda de peso sem explicação, anemia ou dor forte pedem avaliação médica, sem esperar o fim do plano."

### 9.17 Pontos para eu confirmar

Copie esta lista para `docs/PERGUNTAS.md` logo no começo. O app já funciona com as escolhas abaixo; eu confirmo ou corrijo depois.
- **Diarreia:** a tarefa da aula 6 na Kiwify fala em procurar atendimento se a diarreia passar de dois dias sem melhorar; o caderno e o roteiro da aula 6 falam em duas semanas (diarreia crônica). O app mostra os dois (seção 7.13), sem contradição: dois dias sem melhora pedem atendimento, e duas semanas é o critério de diarreia crônica.
- **Lista de FODMAPs:** está igual à do caderno. A conferência da coluna de alto teor contra a lâmina de referência ainda estava pendente (ameixa, pêssego, nectarina, damasco, cereja, figo; alho-poró, aspargos, cogumelo, ervilha, repolho, quiabo; castanha de caju e pistache; maltitol e isomalte; critério das leguminosas de baixo teor). Qualquer correção no caderno precisa ser repetida em `src/content`.
- **Tabela de teste da fase 2:** as porções de sorbitol e frutanos seguem o material da aula 12, que é mais detalhado que a página 22 do caderno. As porções de alho e cebola nos dias 2 e 3 não estão definidas no material.
- **Limiares da seção 7.0**, em especial "dia com sintoma" a partir da nota 4.
- **Código de acesso** provisório NAPRATICA.
- **Links da Kiwify** (área de membros e as 17 aulas).
- **Endereço definitivo** do app, antes de entregar o link às alunas.
- **Nome curto** na tela de início: "Modulação".

## 10. Testes

- **Unitários (Vitest):** todo `src/logic`, com os exemplos da seção 7.15 e casos de borda (sem dados, empates, dias faltando, virada do dia às 23h30). Cobertura de pelo menos 90% em `src/logic`.
- **Banco:** teste de migração (dados da versão anterior continuam lá depois da atualização) e teste da cópia de segurança indo e voltando (salvar, restaurar substituindo, restaurar juntando).
- **Componentes:** seletor de Bristol, controle de 0 a 10 (toque e teclado), salvamento automático do registro.
- **Voz da interface:** um teste que varre `src/content` e os textos da interface e falha se encontrar os caracteres U+2014 ou U+2013, as palavras "seu", "sua", "seus", "suas" (com limite de palavra) ou ponto de exclamação. Exceções só com comentário explicando.
- **Ponta a ponta (Playwright, iPhone 13 e Pixel 7, com relógio simulado):**
  1. Primeira vez completa, com o código vindo pelo link, até a tela Hoje.
  2. Registro de um dia típico da semana 1 do plano (evacuou, quantas vezes, Bristol, três sintomas, energia, dois hábitos, um chip e Pronto) com no máximo 12 toques.
  3. Sete dias registrados e a leitura da semana com os valores esperados.
  4. Plano: semana zero, avanço das datas, leitura com repetição da semana, reavaliação com o cenário esperado.
  5. Tarefa da aula 7 com refeições e sintomas e os suspeitos corretos.
  6. Sugestão do modo crise depois de dois dias com tipo 6.
  7. Sem internet: abrir, ficar offline, recarregar e registrar.
  8. Salvar cópia e restaurar.
  - Rode `axe-core` nas telas principais, sem violações graves.
- **Lighthouse** no celular, se o ambiente permitir. Se não permitir, registre em `docs/PERGUNTAS.md`.

## 11. Entregáveis e definição de pronto

**Entregáveis:**
- O código no repositório, com commits por fase.
- `README.md` em português, escrito para mim (não sou programadora): o que é o app; como publicar na Netlify, passo a passo; onde trocar textos (`src/content`), links da Kiwify, WhatsApp e Instagram (`src/config.ts`) e o código de acesso (`npm run gerar-codigo`); como testar no celular; como funciona a cópia de segurança; o aviso do endereço definitivo; e como pedir mudanças ao Claude Code numa sessão nova (cole: "Leia docs/especificacao.md, docs/PERGUNTAS.md e o CHANGELOG.md e continue de onde parou, seguindo as mesmas regras.").
- `docs/especificacao.md` (este documento), `docs/PERGUNTAS.md`, `docs/textos-novos.md`, `docs/telas/`, `CHANGELOG.md`.
- `docs/teste-no-celular.md`: roteiro de teste para mim, passo a passo, no iPhone e no Android: instalar, registrar, fechar e abrir, modo avião, salvar cópia e restaurar em outro aparelho, lembretes na agenda, PDF da ficha, tema escuro, fonte grande do sistema.
- `docs/kiwify.md`, seguindo a seção 8: o texto para o módulo "Materiais do curso" apresentando o app, com o link `https://ENDERECO/?acesso=NAPRATICA`; uma frase curta para o fim da descrição de cada aula, com o link direto da tarefa (`https://ENDERECO/aula/N?acesso=NAPRATICA`); e o roteiro de um vídeo de 1 minuto "Como instalar o app" para eu gravar.

**Pronto significa:**
- Funciona instalado no iPhone (Safari) e no Android (Chrome), inclusive sem internet.
- A primeira vez não trava em nenhum caminho (código, instalação, navegador de outro app, restaurar cópia).
- Registro do dia com salvamento automático; o dia típico da semana 1 do plano cabe em até 12 toques.
- Plano de 21 dias, leitura da semana, reavaliação, cenário e plano mínimo funcionando com os cálculos da seção 7.
- As 17 aulas com as tarefas da seção 6.6.
- Guia completo, protocolo low FODMAP, modo crise e ficha da consulta com PDF.
- Cópia de segurança e restauração testadas.
- Todos os testes passando e Lighthouse dentro das metas (ou o motivo registrado).
- Nenhum texto da interface com travessão, "seu" ou "sua".
- Publicado na Netlify, ou com o passo a passo pronto para eu publicar em poucos minutos.

## 12. Fases e prioridades

- **Fase 1 · Base (P0):** projeto, tokens e fontes, conteúdo em `src/content`, banco e migrações, salvamento automático, cópia de segurança, PWA e instalação (iPhone, Android, navegador de outro app), código de acesso, primeira vez, abas, tela Hoje, Registro do dia com modo simples, Escala de Bristol, hábitos e água, sinais de alerta, Ajustes e os testes da lógica base.
- **Fase 2 · Processo (P0):** Caminho com as 17 aulas e todas as tarefas, plano de 21 dias completo, leitura da semana, reavaliação, cenário, plano mínimo, manutenção e revisão do mês, lembretes de agenda, modo crise, próximo passo e verificações automáticas.
- **Fase 3 · Conhecimento e resultados (P0 e P1):** Guia completo com busca, lista de FODMAPs e protocolo, ferramentas de água e fibra, respiração guiada, cardápios, ficha da consulta com PDF, Resultados com gráficos e padrões, modo demonstração.
- **Fase 4 · Acabamento e publicação:** acessibilidade, desempenho, testes ponta a ponta, Lighthouse, README, `docs/kiwify.md`, `docs/teste-no-celular.md`, `netlify.toml` e publicação.

Se o tempo apertar, siga esta ordem de prioridade: registro do dia e cópia de segurança; instalação no iPhone; plano de 21 dias, leitura e reavaliação; tarefas das aulas; Guia; protocolo low FODMAP; ficha em PDF; padrões; modo demonstração.

**Comece agora pela seção 1, item 1. No fim de cada fase, me mande o resumo combinado e siga para a próxima.**
