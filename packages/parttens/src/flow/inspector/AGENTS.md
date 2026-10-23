# Flow inspector pattern

The side panel of the details of a flow step: `FlowInspector` (the frame: header, tabs, scrollable content, footer) and three read renderers for its tabs, `FlowInspectorDetails`, `FlowInspectorStatus` and `FlowInspectorLogs`. The consumer owns `open`, `tab`, the log `filter`, the edit form (passed as `build`) and every action; the pattern never fetches, filters, persists or ships CSS. Its only state is the dock media query. Decided in [ADR 0006](../../../../../.specs/adr/0006-flow-family-on-react-flow.md) (D8).

## Map

| Folder | Holds |
| --- | --- |
| `composition/flow-inspector/` | `FlowInspector`, its test and barrel |
| `composition/flow-inspector-details/`, `-status/`, `-logs/` | the three renderers, each with its test and barrel |
| `components/` | `inspector-header.tsx` (icon, title, badge, actions, close button), `stat-grid.tsx` (a titled `dl` of label and value), `log-entry.tsx`, `status-icon.tsx` |
| `hooks/` | `use-inspector-dock.ts`: `useMediaQuery('md')` |
| `lib/` | `labels.ts` (pt-BR defaults) and `variants.ts` (status to `Badge` variant and icon color) |
| `store/` | `flow-inspector-context.ts`: the merged `labels` and `onClose` for the parts inside a `FlowInspector` |
| `types/` | `FlowInspectorLabels` |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: `FlowInspectorTab`, `FlowLogEntry`, `FlowLogFilter`, `FlowStepStats`, `flowStepAbandonment`, `formatFlowDuration`, with `core.test.ts` |

Import direction: `composition/` → `components/`, `hooks/`, `lib/`, `store/`, `types/`, `core.ts`; `components/` → `lib/`, `store/`, `core.ts`; `store/` → `lib/`, `types/`. The only import from another pattern is `../canvas/core`, as types (`FlowRunStatus`), so the registry item ships that file and never `@xyflow/react`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `flow/inspector/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list `flow/inspector` for the item `flow-inspector`. The T5 templates (`workflow-editor`, `agent-builder`) mount `FlowInspector` with their own `shared/step-form.tsx` as `build`.

## Invariants

Frame:

- From `md` the inspector is an `aside` with `aria-label` from `labels.title` ("Detalhes do passo"). `data-docked` is `"true"` open and `"false"` closed; closed it is `inert` with width zero. The inner `div` keeps `--flow-inspector-width`, so the transition reveals the panel without reflowing it. Below `md` it renders a COSS `Sheet` with the same body and no `aside`, and nothing while closed.
- `onClose` runs from the close button and from the Sheet's own dismissal (Esc, outside press). The close button is always drawn by the pattern after `headerActions`.
- `build`, `status` and `logs` fill the tab panels and only the active panel is mounted; `children` is the footer and the footer is omitted without it. `unconnected` adds the `Alert` to Build only.
- `disabledTabs` disables a tab. Base UI marks it `aria-disabled="true"` with `pointer-events: none`, not the `disabled` attribute.

Renderers:

- They render only what they receive: an item with no value and no owner, a group with no data and a missing duration or run id are not drawn. `FlowInspectorStatus` shows `labels.noRunNote` when the status is `not-run`, `idle` or absent and no entry reached the step.
- Abandonment is `(entered - completed) / entered` rounded to a percent, `—` without entries, never negative.
- `FlowInspectorLogs` takes entries already filtered by the consumer, shows the count (`labels.logCount`) and, with no entries, the `Empty`; its action needs both `emptyActionLabel` and `onEmptyAction`. The filter is a COSS `ToggleGroup` with `aria-pressed`, not radios.
- Parts inside a `FlowInspector` take the merged labels from context; outside one they use `defaultFlowInspectorLabels`. A `labels` prop on a part wins over both.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="flow-inspector"`, `data-docked` | the `aside`, or the `SheetPopup` (no `data-docked`) |
| `data-slot="flow-inspector-body"`, `flow-inspector-header`, `flow-inspector-footer` | the frame parts |
| `data-slot="flow-inspector-details"`, `flow-inspector-detail` | the list and each pair |
| `data-slot="flow-inspector-status"`, `flow-inspector-stat-grid`, `flow-inspector-status-note` | the status renderer, each group and the note |
| `data-slot="flow-inspector-logs"`, `flow-inspector-log-list`, `flow-inspector-log-entry` (`data-status`), `flow-inspector-logs-empty` | the logs renderer |
| `data-slot="flow-status-icon"`, `data-status` | the state icon |

- The tab list sits in a `div` with the `border-b`, because a border class on `TabsList` is a COSS override. Colors are theme tokens only: status icons use `--*-foreground` (4.5:1 or more on `background`), never a palette class.
- The `Alert` icon takes `[&>svg]:text-warning-foreground` because COSS `--warning` is 1.99:1 on the light background; `overrides:check` does not track color and rejects an exception for it. The ratios are in `docs/architecture/tc96-parttens.md`, section "Patterns: Flow Inspector".
- The owner initials of `AvatarFallback` in `flow-inspector-details` use `text-foreground`, the same fix as the canvas node (`muted-foreground` on `bg-border` is 4,25:1 in the dark theme).
- No class overrides a COSS component's border, radius or shadow, so `scripts/override-exceptions.json` has no entry for this pattern.

## Verify

```bash
bun test --isolate packages/parttens/src/flow/inspector
bunx biome check packages/parttens/src/flow/inspector
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/flow/inspector
```

Stories are in `apps/storybook/src/patterns/flow/inspector/flow-inspector.stories.tsx` (`Patterns/Flow/Inspector`, with the `Doc` page). The meta fixes the `desktop` viewport as environment so the dock renders; `Sheet` sets `mobile2` through `globals`, not `args`. `Edit` carries an example form (`Field`, `Input`, `Textarea`, `Select`) whose first field takes `autoFocus`: the pattern does not move focus on open in the dock.

## Pointers

- Public API: `index.ts` and the `flow-inspector` entry of `docs/architecture/public-api-exports.json`. Props are in each composition file; labels in `types/index.ts`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Patterns: Flow Inspector".
