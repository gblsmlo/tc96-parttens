# Data Grid view

The spreadsheet view of `collection-views`: a WAI-ARIA grid over the TanStack Table v9 instance `useDataGrid` returns, with roving focus, cell and row selection, column menu, resize, pinning, group rows, drag-scroll and optional virtualization. It never fetches, persists or writes a cell value; an editable cell reports the change through `onCellValueChange`. Its state is the table state `useDataGrid` keeps locally (sorting, filters, columns, row selection, pagination, density) plus, inside `DataGrid`, the focused cell, the cell selection, uncontrolled group collapse and the drag-scroll gesture.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `DataGrid`, its rows and cells, `DataGridCell` (default renderer per `meta.variant`) and the public toolbar parts |
| `hooks/` | `useDataGrid` and the hooks `DataGrid` composes: rows, focus, cell selection, cell events, virtualizer, drag-scroll, column layouts, row context |
| `lib/` | pure functions, constants, `createSelectColumn`, `dataGridFeatures` and the table types |
| `types.ts` | column meta, variants, column types, density, value change |
| `README.md` | usage and the benchmark table |

Import direction: `components/` → `hooks/`, `lib/`, `types.ts`; `hooks/` → `lib/`, `types.ts`; `lib/` → `types.ts`. The one upward import is `hooks/use-data-grid.ts` → `components/data-grid-cell.tsx`, the default column renderer. Imports leaving the view are in the parent AGENTS.md.

## Dependents

- `collection-views/composition/collection-view-outlet.tsx` imports `components/data-grid.tsx` by path, not through the barrel.
- `collection-views/core.ts` imports `lib/data-grid-features.ts` and `types.ts` by path.
- `collection-views/index.ts` re-exports `index.ts` whole.
- `scripts/bench/data-grid.bench.ts` imports this folder's `index.ts` and queries the slots `data-grid-row`, `data-grid-cell` and `data-grid-group-row`.
- `apps/storybook/src/patterns/collection-views/views/data-grid.stories.tsx` and `apps/storybook/src/patterns/collection-views/default.stories.tsx` query the slots `data-grid`, `data-grid-body` and `data-grid-header`.

## Invariants

Rendering:

- Rows and body cells are `memo` and receive primitives. Focus and cell selection reach a row only through `focusedColumnId`, `interacted` and `selectedColumnIds`; selected sets keep their identity when unchanged. Everything else comes from `DataGridRowContext`, which changes only with columns, layouts, density, interactions, `meta`, `enableRowSelection` or row-selectable. A new input a cell renders from must arrive as a row prop or through that context, or memoization serves stale cells.
- A cell re-renders on the `cell` object, `isSelected`, `isFocused`/`showFocus`, `rowSelected`, `canSelect`, layout, density, `table.options.meta` and `enableRowSelection`. A renderer must derive from row, column, cell and `table.options.meta` only; one that reads sorting, filters or pagination goes stale.
- `useDataGrid` memoizes `meta` and wraps `onCellValueChange` in `useLatestCallback`, so an inline handler does not re-render cells; an inline `tableOptions.meta` does. `tableOptions` is spread last, so it overrides any hook option, `state` included; only `meta` is merged, with the grid's keys winning.
- Cell handlers are one stable `CellInteractions` object attached on each cell, not delegated to the viewport: events from the portaled Select popup bubble through the React tree to the cell, and a DOM lookup at the viewport would lose them. `CellRegistry.identify` resolves the cell from the registered row and the cell's `data-column-id`.
- `DataGridCell` passes the Select's `itemToStringLabel` and `itemToStringValue` as module constants: inline arrows made Base UI re-sync them in a layout effect and re-render the trigger in a second commit. `components/data-grid-select-cell.test.tsx` asserts one commit per focus move.

Focus and selection:

- The roving cell is derived: when the stored cell is not among the visible rows and columns, the first row and first navigable column stand in. No effect copies it back into state.
- Cell selection is filtered at read time against the collection rows and visible columns, and again when Shift extends it. Owner decision of 2026-10-03: selection and roving focus survive hiding a column and filtering, so undoing either restores them. A row is dropped from the stored selection only when its id leaves the core row model, so `getRowId` needs a stable key; with index ids a swapped dataset keeps the selection on the same positions.
- One `useLayoutEffect` without a dependency array returns focus, on purpose: it must also run on renders that change neither the focused cell nor `hasInteracted` (focus in another row, a virtual row mounting later). It pulls only from `body` or another grid cell. A control inside the focused cell (the select trigger) already holds the right focus, and stealing it closes the popup the click just opened. The group chevron keeps focus after collapsing.
- The first pointer press on an unselected cell with a select trigger selects it without opening the select, and the click that follows within 750 ms is swallowed. A click on a selected cell is forwarded to the trigger.
- Navigation walks only visible rows; collapsed rows stay in the page but leave the grid. `select` and `actions` are never the first navigable column (Home and ArrowLeft stop after them) nor the default fill column; End and ArrowRight still reach a trailing `actions`.
- Drag-scroll is horizontal, mouse and pen only, starts past 8px and only when columns overflow; a click within 500 ms of a drag is suppressed. A new interactive element inside a cell must match `DRAG_SCROLL_EXCLUDED_TARGETS` in `lib/constants.ts`, or dragging from it scrolls the grid.

Groups and pagination:

- A group row exists per run of equal consecutive values over the whole collection; a null group does not close a run. `runsThrough[i]` counts the group rows opened up to row `i`, which gives a row its `aria-rowindex` on any page. A page that opens mid-group repeats the group row on its first row only.
- With server pagination the collection is the loaded page, so positions come from the collection, not the page offset; `dataGridPaginationRowOffset` wins when greater than zero.
- Group counts are page counts. Collapse hides rows on the page only: pagination still counts them and the select-all header still selects them. `setGroupCollapsed` reads the uncontrolled list from a ref, not from render state.
- A group row key is the group plus its first row id on the page, never an index.
- `useDataGrid` always registers pagination with `manualPagination: !enablePagination`, so without the flag the table yields every row. `DataGrid` shows `DataGridPagination` whenever the table paginates; `footer` replaces it, `pagination={false}` drops it.
- `DataGridSearch` and `DataGridFilterMenu` return to page one on every change; the search filters per keystroke, unlike `CollectionSearchField`.
- Virtualization applies only without `getRowGroup`, not loading and with rows, because only then is `entries[i]` the `i`-th virtual row.

Cells:

- The date variant uses one cached `Intl.DateTimeFormat` with no locale and no options, so it shows the date only. `parseDateValue` from `@tc96/helpers/date` reads `2026-08-04` as local midnight, because `new Date('2026-08-04')` is UTC midnight and shows the previous day west of UTC (tested).
- `createSelectColumn` shows the row number and swaps it for the checkbox on hover, focus within, coarse pointer or when checked; `showRowNumbers: false` shows only the checkbox. The number is `row.index + 1`, the position in `data`, so sorting does not renumber.

ARIA and layout:

- `role="grid"`, `row`, `gridcell`, `columnheader`, `rowgroup` and `separator` on `div`s are intentional: a virtualizable spreadsheet uses the WAI-ARIA grid pattern, not table elements. Each file that sets one carries a `biome-ignore-all lint/a11y/useSemanticElements` line, the only comment allowed here; it ships with the copied source so the consumer's Biome stays quiet.
- `aria-rowcount` is header rows plus body rows plus the add row and the footer: a grid contains only rows, so both are rows with a `gridcell`. Body rows are the loading count, 1 for the empty row, or collection rows plus group rows.
- A row emits `aria-selected` only when row selection applies (`enableRowSelection` or `getRowSelected`); cells always do, because cell selection always exists. The grid is `aria-multiselectable` because Shift extends the cell selection.
- The resize separator always carries `aria-valuemin` and `aria-valuemax`, and the keyboard resize is clamped to them. `useDataGrid`'s default column sets `minSize: 80`; another table falls back to TanStack's 20 and `Number.MAX_SAFE_INTEGER`.
- The last column's resize handle and grab area grow inward: outward they add 8px of scroll past the content, and the strip reads as an extra column.
- With no fill column the wrapper and the bordered root are `w-fit max-w-full`, because stretching leaves a borderless strip that reads as a phantom column; it still scrolls when columns overflow. The wrapper also positions the selection action bar.
- `style={{ minWidth: 0 }}` on `ScrollAreaPrimitive.Content` is the only way to beat Base UI's inline `minWidth: fit-content`.

## Styling

| Attribute | Where |
| --- | --- |
| `data-state="selected"` | row |
| `data-selected`, `data-focused` | body cell |
| `data-pinned="start\|end"`, `data-column-id` | header, body and skeleton cells |
| `data-density`, `data-drag-scroll="dragging"` | viewport |
| `data-virtualized` | body |
| `data-collapsed` | group row |
| `data-column-type` | column type icon |
| `data-grid-select-trigger` | editable select trigger; read by the cell handlers and the drag-scroll exclusion |

`data-slot` names: `data-grid`, `data-grid-header`, `data-grid-header-row`, `data-grid-header-cell`, `data-grid-body`, `data-grid-row`, `data-grid-cell`, `data-grid-group-row`, `data-grid-group-label`, `data-grid-group-count`, `data-grid-add-row-group`, `data-grid-footer`, `data-grid-selection-actions`, `data-grid-row-marker`, `data-grid-column-type-icon`, `data-grid-pagination`, `data-grid-search`, `data-grid-filter-menu`, `data-grid-selection-summary`. Do not rename or drop any; the bench and the stories query some.

`scripts/override-exceptions.json` has no entry for this view.

## Verify

```bash
bun test --isolate packages/parttens/src/collection-views/views/data-grid
bunx biome check packages/parttens/src/collection-views/views/data-grid
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/collection-views/views/data-grid.stories.tsx src/patterns/collection-views/default.stories.tsx
bun scripts/bench/data-grid.bench.ts --compare scripts/bench/results/data-grid.base.json --gate
```

## Pointers

- Parent: `collection-views/AGENTS.md`, for bench rules and imports leaving the view.
- Public API: this folder's `index.ts` and the `collection-views` entry of `docs/architecture/public-api-exports.json`. Usage is in `README.md`.
- Decisions: `docs/architecture/tc96-parttens.md`, sections "Data Grid: linhas memoizadas e estado derivado", "Data Grid: um commit por interação" and "Collection views: benchmark por view".
