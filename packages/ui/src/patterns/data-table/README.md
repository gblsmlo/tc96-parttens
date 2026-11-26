# Data Table

A semantic `<table>` on COSS `Table` and TanStack Table v9. Unlike `DataGrid`, it is not a WAI-ARIA grid: there is no roving focus, cell selection, column menu, sticky pinning or virtualization, and the header is plain content. The consumer owns the cells (a checkbox, a sort button, a pagination control) and drives the instance from `useDataTable`. Everything below the basics is opt-in and leaves the markup unchanged when unused: selection actions, sub-rows, group rows, row reorder, load more, inline editing and density. The names mirror `DataGrid`, so a screen moves between the two views by swapping the hook, the component and the column factories. `DataGridPagination`, `DataGridSortSubmenu`, `DataGridDensitySubmenu`, `DataGridConditionFilters` and `createDataGridConditionFilterFn` also accept this table.

## State

`useDataTable` takes a value and `on*Change(value)` pair for `sorting`, `globalFilter`, `columnFilters`, `columnVisibility`, `columnOrder`, `columnPinning`, `columnSizing`, `rowSelection`, `pagination` and `expanded`. A value makes that state controlled; without it the hook keeps the state, seeded from `tableOptions.initialState`, and still reports each change as the resolved value, never an updater. `globalFilterFn` defaults to `includesString`; pass `createDataGridConditionFilterFn<TData, DataTableFeatures>(fields)` as `tableOptions.globalFilterFn` and feed it with `table.setGlobalFilter(conditions)` for condition filters.

## Selection

`createDataTableSelectColumn({ selectAllLabel, getRowLabel })` adds the `select` column with the page select-all and row checkboxes. `selectionActions` on `DataTable` renders the pattern `ActionBar` (or a function of `{ selectedRows, selectedCount, clearSelection }`) floating at the bottom of the table while rows are selected.

## Sub-rows

`enableExpanding` with `getSubRows` renders sub-rows under their parent; a page counts top-level rows. Put `DataTableExpandToggle` in the first column cell: it indents by `row.depth * indent` px and renders a button with `aria-expanded`, named by `getLabel(row, expanded)`. The table keeps its `table` role: `aria-level` and `aria-expanded` are valid on a row only inside a `treegrid`, and this view has no grid keyboard model, so the expanded state lives on the toggle button.

## Group rows

`getRowGroup(row)` opens a group at every run of equal consecutive values on the page; each run is its own `tbody`, opened by a row whose label cell is a `th scope="rowgroup"` with a chevron, the group and its count. `renderGroupCell({ group, count, collapsed, column, rows })` gives the group row one cell per column for subtotals. Collapse is uncontrolled (`defaultCollapsedGroupIds`) or controlled (`collapsedGroupIds`, `onCollapsedGroupIdsChange`); pass every id to collapse all. `getGroupToggleLabel(group, collapsed)` names the chevron.

## Row reorder

`onRowMove({ rowId, fromIndex, toIndex, overRowId })` with a `createDataTableRowDragColumn({ getHandleLabel, headerLabel })` column lets a row be dragged by its handle with the pointer or the keyboard (Space picks, arrows move, Space drops, Escape cancels). The table never reorders `data`; the consumer does. `rowDragAnnouncements` supply what screen readers hear. Reorder is off while the table is sorted, grouped or loading, and the handles render disabled.

## Load more

`onEndReached` fires when the scroll viewport is within `endReachedThreshold` rows (default 5) of the end, once per data length; `loadingMore` appends `loadingMoreRowCount` skeleton rows and holds further calls. The table must sit in a bounded flex column to scroll.

## Inline editing

With `onCellValueChange` on `useDataTable`, a column with `meta.editable` (text, or `meta.variant: 'number'`) renders an editable cell in the default `DataTableCell`, with the DataGrid column meta: `validate`, `getCellError`, `formatValue`, `getCellLabel`, `emptyLabel`, `placeholder`. Enter or blur commits once as a string, Escape restores. A column with its own `cell` renders `<DataTableCell context={context} />` to stay editable. Type the meta with `satisfies DataTableColumnMeta<TData>`, since the table's column meta is open.

## Density

`density` (`short`, `medium`, `tall`, `extra-tall`) on `useDataTable` or `DataTable` sets the body row height; `onDensityChange` makes it controlled. `DataGridDensitySubmenu` inside a `ViewSettings` changes it. Without a density the rows keep the COSS height.

## Cell renderers

Rows are memoized below the component that calls `useDataTable`. A row re-renders when its `row`, its `selected`, `canSelect` and `expanded` state, whether reorder is active, the visible columns or `table.options.meta` change. A cell renderer must derive from its `row`, `column`, `cell` and `table.options.meta`. A custom cell that reads other table state (sorting, pagination, filters) during render is not re-rendered when that state changes, because the row is memoized. Pass what the cell needs through `meta`, or read it from the row. `onRowOpen` also reaches the memoized row by identity, so keep it stable (`useCallback`) like `columns`; an inline handler re-renders every row on each parent render.

## Row click

`onRowOpen(row)` opens a record from any part of a row, like `ListRow` and `KanbanCard`. Each body row gets a button in its first cell, stretched over the row and named by `getRowOpenLabel(row)` (default "Abrir registro"). A click on the selection checkbox, an editable property or a button the consumer put in a cell keeps its own handler and never calls `onRowOpen`. The row carries `data-interactive` and the pointer cursor only while the prop is set. Cell content that is not interactive stops receiving the pointer, so its text cannot be selected with the mouse.

## Footer aggregations

A column declares `meta.aggregations` (`count`, `sum`) with `DataTableColumnMeta`, plus optional `align`, `getAggregationValue` for a column without an accessor, and `formatAggregation`. Its footer cell becomes a menu with "Nenhum" and the listed operations; the result covers every row before pagination. `defaultAggregations` sets the initial choice by column id, `aggregations` with `onAggregationsChange` controls it, and `aggregationLabels` replaces the pt-BR labels. Without rows or while loading, the aggregated cells are left out.

## Columns submenu

`DataTableColumnsSubmenu` is the `DataGridColumnsSubmenu` of the Table: a `ViewSettings` section that lists `getAllLeafColumns()` with `getCanHide()` and toggles each one's visibility. Each option reads `meta.label` (`DataTableColumnMeta`) and falls back to the column id, so give a column such as `select` `enableHiding: false` to keep it out. The submenu renders nothing when no column can hide, and `label` replaces the pt-BR "Colunas".

## Horizontal overflow

The table scrolls inside the `ScrollArea` of `@tc96/ui/scroll-area` (`data-slot="data-table-viewport"` on its viewport), with a sticky `thead` and `tfoot`; the vertical scrollbar starts below the header and ends above the footer. The root `data-slot="data-table"` carries `data-overflow-start` and `data-overflow-end` while the columns run past that side of the viewport, and a fade over that edge shows the clipped content.

## Benchmark

Reproduce from the repo root:

```bash
bun run bench:data-table                       # same as: bun scripts/bench/data-table.bench.ts
bun scripts/bench/data-table.bench.ts --json scripts/bench/results/data-table.base.json
bun scripts/bench/data-table.bench.ts --compare scripts/bench/results/data-table.base.json --gate
```

`--gate` exits 1 when any render counter rose or a scenario disappeared; timing only warns. Cells are counted by wrapping the column `cell` renderers (including the selection checkbox cell) with `countRenders`, so `cells` is how many times a consumer renderer ran. Data is seeded (96), columns are one selection column plus data columns.

| Case | Scenario | What it counts |
| --- | --- | --- |
| `200x10`, `1000x20` | mount | cell renders of the first render of every row |
| `200x10`, `1000x20` | select click | cell renders after toggling one row checkbox (click on the same checkbox, so state returns) |
| `200x10`, `1000x20` | sort toggle | cell renders after `column.toggleSorting` alternating ascending and descending |
| `200x10 paged`, `1000x20 paged` | pagination next/prev | cell renders after `nextPage` and `previousPage` alternating, page size 50 |
| all | parent re-render | cell renders after a wrapper with a counter button re-renders with the same props and table |

`DataTable` has no public header sort control or pagination UI, so sorting and paging go through the table instance, the same API a consumer's own controls call.

Environment: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), React 19.1.1 development build, AMD Ryzen 3 3200G with Radeon Vega Graphics x4, seed 96, 5 iterations per scenario with 1 warmup (mount: 3, fresh container), medians. Before is the view before the memoized leaf, after is this folder; same machine, same adapter, run one after the other. The after file is the committed baseline `scripts/bench/results/data-table.base.json`. Render counts gate; times are a report and differences under 10% are noise.

| Case | Scenario | Cells before | Cells after | Wall before (ms) | Wall after (ms) | Δ wall | Profiler before (ms) | Profiler after (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 200x10 | mount | 2000 | 2000 | 304.7 | 184.5 | -39% | 268.3 | 170.1 |
| 200x10 | select click | 2000 | 10 | 57.4 | 9.7 | -83% | 29.5 | 1.4 |
| 200x10 | sort toggle | 2000 | 0 | 66.7 | 19.1 | -71% | 28.8 | 3.4 |
| 200x10 | parent re-render | 2000 | 0 | 46.7 | 2.5 | -95% | 25.1 | 1.3 |
| 1000x20 | mount | 20000 | 20000 | 1269.0 | 1226.5 | -3% | 1166.1 | 1132.4 |
| 1000x20 | select click | 20000 | 20 | 366.2 | 37.9 | -90% | 211.5 | 4.0 |
| 1000x20 | sort toggle | 20000 | 0 | 497.8 | 138.9 | -72% | 234.0 | 7.8 |
| 1000x20 | parent re-render | 20000 | 0 | 355.6 | 6.5 | -98% | 202.9 | 4.3 |
| 200x10 paged | mount | 500 | 500 | 36.1 | 38.8 | +7% | 33.1 | 35.7 |
| 200x10 paged | pagination next/prev | 500 | 500 | 41.7 | 44.2 | +6% | 35.4 | 39.0 |
| 200x10 paged | parent re-render | 500 | 0 | 14.9 | 1.2 | -92% | 6.4 | 0.4 |
| 1000x20 paged | mount | 1000 | 1000 | 65.4 | 60.8 | -7% | 60.0 | 56.5 |
| 1000x20 paged | pagination next/prev | 1000 | 1000 | 75.6 | 72.2 | -5% | 65.5 | 64.0 |
| 1000x20 paged | parent re-render | 1000 | 0 | 24.9 | 1.4 | -94% | 12.3 | 0.5 |

Reading the table: selecting a row renders that row's cells (10 and 20; every cell before), and a sort toggle or a parent re-render with unchanged props renders none. Pagination still renders one page, because the rows on screen change. Mount renders every cell either way; its moves in this run (-39% at 200x10, under 10% elsewhere) are noise, since a memo cannot make a mount cheaper.

On 2026-11-06 the scroll container became a Base UI `ScrollArea`, and mount went from one commit to two in every case: the root measures its overflow once after mount. Cell renders did not change. `scripts/bench/results/data-table.base.json` was regenerated then (bun 1.4.2, Apple M4); the table above keeps the 2026-10-03 times.
