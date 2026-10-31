# Flow Canvas pattern

A controlled graph editor on `@xyflow/react`: `FlowCanvas` (its own `ReactFlowProvider`, dotted background, one node type and one edge type), `FlowCanvasControls` (cursor mode, zoom and a slot for the consumer's buttons), `FlowCanvasMinimap` and `FlowShortcutsPopover`. The consumer passes the steps, connections, selection, labels and icons and owns the history, the execution, the persistence and every id; the canvas emits `onStepsChange`, `onConnect`, `onConnectionsChange`, `onSelect`, `onStepDrop` and `onStepAction` (plus `onStepsChangeEnd`). The pattern never fetches, persists, orders or computes a run, and ships no CSS; its only state is the cursor mode and the measured node sizes.

## Map

| Folder | Holds |
| --- | --- |
| `composition/flow-canvas/` | `FlowCanvas`, the single place that imports `ReactFlow`, `Background` and the provider |
| `composition/flow-canvas-controls/` | `FlowCanvasControls`: the `Panel` with the cursor `ToggleGroup`, zoom and `children` |
| `composition/flow-canvas-minimap/` | `FlowCanvasMinimap` |
| `components/` | the node (`flow-step-node.tsx`), the edge and its controls, the node toolbar, context menu and actions menu, the shortcuts popover, the empty state and small helpers; never public except `FlowShortcutsPopover` |
| `hooks/` | `useFlowShortcuts` (key handler for the canvas wrapper; it ignores events whose target is outside the wrapper) and `useFlowDrop` (`onDragOver` and `onDrop` over `screenToFlowPosition`) |
| `lib/` | `to-react-flow.ts` (steps and connections to nodes and edges, move, drag-end, selection and measured-size helpers), `steps.ts` (kind, icons, action lists), `labels.ts` (pt-BR defaults), `variants.ts` (every class) |
| `store/` | `flow-canvas-context.ts`: mode, labels, icons, connections and callbacks for the node, edge and controls |
| `types/` | the props, labels and the React Flow node and edge types |
| `core.ts` | the React-free vocabulary of the whole `flow` family (`FlowStep`, `FlowConnection`, `tidyTree`, `flowStepNodeSize`, `parseStepTransfer`, ...), with `core.test.ts`; owned by the plan, not edited by the canvas. `flowStepNodeSize` moved here from `lib/steps.ts` in T5 so a template reaches it through `@tc96/parttens/flow/canvas/core`, the only `.ts` entry of the `exports` map |

Import direction: `composition/` → `components/`, `hooks/`, `lib/`, `store/`, `types/`, `core.ts`; `components/` → `lib/`, `store/`, `types/`, `core.ts`, `@tc96/elements` and COSS; `lib/`, `hooks/` and `store/` → `core.ts` and `types/`. `@xyflow/react` is imported only inside this folder (`scripts/check-boundaries.test.ts`). No import into another pattern.

## Dependents

- `flow/step-library` and `flow/inspector` import types and `serializeStepTransfer` from `../canvas/core` only, never from this folder's React files.
- `packages/templates` (`workflow-editor`, `agent-builder`) import `FlowCanvas`, `FlowCanvasControls` and `FlowCanvasMinimap` by file path (`@tc96/parttens/flow/canvas/composition/flow-canvas/flow-canvas`) and `tidyTree` from `@tc96/parttens/flow/canvas/core`. Renaming a composition file breaks them.
- `packages/parttens/src/index.ts` re-exports `flow/canvas/index`; `packages/registry/src/manifest.ts` and `scripts/test-patterns.ts` list the folder `flow/canvas` for the item `flow-canvas`; `manifest.test.ts` asserts it declares `@xyflow/react@12.12.0` and `d3-hierarchy@3.1.2`.

## Invariants

Controlled state:

- Selection is `selectedStepId`: the node `selected` flag is derived from it and `onSelect` fires once per change (click, Enter or Space on a focused node, pane click), deduplicated against the last known id. A box selection reports its first node.
- `onStepsChange` receives the whole list with the moved step's new position, on every drag tick, because React Flow is controlled and the consumer must feed the position back. `onStepsChangeEnd` receives the same list once, when a position change arrives with `dragging === false` (the end of a drag), so a consumer records one undo entry per drag. Dimension changes never reach the consumer; they are kept in state as `measured`, without which the minimap draws no node.
- `onConnect` gets `{ source, target, sourceHandle? }` with no id; the consumer creates the connection, and refuses duplicates and cycles. A self connection is refused by `isValidConnection`. A node has one output handle, so `FlowConnection.sourceHandle` is carried to `onConnect` only and `toEdges` ignores it.
- `onStepAction(action, stepId, connection?)`: the edge "+" sends `('add-after', connection.source, connection)`; the edge "remove" calls `onConnectionsChange` with the list minus that connection. The trigger never offers duplicate or delete, in the toolbar, the context menu and `Backspace`.
- The callbacks and the context value are stable: `FlowCanvas` keeps the consumer's callbacks in a latest-ref (synced in a layout effect), so a fresh function on every render does not rebuild the context.
- `locked` blocks dragging and connecting and shows the cursor as `select` (derived, not stored); it does not block selection. Every mutating control reads `locked` from the context and renders `disabled`: the toolbar, the node menu and the context menu for `add-after`, `add-branch`, `duplicate` and `delete` (`view` and `edit` stay enabled), the edge controls and the leaf "+" button. The drop is ignored while `locked` or `loading`. `loading` renders no node and sets `aria-busy`; no steps and not `loading` shows the `Empty`.
- Cursor mode: `select` drags nodes and a box on the pane, and pans with the middle or right button; `pan` pans with any button and does not drag nodes.

Keyboard and names:

- The shortcuts live on the `section` wrapper (`tabIndex={-1}`), so they act only while focus is inside the canvas; `V`, `H`, `+`/`=`, `-`, `Shift+1` (fit), `Shift+0` (100%), `Backspace`/`Delete`. They are ignored with a modifier, when the event is `defaultPrevented` and inside `input`, `textarea`, `select`, `contenteditable` or `role="textbox"`. `Shift+digit` reads `event.code`, since `event.key` changes with the layout.
- The node wrapper is the React Flow node (`role="group"`, `aria-roledescription` from `labels.stepRoleDescription`, name `labels.stepName`); the visible card is the `ContextMenu` trigger and the handles are its siblings, outside the trigger. The handles carry `role="button"` because axe refuses `aria-label` on a bare `div`; they are not keyboard operable (React Flow does not make them focusable).
- Edges are `focusable: false` and `selectable: false`: the operable parts are the buttons of `FlowEdgeControls`, which show on hover, on focus within and on coarse pointers (`opacity-0` to `opacity-100` on the wrapper, not on the COSS button).
- `FlowControlButton` wraps COSS `Button` in `Tooltip` and keeps the `aria-label`; it stays a direct child of `Group`, which joins buttons by `data-slot`.

Drop:

- `useFlowDrop` accepts a drop only with `FLOW_STEP_TRANSFER_TYPE` in `dataTransfer.types` and a payload `parseStepTransfer` accepts; the position is `screenToFlowPosition` of `clientX` and `clientY`, snapped when `snapToGrid`.

## Styling

- The consumer imports `@xyflow/react/dist/base.css`; the pattern ships no CSS. `lib/variants.ts` redefines the `--xy-*` variables on the `.react-flow` root with arbitrary-property classes over tokens, and uses `!` where `base.css` writes the property directly (edge `stroke`, handle `background-color`, attribution link color). The attribution stays visible. A `__` inside an arbitrary variant must be escaped (`react-flow\_\_attribution`), and the class is a `String.raw` template so the Tailwind scan and the runtime string agree.
- The node is the COSS `Card` inside the context menu trigger (`div[data-slot="flow-step-node"] > div[data-slot="card"]`), so border, radius, background and shadow are the theme's card; the trigger keeps the `flow-step-node` slot because a `data-slot` on the `Card` itself would replace `card` and lose the theme radius. The `Card` takes only rings: `ring-2 ring-primary` when selected and `group-focus-visible/step:ring-2 ring-ring` for the keyboard focus on the wrapper, registered in `scripts/override-exceptions.json`. Status colors stay on base tokens: only `failed` is `destructive`; success, running and skipped are `outline`/`secondary` badges and `muted-foreground` text, so a finished run does not tint every node. The controls panel uses the surface of the COSS `Toolbar` (`bg-card`, `border`, `rounded-xl`, `shadow-xs/5`). The initials of `AvatarFallback` use `text-foreground` (4,25:1 with the COSS `muted-foreground` on `bg-border` in the dark theme).
- `data-slot` and `data-*` contract: `flow-canvas` (`data-direction`, `data-mode`, `data-locked`), `flow-canvas-controls`, `flow-canvas-empty`, `flow-step-node` (`data-kind`, `data-status`), `flow-step-toolbar`, `flow-step-edge-label`, `flow-edge-controls`.
- Ratios and decisions of scale are in `docs/architecture/tc96-parttens.md`, "Patterns: Flow Canvas".

## Verify

```bash
bun test --isolate packages/parttens/src/flow/canvas/core.test.ts packages/parttens/src/flow/canvas/lib
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check
cd apps/storybook && bunx vitest run --project=storybook src/patterns/flow/canvas
bun run build:registry
```

Interface tests are `play` functions in `apps/storybook/src/patterns/flow/canvas/`: `states.stories.tsx` (loading, empty, node names), `drop.stories.tsx` (a `DragEvent` with a real `DataTransfer` on the pane), `keyboard.stories.tsx` (Backspace, V and H, keys from the portaled shortcuts popover) and `lock.stories.tsx` (disabled controls, mode forced to `select`), over `fixtures/two-steps.ts`. The bun tests left in this folder are pure logic: `core.test.ts` and `lib/to-react-flow.test.ts`.

Never run the bare `bun test packages/parttens`; use `bun run test:patterns`.

## Pointers

- `.specs/adr/0006-flow-family-on-react-flow.md`, `.specs/flow-editors/user-experience.md` (§2 Canvas, §4) and `.specs/flow-editors/tasks/0001-flow-editors.md` (T1, "Registro da execução").
- Stories: `apps/storybook/src/patterns/flow/canvas/` (`Patterns/Flow/Canvas`, fixtures `lead-routing.ts` and `collections-agent.ts`).
- `docs/architecture/tc96-parttens.md`, "Patterns: Flow Canvas".
