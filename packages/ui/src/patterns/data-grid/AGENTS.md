# Data Grid view

The spreadsheet view of `collection`: a WAI-ARIA grid over the TanStack Table v9 instance `useDataGrid` returns, with roving focus, cell and row selection, column menu, resize, pinning, group rows, drag-scroll and optional virtualization. It never fetches, persists or writes a cell value; an editable cell reports the change through `onCellValueChange`. Its state is the table state `useDataGrid` keeps locally (sorting, filters, columns, row selection, pagination, density) plus, inside `DataGrid`, the focused cell, the cell selection, uncontrolled group collapse and the drag-scroll gesture.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `DataGrid`, its rows and cells, `DataGridCell` (default renderer per `meta.variant`), the public toolbar parts, `DataGridExpandToggle`, and thin wrappers over the parts it shares with the Data Table in `collection/shared/` (`createRowDragColumn` over `RowDragHandle`, `DataGridRowReorder` over `RowReorderProvider`, `DataGridSelectionActions` over `SelectionActions`, `DataGridInputCell` over `EditableInputCell`) |
| `hooks/` | `useDataGrid` and the hooks `DataGrid` composes: rows, focus, cell selection, cell events, virtualizer, drag-scroll, column layouts, row context, and `useDataGridEndReached` over the shared `useEndReached`. `useControllableTableState`, `useLatestCallback` and `useCollapsedGroups` moved to `collection/shared/hooks/` on 2026-11-24, when the Data Table took the same state pairs |
| `lib/` | pure functions (tree flattening and row positions among them; group runs, end-of-scroll, row-move rules and value formatting live in `collection/shared/lib/` since 2026-11-24), constants, `createSelectColumn`, `dataGridFeatures`, the table types and `data-grid-conditions.ts`, the React-free condition model and its filter function |
| `types.ts` | column meta, variants, column types, density, value change |
| `README.md` | usage and the benchmark table |

Import direction: `components/` → `hooks/`, `lib/`, `types.ts`; `hooks/` → `lib/`, `types.ts`; `lib/` → `types.ts`; any of them → `collection/shared/` (`types.ts` aliases `DataGridRowMove` and `DataGridRowDragAnnouncements` to the shared `RowMove` and `RowDragAnnouncements`). The one upward import is `hooks/use-data-grid.ts` → `components/data-grid-cell.tsx`, the default column renderer. Imports leaving the view are in the parent AGENTS.md.

## Dependents

- `collection/composition/collection-layout-outlet.tsx` imports `components/data-grid.tsx` by path, not through the barrel.
- `collection/core.ts` imports `lib/data-grid-features.ts` and `types.ts` by path.
- `collection/index.ts` re-exports `index.ts` whole.
- `scripts/bench/data-grid.bench.ts` imports this folder's `index.ts` and queries the slots `data-grid-row`, `data-grid-cell` and `data-grid-group-row`.
- `apps/storybook/src/patterns/data-grid/behavior-expanding.stories.tsx`, `behavior-group-cells`, `behavior-row-reorder` and `behavior-end-reached` share the `Behavior` title with `behavior.stories.tsx`; they query `data-grid-row`, `data-grid-group-row`, `data-grid-group-cell`, `data-grid-expand`, `data-grid-row-drag-handle` and `data-loading-more`.
- The `Patterns/DataGrid` pages in `apps/storybook/src/patterns/data-grid/` query slots: the hidden `Anatomy` of `api-reference.stories.tsx` checks `data-grid`, `data-grid-header`, `data-grid-header-row`, `data-grid-header-cell`, `data-grid-body`, `data-grid-group-row`, `data-grid-row`, `data-grid-cell`, `data-grid-footer` and `data-grid-pagination`, and `usages.stories.tsx` queries `data-grid-group-row`. Outside it, the root `Patterns/Collection` Behavior (`apps/storybook/src/patterns/collection/behavior.stories.tsx`) queries `data-grid`, and the hidden `Anatomy` of `layouts/data-table/api-reference.stories.tsx` checks `data-grid-pagination`.

## Invariants

Rendering:

- Rows and body cells are `memo` and receive primitives. Focus and cell selection reach a row only through `focusedColumnId`, `interacted` and `selectedColumnIds`; selected sets keep their identity when unchanged. Everything else comes from `DataGridRowContext`, which changes only with columns, layouts, density, interactions, `meta`, `enableRowSelection`, row-selectable or whether row reorder is active. A new input a cell renders from must arrive as a row prop or through that context, or memoization serves stale cells.
- A cell re-renders on the `cell` object, `isSelected`, `isFocused`/`showFocus`, `rowSelected`, `canSelect`, layout, density, `table.options.meta` and `enableRowSelection`. A renderer must derive from row, column, cell and `table.options.meta` only; one that reads sorting, filters or pagination goes stale.
- Every table state `useDataGrid` keeps (`sorting`, `globalFilter`, `columnFilters`, `columnVisibility`, `columnOrder`, `columnPinning`, `columnSizing`, `rowSelection`, `pagination`, `expanded`) has an option pair: the value makes it controlled and the `on*Change` callback receives the resolved value, never an updater (`useControllableTableState`). Without the value the hook keeps it, seeded from `tableOptions.initialState`, and still reports it. `density` is controlled only when `onDensityChange` is passed, because `density` alone was always the initial value. Passing `tableOptions.state` still replaces the whole state object.
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
- `DataGridPagination` renders the page size selector only with `pageSizeOptions`, `pageSizeLabel` and a table that has `setPageSize`; a change calls `setPageSize` and returns to page one. `DataGrid` renders `DataGridPagination` without those props, so a grid with the selector passes it as `footer`; the parent that builds the `footer` element must keep `data` referentially stable, or the page index resets on every render.
- `DataGridSearch` and `DataGridFilterMenu` return to page one on every change; the search filters per keystroke, unlike `CollectionSearchField`.
- Virtualization applies only without `getRowGroup`, not loading and with rows, because only then is `entries[i]` the `i`-th virtual row.
- Loading rows keep the height of loaded rows when `loadingRowAnatomy.cell` matches the cells: `control` (24px, the property surfaces) or `text` (20px); the density sets the row minimum either way. Pass the page size as `loadingRowCount` when the grid paginates. The skeleton rows carry `data-cell`.

Row tree (`enableExpanding`):

- `dataGridFeatures` always carries `rowExpandingFeature` and the expanded row model, and `useDataGrid` always owns the `expanded` state (`expanded`/`onExpandedChange` make it controlled; `initialState.expanded` seeds it). Only with `enableExpanding` does it also pass `getSubRows`, `paginateExpandedRows: false` and `autoResetExpanded: false`: the page counts top-level rows and sub-rows ride with their parent, and an edit that replaces `data` does not collapse the tree. Without the flag the pipeline output is the one it always was (bench counters unchanged).
- The grid is `role="treegrid"` only when `table.options.enableExpanding` is true. A row then carries `aria-level` (`row.depth + 1`) and, when it can expand, `aria-expanded`; both are row props, and `expanded` is also passed to every cell of that row (like `rowSelected`), because an expand changes neither the row nor the cell object.
- The collection is the flattened expanded tree of the sorted rows (`flattenExpandedRows`), so `aria-rowindex`, `aria-rowcount`, positions and cell selection cover sub-rows on any page. With client pagination the position wins over `dataGridPaginationRowOffset`, because pages hold more rows than `pageSize`. Server pagination with `rowCount` is not supported with a tree.
- Indent and toggle are the consumer's first column cell: `DataGridExpandToggle` (indent `row.depth * indent` px as `padding-inline-start`, a button with `aria-expanded` and `getLabel(row, expanded)` as its name, or a same-size spacer on leaf rows). Keyboard decision: ArrowLeft/ArrowRight already move the cell focus, so they cannot expand or collapse; the toggle button is the keyboard path (Tab, then Enter or Space). Every toggle is a tab stop, like the select checkbox. Groups (`getRowGroup`) and sub-rows are not designed to combine.

Group row cells (`renderGroupCell`):

- With `renderGroupCell` the group row renders one `gridcell` per visible column, with the column layout (width, pinned offset) of the body cells, so subtotals sit under their columns. The chevron, label and count go in the first navigable column (`labelColumnId`, never `select`, `actions` or `drag`); leading columns are empty cells, and `renderGroupCell` runs for every other column. Cells align with `meta.align`. Without the prop the group row keeps its single cell.
- `renderGroupCell({ group, count, collapsed, column, rows })` receives the rows of that group on the current page, collapsed ones included: counts and subtotals are page values. It runs in the memoized group row: an inline function re-renders group rows (not cells) on each grid render, and a renderer that reads other state with a stable identity goes stale.
- Collapse all and expand all use the existing `collapsedGroupIds`/`onCollapsedGroupIdsChange` pair: the consumer owns the list of group ids and passes it all or empty.

Row reorder (`onRowMove`):

- The grid never reorders `data`: dnd-kit (`useSortable` per handle, one `DragDropProvider` around the body) reports `{ rowId, fromIndex, toIndex, overRowId }` once per drop; a cancelled drag, a drop in place or outside a row reports nothing. The consumer reorders `data`; if it does not, dnd-kit's optimistic DOM order and React disagree until the next render. Indexes are positions in the collection (the filtered rows), so they are data indexes only without a filter; `overRowId` is the stable reference. With client pagination they carry the page offset.
- The handle comes from `createRowDragColumn`; its `useSortable` takes the row element through `closest('[data-slot="data-grid-row"]')` in a callback ref, because the cell cannot reach the row. Only the handle is a drag activator, and `button` is in `DRAG_SCROLL_EXCLUDED_TARGETS`. The drag column id is `drag`, a non-navigable column.
- Reorder is active only with `onRowMove`, no `getRowGroup`, no sorting, not loading and not virtualized (`isRowReorderActive`; the check uses the virtualization that really applies). Otherwise the provider is not mounted and every handle renders disabled, so a reorder never lands in a sorted, grouped or windowed view.
- Keyboard: the sensor is the checklist's: Space picks, arrows move, Space or Tab drops, Escape cancels. `rowDragAnnouncements` (`start`, `over`, `end`, `instructions`) supply every spoken text through the dnd-kit `Accessibility` plugin; positions in them are 0-based among the rendered rows. Without it dnd-kit's English defaults speak. Give a stable object or memoize it: the plugin list rebuilds only when its shape changes, not per render.
- The dragged row gets `data-dnd-dragging` from dnd-kit, and only when reorder is active the row reads it (`data-dnd-dragging:bg-background`, shadow).

End of scroll (`onEndReached`, `loadingMore`):

- `onEndReached` fires from the viewport's `scroll` event and once after render, when the distance to the end is within `endReachedThreshold` rows (default 5, `ROW_HEIGHT` of the density, plus the sticky footer or add row) and not loading. It fires once per `table.options.data.length`: a load that adds nothing does not retry, and a shorter-than-viewport list fires on mount. The same geometry serves virtualized and plain grids. Use it without pagination.
- `loadingMore` appends `loadingMoreRowCount` (3) skeleton rows (`DataGridSkeletonRows`, `data-loading-more`), sets `aria-busy`, counts in `aria-rowcount` and suppresses `onEndReached`. They render only with rows and not `isLoading`. When virtualized they are absolutely positioned after the last virtual row and `totalSize` grows by their height.

Cells:

- The date variant uses one cached `Intl.DateTimeFormat` with no locale and no options, so it shows the date only. `parseDateValue` from `@tc96/ui/helpers/date` reads `2026-08-04` as local midnight, because `new Date('2026-08-04')` is UTC midnight and shows the previous day west of UTC (tested).
- An editable `text` or `number` cell (`meta.editable` with `onCellValueChange`) is `DataGridInputCell`: a button that opens an input in the same cell. Enter commits, Escape restores the stored value, blur commits; each goes through `onCellValueChange` once, as a string. `meta.validate(value, row)` runs on every keystroke: while it returns a message the input has `aria-invalid` and `aria-describedby` to the message under it, the cell gets `data-invalid`, and Enter and blur keep the input open without committing. The value of a `number` cell is the typed string; the consumer parses it.
- The message sits in the cell flow, so a row grows while it shows. With `virtualize` the row height is fixed and the message is clipped, while `aria-invalid` and the red field stay. `data-invalid` is set on the `gridcell` by an effect, since the cell element belongs to `DataGridBodyCell`.
- `meta.getCellError(row, columnId)` marks a cell invalid from outside (a server error) with the same attributes. It costs nothing per render, but a new answer reaches the cell only when `columns` or `tableOptions.meta` change identity, which re-renders every row, so keep the errors in the memoized `columns`.
- `createSelectColumn` shows the row number and swaps it for the checkbox on hover, focus within, coarse pointer or when checked; `showRowNumbers: false` shows only the checkbox. The number is `row.index + 1`, the position in `data`, so sorting does not renumber.

Texts:

- `DataGridDensitySubmenu` and `DataGridSortSubmenu` take a structural table (`DataGridDensityTable`: `options.meta` with `dataGridDensity` and `onDataGridDensityChange`; `DataGridSortTable`: `getAllLeafColumns`, `resetSorting`, `store.state.sorting`), so a `useDataTable` instance drives them too; `DataGridConditionFilters` takes no table at all.
- Every text the view's parts render has a prop with a pt-BR default, so a block passes its labels instead of rebuilding a part: `createSelectColumn` `selectAllLabel` and `getRowLabel`, `DataGridSortSubmenu` `clearLabel` and `getOptionLabel(columnLabel, direction)`, `DataGridDensitySubmenu` `densityLabels`, `DataGrid` `getGroupToggleLabel(group, collapsed)` (the group chevron, previously in English). Editable cells take column meta `getCellLabel(columnLabel, displayValue)` and `emptyLabel` for the trigger name, and `formatValue(value)` for what the text and number trigger shows (the input still edits the raw string). Texts that join a value and words are functions, never concatenated in the part. `getGroupToggleLabel` reaches the memoized group row as a prop: pass a stable function.

Condition filters:

- `DataGridConditionFilters` keeps no copy of the conditions: `conditions` and `onConditionsChange` are the consumer's, and the consumer declares the fields, the operator labels and every text (`labels`, `operatorLabels`, `formatValue`). Values render as separate nodes (badges for `is-any-of`, the consumer's `rangeSeparator` between a range), so the pattern never joins words.
- `createDataGridConditionFilterFn<TData, TFeatures>(fields, join)` returns a `FilterFn` of any feature set (`DataGridFeatures` by default, `DataTableFeatures` for a table) and evaluates the whole row, whatever `columnId` it receives, so it takes the table's `globalFilterFn` (feed it with `table.setGlobalFilter(conditions)`, and `''` to clear: `undefined` leaves the old value in the store) or one column's `filterFn`. As the global filter it replaces `DataGridSearch`; with a search box, use it as the `filterFn` of one column and set that column's filter value.
- A condition with an empty value, an unknown column or a range with one end is ignored, so a freshly added chip filters nothing. `and` is the default join; `or` is a factory option, not part of the toolbar.
- Option conditions store the option `value` strings; dates are `YYYY-MM-DD` compared by calendar day; numbers compare as numbers and a cell that is not a finite number never matches.

ARIA and layout:

- `role="grid"` (`treegrid` with `enableExpanding`), `row`, `gridcell`, `columnheader`, `rowgroup` and `separator` on `div`s are intentional: a virtualizable spreadsheet uses the WAI-ARIA grid pattern, not table elements. Each file that sets one carries a `biome-ignore-all lint/a11y/useSemanticElements` line, the only comment allowed here; it ships with the copied source so the consumer's Biome stays quiet.
- `aria-rowcount` is header rows plus body rows plus the `loadingMore` rows, the add row and the footer: a grid contains only rows, so both are rows with a `gridcell`. Body rows are the loading count, 1 for the empty row, or collection rows plus group rows.
- A row emits `aria-selected` only when row selection applies (`enableRowSelection` or `getRowSelected`); cells always do, because cell selection always exists. The grid is `aria-multiselectable` because Shift extends the cell selection.
- The resize separator always carries `aria-valuemin` and `aria-valuemax`, and the keyboard resize is clamped to them. `useDataGrid`'s default column sets `minSize: 80`; another table falls back to TanStack's 20 and `Number.MAX_SAFE_INTEGER`.
- The last column's resize handle and grab area grow inward: outward they add 8px of scroll past the content, and the strip reads as an extra column.
- With no fill column the wrapper and the bordered root are `w-fit max-w-full`, because stretching leaves a borderless strip that reads as a phantom column; it still scrolls when columns overflow. The wrapper also positions the selection action bar.
- The grid is the `ScrollArea` of `@tc96/ui/scroll-area`; its default `clampContentMinWidth` puts `style={{ minWidth: 0 }}` on the content, the only way to beat Base UI's inline `minWidth: fit-content`. The frame classes on its root are registered in `scripts/override-exceptions.json`.

## Styling

| Attribute | Where |
| --- | --- |
| `data-state="selected"` | row |
| `data-selected`, `data-focused` | body cell |
| `data-pinned="start\|end"`, `data-column-id` | header, body and skeleton cells |
| `data-density`, `data-drag-scroll="dragging"` | viewport |
| `data-virtualized` | body |
| `data-collapsed` | group row |
| `data-depth` | `DataGridExpandToggle` wrapper (`row.depth`) |
| `data-dragging` | row drag handle, while its row is the drag source |
| `data-dnd-dragging` | the dragged row, set by dnd-kit; read by the row only while reorder is active |
| `data-loading-more="true"` | skeleton rows rendered by `loadingMore` |
| `data-column-type` | column type icon |
| `data-grid-select-trigger` | editable select trigger; read by the cell handlers and the drag-scroll exclusion |
| `data-grid-input-trigger` | the button of an editable text or number cell; a `button`, so drag-scroll already skips it |
| `data-invalid` | the `gridcell` and the `data-grid-input-cell` wrapper while the cell holds an invalid or externally flagged value |

`data-slot` names: `data-grid`, `data-grid-header`, `data-grid-header-row`, `data-grid-header-cell`, `data-grid-body`, `data-grid-row`, `data-grid-cell`, `data-grid-group-row`, `data-grid-group-label`, `data-grid-group-count`, `data-grid-group-cell`, `data-grid-expand`, `data-grid-expand-toggle`, `data-grid-row-drag-handle`, `data-grid-add-row-group`, `data-grid-footer`, `data-grid-selection-actions`, `data-grid-row-marker`, `data-grid-column-type-icon`, `data-grid-pagination`, `data-grid-search`, `data-grid-filter-menu`, `data-grid-selection-summary`, `data-grid-input-cell`, `data-grid-condition-filters`, `data-grid-condition`. Do not rename or drop any; the bench and the stories query some.

`scripts/override-exceptions.json` has no entry for this view.

## Verify

```bash
bun test --isolate packages/ui/src/patterns/data-grid
bunx biome check packages/ui/src/patterns/data-grid
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/data-grid/ src/patterns/collection/usages/tasks.stories.tsx src/patterns/collection/usages/contacts.stories.tsx
bun scripts/bench/data-grid.bench.ts --compare scripts/bench/results/data-grid.base.json --gate
```

## Pointers

- Parent: `collection/AGENTS.md`, for bench rules and imports leaving the view.
- Public API: this folder's `index.ts` and the `collection` entry of `docs/architecture/public-api-exports.json`. Usage is in `README.md`.
- Decisions: `docs/architecture/tc96-ui.md`, sections "Data Grid: linhas memoizadas e estado derivado", "Data Grid: um commit por interação" and "Collection layouts: benchmark por layout".
