# Lovable Credits Generator

Extensão para navegadores Chromium (Chrome/Edge) que automatiza a abertura do modal de publicação e o clique em “Publish” em múltiplas abas do Lovable. Útil para fluxos de criação por indicação: você replica a aba do projeto remixado, abre o modal em todas e publica em lote.

## O que ela faz

- Replica a aba atual X vezes, mantendo a mesma URL do remix aberto.
- Abre o modal de publicação (“Publish”) em todas as abas acessíveis.
- Clica no botão “Publish” dentro do modal em todas as abas.
- Mostra um status claro de sucesso/erro/abas ignoradas.

Arquivos-chave:

- Manifesto: [manifest.json](file:///d:/lovable-credits/ext/manifest.json)
- Interface: [popup.html](file:///d:/lovable-credits/ext/popup.html)
- Lógica do popup: [popup.js](file:///d:/lovable-credits/ext/popup.js)
- Service worker: [background.js](file:///d:/lovable-credits/ext/background.js)

## Instalação (modo desenvolvedor)

- Chrome
  1. Abra `chrome://extensions`
  2. Ative “Modo do desenvolvedor”
  3. Clique em “Carregar sem compactação”
  4. Selecione a pasta `ext` deste projeto
- Microsoft Edge
  1. Abra `edge://extensions`
  2. Ative “Modo do desenvolvedor”
  3. Clique em “Carregar sem empacotar”
  4. Selecione a pasta `ext` deste projeto

Permissões usadas: `tabs`, `activeTab`, `scripting` (ver [manifest.json](file:///d:/lovable-credits/ext/manifest.json)).

## Tutorial de uso (fluxo de indicação)

1. Pegue seu link de indicação no Lovable.
2. Abra o link e crie uma conta nova usando esse link. Prefira janela/perfil separado para evitar sessão prévia.
3. Gere um remix:
   - Recomendação: use o Remix de um template/tema pronto para evitar falhas de segurança ao publicar.
   - Alternativamente, use um prompt simples para criar um projeto no Lovable.
4. Com o projeto remixado aberto, abra a extensão:
   - Campo “Número de cópias”: defina quantas vezes replicar a aba (ex.: 5–15).
   - Clique em “Replicar Aba Atual” e aguarde todas as páginas carregarem totalmente.
   - Clique em “Abrir Modal em Todas as Abas” e aguarde o status indicar que o modal foi aberto em todas.
   - Clique em “Publicar em Todas as Abas” e aguarde a confirmação de publicação em todas.

## Notas importantes

- Abas protegidas (ex.: `chrome://`, `edge://`, `about:`, `file://`) são ignoradas automaticamente.
- Se a UI do Lovable mudar, o botão pode não ser encontrado; há fallback por seletor/XPath e busca por texto “Publish” dentro de diálogos.
- Não feche o popup da extensão enquanto os processos estão em execução; aguarde as mensagens de status.
- Replicar muitas abas pode demorar e consumir recursos; ajuste o volume conforme seu hardware/rede.

## Fluxo da interface

- Seção 1 — Replicar Abas: define a quantidade e cria cópias da aba atual.
- Seção 2 — Abrir Modal: tenta abrir o modal de publicação em todas as abas acessíveis.
- Seção 3 — Executar Publish: clica em “Publish” dentro do modal em todas as abas.

## Resolução de problemas

- Modal não abre: verifique se o remix está carregado e se a página é acessível (não protegida).
- Publish não dispara: confirme que o modal está aberto e que você está autenticado.
- Nada acontece em algumas abas: a extensão ignora páginas protegidas ou que bloqueiam injeção de script.
- Atualize/recarregue a extensão se a página do Lovable tiver sofrido mudanças recentes na UI.

## Segurança e boas práticas

- Prefira remixes de templates/temas oficiais ao publicar; evita configurações inseguras.
- Evite executar em páginas sensíveis ou fora do Lovable.
- Não compartilhe credenciais em prompts ou projetos públicos.
