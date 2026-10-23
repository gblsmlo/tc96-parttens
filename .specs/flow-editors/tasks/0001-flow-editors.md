---
capability: flow-editors
plan: 0001
owner: project-manager
status: Ready
issue: none
branch: feat/flow-editors a partir de main (lacuna e); um PR por fase para a branch, um PR final para main
appetite: grande, seis fases em sessões separadas. Teto: quatro patterns (flow/canvas, flow/step-library, flow/inspector, chat/assistant), dois templates (workflow-editor, agent-builder), duas dependências npm (@xyflow/react, d3-hierarchy), quatro itens COSS novos (tabs, context-menu, progress, alert). Se uma unidade pedir mais, o plano volta à tabela de decisão (WF-PLAN-02)
inputs: ADR 0006 Accepted em 2026-10-23; user-experience.md accepted em 2026-10-23; lacunas a a h fechadas pelo dono com as recomendações em 2026-10-23; ADR 0005 Accepted; pedido do dono de 2026-10-23; leitura do Flowly em 2026-10-23
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | não necessário: o pedido do dono define o escopo (dois editores com a anatomia do Flowly, patterns + templates, libs de apoio permitidas) |
| `../design.md` | substituído pelo ADR 0006, que decide família, dependências, vocabulário e contrato |
| `../user-experience.md` | accepted pelo dono em 2026-10-23; anatomia, estados, nomes acessíveis e teclado das duas telas |
| `../../adr/0006-flow-family-on-react-flow.md` | Accepted pelo dono em 2026-10-23 |
| `../../adr/0005-installable-templates.md` | Accepted; vale para os dois templates |

Nenhuma Task começa antes de o ADR 0006 passar a `Accepted` e o `user-experience.md` a `accepted` (`WF-SPEC-04`).

### Lacunas abertas (fecha-em: planejamento)

Fechadas pelo dono em 2026-10-23, na conversa, com as recomendações de cada linha.

| # | Lacuna | Recomendação | Decide |
| --- | --- | --- | --- |
| a | Aceitar o ADR 0006 (família `flow`, `@xyflow/react` em `flow/canvas`, `d3-hierarchy` para o tidy tree, `base.css` importado pelo consumidor) | aceitar | dono |
| b | Incluir o assistente (`chat/assistant`, o "Ask AI") neste lote ou deixar no backlog | incluir (T4): corre em paralelo, reaproveita o COSS `chat` e `composer` e os dois templates o usam | dono |
| c | Nomes: família `flow`, itens `flow-canvas`, `flow-step-library`, `flow-inspector`, `chat-assistant`, `workflow-editor`, `agent-builder` | como está | dono |
| d | O formulário de Build (Tipo, Nome, Descrição, Responsável, Caminho) vive no `shared/` dos templates, não no pattern inspector | no template: o pattern entrega o quadro e as leituras; os campos são domínio da tela (ADR 0006 D8) | dono |
| e | Branch: `feat/flow-editors` a partir de `main`, um PR por fase para ela, um PR final para `main`; ou cada fase direto para `main` | `feat/flow-editors` com um PR por fase: T1 a T4 nascem em worktrees dela depois de T0 | dono |
| f | O Storybook importa `@xyflow/react/dist/base.css` em `.storybook/preview.ts`, ao lado do tema (folha de biblioteca; o AGENTS.md só proíbe tema e regra CSS próprios) | sim; a mesma linha vai para `apps/example` quando o exemplo ganhar uma página com o canvas | dono |
| g | Ícones de marca nas stories do agent builder: `@thesvg/icons` (peer de `parttens`) ou só Lucide | `@thesvg/icons` no agent builder, Lucide no workflow | dono |
| h | Rótulos: padrão em pt-BR como os patterns e os shells, com os termos do Flowly em inglês só como referência | pt-BR | dono |

### Catálogo do lote

O Flowly orienta só a anatomia e os estados (`../user-experience.md`); nenhum código, classe ou dado do ReUI entra no repositório (ADR 0006 D11).

| Story | Item do registry | Pasta | Composição com COSS e componentes internos |
| --- | --- | --- | --- |
| `Patterns/Flow/Canvas` | `flow-canvas` | `packages/parttens/src/flow/canvas/` | `@xyflow/react` (ReactFlow, Background, MiniMap, Panel, NodeToolbar, Handle, BaseEdge, EdgeLabelRenderer); nó com `IconFrame`, `Badge`, `Avatar`; toolbar com `Group` + `Button`; `ContextMenu`; controles com `ToggleGroup`, `Button`, `Tooltip`; atalhos com `Popover` + `Kbd`; `Empty` |
| `Patterns/Flow/Step Library` | `flow-step-library` | `packages/parttens/src/flow/step-library/` | `ScrollArea`, `Separator`, `Button` (item arrastável), `IconFrame`, `Card` + `Progress` + `Badge` (cartão da última execução), `Skeleton`, `Empty` |
| `Patterns/Flow/Inspector` | `flow-inspector` | `packages/parttens/src/flow/inspector/` | `Sheet` (abaixo de `md`), `Tabs`, `ScrollArea`, `Badge`, `Button`, `Tooltip`, `ToggleGroup`, `Empty`, `Alert`, `IconFrame`, `Avatar`; `use-media-query` do COSS para o dock |
| `Patterns/Chat/Assistant` | `chat-assistant` | `packages/parttens/src/chat/assistant/` | `Card`, `Badge`, `Button`, `Tooltip`, `chat/*` (ChatConversation, ChatMessage, ChatTypingIndicator, ChatEmptyState, useChatScroll), `Composer*` |
| `Application/Flow/WorkflowEditor` | `workflow-editor` | `packages/templates/src/application/flow/workflow-editor/` | `shared/` do grupo + os quatro patterns por caminho de arquivo; canvas `horizontal`, undo/redo/lock, minimapa, formulário com Tipo, Nome, Descrição, Responsável |
| `Application/Flow/AgentBuilder` | `agent-builder` | `packages/templates/src/application/flow/agent-builder/` | `shared/` do grupo + os quatro patterns; canvas `vertical` com controles de aresta e "Organizar árvore"; formulário com Tipo, Nome, Descrição, Caminho |

Backlog, fora deste plano: dock redimensionável (`react-resizable-panels`), histórico de undo/redo como helper, toast de "passo criado", histórico de conversas do assistente, página no `apps/docs`, biblioteca de passos como `Sheet` no móvel.

### Contrato comum da família

Fecha em T0 e vale para T1 a T5. Fica em `packages/parttens/src/flow/canvas/core.ts`, sem import de React nem de `@xyflow/react` (ADR 0006 D2). Os nomes abaixo são o contrato; a forma final (opcionais, `readonly`) é do implementador, e `core.test.ts` cobre cada função.

```ts
export type FlowDirection = 'horizontal' | 'vertical'
export type FlowRunStatus = 'idle' | 'running' | 'success' | 'failed' | 'skipped' | 'not-run'
export type FlowStepKind = 'trigger' | 'action' | 'condition'

export interface FlowStepType {
  id: string
  label: string
  group: string
  kind?: FlowStepKind
  description?: string
}

export interface FlowStepRun {
  status: FlowRunStatus
  durationMs?: number
  metrics?: readonly string[]
  note?: string
}

export interface FlowStep {
  id: string
  type: string
  name: string
  description?: string
  kind?: FlowStepKind
  owner?: { name: string; avatarUrl?: string }
  position: { x: number; y: number }
  run?: FlowStepRun
}

export interface FlowConnection {
  id: string
  source: string
  target: string
  label?: string
  sourceHandle?: string
  taken?: boolean
}

export interface FlowRunSummary {
  status: FlowRunStatus
  id?: string
  note?: string
  completed: number
  total: number
}

export type FlowStepAction = 'add-after' | 'add-branch' | 'view' | 'edit' | 'duplicate' | 'delete'

export const FLOW_STEP_TRANSFER_TYPE = 'application/x-tc96-flow-step'
export function serializeStepTransfer(type: FlowStepType): string
export function parseStepTransfer(raw: string | null | undefined): FlowStepType | null
export function tidyTree(steps, connections, options: { direction: FlowDirection; nodeSize: [number, number]; gap: [number, number] }): FlowStep[]
export function flowRunSummary(steps, options?: { id?: string }): FlowRunSummary
export function incomingOf(stepId, connections): FlowConnection[]
export function outgoingOf(stepId, connections): FlowConnection[]
```

Ícones não entram no contrato: cada componente recebe `icons?: Record<string, ReactNode>` por `FlowStepType.id`, com um Lucide por `kind` como padrão. Textos visíveis são `labels` com padrão em pt-BR (lacuna h). Os patterns não buscam, não persistem, não ordenam e não calculam execução: tudo chega por props e sai por callbacks (ADR 0006 D6).

### Sessões de execução

Pedido do dono em 2026-10-23: a execução corre em sessões com modelos mais baratos; esta conversa só planeja. Cada sessão nasce `fresh`, lê os arquivos da coluna "Lê" antes de tocar em código e trabalha numa worktree própria a partir de `feat/flow-editors`. Uma sessão não muda arquivo de outra fase; se precisar, registra em **Registro da execução** e devolve.

| Fase | Modelo | Lê | Entrega |
| --- | --- | --- | --- |
| T0 | Sonnet 5.5 | `AGENTS.md` (raiz), ADR 0006, este plano | PR `feat/flow-editors` com a base |
| T1 | Sonnet 5.5 (Opus 5.5 só se o T1 travar no React Flow em JSDOM ou no vitest browser) | `AGENTS.md`, `properties/AGENTS.md` (referência de AGENTS.md), `wizard/` (referência de layout), ADR 0006, `user-experience.md` §2 Canvas e §4, este plano | PR de `flow/canvas` |
| T2 | Haiku 5.5 | os mesmos, `user-experience.md` §2 Biblioteca | PR de `flow/step-library` |
| T3 | Sonnet 5.5 | os mesmos, `user-experience.md` §2 Inspector | PR de `flow/inspector` |
| T4 | Sonnet 5.5 | os mesmos, `chat/chats-panel/AGENTS.md`, `apps/storybook/src/patterns/chat/usages/lead-qualification.stories.tsx` (uso do COSS chat), `user-experience.md` §2 Assistente | PR de `chat/assistant` |
| T5 | Sonnet 5.5 | `packages/templates/AGENTS.md`, ADR 0005, `app-shell-3` (referência), `user-experience.md` inteiro, os quatro `AGENTS.md` novos | PR dos dois templates e da documentação |
| T6 | Haiku 5.5 para o gate; `tc96-core:code-reviewer` em contexto novo para a revisão | este plano, `Registro da execução` | PR final para `main` |

Brief padrão de cada sessão: "Execute a Task <id> de `.specs/flow-editors/tasks/0001-flow-editors.md` no repositório `tc96-parttens`. Siga o `AGENTS.md` da raiz e o da pasta que tocar; sem comentários no código; Biome com 2 espaços, aspas simples, sem ponto e vírgula; `cn` de `@tc96/utils`; COSS por `@tc96/ui/<component>`; nunca edite `packages/ui` à mão. Rode a tabela de evidência da Task antes de fechar. Não faça commit nem PR sem o dono pedir; deixe a branch pronta e registre desvios em **Registro da execução**."

### Ordem

- T0 fecha as lacunas e a base. Nada começa antes.
- T1, T2, T3 e T4 são independentes depois de T0: cada um toca a própria pasta, as próprias stories e o próprio `AGENTS.md`; nenhum edita `flow/canvas/core.ts` (se precisar de um tipo novo, registra e devolve a T0).
- T5 depende de T1 a T4.
- T6 depende de T5 e fecha o PR para `main`.

```
T0 ─┬─ T1 (canvas) ──────┐
    ├─ T2 (step-library) ─┤
    ├─ T3 (inspector) ────┼─ T5 (templates + docs) ── T6 (gate + review)
    └─ T4 (assistant) ────┘
```

### Tasks

- [x] **T0 · Fechar as lacunas e preparar a base da família [DECISION + ENGINEERING]**
  - **Owner:** dono para as lacunas; `tc96-frontend:frontend-developer` para o código
  - **Depends on:** none
  - **Inputs:** ADR 0006 (D2, D3, D4, D10); este plano, "Contrato comum da família"
  - **Scope:**
    - Lacunas a a h respondidas; ADR 0006 `Accepted`; `user-experience.md` `accepted`; este plano `Ready`.
    - `git switch -c feat/flow-editors main`.
    - `bun run sync:coss tabs context-menu progress alert`; nenhuma edição à mão em `packages/ui`; `select.tsx` e `combobox.tsx` não mudam (exceção de 2026-10-20 continua aplicada).
    - `packages/parttens/package.json`: `@xyflow/react` 12.12.0 e `d3-hierarchy` 3.1.2 em `dependencies`; `@types/d3-hierarchy` em `devDependencies` da raiz; `bun install`.
    - `apps/storybook/.storybook/preview.ts`: `import '@xyflow/react/dist/base.css'` logo depois do tema (lacuna f).
    - `packages/parttens/src/flow/canvas/core.ts` e `core.test.ts` com o contrato comum; `tidyTree` sobre `d3-hierarchy`; `test/dom.ts` do canvas com os mocks de `ResizeObserver` e `DOMMatrixReadOnly` que o React Flow pede em JSDOM.
    - `scripts/test-patterns.ts`: `flow/canvas`, `flow/step-library`, `flow/inspector`, `chat/assistant` na lista.
    - `packages/registry/src/manifest.ts`: os quatro `patternNames` e `patternSources`, e `workflow-editor` e `agent-builder` em `templateNames` e `templateSources` (as pastas nascem em T5; o teste que compara `templateSources` com as pastas fica `todo` até T5).
    - `packages/parttens/src/index.ts`: `export * from './flow/canvas/index'` e as outras três linhas, cada uma apontando para um `index.ts` que por ora exporta só `core` (T1 a T4 completam).
    - `packages/parttens/package.json`: entrada `"./*/core": "./src/*/core.ts"` em `exports`, porque `"./*"` só resolve `.tsx` e o template do agent builder importa `tidyTree` de `@tc96/parttens/flow/canvas/core` (ADR 0006 D2); teste em `manifest.test.ts` de que o build segue esse import.
    - `scripts/check-boundaries.test.ts`: teste de que `@xyflow/react` só aparece em `packages/parttens/src/flow/canvas/`.
    - `docs/architecture/tc96-parttens.md`: linha na tabela de decisões (família `flow`, React Flow como o Plate e o recharts, `base.css` do consumidor).
  - **Acceptance:**
    - `tabs.tsx`, `context-menu.tsx`, `progress.tsx` e `alert.tsx` existem em `packages/ui/src` e no `coss.lock.json`.
    - `core.ts` não importa React nem `@xyflow/react`; `tidyTree` numa árvore de três ramos devolve posições sem sobreposição e o mesmo resultado em duas chamadas; `parseStepTransfer` devolve `null` para texto inválido; `flowRunSummary` conta `completed` só com `success`.
    - O `test/dom.ts` do canvas monta um `ReactFlow` vazio em `bun test` sem lançar.
    - `bun run verify:public-api --record` regrava o baseline com os quatro módulos novos (só `core`); o resumo do PR cita a mudança.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bun run check:coss` | exit 0 |
    | `git diff --stat packages/ui/src/select.tsx packages/ui/src/combobox.tsx` | vazio |
    | `bun test packages/parttens/src/flow/canvas` | exit 0, `core.test.ts` verde |
    | `bun test --isolate scripts` | exit 0, com o teste novo de `@xyflow/react` |
    | `bun run typecheck && bun run lint:ci && bun run boundaries:check` | exit 0 |
    | `bun run test:registry` | exit 0 (o teste das pastas de template marcado `todo` com referência a T5) |
  - **Test types:** static (biome, tsc, boundaries), unit (`core.test.ts`, `manifest.test.ts`).
  - **Out of this Task:** qualquer componente React da família; stories.
  - **Ships alone safely because:** adiciona dependências, tipos e itens COSS sem mudar nenhum pattern existente.

- [x] **T1 · Pattern `flow/canvas` sobre React Flow [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`, com `tc96-frontend:storybook-story` para as stories e `tc96-frontend:storybook-test` para os `play`
  - **Depends on:** T0
  - **Inputs:** ADR 0006 (D3, D4, D5, D6, D7, D10); `user-experience.md` §2 "Canvas", §3, §4
  - **Scope:**
    - `packages/parttens/src/flow/canvas/` no layout da casa: `composition/flow-canvas/` (`FlowCanvas`: `ReactFlowProvider` dentro, `Background`, `nodeTypes`, `edgeTypes`, `onDrop` com `parseStepTransfer` e `screenToFlowPosition`, `onConnect`, seleção controlada, `locked`, `snapToGrid`, `direction`), `composition/flow-canvas-controls/` (`FlowCanvasControls`: Selecionar/Mover em `ToggleGroup`, zoom com o nível como botão que ajusta, e `children` para Desfazer/Refazer/Travar ou Organizar), `composition/flow-canvas-minimap/`, `components/` (`flow-step-node.tsx`, `flow-step-edge.tsx` com rótulo e `taken`, `flow-edge-controls.tsx`, `flow-step-toolbar.tsx` com `Group`, `flow-step-context-menu.tsx`, `flow-shortcuts-popover.tsx`, `flow-canvas-empty.tsx`), `hooks/` (`use-flow-shortcuts.ts` que ignora campos de texto, `use-flow-drop.ts`), `lib/` (`to-react-flow.ts`: `FlowStep` → `Node`, `FlowConnection` → `Edge`, e a volta; `variants.ts`), `store/flow-canvas-context.ts` (modo, rótulos, ícones, callbacks), `types/index.ts`, `index.ts`, `AGENTS.md` nas sete seções.
    - Cores só por classe Tailwind sobre token; o que o React Flow só aceita por `--xy-*` entra no tema do exemplo escopado em `.react-flow` e vai para a nota do consumidor em `docs/architecture/tc96-parttens.md`.
    - Classes que sobrescrevem parte do COSS registradas em `scripts/override-exceptions.json`.
    - Stories em `apps/storybook/src/patterns/flow/canvas/`: `flow-canvas.stories.tsx` (`Patterns/Flow/Canvas`, `Doc` com `usage` que mostra o import de `base.css`, e `api`), fixtures `fixtures/lead-routing.ts` (horizontal, com execução falha) e `fixtures/collections-agent.ts` (vertical, com execução passada), stories por estado da tabela "Componentes novos" do `user-experience.md`, `usages/` com `tags: ['!autodocs']`.
    - Auditoria visual: contraste do nó, da aresta, do rótulo, do minimapa e dos controles no claro e no escuro com as razões; espaçamento e composição em screenshot; registro em `docs/architecture/tc96-parttens.md`.
  - **Acceptance:**
    - `FlowCanvas` monta sem regra de negócio: não busca, não persiste, não calcula execução; `onStepsChange` recebe o passo movido, `onConnect` a conexão nova, `onSelect` o id ou `null`, `onStepDrop` o tipo e a posição, `onStepAction` a ação e o id.
    - O nó tem `role="group"`, `aria-roledescription` e o nome `<nome>, <tipo>, <estado>`; o gatilho não mostra duplicar nem excluir; o selecionado mostra o toolbar com os nomes da tabela de §4.
    - A aresta com `taken` anima; com `label` mostra o rótulo; em `vertical` mostra os controles no hover e no foco.
    - `locked` bloqueia arrastar e conectar; `snapToGrid` alinha; os atalhos `V`, `H`, `+`, `-`, `Shift+1`, `Shift+0`, `Backspace` funcionam e não disparam dentro de um `input` ou `textarea`.
    - `play` de `Horizontal`: seleciona um nó pelo clique, confere o toolbar e chama `onSelect`; abre o menu de contexto e chama `onStepAction('edit', id)`; `play` de `Vertical`: foca um controle de aresta e chama `onStepAction('add-after', ...)` ou o callback de conexão.
    - `bun test` cobre `to-react-flow` nos dois sentidos e o `onDrop` com um `DataTransfer` montado à mão.
    - Nenhuma classe de borda, raio, cor ou sombra sobre parte do COSS fora de `scripts/override-exceptions.json`; `bun run story:source` da `Horizontal` imprime um componente pronto.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bunx biome check <arquivos tocados>` | exit 0 |
    | `bun test packages/parttens/src/flow/canvas` | exit 0 |
    | `bun run typecheck && bun run storybook:typecheck && bun run storybook:lint` | exit 0 |
    | `bun run check:coss && bun run boundaries:check && bun run overrides:check` | exit 0 |
    | `cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/flow/canvas` | todos passam, zero violação de axe |
    | `bun run build:registry` | `flow-canvas.json` com `@xyflow/react@12.12.0` e `d3-hierarchy@3.1.2` em `dependencies` e os COSS em `registryDependencies` |
    | `bun scripts/verify-public-api.ts --record` | baseline com os exports do canvas; citado no resumo do PR |
    | screenshots claro e escuro de `Horizontal` e `Vertical` | anexados ao PR, com as razões de contraste |
  - **Test types:** static; unit (`bun test`); component (`storybook:test` com axe: só ele prova o toolbar sobre o viewport real e o contraste no escuro).
  - **Out of this Task:** biblioteca, inspector, assistente, templates; undo/redo (callbacks só).
  - **Ships alone safely because:** o item `flow-canvas` fica completo e instalável sozinho; nada existente o importa.

- [x] **T2 · Pattern `flow/step-library` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T0
  - **Inputs:** ADR 0006 (D7, D10); `user-experience.md` §2 "Biblioteca de passos", §4
  - **Scope:**
    - `packages/parttens/src/flow/step-library/`: `composition/step-library/` (`FlowStepLibrary`: título, dica, grupos, `ScrollArea`, rodapé por `children`), `composition/step-library-group/`, `composition/step-library-item/` (`button` com `draggable`, `onDragStart` que grava `serializeStepTransfer`, `onClick` que chama `onAdd`), `composition/flow-run-card/` (`FlowRunCard`: `Card` com ícone, título, `Badge` de estado, descrição e `Progress` com `aria-label`), `components/step-library-skeleton.tsx`, `lib/variants.ts`, `core.ts` (`FlowStepGroup`, `groupStepTypes`), `types/index.ts`, `index.ts`, `test/dom.ts`, `AGENTS.md`.
    - Importa de `../canvas/core` só tipos e `serializeStepTransfer`.
    - Stories em `apps/storybook/src/patterns/flow/step-library/` (`Patterns/Flow/Step Library`, `Doc`): `Default`, `Loading`, `Empty`, `WithRunCard` (Failed, Passed, NotRun), `Collapsed`; fixtures com os grupos do workflow e os do agent.
  - **Acceptance:**
    - Cada item é um `button` com o nome do passo, `draggable`, e `onDragStart` grava `FLOW_STEP_TRANSFER_TYPE` no `dataTransfer`; o clique chama `onAdd(type)`.
    - Cada grupo é um `group` com o rótulo; a lista rola dentro de `ScrollArea`; `loading` mostra esqueletos e `aria-busy`; sem grupos mostra `Empty`.
    - `FlowRunCard` tem `role="region"`, nome "Última execução", e a barra `progressbar` com "Última execução: <n>%".
    - `play` de `Default`: clica num item e confere `onAdd`; monta um `DataTransfer` em `fireEvent.dragStart` no `bun test` e confere o payload (se o `play` não conseguir, fica só no `bun test`, registrado).
    - Sem sobrescrita de COSS fora de `scripts/override-exceptions.json`.
  - **Evidence:** as mesmas linhas de T1, com `packages/parttens/src/flow/step-library` e `src/patterns/flow/step-library`; `bun run build:registry` gera `flow-step-library.json` sem `@xyflow/react` em `dependencies`.
  - **Test types:** static; unit; component (axe no claro e no escuro).
  - **Out of this Task:** soltar no canvas (T1); o cartão colapsado no móvel como `Sheet` (backlog).
  - **Ships alone safely because:** item completo sem dependência do React Flow.

- [x] **T3 · Pattern `flow/inspector` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T0
  - **Inputs:** ADR 0006 (D8, D10); `user-experience.md` §2 "Inspector", §3, §4 (formulários, foco)
  - **Scope:**
    - `packages/parttens/src/flow/inspector/`: `composition/flow-inspector/` (`FlowInspector`: `aside` com `data-docked`, `aria-label`, `inert` fechado, largura por variável, transição com `motion-reduce`; abaixo de `md` renderiza `Sheet`; cabeçalho com `IconFrame`, título, `Badge` e `children` do cabeçalho; `Tabs` controladas `tab`/`onTabChange` com `disabledTabs`; rodapé por `children`), `composition/flow-inspector-details/` (lista Detalhes), `composition/flow-inspector-status/` (Última execução + Execuções de teste), `composition/flow-inspector-logs/` (`ToggleGroup`, contagem, lista, `Empty` com ação), `components/` (`inspector-header.tsx`, `stat-grid.tsx`, `log-entry.tsx`), `hooks/use-inspector-dock.ts` (sobre `@tc96/ui/hooks/use-media-query`), `store/flow-inspector-context.ts`, `core.ts` (`FlowInspectorTab`, `FlowLogEntry`, `FlowStepStats`), `types/index.ts`, `index.ts`, `test/dom.ts`, `AGENTS.md`.
    - Importa de `../canvas/core` só tipos.
    - Stories em `apps/storybook/src/patterns/flow/inspector/` (`Patterns/Flow/Inspector`, `Doc`): `View`, `Edit` (formulário de exemplo na story, com `Field`, `Input`, `Textarea`, `Select`), `Create`, `Status`, `Logs`, `LogsEmpty`, `WithAlert`, `Sheet` com viewport `mobile2` como ambiente.
  - **Acceptance:**
    - O `aside` tem nome "Detalhes do passo"; fechado fica `inert` com largura zero; aberto a partir de `md` tem `data-docked="true"`; abaixo de `md` abre um `Sheet` com o mesmo conteúdo.
    - As abas são `tab` com os nomes Build, Status, Logs; `disabledTabs` desabilita Status e Logs no modo criar; trocar aba chama `onTabChange`.
    - Details, Status e Logs renderizam só o que recebem; Logs vazio mostra `Empty` e a ação chama o callback; o filtro "Este passo | Todos os passos" chama `onFilterChange`.
    - `play` de `Edit`: foca o primeiro campo ao abrir, troca de aba pelo teclado, fecha com Esc no `Sheet` e chama `onClose`; axe sem violação com o formulário.
    - Sem sobrescrita de COSS fora de `scripts/override-exceptions.json`.
  - **Evidence:** as mesmas linhas de T1, com `packages/parttens/src/flow/inspector` e `src/patterns/flow/inspector`; `flow-inspector.json` sem `@xyflow/react`.
  - **Test types:** static; unit; component (axe; o `Sheet` só se prova no viewport real).
  - **Out of this Task:** os campos do formulário de Build (T5, `shared/step-form.tsx`); dock redimensionável (backlog).
  - **Ships alone safely because:** item completo; serve a qualquer tela com painel lateral de detalhes.

- [x] **T4 · Pattern `chat/assistant` sobre o COSS chat e composer [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T0
  - **Inputs:** ADR 0006 (D9); `user-experience.md` §2 "Assistente", §4
  - **Scope:**
    - `packages/parttens/src/chat/assistant/`: `composition/assistant-panel/` (`AssistantPanel`: `Card` flutuante ou ancorado por `placement`, cabeçalho com título, `Badge`, Nova conversa, Histórico, Expandir/Minimizar, Encerrar; corpo com saudação, descrição e sugestões quando `messages` está vazio, `ChatConversation` + `ChatMessage` quando não; `ChatTypingIndicator` em `typing`; aviso fixo), `composition/assistant-suggestions/`, `composition/assistant-composer/` (`Composer*` com Anexar e Enviar), `store/assistant-context.ts`, `core.ts` (`AssistantMessage`, `AssistantSuggestion`), `lib/variants.ts`, `types/index.ts`, `index.ts`, `test/dom.ts`, `AGENTS.md`.
    - Controlado: `messages`, `suggestions`, `typing`, `expanded`, `onSend`, `onSuggestion`, `onAttach`, `onNewChat`, `onHistory`, `onExpandedChange`, `onEnd`. Nenhuma chamada a modelo.
    - Stories em `apps/storybook/src/patterns/chat/assistant/` (`Patterns/Chat/Assistant`, `Doc`): `Empty`, `Conversation`, `Typing`, `Error`, `Expanded`, `Minimized`; `usages/workflow.stories.tsx` com as sugestões do editor.
    - `apps/storybook/src/patterns/chat/` ganha a pasta; `Patterns/Chat` continua com o `chats-panel` (regra de 2026-10-21).
  - **Acceptance:**
    - O painel tem nome "Assistente"; Enviar chama `onSend(text)` e limpa o compositor; clicar numa sugestão chama `onSuggestion`; `Enter` envia e `Shift+Enter` quebra linha (comportamento do `Composer`).
    - Com `messages` vazio mostra saudação e sugestões; com mensagens a lista rola para a última (`useChatScroll`); `typing` mostra o indicador com nome acessível.
    - `play` de `Empty`: clica numa sugestão e confere `onSuggestion`; `play` de `Conversation`: digita, envia e confere `onSend`; axe sem violação.
  - **Evidence:** as mesmas linhas de T1, com `packages/parttens/src/chat/assistant` e `src/patterns/chat/assistant`; `chat-assistant.json` com `@coss/chat` e `@coss/composer` em `registryDependencies`.
  - **Test types:** static; unit; component (axe; só o viewport real prova o cartão flutuante sobre o canvas).
  - **Out of this Task:** histórico de conversas, anexos reais, streaming.
  - **Ships alone safely because:** item completo na família `chat`; nada existente o importa.

- [ ] **T5 · Templates `workflow-editor` e `agent-builder` com `shared/` e documentação [ENGINEERING + DOCS]**
  - **Owner:** `tc96-frontend:frontend-developer`, com `tc96-frontend:storybook-story` e `tc96-frontend:storybook-test`
  - **Depends on:** T1, T2, T3, T4
  - **Inputs:** ADR 0005 (D1, D3, D4, D6, D8); ADR 0006 (D1, D4, D8); `user-experience.md` inteiro
  - **Scope:**
    - `packages/templates/src/application/flow/shared/`: `types.ts` (contrato dos dois templates: `flow`, `stepTypes`, `icons`, `run`, `selectedStepId`, callbacks de passo, conexão, execução e assistente, `labels`), `labels.ts` (pt-BR), `flow-page-header.tsx` (nome, Atalhos, Pergunte à IA, Adicionar passo, Executar, Ações em `Menu`), `flow-page-layout.tsx` (biblioteca `min-w-0` + canvas + dock; biblioteca colapsa abaixo de `md`), `step-form.tsx` (Tipo, Nome, Descrição, Responsável ou Caminho sobre `Field`, `Input`, `Textarea`, `Select`; validação de nome obrigatório; erro em `FieldError`), `use-flow-page-state.ts` (só efêmero: inspector aberto, modo, aba, assistente aberto).
    - `workflow-editor/` (`index.ts`, `workflow-editor.tsx`): canvas `horizontal`, controles com Desfazer/Refazer/Travar, minimapa, menu com Alinhar à grade e Reorganizar, confirmação por `AlertDialog` ao excluir passo conectado.
    - `agent-builder/` (`index.ts`, `agent-builder.tsx`): canvas `vertical` com controles de aresta, "Organizar árvore" chamando `tidyTree` e `onStepsChange`, menu com Limpar resultados e Restaurar exemplo (callbacks), formulário com Caminho.
    - Patterns importados por arquivo (`@tc96/parttens/flow/canvas/composition/flow-canvas/flow-canvas` e assim por diante), nunca pelo barrel (ADR 0005 D3).
    - Stories em `apps/storybook/src/application/flow/`: `workflow-editor.stories.tsx` (`Application/Flow/WorkflowEditor`, `layout: 'fullscreen'`, `Doc` com `usage` e `api`), `agent-builder.stories.tsx`, `fixtures/lead-routing.tsx` e `fixtures/collections-agent.tsx` (ícones Lucide e `@thesvg/icons`, lacuna g); stories `Default`, `Empty`, `Running`, `Failed`, `Mobile` (viewport como ambiente); decorator `withAppShell` como as telas do Storybook.
    - Documentação: `apps/storybook/src/templates/doc.mdx` ganha a tabela dos dois templates e a linha do `base.css`; `README.md` (seção pública) e `docs/architecture/tc96-parttens.md` ganham a seção "Templates: editores de fluxo" com contraste, `base.css`, `--xy-*` no tema do exemplo e o registro das decisões de escala.
    - `packages/templates/AGENTS.md`: `Map` e `Dependents` com o grupo `flow`; o teste `todo` de T0 volta a ativo.
  - **Acceptance:**
    - Cada template monta sem fetch, sem persistência, sem modelo e sem tema; cada ação da jornada (§1 do `user-experience.md`) chama o callback com o payload descrito.
    - `play` de `WorkflowEditor/Default`: clica num item da biblioteca e confere `onStepAdd`; seleciona um nó, abre Editar, muda o nome, salva e confere `onStepChange`; abre Pergunte à IA e envia uma sugestão.
    - `play` de `AgentBuilder/Default`: abre o menu do nó, escolhe Adicionar ramo e confere `onStepAdd` com o pai; clica Organizar árvore e confere `onStepsChange` com posições sem sobreposição.
    - `Mobile`: biblioteca colapsada, inspector como `Sheet`, assistente em tela cheia.
    - Contraste medido no claro e no escuro (texto 4,5:1, gráfico 3:1), com as razões no `docs/architecture/tc96-parttens.md`; axe sem violação nas duas.
    - `bun run story:source` de `Default` dos dois imprime um componente pronto; `manifest.test.ts` confere que `workflow-editor.json` leva só os arquivos de `application/flow/`, dos quatro patterns, de `elements` e de `helpers` que ele usa.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bunx biome check packages/templates apps/storybook/src/application/flow` | exit 0 |
    | `bun run typecheck && bun run storybook:typecheck && bun run storybook:lint` | exit 0 |
    | `bun run boundaries:check && bun run overrides:check` | exit 0 |
    | `bun run test:registry` | exit 0, com o teste das pastas de template ativo |
    | `bun run build:registry` | gera `workflow-editor.json` e `agent-builder.json` |
    | `cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/application/flow` | todos passam, zero violação de axe |
    | `bun scripts/verify-public-api.ts --record` | baseline com `template:workflow-editor` e `template:agent-builder` |
    | screenshots claro e escuro de `Default`, `Failed` e `Mobile` dos dois | anexados ao PR |
  - **Test types:** static; unit (`manifest.test.ts`); component (axe e `play`: só o viewport real prova o layout de três painéis, o `Sheet` e o cartão flutuante).
  - **Out of this Task:** instalar num consumidor (T6); página no `apps/docs`.
  - **Ships alone safely because:** os dois itens só compõem o que T1 a T4 entregaram; nada existente muda.

- [ ] **T6 · Gate, consumidor real e revisão independente [VALIDATION]**
  - **Owner:** `tc96-core:qa-engineer` para a leitura; `tc96-core:code-reviewer` em contexto novo para a revisão; `tc96-core:repo-operator` para o PR
  - **Depends on:** T0 a T5
  - **Inputs:** este plano; `Registro da execução`
  - **Scope:**
    - `scripts/test-consumer-registry.ts`: instala `flow-canvas` num consumidor sem `tabs` e `workflow-editor` num consumidor sem nada da família; confere `@xyflow/react` e `d3-hierarchy` no `package.json` do consumidor e o `tabs.tsx` gravado.
    - `bun run check` e `bun run test:consumer:registry` verdes.
    - Revisão do diff inteiro por `tc96-core:code-reviewer` com `react-review`, `tailwind-review` e `react-structure` (fronteira: `@xyflow/react` só em `flow/canvas`, imports por arquivo nos templates).
    - PR de `feat/flow-editors` para `main` com `Closes #N` se houver issue; resumo cita o baseline da API pública, as dependências novas e a linha do `base.css` para o consumidor.
  - **Acceptance:** `bun run check` exit 0; consumidor compila depois de instalar `workflow-editor`; nenhum achado `blocker` aberto na revisão.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bun run check` | exit 0 |
    | `bun run test:consumer:registry` | exit 0, com `flow-canvas` e `workflow-editor` instalados |
    | `bun run verify:public-api` | exit 0 sem `--record` |
    | `gh pr view <n> --json closingIssuesReferences` | as issues do PR |
  - **Test types:** integration (`test:consumer:registry`: só ele prova a instalação com os aliases e o `tsc` do consumidor); review.
  - **Out of this Task:** publicar no npm. A versão nova do CLI sai por release própria, com pausa para o `npm login` do dono.
  - **Ships alone safely because:** não muda código; fecha a evidência.

### Done when

- Cada Task nomeia um dono, as dependências e os inputs.
- Cada Task tem aceitação escrita e tabela de evidência.
- Cada Task nomeia os tipos de teste, e nenhum fica acima do mais barato que pega o defeito sem a frase que diz por quê.
- Cada input está aceito e cada lacuna de que uma Task depende está fechada, ou a Task espera.

### Fora deste plano

- Dock redimensionável, histórico de undo/redo como helper, toast de "passo criado", histórico do assistente, biblioteca como `Sheet` no móvel.
- Página no `apps/docs`.
- Publicação da versão do CLI com os itens novos.
- Uma página do `apps/example` com o canvas (a linha do `base.css` entra nesse dia).

### Registro da execução

Cada sessão acrescenta aqui a data, a Task, e cada desvio do plano com o lugar onde ficou registrado (ADR, `AGENTS.md`, `docs/architecture/tc96-parttens.md`).

**2026-10-23 · T0** (parte de engenharia; as lacunas a a h foram fechadas pelo dono com as recomendações e os status já estavam movidos por ele; nenhum `status` foi mudado nesta sessão). Evidência da tabela da T0 toda verde. Desvios:

- Branch `claude/flow-editors-t0-c6fa5e`, cortada de `main`, no lugar de `feat/flow-editors` (lacuna e ainda aberta); os arquivos de `.specs/` são não rastreados e foram copiados do checkout principal para o worktree.
- `sync:coss tabs context-menu progress alert` trouxe também `segmented-control`, dependência do `tabs`; entrou em `packages/ui/src` e no `coss.lock.json`. `select.tsx` e `combobox.tsx` não mudaram.
- `@types/d3-hierarchy` 3.1.7 (série 3.1.x) e `@xyflow/react`/`d3-hierarchy` também em `devDependencies` da raiz, como as demais dependências de pattern.
- `build-registry.ts` e `verify-public-api.ts` ignoram templates cuja pasta ainda não existe (`existsSync`), senão `build:registry` e `verify:public-api` falham até a T5; a T5 pode remover o filtro. O baseline não tem `template:workflow-editor` nem `template:agent-builder` por isso.
- `manifest.test.ts`: o teste das pastas de template e o teste de que `flow-canvas` declara `@xyflow/react@12.12.0` ficam `test.todo` (o segundo porque o item só ganha o import do React Flow na T1). Ativos: `d3-hierarchy@3.1.2` em `flow-canvas`, ausência de `@xyflow/react` nos outros três itens, e a resolução de `@tc96/parttens/flow/canvas/core` a partir de um template.
- `bun scripts/verify-public-api.ts --record` acrescentou também `template:app-shell-2`, `-3`, `-4` e seus exports, pendentes antes desta Task e sem relação com ela.
- `TidyTreeOptions` foi exportado além do contrato, e `nodeSize` e `gap` são `readonly [number, number]`.

**2026-10-23 · T1** (branch `claude/flow-editors-t1-canvas-7299a1`, cortada de `feat/flow-editors` no commit `8a92850`). Evidência da tabela da T1 verde, exceto os screenshots anexados ao PR (não há PR nesta sessão; as razões de contraste e a leitura visual estão em `docs/architecture/tc96-parttens.md`, "Patterns: Flow Canvas"). Desvios:

- `--xy-*` por classe, não pelo tema do exemplo: as variáveis do React Flow são redefinidas na raiz `.react-flow` com classes arbitrárias do Tailwind sobre token (`lib/variants.ts`), então `apps/example/packages/ui/src/styles.css` não mudou; o que `base.css` escreve direto em propriedade (`stroke` da aresta, fundo do handle, cor do link de atribuição) usa o modificador `!`. Registrado em `docs/architecture/tc96-parttens.md` e no `AGENTS.md` do pattern.
- `onStepsChange` recebe a lista inteira com o passo movido (React Flow controlado), e `onStepAction` ganhou um terceiro argumento opcional, a conexão, para o "+" da aresta (`add-after` com `connection.source` e a conexão); remover conexão chama `onConnectionsChange`. `core.ts` não mudou. Registrado em `AGENTS.md`, "Invariants".
- `flowStepNodeSize` (256 por 100) sai do barrel do canvas para o consumidor passar ao `tidyTree`; `FlowShortcutsPopover` também é público. Baseline `public-api-exports.json` regravado com os 14 exports novos (só do canvas).
- Em modo controlado o React Flow não dá `measured` ao nó sem as mudanças `dimensions`; o canvas as guarda em estado efêmero (sem elas o minimapa não desenhava nó algum). Registrado em `docs/architecture/tc96-parttens.md`.
- Handles com `role="button"` porque o axe recusa `aria-label` em `div` sem papel; não são operáveis por teclado (o React Flow não os torna focáveis), então "`Tab` passa pelos handles" da `user-experience.md` §4 não foi atendido. Registrado em `AGENTS.md`.
- `test/dom.ts` (da T0) passou a pôr `ResizeObserver` e `DOMMatrixReadOnly` também em `window`; o React Flow lê `window.DOMMatrixReadOnly`.
- O `FlowStepNode` não mostra `FlowStepRun.note`; as métricas aparecem só no rodapé vertical (agent) e a duração só no horizontal (workflow). A `note` fica para o inspector (T3).
- `manifest.test.ts`: o `test.todo` de `@xyflow/react@12.12.0` em `flow-canvas` virou teste ativo.
- `storybook:test` do React Flow no vitest browser fechou sem mocks (`ResizeObserver` e medidas reais); o único aviso foi `ResizeObserver loop completed with undelivered notifications` no log do `storybook dev`, benigno e sem efeito nos testes.
**2026-10-23 · T2** (`flow/step-library`, branch `claude/flow-editors-t2-step-library-5d354b` a partir de `8a92850`). Evidência da tabela da T2 toda verde: biome, `bun test packages/parttens/src/flow/step-library` (12 testes), typecheck, storybook typecheck e lint, `check:coss`, `boundaries:check`, `overrides:check`, `verify:public-api` sem `--record`, `build:registry` (`flow-step-library.json` sem `@xyflow/react`), `vitest run` do `src/patterns/flow/step-library` nos dois projetos (16 testes, axe sem violação). Desvios:

- `FlowStepLibrary` ganhou a prop `collapsed` (só ícones, 3,5rem), fora do contrato da Task: registrada em `docs/architecture/tc96-parttens.md`, seção "Patterns: Flow Step Library", e em `flow/step-library/AGENTS.md`.
- O grupo é `fieldset` com `legend` em vez de `div role="group"`, porque o lint de semântica pede o elemento nativo; registrado em `docs/architecture/tc96-parttens.md` (mesma seção).
- `FlowRunCard` recebe `run: FlowRunSummary` e `labels`, em vez de `title`, `status` e `progress` soltos; o texto de resumo (`summary`, com `{completed}` e `{total}`) é label, nada em pt-BR fixo no componente. Registrado em `flow/step-library/AGENTS.md`.
- `core.ts` exporta também `defaultFlowStepLibraryLabels`, `defaultFlowRunCardLabels` e os tipos de label; o barrel do pattern exporta `groupStepTypes`. Registrado em `flow/step-library/AGENTS.md` e no baseline `docs/architecture/public-api-exports.json` (gravado com `--record`; o diff traz só os exports do pattern, 14 nomes, dois deles os defaults).
- O item traz `d3-hierarchy` no `dependencies` do registry, porque importa `flow/canvas/core.ts` (ADR 0006 D2); `@xyflow/react` ficou de fora. Registrado em `docs/architecture/tc96-parttens.md` e em `flow/step-library/AGENTS.md`.
- As stories de `WithRunCard` são três exports (`WithRunCardFailed`, `WithRunCardPassed`, `WithRunCardNotRun`) em vez de uma story com argumento, e há `AgentGroups` além da lista da Task, para mostrar o fixture do agente. Registrado no próprio arquivo de stories.
- O `play` de `Default` clica no item e confere `onAdd`; o arraste não é coberto no `play`, porque o Storybook não passa `dataTransfer`. O payload é conferido só no `bun test` (`step-library.test.tsx`), como a Task pede. Registrado em `flow/step-library/AGENTS.md`.
- Auditoria de contraste no `Default` com o cartão `Failed`: todo texto ≥ 4,5:1 no claro e no escuro; o indicador do progresso ≥ 4:1 contra a trilha. A trilha do progresso fica em 1,26:1 contra o cartão (abaixo de 3:1); o token `input` não muda, a nota está em `docs/architecture/tc96-parttens.md`.
- O `bun test` imprime avisos de `act(...)` vindos do `ScrollArea` do COSS (estado interno do Base UI); os testes passam e os avisos não vêm do pattern.
- Storybook de verificação subiu na porta 6016, porque a 6006 estava ocupada por outra sessão; nada foi gravado nela.

**2026-10-23 · T3** (`flow/inspector`; evidência da tabela da T3 toda verde, com `bun test --isolate` em 30 testes, vitest nos dois temas com axe em 16 testes e `flow-inspector.json` sem `@xyflow/react`). Desvios:

- O contrato fala em "`children` do cabeçalho": o pattern recebe `headerActions` e desenha sempre o botão "Fechar detalhes do passo" depois dele; `build`, `status` e `logs` são o conteúdo de cada aba e `children` é o rodapé (o plano diz "rodapé por `children`"). Registrado em `flow/inspector/AGENTS.md` (Invariants).
- `FlowStepStats` é `{ entered, completed }` (a taxa de abandono é calculada por `flowStepAbandonment`); `FlowLogFilter` (`'step' | 'all'`) foi exportado além do contrato. O `FlowInspectorLogs` recebe as entradas já filtradas (padrão "sem filtro dentro do pattern"). `docs/architecture/tc96-parttens.md`, "Patterns: Flow Inspector".
- `flow-inspector.json` declara `d3-hierarchy@3.1.2` porque o item leva `flow/canvas/core.ts` (ADR D2, que importa `d3-hierarchy`); não declara `@xyflow/react`.
- O ícone do `Alert` `warning` usa `[&>svg]:text-warning-foreground` (1,99:1 → 4,70:1 no claro). `overrides:check` não acompanha cor e rejeitou a exceção como sem uso, então ela não entra em `scripts/override-exceptions.json`; ficou em `AGENTS.md` (Styling) e na seção "Patterns: Flow Inspector".
- A borda do separador das abas está num `div` em volta do `TabsList`, para não sobrescrever a borda de um item COSS.
- O Base UI desabilita a aba com `aria-disabled` e `pointer-events: none`, não com o atributo `disabled`; as stories e os testes asseguram `aria-disabled`.
- O "primeiro campo focado ao abrir" é do formulário da story (`autoFocus` no Tipo): o dock não move o foco, só o `Sheet` do Base UI move.
- `bun scripts/verify-public-api.ts --record` só acrescentou as exportações do inspector. `packages/registry/src/cli.test.ts` estoura os 5 s padrão sob carga ("preserves an existing file"); passa com `--timeout 60000`.

**2026-10-23 · T4** (pattern `chat/assistant`). Evidência da tabela da T4 toda verde. Desvios:

- `packages/registry/src/build-registry.ts`: o regex `uiComponent` só reconhecia `@tc96/ui/<componente>`, então `@tc96/ui/chat/<parte>` não gerava `@coss/chat` em `registryDependencies`; passou a mapear `@tc96/ui/chat/*` para `@coss/chat`, com teste em `manifest.test.ts` (`chat-assistant` declara `@coss/chat` e `@coss/composer`). Fora da pasta da T4, mas exigido pela aceitação; as outras fases com `chat/*` herdam a correção.
- `ComposerInput` recebe `placeholder:text-muted-foreground`, porque o placeholder do COSS (`muted-foreground/72`) media 3,08:1 no claro e 3,15:1 no escuro; exceção em `scripts/override-exceptions.json`, razões em `docs/architecture/tc96-parttens.md` ("Patterns: Chat Assistant") e em `chat/assistant/AGENTS.md`.
- "Minimizado" é `expanded={false}` (tamanho compacto do cartão flutuante), não um cabeçalho recolhido: o contrato controlado do plano só tem `expanded`; registrado no `AGENTS.md` do pattern e na doc de arquitetura. Cada botão do cabeçalho só renderiza com o callback; `onRetry(id)` entrou além da lista do plano, para a ação "tentar de novo".
- A story `Error` tem o export `Failed` com `name: 'Error'`, porque o Biome proíbe sombrear o global `Error`; o ID é `patterns-chat-assistant--failed`.
- `test/dom.ts` do assistente acrescenta, sobre a cópia do `chats-panel`, os globais de formulário, `document.fonts`, `ResizeObserver` e `getAnimations` que o `Composer` e o `ScrollArea` do COSS pedem em JSDOM.
- `bun run build:registry` e `bun scripts/verify-public-api.ts --record` regravaram o baseline com os exports do `chat-assistant`; o `bun install` na worktree foi necessário (sem `node_modules`).
