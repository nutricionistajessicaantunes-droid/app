# Registro de mudanças

Tudo que muda no app fica anotado aqui, por fase.

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
