# Templates package

Installable templates: whole layouts that compose COSS components, `elements`, `helpers` and pattern modules, copied into the consumer by `tc96-parttens add <template>` ([ADR 0005](../../.specs/adr/0005-installable-templates.md)). The first group is `application/shell/` with `AppShell1` to `AppShell4`; the second is `application/flow/` with `WorkflowEditor` and `AgentBuilder`. A template is controlled like a pattern: data comes through props, links through `renderLink`, events through callbacks; it never fetches, persists, reads cookies or applies a theme. Templates that only live in Storybook (`Templates/Contacts` and the other CRM pages) stay in `apps/storybook/src/templates/` under [ADR 0004](../../.specs/adr/0004-templates-only-in-storybook.md).

## Map

| Folder | Holds |
| --- | --- |
| `src/<category>/<group>/<template>/` | one installable template; its `index.ts` is the module the consumer imports and the entry the registry walks |
| `src/<category>/<group>/shared/` | parts used by more than one template of the group; internal, shipped with every item that imports them |
| `src/application/shell/shared/` | types, labels, `renderAnchor`, `ShellNav`, `WorkspaceSwitcher`, `UserMenu`, `ShellHeader`, `ShellSearch`, `ShellNotifications` |
| `src/application/shell/app-shell-3/` | also `project-nav.tsx` and `usage-card.tsx`, used only there |
| `src/application/shell/app-shell-4/` | also `section-rail.tsx`, used only there |
| `src/application/flow/shared/` | types, labels, `renderAnchor`, `useFlowPageState` (ephemeral state), `createFlowEditorHandlers` (the handlers both editors share; no hooks), `FlowPageHeader`, `FlowPageLayout`, `FlowStepInspector` (the inspector assembly), `StepForm`, `FlowAssistant`, `FlowConfirmDialog`, `FlowDeleteDialog` (the step delete confirmation both editors mount, controlled by `pendingDelete` and `onPendingDeleteChange`), `FlowToolButton` |
| `src/application/flow/workflow-editor/` | `WorkflowEditor` only: horizontal canvas, undo, redo, lock, minimap, grid snapping |
| `src/application/flow/agent-builder/` | `AgentBuilder` only: vertical canvas, Organizar árvore, Limpar resultados, Restaurar exemplo |
| `src/application/flow/agent-builder/compositions/agent-builder/` | `AgentBuilder`, the page the consumer mounts; it owns the state and the handlers and hands them to the partials |
| `src/application/flow/agent-builder/partials/` | one region of the page each, controlled by plain props with the agent labels and `renderAnchor` as defaults; `partials/index.ts` is the barrel the composition and the stories import, and the template `index.ts` does not re-export it: `AgentBuilderActions` (in-page header or portal), `AgentBuilderMenu` (the Ações items), `AgentBuilderCanvas` (vertical canvas with Organizar árvore), `AgentBuilderLibrary` (library with the run card), `AgentBuilderDialogs` (clear and delete confirmations) |

Import direction: a template folder → its group's `shared/` and its own files; inside `agent-builder/`, `compositions/` → `partials/` → `shared/`, and a partial never imports another partial; `shared/` → COSS, `@tc96/elements`, `@tc96/helpers`, never a template folder; no template imports another template. Patterns come by file path (`@tc96/parttens/widgets/shared/progress-ring`), never through the `@tc96/parttens` barrel, so the item ships only that file.

## Dependents

- `packages/registry/src/manifest.ts` lists every template in `templateNames` and maps it to its folder in `templateSources`; `manifest.test.ts` fails when a folder with an `index.ts` is missing from the map.
- `scripts/verify-public-api.ts` records each template `index.ts` as `template:<name>` in `docs/architecture/public-api-exports.json`.
- `apps/storybook/src/application/shell/` (stories titled `Application/Shell/AppShell{n}`, at the sidebar root) imports each template through `@tc96/templates/<path>` and the fixtures import the shared types through the `app-shell-1`, `app-shell-3` and `app-shell-4` barrels.
- `apps/storybook/src/templates/fixtures/app-shell.tsx` imports `AppShell1` and the `application/shell/fixtures/shell-data.tsx` fixtures; `withAppShell` wraps every `Templates/*` page as a decorator, with the active nav item and the breadcrumb of that page.
- `apps/storybook/src/application/flow/` (stories titled `Application/Flow/WorkflowEditor` and `Application/Flow/AgentBuilder`) imports each template through `@tc96/templates/application/flow/<name>`; `agent-builder/agent-builder.stories.tsx` is the composition with the `Doc` page, and `agent-builder/partials/*.stories.tsx` (`Application/Flow/AgentBuilder/Partials/<Name>`) import `@tc96/templates/application/flow/agent-builder/partials`, so renaming a partial export breaks them; its fixtures (`lead-routing.tsx`, `collections-agent.tsx`, `use-flow-editor-state.ts`) keep the history and the ids the templates leave to the consumer. The stories reuse `withAppShell`.
- The flow templates import the patterns by file path: `flow/canvas/composition/flow-canvas/flow-canvas` (and `-controls`, `-minimap`), `flow/canvas/components/flow-shortcuts-popover`, `flow/canvas/core` (`tidyTree`, `flowStepNodeSize`, `flowRunSummary`), `flow/step-library/composition/...`, `flow/inspector/composition/...` and `chat/assistant/composition/assistant-panel/assistant-panel`. Renaming one of those files breaks the templates; `manifest.test.ts` asserts that `workflow-editor.json` carries only `application/flow/`, `flow/`, `chat/assistant/`, `elements` and `helpers` files, with `@xyflow/react` and `d3-hierarchy` in `dependencies`.
- Nothing in `packages/` imports `@tc96/templates`; `boundaries:check` enforces it.

## Invariants

- Every template folder is reachable as `@tc96/templates/<category>/<group>/<template>` through the package `exports` (`./*` to `./src/*/index.ts`) and installs to the same path under the consumer's `templates` alias.
- `shared/` files are not re-exported by a template `index.ts`; only types are. Renaming a `shared/` file changes the files every installed shell carries.
- Every visible or accessible text is a `ShellLabels` key with a pt-BR default in `shared/labels.ts`; `labels` is partial and merged over the defaults.
- Links render through `renderLink(href)` as the Base UI `render` element of `SidebarMenuButton`, `SidebarMenuSubButton` and `BreadcrumbLink`; the default `renderAnchor` carries a `biome-ignore` because the text arrives through the render prop.
- Active items set both `isActive` (COSS `data-active`) and `aria-current="page"`. A branch with sub items starts open when it or a child is active. A leaf with `actions` shows the actions menu and drops its `badge`, because both sit at the right edge.
- `ShellSearch` owns its open state and the ⌘K / Ctrl+K listener on `document`; picking a route closes the dialog, then calls `onNavigate(href)`.
- `AppShell4` nests two `Sidebar collapsible="none"` (rail and section panel) inside one `Sidebar collapsible="icon"`, with `--sidebar-width` set to the icon width plus `16rem`; collapsing clips the panel and picking a section calls `setOpen(true)`. The workspace switcher and the account menu run `compact` in the rail, with their tooltips always shown.
- The section of `AppShell4` is controlled by `sectionId`; the template keeps no copy of it.
- Every shell wraps `children` in a flex column with `gap-4 p-4`; `padded={false}` drops both, for a page that runs edge to edge in the inset (the flow editors with `actionsContainer`).
- Every shell gives `SidebarInset` `min-w-0`. The inset is a flex item of the provider's row, so without it a wide child (a `DataTable`, a `KanbanView`) widens the inset past the viewport and the page scrolls sideways instead of the child's own container.

- Both flow templates keep the selection, the steps and every result in the consumer (`selectedStepId` and `onSelectedStepChange` are props); the template state is the inspector (open, `view` | `edit` | `create`, tab, log filter), the assistant (open, expanded), `snapToGrid`, `locked` and the two confirmation dialogs.
- A library click or a canvas drop calls `onStepAdd(type, { position? })` at once; the header Adicionar passo, the node "+" and Adicionar ramo open the inspector in `create` mode, and submitting calls `onStepAdd(type, { after?, connection?, values })`. Saving the edit form calls `onStepChange(stepId, values)`. Deleting a step with connections asks through an `AlertDialog` first.
- `onStepsChange` receives the whole list. Reorganizar (workflow, `horizontal`) and Organizar árvore (agent, `vertical`) pass `tidyTree` the `flowStepNodeSize` and a gap of 96 by 48 and 48 by 88.
- `locked` makes the template read-only for mutations: `createFlowEditorHandlers` ignores `add-after`, `add-branch`, `duplicate`, `delete`, the library add, the drop, the tidy and the create submit, and the controls render `disabled` (header Adicionar passo, Reorganizar and Organizar árvore, the library items, the inspector delete and the create submit). `view` and `edit` stay enabled.
- `onStepsChangeEnd(steps)` is forwarded from the canvas (one call per drag) and also called once after a tidy, so a consumer records one undo entry per gesture; the story fixture `use-flow-editor-state.ts` does it.
- The form validates only the name (`FieldError`, `aria-invalid`, focus on the field). Caminho is the label of the first incoming connection; Responsável matches `step.owner.name` against `owners`.
- Below `md` the library is `collapsed`, the inspector is the `Sheet` of the pattern and the assistant is a full-screen COSS `Sheet` (`data-slot="flow-assistant-fullscreen"` on the popup; role, focus trap and Escape, which closes it) with `placement="docked"`; from `md` the assistant is `floating` in the canvas wrapper, which is the positioned ancestor.
- `AgentBuilder` takes `actionsContainer`, an element in the consumer's app header (the `actions` slot of an App Shell): when set, `FlowPageActions` renders there through `createPortal`, the page drops `FlowPageHeader` (the shell carries the breadcrumb) and `FlowPageLayout` renders with `framed={false}`, without `rounded-xl border` and with `p-4` on the canvas pane (`flow-page-canvas`) in place of the shell padding; `null`, while the slot mounts, renders no actions. The story passes it through `withAppShell({ actionsArg })`, which also drops the root crumb with `root: false` and the shell padding with `padded: false`.
- The page frame (`flow-page`) takes `min-h-160` and `flex-1`, so it needs a flex column parent with a height, like the content area of the shells.

## Styling

- The flow templates add no override on a COSS part; the page frame is a plain `div` with `border` and `rounded-xl` on tokens. Their contrast ratios are in `docs/architecture/tc96-parttens.md` (Templates: editores de fluxo).
- No border, radius, color or shadow class on a COSS part except where listed in `scripts/override-exceptions.json`; layout, size and typography classes are allowed (`SidebarHeader className="h-14 justify-center px-4"`, `Separator className="me-2 h-4"`, `Badge className="absolute -end-1 -top-1"`).
- `AvatarFallback className="text-foreground"` in `shared/user-menu.tsx`: the fallback sits on `bg-border` and inherited the muted `sidebar-foreground` (3.83:1 light). `overrides:check` does not see `AvatarFallback` re-exported by `@tc96/elements/avatar`, so the reason and ratios are in `docs/architecture/tc96-parttens.md` (Templates: App Shells).
- The workspace logo is an `IconFrame` with `bg-sidebar-primary text-sidebar-primary-foreground`, the sidebar's own pair; `bg-muted` vanished on `bg-sidebar` in dark.
- `UsageCard` and the notification rows are template elements on sidebar or popover tokens (`bg-sidebar-accent text-sidebar-accent-foreground`, `hover:bg-accent`).

## Verify

```bash
bunx biome check packages/templates apps/storybook/src/application apps/storybook/src/templates
bun run typecheck && bun run storybook:typecheck
bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test --isolate packages/registry/src
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/application src/templates
bun run test:consumer:registry
```

## Pointers

- [ADR 0005](../../.specs/adr/0005-installable-templates.md) and the plan `.specs/app-shell-templates/tasks/0001-app-shell-templates.md`.
- `docs/architecture/tc96-parttens.md`, section Templates: App Shells, for contrast ratios and the decisions behind the shells.
- `apps/storybook/src/templates/doc.mdx` (`Templates/Doc`) for the consumer commands and the `base.css` line of the flow editors.
- [ADR 0006](../../.specs/adr/0006-flow-family-on-react-flow.md) and the plan `.specs/flow-editors/tasks/0001-flow-editors.md` for the flow templates.
