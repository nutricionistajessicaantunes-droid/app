# App Modulação Intestinal na Prática

App do curso **Modulação Intestinal na Prática**, de Jéssica Antunes (Nutricionista, CRN2 21581D). É um aplicativo web (PWA): a aluna abre pelo link, instala na tela de início do celular e usa como qualquer aplicativo, inclusive sem internet.

O app guia a aluna pelas aulas, recebe o registro do dia em um minuto, faz as contas sozinho (leitura da semana, médias, Bristol, hábitos, água, fibras, reavaliação) e guarda tudo **só no celular dela**. Não existe conta, servidor nem rastreamento.

A especificação completa está em [`docs/especificacao.md`](docs/especificacao.md).

---

## Importante: o endereço definitivo, antes de entregar o link às alunas

Os registros de cada aluna ficam presos ao endereço do site. **Se o endereço mudar depois que as alunas começarem, elas abrem o app novo vazio.**

- Decida o endereço **antes** de colocar o link na Kiwify.
- O endereço gratuito da Netlify (por exemplo `modulacao-intestinal.netlify.app`) pode ser o definitivo.
- Se quiser um domínio próprio, configure **antes** de entregar o link.
- Qualquer mudança de endereço depois exige que cada aluna salve uma cópia no endereço antigo e restaure no novo.

---

## Como publicar na Netlify (passo a passo)

Você só faz isso uma vez. Depois, cada atualização publica sozinha.

1. Entre em [app.netlify.com](https://app.netlify.com) com a tua conta (pode entrar com o GitHub).
2. Toque em **Add new site** e depois em **Import an existing project**.
3. Escolha **GitHub** e autorize a Netlify a ver os teus repositórios, se ela pedir.
4. Escolha o repositório **app**.
5. Na tela de configuração, confira:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   (Esses valores já vêm do arquivo `netlify.toml`.)
6. Toque em **Deploy**. Em dois ou três minutos o site fica no ar.
7. Em **Site configuration** e depois **Change site name**, troque o nome para o endereço que você quer (por exemplo `modulacao-intestinal`). Faça isso antes de entregar o link às alunas.

### Como cada atualização chega no ar

- Eu trabalho numa branch separada e abro um **pull request** no GitHub.
- A Netlify cria um **endereço de prévia** para cada pull request. É nele que você testa no celular. Os dados de teste ficam presos a esse endereço e não passam para o definitivo. Isso é o esperado.
- Quando você aprova, faz o **merge** do pull request. A Netlify publica sozinha no endereço definitivo.
- **Merge pelo celular:** abra o link do pull request no app do GitHub, toque em **Merge pull request** e depois em **Confirm merge**.
- Quem já tem o app aberto vê o aviso "Nova versão disponível" com o botão "Atualizar". O app nunca recarrega sozinho no meio de um registro.

---

## Onde trocar cada coisa

| O quê | Onde |
|---|---|
| Textos do curso (aulas, Bristol, plano, cardápios, FODMAPs, alertas) | pasta `src/content` |
| Receitas e ingredientes de "O que eu tenho em casa" e "Montar o meu dia" | `src/content/refeicoes.ts` |
| Links da Kiwify (área de membros e cada aula) | `src/config.ts`, em `KIWIFY_AREA_URL` e `KIWIFY_AULA_URLS` |
| WhatsApp, Instagram e endereços de atendimento | `src/config.ts` |
| Números de corte dos cálculos (por exemplo, "dia com sintoma" a partir da nota 4) | `src/config.ts`, seção "Números de corte" |
| Código de acesso | veja abaixo |

### Código de acesso

O app pede um código para quem chega pelo navegador. O link que vai dentro da Kiwify já leva o código: `https://ENDERECO/?acesso=NAPRATICA`. Quem tem o app instalado não precisa digitar de novo.

Para trocar o código:

1. No computador, na pasta do projeto, rode `npm run gerar-codigo -- PALAVRANOVA`.
2. Copie o código grande que aparece (o "hash").
3. Cole em `ACCESS_CODE_HASH`, no arquivo `src/config.ts`.
4. Troque também o link dentro da Kiwify.

> O código desencoraja o compartilhamento do link, mas **não é segurança forte**: quem entende de programação consegue contornar. Os registros de cada aluna continuam protegidos porque ficam só no celular dela.

Se preferir, peça a troca ao Claude Code numa sessão nova.

---

## Cópia de segurança

Os registros ficam só no celular da aluna. Para não perder nada:

- **Salvar uma cópia** (tela Hoje ou Ajustes) gera o arquivo `modulacao-copia-AAAA-MM-DD.txt`. No celular, o app abre o compartilhamento para a aluna mandar para ela mesma (WhatsApp, e-mail, Arquivos, Drive). No computador, o arquivo é baixado.
- O app lembra de salvar a cópia quando a última tem mais de 7 dias (e já há pelo menos 3 dias registrados), e depois de cada leitura da semana.
- **Restaurar** (Ajustes ou na primeira tela, "Já usei o app em outro celular ou no navegador") aceita o arquivo `.txt` ou `.json`, mostra uma prévia e oferece "Substituir tudo" ou "Juntar com o que já tenho".
- **Trocar de celular** tem um guia curto em Ajustes.
- Se algo quebrar, a tela de erro oferece "Salvar uma cópia de emergência".

**No iPhone**, o Safari e o app instalado guardam dados separados. Por isso o app pede para instalar logo no começo. Quem usou no navegador antes salva uma cópia e restaura no app instalado.

---

## Como testar no celular

- Abra o endereço de prévia do pull request no celular.
- Para ver o app com dados de exemplo, acrescente `?demo=1` no fim do endereço (plano concluído) ou `?demo=plano` (plano em andamento). O modo demonstração usa outro banco e nunca mistura com os teus dados. Para sair, toque em "Sair da demonstração".
- O roteiro completo de teste fica em [`docs/teste-no-celular.md`](docs/teste-no-celular.md).
- Os textos para colocar na Kiwify (apresentação do app, uma frase por aula e o roteiro do vídeo de instalação) ficam em [`docs/kiwify.md`](docs/kiwify.md).

---

## Para quem programa

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

- `npm run lint`: padrão de código. `npm run coverage`: cobertura dos cálculos (`src/logic`, mínimo de 90%).
- `npm run capturas`: gera as capturas de tela em `docs/telas` (rode `npm run build` antes).
- `npm run e2e`: testes ponta a ponta no iPhone 13 e no Pixel 7 simulados (rode `npm run build` antes).
- `npm run gerar-icones`: gera os ícones a partir de `scripts/icone.svg`.
- Estrutura: `src/content` (conteúdo), `src/logic` (cálculos, sem tela), `src/db` (banco e cópia), `src/features` (telas), `src/ui` (componentes), `src/styles` (cores e fontes).

---

## Como pedir mudanças ao Claude Code numa sessão nova

Abra uma sessão nova do Claude Code neste repositório e cole:

> Leia docs/especificacao.md, docs/PERGUNTAS.md e o CHANGELOG.md e continue de onde parou, seguindo as mesmas regras.

Depois, escreva o que você quer mudar.

---

Jéssica Antunes · Nutricionista · CRN2 21581D
