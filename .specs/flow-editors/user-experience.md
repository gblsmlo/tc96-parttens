---
capability: flow-editors
stories: none (sem `requirements.md`; o escopo é o pedido do dono de 2026-10-23)
owner: product-designer
status: accepted (dono, na conversa de 2026-10-23)
source: leitura das páginas `https://flowly-app.reui.io/workflow-editor` e `https://flowly-app.reui.io/agent-builder` no browser em 2026-10-23 (DOM, árvore de acessibilidade, menus, abas e estados); nenhum código do Flowly foi copiado
---

### 1. UX: jornada e fluxo

**Persona e contexto:** quem monta automações (um fluxo de passos disparado por um evento) e quem monta um agente de IA (uma árvore de passos que um modelo percorre). Fonte: os dados de exemplo do Flowly ("Lead Routing" com webhook, filtro e Slack; "Collections Agent" com Stripe, Neon, Claude e Resend). Não há entrevista nem dado próprio; a persona está em §3 como suposição.

**Jornada (as duas telas):**

1. Abre o editor: vê o cabeçalho com o nome, a biblioteca de passos à esquerda, o canvas com o grafo e o cartão da última execução. O que pode dar errado: grafo vazio (estado vazio do canvas), execução anterior com falha (o cartão mostra `Failed` e o passo que falhou).
2. Adiciona um passo: arrasta um item da biblioteca para o canvas, clica no item, usa "Adicionar passo" do cabeçalho, o "+" do toolbar do nó, o "+" da aresta (agent) ou "Adicionar passo depois" do menu de contexto. O que pode dar errado: solta fora do canvas (nada acontece), passo sem conexão de entrada (alerta no inspector: "nada chega aqui").
3. Configura o passo: o inspector abre em Build com tipo, nome, descrição e responsável (workflow) ou caminho do ramo (agent); salva ou cancela. O que pode dar errado: nome vazio (erro no campo), cancelamento depois de editar (volta ao valor anterior).
4. Conecta passos: arrasta de um handle de saída a um de entrada (workflow) ou usa "Adicionar ramo" e o "+" da aresta (agent). O que pode dar errado: conexão duplicada ou em ciclo (o consumidor recusa em `onConnect`; o canvas não mostra a aresta).
5. Executa um teste: "Executar uma vez" (workflow) ou "Executar teste" (agent). Cada nó recebe estado e métricas (`0.2s · Success`, `1,842 tokens · USD 0.031`); as arestas percorridas ficam animadas e os ramos não tomados marcam `Skipped`. O cartão da última execução resume. O que pode dar errado: passo falha (badge `Failed`, o cartão aponta o passo, Status e Logs do inspector explicam).
6. Investiga: Status (última execução, duração, id, entradas/concluídas/abandono) e Logs (este passo ou todos) do inspector; "Pergunte à IA" abre o assistente com sugestões ("Por que o passo X falhou?").
7. Organiza: snap à grade, reorganizar (workflow) ou "Organizar árvore" (agent); desfazer e refazer; travar o canvas; copiar como JSON.

**Fluxo:** uma tela por editor; o inspector é um painel lateral (dock) na mesma tela a partir de `md` e um `Sheet` abaixo disso; o assistente é um cartão flutuante na mesma tela; menus e atalhos são popovers. Nenhuma transição de rota.

### 2. UI: telas e componentes

```
## Editor de workflow (Application/Flow/WorkflowEditor)
**Quem chega e por quê:** quem edita um fluxo de automação; chega pela navegação do app com o fluxo já carregado pelo consumidor.
**Estados:** loading → esqueleto da biblioteca e canvas vazio com `aria-busy` | empty → canvas com `Empty` ("Arraste um passo da biblioteca ou clique em Adicionar passo") e biblioteca ativa | success → grafo horizontal com nós, arestas rotuladas (`True`/`False`), minimapa e controles | failure → nó com badge `Failed`, cartão "Última execução · Failed · <passo> falhou" com barra de progresso, aresta percorrida animada até o passo que falhou; o que fazer: abrir Status/Logs ou "Pergunte à IA".
**Vive na URL:** nada no template; o consumidor pode guardar o passo selecionado.
**Componentes e nível:** FlowStepLibrary, FlowCanvas, FlowInspector → Patterns; AssistantPanel → Patterns (Chat); FlowPageHeader, StepForm, FlowPageLayout → Application (shared do grupo); Sidebar, Breadcrumb, Button, Popover, Kbd, Menu, Tabs, Sheet, Field, Select, Textarea, Badge, Progress, Card, ScrollArea → UI.
```

```
## Construtor de agente (Application/Flow/AgentBuilder)
**Quem chega e por quê:** quem monta um agente como árvore de passos (modelo, dados, mensagens, ferramentas).
**Estados:** loading → como acima | empty → canvas com `Empty` ("Adicione o primeiro passo") | success → árvore vertical organizada (tidy tree), rótulos de ramo nas arestas (`No reply`, `Promised`, `Disputed`), botões "+"/"remover conexão" no meio das arestas (visíveis no hover e no foco) e "+ adicionar depois" sob as folhas | failure → como acima; passos não percorridos mostram `Branch not taken` ou `Upstream skipped`.
**Vive na URL:** nada.
**Componentes e nível:** os mesmos do editor de workflow; o canvas em `direction="vertical"` com `FlowEdgeControls`; os controles trocam undo/redo/lock por "Organizar árvore".
```

```
## Biblioteca de passos (Patterns/Flow/Step Library)
**Quem chega e por quê:** painel fixo à esquerda das duas telas; a pessoa procura o passo pelo grupo.
**Estados:** loading → esqueletos por grupo | empty → `Empty` ("Nenhum passo disponível") | success → título, dica ("Arraste um passo para o canvas ou clique para adicionar"), grupos com rótulo (Messages, Data, Delays, Flow control; Models, Data, Messages, Tools) e itens com ícone e nome; rodapé com o cartão da última execução | failure → o cartão da última execução em `Failed` com o passo que falhou.
**Vive na URL:** nada.
**Componentes e nível:** FlowStepLibrary, FlowStepLibraryGroup, FlowStepLibraryItem, FlowRunCard → Patterns; ScrollArea, Separator, Card, Badge, Progress, Skeleton, Empty → UI; IconFrame → Elements.
```

```
## Canvas (Patterns/Flow/Canvas)
**Quem chega e por quê:** o centro das duas telas; a pessoa lê o grafo, seleciona, arrasta, conecta.
**Estados:** loading → `aria-busy`, sem nós | empty → `Empty` no meio do canvas (texto é prop) | success → nós, arestas, fundo pontilhado, controles no canto inferior esquerdo (Selecionar, Mover, Diminuir zoom, nível de zoom como botão, Aumentar zoom; Desfazer, Refazer, Travar canvas ou Organizar árvore), minimapa no canto inferior direito a partir de `md` | failure → estado de execução por nó (badge) e aresta (animada quando percorrida).
**Nó (FlowStepNode):** cartão de 240–256px: IconFrame (sólido para o gatilho, contorno para os demais), título em uma linha, descrição em uma linha, rodapé com borda superior: avatar do responsável e duração (workflow) ou ícone de estado e métricas separadas por "·" (agent); badge de estado à direita. Selecionado: borda e anel `primary`. Foco visível pelo teclado. Toolbar acima do nó selecionado (Group de botões): adicionar depois, ver, editar, duplicar, excluir (o gatilho não duplica nem exclui). Menu de contexto (botão direito): os mesmos itens. No agent, um botão "Ações de <nome>" no canto do nó abre o mesmo menu (ver, editar, adicionar ramo, excluir).
**Aresta:** smoothstep com rótulo opcional no meio (`True`/`False`, nome do ramo); animada quando `taken`; no agent, controles no meio: "+" e "remover conexão".
**Vive na URL:** nada.
**Componentes e nível:** FlowCanvas, FlowCanvasControls, FlowCanvasMinimap, FlowStepNode, FlowStepEdge, FlowEdgeControls, FlowStepToolbar, FlowShortcutsPopover → Patterns; ToggleGroup, Group, Button, Tooltip, Popover, Kbd, ContextMenu, Menu, Badge, Empty → UI; IconFrame, Avatar → Elements.
```

```
## Inspector (Patterns/Flow/Inspector)
**Quem chega e por quê:** abre ao ver, editar ou criar um passo; dock à direita (largura fixa, transição de largura, `inert` quando fechado) a partir de `md`, `Sheet` abaixo.
**Estados:** loading → esqueleto do cabeçalho e dos campos | empty → fechado (largura zero) | success → cabeçalho (IconFrame, título, badge do tipo "· id" ou "Viewing" / "Not added yet"), abas Build / Status / Logs, conteúdo rolável, rodapé | failure → Status com `Failed`; Build com alerta quando nada chega ao passo ("Conecte um passo a este").
**Build, modo ver:** lista Detalhes (Tipo, Nome, Descrição, Responsável, Entradas, Saídas; no agent: Próximos passos, Última execução, Id do passo); rodapé: Editar passo, Próximo passo →; botão Excluir no cabeçalho.
**Build, modo editar/criar:** formulário com Tipo (select com ícone), Nome (input), Descrição (textarea), Responsável (select com avatar) ou Caminho (input) no agent; cada rótulo com dica em tooltip; rodapé: Cancelar, Salvar passo ou Adicionar passo. Status e Logs ficam desabilitadas enquanto o passo não existe.
**Status:** "Última execução" (Estado, Duração, Execução id) e "Execuções de teste" (Entradas, Concluídas, Abandono %) com nota quando nenhuma execução chegou ao passo.
**Logs:** ToggleGroup "Este passo | Todos os passos", contagem "N entradas", lista com ícone de estado, nome, "#n" e descrição ("Passed: 1,842 tokens, USD 0.031"); vazio: `Empty` "Sem logs ainda" com botão "Executar uma vez".
**Vive na URL:** nada.
**Componentes e nível:** FlowInspector, FlowInspectorDetails, FlowInspectorStatus, FlowInspectorLogs → Patterns; Sheet, Tabs, ScrollArea, Badge, Button, Tooltip, ToggleGroup, Empty, Alert, Field, Input, Textarea, Select → UI; IconFrame, Avatar → Elements.
```

```
## Assistente (Patterns/Chat/Assistant)
**Quem chega e por quê:** "Pergunte à IA" no cabeçalho; cartão flutuante no canto inferior direito, por cima do canvas.
**Estados:** loading → indicador de digitação (ChatTypingIndicator) | empty → saudação ("Oi, <nome>"), descrição do contexto ("Li <fluxo>, a última execução e o que você anexar") e lista "Experimente perguntar" com sugestões | success → conversa (ChatConversation, ChatMessage) e compositor | failure → mensagem de erro do assistente com "tentar de novo"; aviso fixo "As respostas podem estar erradas. Confira antes de publicar."
**Cabeçalho:** título, badge "Beta", Nova conversa, Histórico, Expandir/Minimizar, Encerrar. Compositor: textarea com placeholder, Anexar contexto, Enviar.
**Vive na URL:** nada.
**Componentes e nível:** AssistantPanel, AssistantSuggestions, AssistantComposer → Patterns; chat/*, composer, Card, Badge, Button, Tooltip → UI.
```

```
## Cabeçalho e menus (Application/Flow shared)
**Quem chega e por quê:** barra fixa no topo da página: nome (breadcrumb), Atalhos (popover com Kbd), Pergunte à IA, Adicionar passo, Executar uma vez / Executar teste (primário), Ações (menu: grupo Canvas com "Alinhar à grade" (checkbox) e "Reorganizar"; grupo do fluxo com "Selecionar todos os passos" e "Copiar como JSON"; no agent: "Limpar resultados", "Restaurar exemplo", "Copiar como JSON").
**Estados:** success → todos os botões; running → Executar desabilitado com spinner; failure → nenhum estado próprio.
**Vive na URL:** nada.
**Componentes e nível:** FlowPageHeader → Application; Breadcrumb, Button, Popover, Kbd, Menu, Spinner → UI.
```

**Componentes novos ou alterados:**

| Componente | Variantes e estados (stories) | Prop × composição | Overflow, texto longo, sem dados |
| --- | --- | --- | --- |
| `FlowCanvas` | `Horizontal`, `Vertical`, `Empty`, `Loading`, `WithRun` (sucesso e falha), `Locked`, `Dark` pelo tema | `steps`, `connections`, `direction`, `selectedStepId`, `locked`, `snapToGrid` são props; controles e minimapa são composição (`FlowCanvasControls`, `FlowCanvasMinimap` como `children`) | título e descrição do nó em uma linha com reticências; sem nós mostra `Empty`; grafo maior que o viewport cabe por `fitView` e minimapa |
| `FlowStepNode` | `Trigger`, `Action`, `Condition`, `Selected`, por estado de execução (`Idle`, `Running`, `Success`, `Failed`, `Skipped`, `NotRun`) | tudo por `data` do nó; ícone por mapa de ícones; toolbar e menu são composição do canvas | nome longo trunca; métricas longas truncam; sem execução mostra `Not run` |
| `FlowStepEdge` | `Plain`, `Labeled`, `Taken` (animada), `WithControls` (agent) | `label`, `taken` por `data`; controles por prop do canvas | rótulo longo trunca em uma linha |
| `FlowStepLibrary` | `Default`, `Loading`, `Empty`, `WithRunCard` (`Failed`, `Passed`, `NotRun`), `Collapsed` | grupos e itens por props; o cartão de execução é composição (`children` do rodapé) | lista rola dentro de `ScrollArea`; rótulo longo trunca |
| `FlowInspector` | `View`, `Edit`, `Create` (Status e Logs desabilitadas), `Status`, `Logs`, `LogsEmpty`, `Docked`, `Sheet` (viewport móvel), `WithAlert` | aba e modo por props controladas (`tab`, `onTabChange`); formulário por `children` | descrição longa quebra em linhas; conteúdo rola dentro das abas |
| `AssistantPanel` | `Empty` (saudação e sugestões), `Conversation`, `Typing`, `Error`, `Expanded`, `Minimized` | `messages`, `suggestions`, `greeting`, `disclaimer` por props; cabeçalho e compositor são composição | mensagens longas quebram; lista rola com `useChatScroll`; sem sugestões esconde o bloco |
| `WorkflowEditor`, `AgentBuilder` | `Default`, `Empty`, `Running`, `Failed`, `Mobile` | fluxo, biblioteca e execução por props; cada ação é callback | o canvas ocupa o espaço restante (`min-w-0`); a biblioteca colapsa abaixo de `md` |

### 3. Usabilidade

| Verificação | Resposta |
| --- | --- |
| caminho de recuperação para cada falha esperada | passo falhou → badge no nó, cartão da última execução aponta o passo, Status e Logs explicam, assistente sugere a pergunta; passo sem entrada → alerta no Build com "Conecte um passo a este"; nome vazio → erro no campo e botão Salvar desabilitado; soltar fora do canvas → nada acontece, o item volta à biblioteca |
| ações destrutivas | excluir passo → `onStepAction('delete')`; o template pede confirmação por `AlertDialog` quando o passo tem conexões; remover conexão → sem confirmação, com Desfazer disponível; Limpar resultados → confirmação |
| ações otimistas | nenhuma no pattern; executar mostra `running` enquanto o consumidor não devolve o resultado |
| velocidade percebida | arrastar, selecionar e abrir o inspector respondem no mesmo frame; o inspector anima a largura em 200 ms e respeita `prefers-reduced-motion` |
| estado preservado em recarga e link compartilhado | nada no pattern; o consumidor decide o que vai para a URL (passo selecionado, aba) |

**Não validado com usuário:**

- a persona (quem automatiza e quem monta agentes) vem só dos dados de exemplo do Flowly; teste: entrevista com dois consumidores do registry antes do próximo incremento;
- a biblioteca à esquerda e o inspector à direita são a ordem do Flowly; teste: observar se quem usa teclado chega ao canvas sem passar por toda a biblioteca (o cabeçalho tem "Adicionar passo" como atalho);
- o cartão da última execução no rodapé da biblioteca pode passar despercebido; teste: ver se a pessoa encontra o passo que falhou sem abrir o inspector.

### 4. Acessibilidade

Os nomes abaixo são os padrões em pt-BR; todos são props (`labels`) e as stories os exibem como estão.

| Controle | Papel | Nome acessível |
| --- | --- | --- |
| item da biblioteca | button (`draggable`) | `<nome do passo>` |
| grupo da biblioteca | group | `<rótulo do grupo>` |
| cartão da última execução | region | `Última execução` |
| barra do cartão | progressbar | `Última execução: <n>%` |
| nó do canvas | group, `aria-roledescription="passo"` | `<nome>, <tipo>, <estado>` |
| handle de saída / entrada | (do React Flow) | `Conectar a partir de <nome>` / `Conectar em <nome>` |
| toolbar do nó | group | `Ações de <nome>` |
| adicionar depois | button | `Adicionar um passo depois de <nome>` |
| ver | button | `Ver <nome>` |
| editar | button | `Editar <nome>` |
| duplicar | button | `Duplicar <nome>` |
| excluir | button | `Excluir <nome>` |
| menu do nó (agent) | button, `aria-haspopup="menu"` | `Ações de <nome>` |
| adicionar na aresta | button | `Adicionar um passo aqui` ou `Adicionar um passo no caminho <rótulo>` |
| remover conexão | button | `Remover esta conexão` ou `Remover a conexão do caminho <rótulo>` |
| adicionar depois da folha | button | `Adicionar um passo depois de <nome>` |
| selecionar / mover | radio em `ToggleGroup` | `Selecionar` / `Mover` |
| zoom | button | `Diminuir zoom` · `Nível de zoom <n>%` · `Aumentar zoom` |
| desfazer / refazer | button | `Desfazer` / `Refazer` |
| travar | button, `aria-pressed` | `Travar canvas` |
| organizar | button | `Organizar árvore` |
| minimapa | (do React Flow) | `Minimapa` |
| inspector | complementary (`aside`) | `Detalhes do passo` |
| fechar inspector | button | `Fechar detalhes do passo` |
| abas | tablist / tab | `Build` · `Status` · `Logs` |
| filtro de logs | radio em `ToggleGroup` | `Este passo` / `Todos os passos` |
| ações do rodapé | button | `Cancelar` · `Salvar passo` · `Adicionar passo` · `Editar passo` · `Próximo passo` |
| atalhos | button, abre popover | `Atalhos de teclado` |
| pergunte à IA | button | `Pergunte à IA` |
| adicionar passo | button | `Adicionar passo` |
| executar | button | `Executar uma vez` / `Executar teste` |
| ações do fluxo | button, `aria-haspopup="menu"` | `Ações do workflow` / `Ações do agente` |
| assistente | dialog não modal ou region | `Assistente` |
| compositor | textbox | `Pergunte sobre este workflow` / `Pergunte sobre este agente` |
| anexar / enviar | button | `Anexar contexto` / `Enviar pergunta` |

**Formulários:** Tipo (`Select`, rótulo "Tipo", dica em tooltip ao lado do rótulo), Nome (`Input`, obrigatório), Descrição (`Textarea`), Responsável (`Select`) e Caminho (`Input`, só no agent). Erro abaixo do campo em `FieldError`, ligado por `aria-describedby`, com `aria-invalid` no controle; o primeiro campo inválido recebe foco ao salvar.

**Foco e teclado:** ordem: cabeçalho (Atalhos → Pergunte à IA → Adicionar passo → Executar → Ações) → biblioteca (itens em ordem de grupo) → canvas (nós na ordem do consumidor; setas movem o nó selecionado, `Backspace` exclui, `Tab` passa pelos handles) → controles → inspector (fechar → abas → campos → rodapé) → assistente. Atalhos: `V` selecionar, `H` mover, `+`/`-` zoom, `Shift+1` ajustar, `Shift+0` tamanho real, `Ctrl+Z` desfazer, `Ctrl+Shift+Z` refazer, `Backspace` excluir; nenhum dispara com foco num campo de texto. Clicar no item da biblioteca adiciona o passo sem arrastar.

### Done when

- Cada tela em §2 tem os quatro estados.
- Cada falha esperada tem caminho de recuperação em §3.
- Cada controle do fluxo está na tabela de §4, com papel e nome.
- O nível de catálogo de cada componente vem do vocabulário (SB-LAYER-03).
- Cada afirmação sobre a pessoa tem fonte ou está em "Não validado com usuário".

### Out of this file

| Belongs in | What |
| --- | --- |
| `requirements.md` | não existe; o escopo é o pedido do dono |
| `../adr/0006-flow-family-on-react-flow.md` | fronteiras, dependências, vocabulário |
| `tasks/0001-flow-editors.md` | quem faz, aceitação, evidência |
| `frontend-developer`, na Task | onde o código vive, quem guarda cada estado, qual API do React |
