# Collection views pattern

Controlled renderers for one collection: the consumer declares a `CollectionDefinition` (`items`, `getKey`, `getLabel`, `groupings`), `CollectionProvider` holds the `{ view, groupBy }` preferences, and `CollectionViewOutlet` mounts the active view: `KanbanView`, `ListView`, `DataGrid`, `DataTable` or `CalendarView`, each also usable alone. Kanban and Calendar drag with dnd-kit and report the move, which the consumer accepts or rejects; Data Grid and Data Table run on TanStack Table v9 instances from `useDataGrid` and `useDataTable`. The pattern never fetches, sorts, persists or ships CSS; its only state is the uncontrolled preferences, optimistic drag overrides, list and grid collapse state, and the TanStack table state those hooks keep locally.

## Map

| Folder | Holds |
| --- | --- |
| `composition/` | `CollectionViewOutlet`: picks the view, projects groups, adapts kanban moves to `onItemChange` |
| `store/` | `CollectionProvider` and `useCollectionPreferences` |
| `types/` | the collection contracts (definition, grouping, group, preferences, item change) |
| `shared/components/` | toolbar pieces: search, selected view, view settings, filter submenu, presets, `ActionBar` |
| `shared/lib/` | `projectCollection`, the one function that turns a collection plus a grouping into groups |
| `views/<view>/` | `calendar`, `data-grid`, `data-table`, `kanban`, `list`; each with its own `index.ts` and a `README.md` holding its benchmark |
| `test/` | `test/dom.ts`, the JSDOM setup the tests import, and `test/jsdom.d.ts` |
| `core.ts` | React-free surface: collection, calendar, data-grid and kanban types, kanban drag helpers, date helpers; workspace only, not reached from the barrel |

`views/data-grid/` has its own `AGENTS.md` with its file map and invariants; read it before touching the grid.

Import direction: `composition/` → `store/`, `shared/lib/`, `types/` and the five views; each view → its own folders, `shared/lib/project-collection.ts` and `types/`, and in `data-grid` the `ActionBarContext` type from `shared/components/action-bar.tsx`; `shared/` and `store/` → `types/`; views never import each other. Outside the folder, `shared/components/collection-filter-submenu.tsx` and the data-grid density and columns submenus import `packages/parttens/src/shared/components/menu-selection-item.tsx`, and `views/data-grid/components/data-grid-pagination.tsx` imports `packages/parttens/src/shared/components/collection-pagination.tsx`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `collection-views/index` whole plus `KanbanView as Kanban`.
- `packages/parttens/src/shared/components/collection-toolbar.test.tsx` and `packages/parttens/src/shared/components/collection-pagination.test.tsx` import `test/dom.ts`. Moving it breaks them.
- `scripts/bench-views.ts` (run by `release:check` as `bench:views`) imports `shared/lib/project-collection.ts` by path; `scripts/bench/<view>.bench.ts` import each `views/<view>/index`. Moving a view or `projectCollection` breaks them.
- The folder name `collection-views` is hardcoded in `packages/registry/src/manifest.ts` (which also maps the `view` alias to it), `packages/registry/src/cli.ts`, `scripts/test-patterns.ts`, `scripts/test-consumer-ssr.ts` and `scripts/test-consumer-registry.ts`.
- `scripts/override-exceptions.json` keys two entries by the paths of `views/list/components/list-group.tsx` and `list-view.tsx`.

## Invariants

Collection and outlet:

- `CollectionViewOutlet` throws when the active view is `datagrid`, `datatable` or `calendar` and the matching prop is missing; `projectCollection` throws for `groupBy === null` and for an undeclared dimension. Tests assert the messages.
- Prepared `groups` win over `projectCollection` in list and kanban, and an explicit `[]` never falls back to the source items.
- `kanban.onMoveCard` receives the group of each side, so a handler never parses column ids; a column with no matching group rejects the move. Without it, drag is enabled by `onItemChange` plus `setGroupId` on the active dimension, and a reorder inside one group returns false, because the collection order is the consumer's. `kanban.onMoveCard` wins when both are passed.

Kanban:

- A cross-column `dragOver` calls `event.preventDefault()` and goes through state: dnd-kit's optimistic DOM reorder moved the node outside React, which then failed in `removeChild`. Same-column reorders keep the dnd-kit plugin.
- When `onMoveCard` returns a promise, the dnd-kit suspension resumes immediately so the drop animation does not wait on the network. `false`, a rejection or a throw rolls back; `true` keeps the override until `columns` shows the card at the target.
- The whole card drags except interactive descendants; `KanbanCardOpenTrigger` drags only past 5px (touch: 250ms delay, 5px tolerance). The grip handle, visible only on focus, is the keyboard and assistive-technology activator.
- `KanbanView` always renders the mobile panel and the desktop board and lets CSS pick one, so the active column's cards render twice: `renderCard` must be pure and emit no DOM ids. Below `md` sorting is off; a collapsed column has no drop target.
- The board drag-scrolls only while card drag is enabled, and a click within 500ms of a drag is suppressed.
- `KanbanCard` stays an `article` (tested). `KanbanCardSkeleton` and `ListItemSkeleton` wrap the card in an `output` with `aria-busy`, because an `article` cannot be `status`. `KanbanBadge` accepts `tone` and ignores it.

List, calendar and table:

- `ListView` renders the flat collection with `h2` titles and grouped lists with `h3`. An empty flat list (`grouping === null`, not loading) renders `emptyMessage` in the COSS `Empty` block, like an empty group. With `collapseEmptyGroups`, a manual choice wins, an untouched group reopens when it gets items, every group stays open while loading, and `onCollapsedGroupIdsChange` reports the effective list.
- Calendar drops on a day or all-day cell keep the wall-clock time and the absolute duration (DST-safe); time-column drops snap the block's top edge to `snapMinutes`. The override lives until `getItemSchedule` matches it, and a drop resolving to the same window is ignored. Without `onItemReschedule` no handle or draggable marker exists (tested).
- A calendar item drags from its whole body like a kanban card, except interactive descendants; `CalendarEventChipOpenTrigger` drags only past 5px (touch: 250ms delay, 5px tolerance). The grip handle, visible only on keyboard focus, is the keyboard and assistive-technology activator.
- A full month cell collapses its overflow behind a "+N" `Popover` that lists only the hidden segments, so no item renders twice with the same drag id; an item drags out of the popup like any chip. With `onSelectDay`, the popup's day title is a `PopoverClose` that calls it; without it, the title is plain text.
- In the time grid, a timed item with an `end` gets two pointer-only resize edges (`aria-hidden`, no tab stop) on its top and bottom (top only on the first segment, bottom only on the last). The pointer drags an edge with pointer capture and a live preview that never touches the optimistic override; release goes through the same `onItemReschedule` commit as a drop. The keyboard path is the move handle, so an item keeps two tab stops like a kanban card: Alt+ArrowUp/ArrowDown moves the start and Shift+ArrowUp/ArrowDown the end, one grid line at a time, announced through `aria-keyshortcuts` and ignored while a drag is active. The moved edge lands on the `snapMinutes` wall-clock grid of `timeZone`, and the item keeps at least `snapMinutes` of duration. Items without `end`, all-day items and month chips do not resize.
- `useDataTable` always registers pagination with `manualPagination: !enablePagination`, so without the flag the table yields every row.
- With `enableColumnResizing`, `DataTable` switches to `table-fixed` with a `<colgroup>`: every visible column but the last takes `getSize()`, the last has no width and no handle so it absorbs the remaining space, and the table's `minWidth` is `getTotalSize()`, so it fills the container until the sizes overflow it and the container scrolls. Fixed cells clip with `overflow-hidden`. Without the flag the markup keeps the auto layout.
- Calendar, List and Data Table run the consumer's renderer in a memoized leaf below the stateful component: it re-runs only when its identity or inputs change, so a renderer that reads other state with a stable identity goes stale.

Toolbar:

- `CollectionSearchField` commits on submit and when emptied, never per keystroke. `SelectedViewMenu` is a `Popover` (`role="dialog"`), not a menu. `FilterRadioSubmenu` maps the "all" option to `''`, since a `MenuRadioGroup` cannot represent no choice.
- `CollectionSelectionActions` is a compatibility alias of `ActionBar` that its test keeps.

## Styling

| Attribute | Where | Read by |
| --- | --- | --- |
| `data-kanban-card-action`, `data-calendar-item-action` | controls inside `KanbanCard` and `CalendarEventChip` | the card and chip variants raise them above the open trigger with `z-10` |
| `data-collapsed="true"` | `KanbanColumn`, the grid group row | the board width rule (`w-76`, `xl:w-88`) skips collapsed columns |
| `data-kanban-card-draggable`, `data-kanban-card-drag-id`, `data-calendar-item-drag-id` | drag wrappers and handles | drag-scroll exclusion and focus restore after a move; not styled |
| `data-slot="card"` | `KanbanCard` | header and footer variants via `in-[[data-slot=card]:has(>[data-slot=card-panel])]` |
| `data-state="selected"` | `DataTable` rows, `KanbanCard` | consumers; the card uses its `selected` variant |
| `data-density`, `data-display`, `data-variant`, `data-tone`, `data-completed` | `ListItem`, `KanbanCard`, `CalendarEventChip` | consumers; the pattern styles through `cva` variants or ternaries |
| `data-calendar-date`, `data-today`, `data-outside-month`, `data-calendar-mode` | calendar cells, columns, root | consumers and tests |
| `data-calendar-item-resize="start\|end"` | the resize buttons on time-grid items | tests and the drag sensor, which never starts a move from an edge; the edge measures its `[data-calendar-date]` column to turn pixels into minutes |
| `data-collection-grouping`, `data-interactive`, `data-bordered`, `data-layout` | `ListView`, `ListItem`, `DataTable`, view settings mode tab | consumers |

Data Grid attributes are listed in `views/data-grid/AGENTS.md`.

- Variants live in `kanbanCardVariants` and `calendarEventChipVariants`; every class is a complete string so the Tailwind scanner sees it. A condition emits one class through a ternary.
- The positioned wrapper of each time-grid item (`calendar-day-column.tsx`) is the size container `calendar-item`, which the chip's `block` variant queries: the time follows the title, and below two lines of height (2.625rem) both share one wrapping row whose second line falls outside the block, so a short item always shows its title and shows the time only when it fits.
- `DataTable` draws the DataGrid frame (`rounded-md border bg-background`) unless `bordered={false}`, and its `thead` and the DataGrid header (pinned header cells included) share one `color-mix` of `var(--card)` with 2% black, 2% white in dark, so the two views read as the same surface.
- Colors only from theme tokens; the kanban column tint is `color-mix` over `var(--card)` and the time-grid hour lines read `var(--border)`.
- Hover-only affordances pair `group-hover` with `group-focus-within` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch in v4.
- The calendar chip and `KanbanCard` draw `has-focus-visible:ring-2` on the `article` because the open trigger removes the native outline.
- Time-grid hour labels are `text-[0.625rem]` pending a `--text-2xs` token in the consumer's theme.
- Not findings: `outline-none` next to `focus-visible:` and the `dark:` opacity steps on chip tones follow COSS.
- `scripts/override-exceptions.json` has two entries here: `Separator` with `bg-border/40` in `views/list/components/list-group.tsx` and `list-view.tsx`. The widget shell's `rounded-lg` entry copies the kanban card radius, so changing that radius means revisiting it.

## Verify

```bash
bun test --isolate packages/parttens/src/collection-views
bunx biome check packages/parttens/src/collection-views
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/collection-views
bun scripts/bench/<view>.bench.ts --compare scripts/bench/results/<view>.base.json --gate
```

Run the bench of each view whose rendering changed. `--gate` exits 1 when a render counter rose or a scenario disappeared; timing only warns. Regenerate a baseline with `--json scripts/bench/results/<view>.base.json` on an idle machine and update the view's README table in the same change. The harness in `scripts/bench/` is copied from the tc96-marketplace `react-component-performance` skill; keep its `bench-harness v1` line.

Stories in `apps/storybook/src/patterns/collection-views/` run axe with `test: 'error'` and share the task mock in `fixtures/`; only `default.stories.tsx` carries the toolbar and view switcher.

## Pointers

- Public API: `index.ts` and the `collection-views` entry of `docs/architecture/public-api-exports.json`. `ListItemHeadingLevelContext` and the kanban drag helpers are not exported from the barrel. Exporting from a view's `hooks/`, `lib/` or an internal component needs a reason recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-parttens.md`, sections "Acessibilidade dos patterns", "Collection views: benchmark por view", "Calendar, List e Data Table: o renderizador do consumidor numa folha memoizada", "Kanban: os dois layouts continuam renderizados", "Data Grid: linhas memoizadas e estado derivado" and "Data Grid: um commit por interação".
