# 0006. Família `flow` sobre React Flow, com biblioteca de passos, inspector e assistente como patterns

- **Status:** Accepted (dono, na conversa de 2026-10-23)
- **Date:** 2026-10-23
- **Origin:** pedido do dono em 2026-10-23: "engenharia reversa com o React para construir componentes e templates para atender workflow editor (`https://flowly-app.reui.io/workflow-editor`) e agent builder (`https://flowly-app.reui.io/agent-builder`); usar libs de UI internas ou COSS; se necessário, instalar libs de apoio"
- **Supersedes:** none
- **Amends:** none. O ADR 0005 continua valendo para os templates instaláveis que este ADR cria

## Context

| Força | Fonte |
| --- | --- |
| O dono quer componentes e dois templates com a anatomia das telas do Flowly (ReUI): editor de workflow e construtor de agente | pedido de 2026-10-23 |
| As duas telas do Flowly rodam sobre React Flow: `.react-flow`, `react-flow__node-step` (workflow) e `react-flow__node-agent` (agent), `react-flow__minimap`, `react-flow__node-toolbar`, atribuição "React Flow" | leitura das páginas em 2026-10-23, registrada em `.specs/flow-editors/user-experience.md` |
| As duas telas dividem a mesma anatomia: biblioteca de passos à esquerda, canvas ao centro, inspector com abas Build/Status/Logs à direita, cabeçalho com Ask AI / Add step / Run, menu de ações, atalhos de teclado e um cartão de última execução | `.specs/flow-editors/user-experience.md` §2 |
| Nenhum pacote do workspace declara `@xyflow/react`, `reactflow`, `dagre`, `elkjs` ou `d3-hierarchy` | `bun.lock`; `packages/*/package.json` |
| Um pattern pode trazer dependência npm própria: o `rich-text-editor` traz `platejs`, as views trazem `@tanstack/react-table`, os widgets trazem `recharts`; o build do registry lê as versões só de `elements`, `helpers` e `parttens` | `docs/architecture/tc96-parttens.md:164`, `:488`; `packages/registry/src/build-registry.ts` |
| Patterns não carregam CSS, tokens nem tema; `assertDistributable` recusa `:root`, `.dark`, `@theme` e `@utility` nos arquivos do item | `AGENTS.md` (raiz); `packages/registry/src/build-registry.ts` |
| O React Flow exige a folha `@xyflow/react/dist/base.css` para posicionar nós, arestas e viewport; sem ela o canvas não renderiza | documentação do React Flow 12 ("Theming", "base.css is required") |
| O COSS publica `tabs`, `context-menu`, `progress` e `alert`, que não estão no lock; não publica `item`, `icon-tile`, `button-group`, `resizable` nem `sonner` | `curl https://coss.com/ui/r/<item>.json` em 2026-10-23; `packages/ui/coss.lock.json` |
| O COSS `chat/*` e `composer` já estão sincronizados e só stories os usam | `packages/ui/src/chat/`, `packages/ui/src/composer.tsx`; `apps/storybook/src/ui/chat/` |
| `IconFrame` (`@tc96/elements`) faz o papel do `icon-tile` do ReUI; `Group` (`@tc96/ui/group`) faz o do `button-group` | `packages/elements/src/icon-frame.tsx`; `packages/ui/src/group.tsx` |
| Uma família existe quando dois ou mais patterns dividem um domínio; o item do registry mapeia nome para pasta em `patternSources` | `AGENTS.md` (raiz), "Pattern families"; `packages/registry/src/manifest.ts` |
| Um pattern já importa outro por caminho relativo (`checklist` importa `properties/display/...`) | `packages/parttens/src/checklist/components/checklist-metadata.tsx:4` |
| Templates instaláveis vivem em `packages/templates/src/<categoria>/<grupo>/<template>/`, importam pattern por arquivo (`@tc96/parttens/<caminho>`, exports `./*` → `./src/*.tsx`) e nunca pelo barrel | ADR 0005 D1, D3; `packages/parttens/package.json` |
| O Flowly é demo do ReUI, com código próprio; serve só de referência de anatomia | ADR 0005 D9, pelo mesmo motivo |

## Decision

Criaremos a família `flow` em `packages/parttens/src/flow/` com três patterns, `canvas`, `step-library` e `inspector`, mais o pattern `chat/assistant` na família `chat`, e dois templates instaláveis em `packages/templates/src/application/flow/`: `workflow-editor` e `agent-builder`. O canvas fica sobre `@xyflow/react`; os outros patterns não dependem dele.

**Axis that decided it:** boundary

| Aspecto | Desenho |
| --- | --- |
| D1. Lugar e nomes | `flow/canvas` (item `flow-canvas`), `flow/step-library` (`flow-step-library`), `flow/inspector` (`flow-inspector`), `chat/assistant` (`chat-assistant`). Templates `application/flow/workflow-editor` (`workflow-editor`), `application/flow/agent-builder` (`agent-builder`) e `application/flow/shared/` para o que os dois dividem (cabeçalho, layout de três painéis, formulário de passo, rótulos). Stories: `Patterns/Flow/Canvas`, `Patterns/Flow/Step Library`, `Patterns/Flow/Inspector`, `Patterns/Chat/Assistant`, `Application/Flow/WorkflowEditor`, `Application/Flow/AgentBuilder` |
| D2. Vocabulário | `flow/canvas/core.ts` é o dono dos tipos da família (`FlowStep`, `FlowConnection`, `FlowStepRun`, `FlowRunStatus`, `FlowStepType`, `FlowDirection`) e das funções puras (`tidyTree`, `flowRunSummary`, `parseStepTransfer`). Não importa React nem `@xyflow/react`. `step-library` e `inspector` importam só tipos de `../canvas/core`; o build leva esse arquivo com o item, sem trazer o React Flow. Os templates o alcançam por `@tc96/parttens/flow/canvas/core`, com a entrada `"./*/core": "./src/*/core.ts"` em `exports`, já que `"./*"` só resolve `.tsx` |
| D3. Biblioteca de grafo | `@xyflow/react` 12.12.0 entra como dependência de `packages/parttens` e é importado só dentro de `flow/canvas` (`ReactFlow`, `ReactFlowProvider`, `Background`, `MiniMap`, `Panel`, `NodeToolbar`, `Handle`, `BaseEdge`, `EdgeLabelRenderer`, hooks). Nenhum outro pattern ou template importa `@xyflow/react`; o template recebe o `FlowCanvas` montado, com o provider dentro |
| D4. CSS do React Flow | O pattern não traz CSS. O consumidor importa `@xyflow/react/dist/base.css` no CSS global, documentado em `Patterns/Flow/Canvas` e em `Templates/Doc`. O Storybook importa a mesma folha em `.storybook/preview.ts`, ao lado do tema do exemplo: é folha de biblioteca, não tema. Cor de aresta, fundo e minimapa vêm por classe Tailwind sobre token (`stroke-border`, `fill-muted`); quando o React Flow só aceita variável `--xy-*`, a regra fica no tema do exemplo escopada em `.react-flow` e registrada como nota ao consumidor em `docs/architecture/tc96-parttens.md` |
| D5. Layout | O mesmo `FlowCanvas` atende os dois editores por `direction` (`horizontal`: handles esquerda/direita, posições livres, snap opcional; `vertical`: handles cima/baixo, árvore). O "tidy tree" é a função pura `tidyTree` em `core.ts`, sobre `d3-hierarchy` 3.1.2 (`tree()`), chamada pelo consumidor ou pelo template; o canvas nunca reposiciona sozinho |
| D6. Estado | Controlado, como os outros patterns: `steps`, `connections`, `selectedStepId` e `run` vêm por props; o canvas emite `onStepsChange`, `onConnectionsChange`, `onConnect`, `onSelect`, `onStepDrop`, `onStepAction`. Histórico (undo/redo), execução e persistência são do consumidor, por callbacks. O `store/` de cada pattern (React Context) guarda só o efêmero: modo select/pan, zoom, aba do inspector, dock aberto |
| D7. Arrastar da biblioteca | Drag and drop nativo do HTML5 (`dataTransfer`, tipo `application/x-tc96-flow-step`, como o exemplo oficial do React Flow), com `parseStepTransfer` em `core.ts`. Clicar no item é o caminho de teclado e chama `onAdd`. Sem `@dnd-kit` aqui: não há provider compartilhado entre dois patterns |
| D8. Inspector | `aside` ancorado (`data-docked`, largura fixa) a partir de `md` e `Sheet` do COSS abaixo; cabeçalho com `IconFrame`, título e `Badge`; `Tabs` do COSS com Build/Status/Logs; rodapé com ações. O pattern entrega o quadro e os renderizadores de leitura (`FlowInspectorDetails`, `FlowInspectorStatus`, `FlowInspectorLogs`); o formulário de edição é composição do consumidor sobre `Field`, `Input`, `Textarea` e `Select` do COSS, e nos templates vive em `application/flow/shared/step-form.tsx` |
| D9. Assistente | `chat/assistant` sobre o COSS `chat/*` e `composer`: cartão flutuante ou ancorado com cabeçalho (nova conversa, histórico, expandir, encerrar), saudação, sugestões, conversa e compositor com anexar e enviar. Controlado: `messages`, `suggestions`, `onSend`, `onSuggestion`, `onAttach`. Nenhuma chamada a modelo dentro do pattern |
| D10. COSS novo e substitutos | `bun run sync:coss tabs context-menu progress alert`. O nó do canvas tem markup próprio do pattern (`IconFrame`, `Badge`, `Avatar` de `@tc96/elements`) no lugar do `Item` do ReUI; o grupo de botões do toolbar usa `Group`; o cartão de última execução usa `Card` com `Progress` |
| D11. Referência externa | O Flowly orienta só a anatomia e os estados (`user-experience.md`). Nenhum arquivo, classe, dado ou texto do ReUI entra no repositório. Ícones de marca dos passos são do consumidor (`FlowStepType` + mapa de ícones por id); as stories usam `@thesvg/icons`, já peer de `parttens`, e Lucide |

## Alternatives

| Alternative | Why it was discarded |
| --- | --- |
| Um pattern só, `flow/editor`, com biblioteca, canvas e inspector dentro | quem instala só o inspector ou só a biblioteca levaria o React Flow; três itens deixam cada um com a dependência que usa |
| Família `templates/` ou as telas inteiras dentro de `packages/parttens` | os ADRs 0004 e 0005 já recusaram: tela não é pattern reutilizável |
| Canvas próprio em SVG, com pan, zoom, handles e minimapa feitos à mão | reimplementa viewport, arestas, conexão por arrasto, seleção múltipla, minimapa e a11y de nó que o React Flow já entrega e testa |
| `reactflow` 11 | nome antigo do pacote, sem suporte declarado a React 19 |
| `elkjs` ou `@dagrejs/dagre` para o tidy tree | `elkjs` pesa e pede worker; `dagre` resolve DAGs gerais, mas o construtor de agente é árvore. `d3-hierarchy` `tree()` é o algoritmo tidy tree, sem dependências e sem React |
| `@dnd-kit` para arrastar da biblioteca para o canvas | exigiria um `DragDropProvider` comum a dois patterns; o React Flow já lê `dataTransfer` em `onDrop` |
| `react-resizable-panels` para o dock do inspector | o Flowly usa largura fixa com transição; redimensionar fica no backlog |
| Toast do COSS em "passo criado" | o pattern emite callback; a notificação é do consumidor |
| Buscar o código ou o registry do Flowly | código de terceiro, com licença própria |

## Consequences

- **Gains:**
  - dois editores de grafo com a mesma base e o mesmo vocabulário, instaláveis com um comando e compostos do mesmo `FlowCanvas`;
  - cada item do registry leva só a dependência que usa; o inspector e a biblioteca servem a telas sem canvas;
  - o assistente reaproveita o COSS `chat` e `composer`, que hoje só stories usam.
- **Costs:**
  - duas dependências novas em `parttens` (`@xyflow/react`, `d3-hierarchy`) e `@types/d3-hierarchy` em dev;
  - o consumidor precisa importar `base.css` do React Flow, um passo a mais que nenhum pattern pedia até aqui;
  - quatro itens novos no registry, quatro pastas em `scripts/test-patterns.ts`, quatro `AGENTS.md` e um `test/dom.ts` com mocks de `ResizeObserver` e `DOMMatrixReadOnly` para o React Flow em JSDOM;
  - o React Flow entra no bundle do Storybook e no `storybook:test`.
- **Verifiable invariants:**

| Invariante | Tipo | Como verificar |
| --- | --- | --- |
| `@xyflow/react` só aparece em `packages/parttens/src/flow/canvas/` | static | `grep -rl "@xyflow/react" packages/parttens/src packages/templates/src` lista só arquivos de `flow/canvas`; teste em `scripts/check-boundaries.test.ts` |
| Os itens `flow-step-library`, `flow-inspector` e `chat-assistant` não declaram `@xyflow/react` em `dependencies` | unit | `manifest.test.ts`, por item |
| `flow/canvas/core.ts` não importa React nem `@xyflow/react` | unit | `core.test.ts` lê o arquivo e falha em `from 'react'` ou `from '@xyflow/react'` |
| `tidyTree` é determinística e nunca sobrepõe irmãos | unit | `core.test.ts` com uma árvore de três ramos |
| Nenhum item do registry traz CSS, `:root`, `.dark`, `@theme` ou `@utility` | unit | `assertDistributable` em `bun run build:registry` |
| Nenhum pattern ou template busca, persiste ou chama modelo | review | `grep -rn "fetch(\|localStorage\|setTimeout" packages/parttens/src/flow packages/parttens/src/chat/assistant packages/templates/src/application/flow` vazio |
| Templates importam patterns por arquivo e o item leva só esses arquivos | unit | `manifest.test.ts` confere os `files` de `workflow-editor` e `agent-builder` |
| Stories passam no axe no claro e no escuro | component | `bun run storybook:test` |
| Nó, aresta, inspector e biblioteca passam no contraste 4,5:1 (texto) e 3:1 (gráfico) sobre o tema `Default` | manual | razões medidas e registradas em `docs/architecture/tc96-parttens.md` |

## Not verified

- `@xyflow/react` 12.12.0 com React 19.1.1 e o `ContextMenu` do Base UI envolvendo o nó (handles dentro do trigger). O T1 do plano mede e registra.
- `ReactFlow` dentro do `storybook:test` (vitest browser): `fitView` e o minimapa dependem de `ResizeObserver` e das medidas do container. O T1 mede.
- Drag and drop nativo no `play` do Storybook (`DataTransfer` no Playwright). O T2 mede; se não der, o `play` cobre o clique e o arrasto fica no teste de `bun test` com `fireEvent.drop`.
- Tipos de `d3-hierarchy` com `typescript` 6.0.3 (`@types/d3-hierarchy` 3.1.x). O T0 mede.
