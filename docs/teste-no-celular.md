# Roteiro de teste no celular

Use o endereço de prévia do pull request (ou o endereço definitivo, depois do merge). Faça o roteiro uma vez no iPhone e uma vez no Android. Os dados de teste ficam presos ao endereço usado.

Se quiser ver o app já cheio de dados, acrescente `?demo=1` no fim do endereço (plano concluído) ou `?demo=plano` (plano em andamento). Para sair, toque em "Sair da demonstração". O modo demonstração não mistura com os teus dados.

## 1. Primeira vez e instalação

**iPhone (Safari):**
1. Abra `https://ENDERECO/?acesso=NAPRATICA` no Safari.
2. O app mostra o passo a passo para instalar. Siga: compartilhar, Adicionar à Tela de Início, Adicionar.
3. Abra pelo ícone Modulação na tela de início. Ele deve abrir sem a barra do Safari.
4. Faça a primeira vez até a tela Hoje.

**Android (Chrome):**
1. Abra o mesmo link no Chrome.
2. Toque em "Instalar o app" (ou nos três pontinhos e Instalar app).
3. Abra pelo ícone e faça a primeira vez.

**Confira também:** abra o link pelo Instagram ou pelo WhatsApp. O app deve mostrar a tela "Abra no navegador".

## 2. Registro do dia

1. Toque em "Registrar meu dia".
2. Responda "Você evacuou?", escolha o tipo de Bristol, mexa nos sintomas e na energia, marque um chip do dia.
3. Toque em "Pronto". A tela Hoje deve mostrar o resumo do dia.
4. Volte em "Editar" e confira que tudo ficou salvo.

## 3. Fechar e abrir

1. Feche o app de verdade (arraste para cima na troca de aplicativos).
2. Abra de novo pelo ícone. O registro do dia deve continuar lá.

## 4. Sem internet (modo avião)

1. Com o app já aberto uma vez, ligue o modo avião.
2. Feche e abra o app. Ele deve abrir normalmente.
3. Faça um registro. Deve salvar.
4. Toque em "Ver a aula na Kiwify": o app avisa que você está sem internet.
5. Desligue o modo avião.

## 5. Cópia de segurança e restauração em outro aparelho

1. Em Ajustes, toque em "Salvar uma cópia". No celular, o app abre o compartilhamento: mande o arquivo para você mesma (WhatsApp, e-mail, Arquivos ou Drive).
2. No outro aparelho, abra o link do app. Na primeira tela, toque em "Já usei o app em outro celular ou no navegador" e escolha o arquivo.
3. Confira a prévia e restaure. Os registros devem aparecer.
4. No iPhone, teste também: salve a cópia no Safari e restaure no app instalado (eles guardam dados separados).

## 6. Lembretes na agenda

1. Em Ajustes, Lembretes, toque em "Agenda do iPhone" e depois em "Google Agenda" para o registro do dia.
2. Confira que o evento aparece na agenda, no horário certo, repetindo todos os dias.
3. **No iPhone, teste nos dois jeitos:** pelo Safari e pelo app instalado. Se algum dos dois não abrir o lembrete, me avise (é um ajuste de uma linha, explicado em `docs/PERGUNTAS.md`).

## 7. PDF da ficha para a consulta

1. Abra Resultados e toque em "Ficha para a consulta".
2. Confira os campos que vêm preenchidos e complete os teus.
3. Toque em "Gerar PDF". No celular, o app abre o compartilhamento; salve ou mande para você.
4. Abra o PDF e confira os acentos e a tabela das últimas 3 semanas.

## 8. Tema escuro

1. Troque o celular para o modo escuro (ou, em Ajustes do app, Aparência, Escuro).
2. Passe pelas abas Hoje, Caminho, Resultados e Guia. Os textos devem continuar fáceis de ler.

## 9. Fonte grande do sistema

1. Aumente o tamanho da letra nos ajustes do celular (iPhone: Ajustes, Tela e Brilho, Tamanho do Texto; Android: Configurações, Tela, Tamanho da fonte).
2. Abra o app. Nada deve ficar cortado ou sobreposto, e os botões devem continuar fáceis de tocar.

## 10. Plano, tarefas e modo crise (com a demonstração)

1. Abra com `?demo=plano`: veja a tela Hoje, o Plano, a aula 11 com a tarefa em andamento e o registro do dia com os campos da tarefa.
2. Abra com `?demo=1`: veja a reavaliação, o fim do curso, o plano mínimo, o protocolo low FODMAP e Resultados com os gráficos.
3. Em Guia, Diarreia, toque em "Estou com diarreia agora" e confira o modo crise.

Se algo não funcionar, anote o celular, o que você tocou e o que apareceu, e me mande numa sessão nova do Claude Code.
