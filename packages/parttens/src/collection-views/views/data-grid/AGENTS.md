# Data Grid

Guide for agents working in `packages/parttens/src/collection-views/views/data-grid`. Root and `collection-views` rules apply: no comments in code, Biome formatting, COSS through `@tc96/ui/<component>`, no business rules. Explanations that used to live in comments are in "Invariants" below. Usage and performance notes are in `README.md`.

## Layout

```text
data-grid/
  index.ts       public barrel; the registry and the public API baseline read it
  types.ts       cell variants, column types, density, column meta, value change
  components/    one component per file (see below)
  hooks/         everything that calls React hooks
  lib/           pure functions, constants, TanStack feature set
```

### components/

| File | Owns |
| --- | --- |
| `data-grid.tsx` | `DataGrid`, `DataGridProps`: wires the hooks and renders header, body, add row and footer |
| `data-grid-header-rows.tsx` | the sticky header rowgroup and its header cells |
| `data-grid-column-header.tsx` | label, type icon, sort mark and the menu trigger of one column |
| `data-grid-column-menu.tsx` | the column menu items (sort, move, pin, hide) |
| `data-grid-resize-handle.tsx` | the `role="separator"` resize handle |
| `data-grid-body.tsx` | picks skeleton, empty row, virtual rows or the entry list; computes per-row primitives |
| `data-grid-row.tsx` | `DataGridRow`, memoized |
| `data-grid-body-cell.tsx` | `DataGridBodyCell`, memoized: the `gridcell` element and its `flexRender` |
| `data-grid-group-row.tsx`, `data-grid-skeleton-rows.tsx`, `data-grid-empty-row.tsx`, `data-grid-add-row.tsx`, `data-grid-footer.tsx` | the other rows of the grid |
| `data-grid-selection-actions.tsx` | the floating selection action bar; reads the selected rows only when `selectionActions` is set |
| `data-grid-cell.tsx` | `DataGridCell`: default renderer per `meta.variant` (public); the Select's item-to-string functions are module constants so Base UI does not re-sync them every render |
| `data-grid-column-type-icon.tsx` | `DATA_GRID_COLUMN_TYPE_ICONS`, `DataGridColumnTypeIcon` (public) |
| `data-grid-pagination.tsx` | `DataGridPagination`, `PaginatedTable` (public) |
| `data-grid-search.tsx`, `data-grid-filter-menu.tsx`, `data-grid-selection-summary.tsx`, `data-grid-sort-submenu.tsx`, `data-grid-columns-submenu.tsx`, `data-grid-density-submenu.tsx` | toolbar parts and their props (public) |
| `*.test.tsx` | JSDOM tests next to the file they cover; `data-grid.test.tsx` covers ARIA, numbering, groups, pagination, editable cells, fill column; `data-grid-rendering.test.tsx` covers memoized rows and the ARIA attributes; `data-grid-select-cell.test.tsx` covers the select cell (one commit entering and leaving it, label follows options and value, pointer opens on the second click) |

### hooks/

| File | Owns |
| --- | --- |
| `use-data-grid.ts` | `useDataGrid` (public) |
| `use-data-grid-rows.ts` | page rows, collection rows, visible rows, position map, group maps and the body entry list, memoized |
| `use-collapsed-groups.ts` | controlled or local collapse state; `setGroupCollapsed` reads the latest list |
| `use-data-grid-cell-selection.ts` | focused cell, `hasInteracted`, cell selection; availability is derived at read time |
| `use-data-grid-focus.ts` | the cell registry and the single layout effect that returns focus to the roving cell |
| `use-data-grid-cell-events.ts` | the stable pointer, click and key handlers shared by every cell |
| `use-data-grid-drag-scroll.ts` | mouse drag-scroll of the viewport |
| `use-data-grid-virtualizer.ts` | `@tanstack/react-virtual` setup and scroll-into-view |
| `use-column-layouts.ts` | per-column pinned state and style, identity-stable between renders |
| `use-data-grid-row-context.ts` | context with the grid-level values rows read |
| `use-latest-callback.ts` | stable function that calls the latest closure |

### lib/

`constants.ts`, `columns.ts`, `column-layout.ts`, `cell-registry.ts`, `selection.ts`, `group-runs.ts`, `body-entries.ts`, `row-index.ts`, `resize.ts`, `move-column.ts`, `virtual-scroll.ts`, `dom.ts`, `skeleton.ts`, `format-value.ts` (cached `Intl.DateTimeFormat`), `create-select-column.tsx` (public `createSelectColumn`), `data-grid-features.ts` (public `dataGridFeatures` and the table, column, header and meta types). Each has a test only where logic warrants one (`selection.test.ts`).

## Public API

Everything `index.ts` exports and nothing else; `docs/architecture/public-api-exports.json` records it and `bun run verify:public-api` must pass without `--record`. Props and behavior are listed in `../../AGENTS.md` (Public API) and `README.md`.

## Styling contract

State lives in `data-*` attributes: `data-state="selected"` on a row, `data-selected` and `data-focused` on a cell, `data-pinned="start|end"` on header cells, body cells and skeleton cells, `data-drag-scroll="dragging"` and `data-density` on the viewport, `data-virtualized` on the body, `data-column-id` on header and body cells, `data-column-type` on the type icon, `data-collapsed` on a group row, `data-grid-select-trigger` on the editable select trigger. `data-slot` names: `data-grid`, `data-grid-header`, `data-grid-header-row`, `data-grid-header-cell`, `data-grid-body`, `data-grid-row`, `data-grid-cell`, `data-grid-group-row`, `data-grid-group-label`, `data-grid-group-count`, `data-grid-add-row-group`, `data-grid-footer`, `data-grid-selection-actions`, `data-grid-row-marker`, `data-grid-column-type-icon`, `data-grid-pagination`, `data-grid-search`, `data-grid-filter-menu`, `data-grid-selection-summary`. Do not rename or drop any of them.

## Invariants

- Rows are memoized and receive primitives. Focus and cell selection reach a row only through `focusedColumnId`, `interacted` and `selectedColumnIds`; selected sets keep their identity when unchanged. Anything a row needs from the grid goes through `DataGridRowContext`, whose value changes only when columns, layouts, density, interactions, row-selectable or the value-change handler change. A new input that a cell renders from must reach the row as a prop or through that context, or memoization will serve stale cells. Today the invalidators are: the `cell` object, `isSelected`, `isFocused`/`showFocus`, `rowSelected`, `canSelect` (`row.getCanSelect()`), the layout, density, `table.options.meta` and `enableRowSelection`. Cell renderers must derive from row, column, cell and `table.options.meta` only; a renderer that reads other table state (sorting, filters, pagination atoms) is not re-rendered when it changes. `useDataGrid` memoizes `meta` and wraps `onCellValueChange` in a stable function that calls the latest closure, so an inline handler does not re-render cells; a `tableOptions.meta` created inline on every render does.
- Cell handlers are one stable object (`CellInteractions`). They are attached on each cell, not at the viewport, on purpose: React events from portaled content (the Select popup) bubble through the React tree to the cell, and a delegated DOM lookup would lose them. The handlers learn which cell fired from `CellRegistry.identify`: the row element registers its id, the cell carries `data-column-id`.
- The roving cell is derived: when the stored focused cell is no longer among the visible rows and columns, the first row and first navigable column stand in. There is no effect that copies it back into state.
- Cell selection is filtered at read time against the collection rows and visible columns, and again when a shift-extend adds a cell. Decided by the owner on 2026-10-03: selected cells and the roving focus survive hiding a column and filtering, so re-showing the column or removing the filter brings them back. The stored selection is garbage-collected when the core row model changes: cells of row ids that left the dataset are dropped. Row identity is the id, so give `getRowId` a stable key; with the default index ids a swapped dataset keeps the selection on the same positions.
- Focus is returned by one layout effect without a dependency array, on purpose: it must also run on re-renders that change neither the focused cell nor `hasInteracted` (a focused cell in another row, a virtual row that mounts later). It pulls only when focus is on `body` or inside another grid cell. A control inside the focused cell (the editable select trigger) already holds the right focus, and stealing it closes the popup the click just opened. Outside the cells, focus is only recovered when lost: the group chevron keeps focus after collapsing.
- The first pointer press on an unselected editable cell selects it without opening the select; the click that follows within 750 ms is swallowed, and a click on an already selected cell is forwarded to the trigger.
- Navigation and focus walk only visible rows; rows of a collapsed group stay in the page but are out of the grid. The `select` and `actions` columns are never the first navigable column, never the fill column and never counted as common.
- A group row exists per run of equal consecutive values over the whole collection; a null group does not close a run. `runsThrough[i]` is the number of group rows opened up to row `i`, which gives a row its position in the grid on any page. A page that opens mid-group repeats the group row on its first row only. With server pagination the collection is the loaded page, so positions are looked up in the collection, not derived from the page offset (`dataGridPaginationRowOffset` wins when greater than zero).
- Group counts are page counts. Collapse hides rows on the page only; pagination still counts them.
- A group row key uses the first row id of the run, never an index.
- Aria row count is header rows plus body rows plus the add row and the footer: a grid contains only rows, so the add row and the pagination footer are rows with a `gridcell`. Body rows are the loading count, 1 for the empty row, or the collection rows plus group rows.
- `aria-selected` on a row is emitted only when row selection applies (`enableRowSelection` or `getRowSelected`); cells always carry it because cell selection always exists. The grid is `aria-multiselectable` because Shift extends the cell selection. The resize separator always carries `aria-valuemin` and `aria-valuemax` (TanStack defaults 20 and `Number.MAX_SAFE_INTEGER` when the column sets none) and the keyboard resize is clamped to them.
- The last column's resize handle and its grab area grow inward: growing outward would add 8px of scroll beyond the content, and the empty strip on the right reads as an extra column.
- The outer wrapper keeps the scrollbar outside the surface that draws the border without changing the table's horizontal geometry. With no fill column the frame shrinks to the columns (`w-fit`), because stretching would leave a borderless strip that reads as a phantom column; it still scrolls when columns exceed the container.
- `style={{ minWidth: 0 }}` on `ScrollArea.Content` is deliberate: the only way to beat Base UI's inline `minWidth: fit-content`.
- Virtualization applies without `getRowGroup`, not loading and with rows. `entries[i]` equals the `i`-th virtual row because no group row exists.
- `useDataGrid` registers pagination always and sets `manualPagination: !enablePagination`, so without the flag the table yields the rows before pagination, as v8 did without `getPaginationRowModel`.
- `role="grid"`, `row`, `gridcell`, `columnheader`, `rowgroup` and `separator` on `div`s are intentional (a virtualizable spreadsheet uses the WAI-ARIA grid pattern instead of table elements). Each file that sets one of those roles carries `biome-ignore-all lint/a11y/useSemanticElements`; the directive ships with the copied source, so a consumer's Biome stays quiet.
- Pattern code carries no comments; cell date text uses one cached `Intl.DateTimeFormat` with the default locale.

## Verify

```bash
bunx biome check packages/parttens/src/collection-views/views/data-grid
bun test packages/parttens/src/collection-views/views/data-grid
bun run typecheck && bun run verify:public-api
bun run bench:data-grid
bun scripts/bench/data-grid.bench.ts --compare scripts/bench/results/data-grid.base.json --gate
```

The gate compares against the committed baseline and fails when any render counter rose; timing only warns. If a change is meant to move the numbers, regenerate the baseline with `--json scripts/bench/results/data-grid.base.json` and update the README table.
