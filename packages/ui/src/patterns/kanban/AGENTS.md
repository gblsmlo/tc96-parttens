# Kanban

A board of columns of cards, usable alone or mounted by `CollectionLayoutOutlet`. The consumer passes `columns` with their cards and returns each card from `renderRecord`; cards drag with dnd-kit and the move is reported through `onRecordMove`, which the consumer accepts or rejects. Its only state is the optimistic drag override, the active column below `md` and the drag-scroll gesture.

## Map

| Folder | Holds |
| --- | --- |
| `composition/kanban-view/` | `KanbanView` and its server-render test |
| `components/` | the column, its header and settings popover (`KanbanColumnSettings`), the column selector, the badge, the card skeleton and the sortable card wrapper |
| `hooks/` | drag and drop, horizontal drag-scroll, the active column |
| `lib/` | the React-free drag helpers |
| `types.ts` | the column, actions, move and color option contracts |

Import direction: `composition/` → `components/`, `hooks/`, `lib/`, `types.ts`; `components/kanban-card-skeleton.tsx` imports `kanban-card/components/kanban-card` by path. It never imports another layout.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `index.ts`; `collection/composition/collection-layout-outlet.tsx` imports the view by file path and mounts it, so the `collection` registry item ships this folder.
- `scripts/bench/kanban.bench.ts` imports `index.ts`.
- `kanban-card/` holds the card and its own `AGENTS.md`.

## Invariants

- The column settings button opens `KanbanColumnSettings` (a COSS `Popover` with native radio swatches and a `Switch`) when the actions carry `onColorChange` with `colorOptions` or the view has `onCollapsedGroupIdsChange`; otherwise it stays the plain button that calls `onSettingsOpen`. Collapse follows List and the tables: `collapsedGroupIds`, `defaultCollapsedGroupIds` and `onCollapsedGroupIdsChange` through the shared `useCollapsedGroups`; `KanbanColumn` takes `collapsed` as a prop. A collapsed column keeps the button, so the switch is the way back.
- A cross-column `dragOver` calls `event.preventDefault()` and goes through state: dnd-kit's optimistic DOM reorder moved the node outside React, which then failed in `removeChild`. Same-column reorders keep the dnd-kit plugin.
- When `onRecordMove` returns a promise, the dnd-kit suspension resumes immediately so the drop animation does not wait on the network. `false`, a rejection or a throw rolls back; `true` keeps the override until `columns` shows the card at the target.
- The whole card drags except interactive descendants; `KanbanCardOpenTrigger` drags only past 5px (touch: 250ms delay, 5px tolerance). The grip handle, visible only on focus, is the keyboard and assistive-technology activator.
- `KanbanView` always renders the mobile panel and the desktop board and lets CSS pick one, so the active column's cards render twice: `renderRecord` must be pure and emit no DOM ids. Below `md` sorting is off; a collapsed column has no drop target.
- The board drag-scrolls only while card drag is enabled, and a click within 500ms of a drag is suppressed.
- `KanbanCardSkeleton` follows the card through `loadingAnatomy` (`descriptionLines`, `fields`, `counts`, `menu`, `assignee`), at the real line heights, and wraps the card in an `output` with `aria-busy`, because an `article` cannot be `status`; the stories check that the loading card keeps the loaded height. `KanbanBadge` accepts `tone` and ignores it.

## Styling

| Attribute | Where | Read by |
| --- | --- | --- |
| `data-slot="kanban-column-settings\|kanban-column-color-option\|kanban-column-collapse"` | the column settings popover, its swatches and its collapse row | consumers and tests; not styled |
| `data-kanban-column-option="<column id>"` | the column buttons of `KanbanColumnSelector` (below `md`) | consumers, as the `finalFocus` fallback of `RecordPreview` when the moved card is not rendered; not styled |
| `data-collapsed="true"` | `KanbanColumn` | the board width rule (`w-76`, `xl:w-88`) skips collapsed columns |
| `data-kanban-card-draggable`, `data-kanban-card-drag-id` | drag wrappers and handles | drag-scroll exclusion and focus restore after a move; not styled |
| `data-counts`, `data-description-lines`, `data-fields` | the `output` of `KanbanCardSkeleton`, from `loadingAnatomy` | tests; not styled |

- Colors only from theme tokens; the column tint is `color-mix` over `var(--card)`. A column without `color` takes `defaultColumnColor` (`lib/column-color.ts`, `var(--color-slate-400)`, the gray of the first stage), so every column has a marker and a tint, and the settings swatch with that value reads as checked. Consumers and stories pass Tailwind primitive tokens (`var(--color-green-500)`) rather than hex values.
- Hover-only affordances pair `group-hover` with `group-focus-within` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch in v4.

## Verify

```bash
bun test --isolate packages/ui/src/patterns/kanban
bunx biome check packages/ui/src/patterns/kanban
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/kanban
bun scripts/bench/kanban.bench.ts --compare scripts/bench/results/kanban.base.json --gate
```

Run the bench when rendering changed: `--gate` exits 1 when a render counter rose or a scenario disappeared; timing only warns. Regenerate the baseline with `--json` on an idle machine and update `README.md` in the same change.

`Patterns/Kanban` (`apps/storybook/src/patterns/kanban/`) is documented in the six component pages; its `Usages` and `Behavior` read `tasks.ts` through `collection/fixtures/kanban-tasks.tsx` and `deals.ts` through `collection/fixtures/pipeline-usage.tsx`. The `Behavior` plays that check loading start from it and load after a 2s `sleep`.

## Pointers

- Public API: `index.ts` and the `patterns` entry of `docs/architecture/public-api-exports.json`.
- Section "Kanban: os dois layouts continuam renderizados" of the architecture doc.
- Decisions: `docs/architecture/tc96-ui.md`; accessibility: `docs/accessibility.md`, sections "Regras" and "Boas práticas".
- The collection outlet that mounts this layout, and the shared code it imports: `packages/ui/src/patterns/collection/AGENTS.md`.
