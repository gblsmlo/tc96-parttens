# DataTable

A read-mostly table over the TanStack Table v9 instance `useDataTable` returns, usable alone or mounted by `CollectionLayoutOutlet`. It never fetches or persists; its state is the table state the hook keeps locally when the consumer does not control it.

## Map

| Folder | Holds |
| --- | --- |
| `use-data-table.ts` | the hook |
| `data-table-features.ts` | features and table types |
| `data-table.tsx`, `data-table-body.tsx` | the root, body, group sections and reorder provider |
| the other `data-table-*` files | the row, group row, skeleton rows, cells, aggregation, resize handle, columns submenu, the column factories (`createDataTableSelectColumn`, `createDataTableRowDragColumn`), `DataTableExpandToggle`, `data-table-types.ts` and `data-table-align.ts` (the `meta.align` classes) |
| `use-horizontal-overflow.ts` | the edge fades |

Import direction: the files import each other and `collection/shared/` (`use-scrollbar-insets`, the table hooks, `group-runs`, `end-reached`, `row-reorder`, `editable-cell`, `format-value`, `interactive-descendants`, `selection-actions`, `row-reorder-provider`, `row-drag-handle`, `editable-input-cell`). It never imports another layout; it shares the DataGrid contract through `collection/shared/`.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `index.ts`; `collection/composition/collection-layout-outlet.tsx` imports the view by file path and mounts it, so the `collection` registry item ships this folder.
- `scripts/bench/data-table.bench.ts` imports `index.ts`.
- The table blocks import `use-data-table`, `data-table-features`, `data-table-select-column` and `data-table` by path (`packages/ui/src/blocks/AGENTS.md`).
- `scripts/override-exceptions.json` keys two `TableHeader` entries by `data-table.tsx` and one `TableRow` entry by `data-table-row.tsx`.
- `apps/storybook/src/patterns/data-table/behavior-expanding.stories.tsx`, `behavior-groups`, `behavior-row-reorder`, `behavior-end-reached` and `behavior-table-blocks` share the Data Table `Behavior` title with `behavior.stories.tsx`; `behavior-table-blocks` imports `conditionLabels` and `operatorLabels` from `apps/storybook/src/patterns/data-grid/data-grid-table-blocks.tsx`.

## Invariants

- `useDataTable` always registers pagination with `manualPagination: !enablePagination`, so without the flag the table yields every row.
- `useDataTable` mirrors `useDataGrid`: every table state (`sorting`, `globalFilter`, `columnFilters`, `columnVisibility`, `columnOrder`, `columnPinning`, `columnSizing`, `rowSelection`, `pagination`, `expanded`) has a value and `on*Change(value)` pair through the shared `useControllableTableState`; without the value the hook keeps it, seeded from `tableOptions.initialState`, and still reports it. `dataTableFeatures` carries filtering (global and per column, `globalFilterFn: 'includesString'`), ordering, pinning and expanding, so the DataGrid toolbar parts and `createDataGridConditionFilterFn<TData, DataTableFeatures>` work on a table. Pinning only orders the columns; the table has no sticky pinned cells.
- `useDataTable` leaves `meta` and `defaultColumn` untouched unless `density`, `onDensityChange` or `onCellValueChange` is passed, so the rows keep their memo and the default cell stays TanStack's. With them it memoizes a meta that merges the consumer's: density under the DataGrid keys (`dataGridDensity`, `onDataGridDensityChange`), so `DataGridDensitySubmenu` drives either view, and `onDataTableCellValueChange` behind `useLatestCallback`. `density` alone is the initial value; `onDensityChange` makes it controlled.
- With `onCellValueChange`, the default cell is `DataTableCell`: a column with `meta.editable` renders the shared `EditableInputCell` (text, or number with `meta.variant: 'number'`), with DataGrid's contract: Enter and blur commit once as a string, Escape restores, `meta.validate` blocks the commit while it returns a message (`aria-invalid`, `aria-describedby`, `data-invalid` on the `td`), `meta.getCellError` flags from outside, `formatValue`, `getCellLabel` and `emptyLabel` name the trigger. A column with its own `cell` renders `DataTableCell` itself to stay editable. Column meta is untyped in `dataTableFeatures` (consumers pass extra keys such as `type`), so type an editable column's meta with `satisfies DataTableColumnMeta<TData>`.
- Density sets `data-density` on the `table` and the body cells' block padding (`short` keeps COSS `p-2.5`, `medium` `py-3.5`, `tall` `py-5`, `extra-tall` `py-7`), which matches the DataGrid row steps of 8, 20 and 36 px. Without a density the `table` has no attribute and no class.
- Row tree (`enableExpanding` with `getSubRows`): the hook passes `paginateExpandedRows: false` and `autoResetExpanded: false`, so a page counts top-level rows and an edit does not collapse the tree. ARIA decision: the view stays a `table`. `aria-level` and `aria-expanded` belong to `row` only inside a `treegrid`, and turning the table into a `treegrid` would promise grid keyboard navigation it does not have. The state lives on `DataTableExpandToggle`, a `button` with `aria-expanded` named by `getLabel(row, expanded)`; depth is the indent (`row.depth * indent` px) and `data-depth`. `expanded` is a row prop, because an expand changes neither the row object nor its cells and the row is memoized.
- `getRowGroup` splits the page rows into runs of equal consecutive values (`splitGroupSections`; a null group joins the open run) and renders each run as its own `tbody`, opened by a group row whose label cell is a `th scope="rowgroup"`: that scope names the `tbody`, which is why each group gets one. The label cell spans every column, or, with `renderGroupCell`, the row has one cell per visible column: the label sits in the first column that is not `select`, `actions` or `drag`, leading cells are empty and `renderGroupCell({ group, count, collapsed, column, rows })` fills the rest, aligned by `meta.align`. Counts and `rows` are page values. The chevron is a `button` with `aria-expanded` named by `getGroupToggleLabel(group, collapsed)`; collapse is uncontrolled (`defaultCollapsedGroupIds`) or controlled (`collapsedGroupIds` with `onCollapsedGroupIdsChange`), and collapse all passes every id. Without `getRowGroup` the body is the single `tbody` it always was. Groups and sub-rows are not designed to combine.
- Row reorder (`onRowMove`) reuses the DataGrid contract through the shared provider and handle: the handle column from `createDataTableRowDragColumn` (`drag` id) finds its `tr` with `closest('tr')`, the keyboard sensor is the same, `rowDragAnnouncements` supply every spoken text, and the move reports `{ rowId, fromIndex, toIndex, overRowId }` with indexes in `getPrePaginatedRowModel()`. It is active only without `getRowGroup`, sorting or `loading`; otherwise every handle renders disabled. dnd-kit copies the cell widths of a dragged `tr`; while active the row carries `data-dnd-dragging:bg-background` (override exception) so the lifted row is opaque.
- `onEndReached` listens to `data-table-viewport` through the shared `useEndReached`: it fires within `endReachedThreshold` rows (default 5) of the end, measuring the first body row and the sticky footer, once per `table.options.data.length`, never while `loading` or `loadingMore`, and once after render when the rows do not fill the viewport. The viewport only scrolls inside a bounded flex column. `loadingMore` appends `loadingMoreRowCount` (3) skeleton rows (`data-loading-more="true"`) to the last `tbody` and sets `aria-busy`; they render only with rows and not `loading`.
- Column `meta.align` (`start`, `center`, `end`) aligns the `th` and every body `td` of the column: `text-*` for inline content (text, a `Button` or `Badge`, which are `inline-flex`) and `[&>.flex]:justify-*` for a direct `flex` child, so a block never wraps a cell in `flex justify-end` or a header in `block text-end`. Without `align` the `th` and `td` keep their exact markup (no class added), and `EndColumnAlignsHeaderAndBody` in `Patterns/DataTable/Behavior` measures the `end` case. The group row, the aggregation menu and the editable cell read the same key on their own.
- `selectionActions` renders the consumer's `ActionBar` (or a function of `{ selectedRows, selectedCount, clearSelection }`) in `data-slot="data-table-selection-actions"`, floating at the bottom of the root, only while rows are selected. `createDataTableSelectColumn` renders the select-all and row checkboxes, named by `selectAllLabel` and `getRowLabel`.
- Every new text of the table has a prop with a pt-BR default and joins no words in the part: `getGroupToggleLabel`, `DataTableExpandToggle` `getLabel`, the select and drag column labels, `rowDragAnnouncements`, and the editable cell meta (`getCellLabel`, `emptyLabel`). The default group label (`Expandir`/`Recolher` and the group) and the default cell name (`label: value`) are functions, as in the DataGrid.
- While `loading`, `DataTable` renders `loadingCount` skeleton rows shaped by `loadingAnatomy`: `lines` (1 or 2) in the first column with an accessor (the selection column has none) and `cell` (`text`, 20px, or `control`, 24px) in the others, so a loading row keeps the height of a loaded one. Pass the page size as `loadingCount` when the table paginates.
- With `enableColumnResizing`, `DataTable` switches to `table-fixed` with a `<colgroup>`: every visible column but the last takes `getSize()`, the last has no width and no handle so it absorbs the remaining space, and the table's `minWidth` is `getTotalSize()`, so it fills the container until the sizes overflow it and the container scrolls. Fixed cells clip with `overflow-hidden`. Without the flag the markup keeps the auto layout.
- A `DataTable` column with `meta.aggregations` gets a footer menu (none, count, sum) instead of its `footer`. Aggregates read `getPrePaginatedRowModel()`, so they cover every page, like Notion. Count is the row count; sum skips values that are not finite numbers. Without rows or while loading, aggregated cells render nothing, and a footer with only aggregated columns is left out. The choice is uncontrolled through `defaultAggregations` or controlled through `aggregations`, and a choice the column does not list reads as none.
- With `onRowOpen`, each `DataTable` body row gets a `button` in its first cell stretched (`absolute inset-0 -z-10`) against the `tr`, which is `isolate` so the negative `z` stays inside the row. A `button` cannot be a child of `tr`; the negative `z` keeps non-positioned cell controls above it. Cells are `pointer-events-none` and their interactive descendants `pointer-events-auto` (`interactiveDescendants`, shared with `ListRow`), so a plain area reaches the trigger and a checkbox, field or cell button keeps its click. `DataTable` resolves `getRowOpenLabel` into a string for the memoized row, while `onRowOpen` reaches it by identity. Without the prop the markup is unchanged (tested), and so is a row for which `getRowCanOpen` returns `false` (`RowThatDoesNotOpen`): the body passes it no `onRowOpen`, so a consumer row that leads nowhere keeps its cells and selection. The data grid has no row open and `ListRow` opens only through a `ListRowTitleTrigger` the consumer renders, so neither needs the predicate. `RowOpensFromAPlainArea` in `Patterns/DataTable/Behavior` asserts this with `elementFromPoint`, since JSDOM has no hit testing.
- `DataTable` wraps the COSS `Table` in `data-slot="data-table"`, the positioned box for two `aria-hidden` fades over the scroll container's edges (issue #127): macOS overlay scrollbars hide while idle and a vertical wheel does not scroll sideways, so the overflow had no cue. `useHorizontalOverflow` reads the viewport through a ref object, not a state callback ref; mount is two commits in the bench because the Base UI `ScrollArea` root measures once after mount.
- `DataTable` is `min-h-0 flex-1` and scrolls itself through the `ScrollArea` of `@tc96/ui/scroll-area` with a sticky `thead`/`tfoot`; `useScrollbarInsets` writes the header and footer heights to `--scrollbar-inset-start`/`--scrollbar-inset-end`, since Base UI sets the scrollbar's `top` and `bottom` inline.
- The consumer's renderer runs in a memoized leaf below the stateful component: it re-runs only when its identity or inputs change, so a renderer that reads other state with a stable identity goes stale.

- Each skeleton row carries a visually hidden `output` with `aria-busy` in its first cell, holding `loadingLabel` (`"Carregando linha"`): a `tr` or a `role="row"` cannot be wrapped in a status, as List and Kanban wrap their skeletons.
- `density` is the shared `CollectionDensity` (`compact`, `short`, `medium`, `tall`, `extra-tall`); `compact` is the step below `short`.

## Styling

| Attribute | Where | Read by |
| --- | --- | --- |
| `data-slot="data-table"`, `data-overflow-start`, `data-overflow-end` | the `DataTable` root; `data-slot="data-table-viewport"` is the scrolling element | the edge fades (`data-table-overflow-start`, `data-table-overflow-end`) through `group-data-*/data-table` |
| `data-slot="data-table-row-trigger"`, `data-interactive` | the open button and the `tr` of a `DataTable` row, only with `onRowOpen` and not on a row `getRowCanOpen` rejects | consumers and tests; the trigger draws its own `focus-visible` ring |
| `data-cell`, `data-lines` | the skeleton rows of a loading `DataTable`, from `loadingAnatomy` | tests; not styled |
| `data-density` | the `DataTable` `table`, only with a density | tests; the density padding is a class keyed by the value |
| `data-loading-more="true"` | the skeleton rows `loadingMore` appends to a `DataTable` | tests; not styled |
| `data-slot="data-table-group-row"`, `data-collapsed`, `data-slot="data-table-group-label\|group-count\|group-toggle\|group-cell"`, `data-column-id` | the `DataTable` group row, its label parts and its per-column cells | consumers and tests; not styled outside the row |
| `data-slot="data-table-expand"`, `data-depth`, `data-slot="data-table-expand-toggle"` | `DataTableExpandToggle` | consumers and tests |
| `data-slot="data-table-row-drag-handle"`, `data-dragging`, `data-dnd-dragging` | the handle of `createDataTableRowDragColumn`; `data-dnd-dragging` is set by dnd-kit on the dragged `tr` | the row, only while reorder is active |
| `data-slot="data-table-input-cell"`, `data-table-input-trigger`, `data-invalid` | the editable cell of `DataTableCell`; `data-invalid` also lands on its `td` | tests; the trigger draws its own `focus-visible` ring |
| `data-slot="data-table-selection-actions"` | the floating wrapper of `selectionActions` | consumers and tests |
| `data-slot="data-table-aggregation"`, `data-aggregation` | the `DataTable` footer cell of an aggregated column | consumers and tests; with no aggregation the trigger hides behind `group-hover/footer` |
| `data-state="selected"`, `data-bordered` | `DataTable` rows and root | consumers |

- `DataTable` draws the DataGrid frame (`rounded-md border bg-background`) unless `bordered={false}`, and its `thead` and the DataGrid header (pinned header cells included) share one `color-mix` of `var(--card)` with 2% black, 2% white in dark, so the two views read as the same surface.
- `scripts/override-exceptions.json` has two `TableHeader` entries in `data-table.tsx` (the `thead` color) and one `TableRow` entry in `data-table-row.tsx` (`data-dnd-dragging:bg-background`, the opaque dragged row).

## Verify

```bash
bunx biome check packages/ui/src/patterns/data-table
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/data-table
bun scripts/bench/data-table.bench.ts --compare scripts/bench/results/data-table.base.json --gate
```

Run the bench when rendering changed: `--gate` exits 1 when a render counter rose or a scenario disappeared; timing only warns. Regenerate the baseline with `--json` on an idle machine and update `README.md` in the same change.

`Patterns/DataTable` (`apps/storybook/src/patterns/data-table/`) is documented in the six component pages; its `Usages` and `Behavior` read `collection/fixtures/tasks.ts`.

## Pointers

- Public API: `index.ts` and the `patterns` entry of `docs/architecture/public-api-exports.json`.
- Section "Data Table: `onRowOpen` com um gatilho esticado na linha" of the architecture doc.
- Decisions: `docs/architecture/tc96-ui.md`; accessibility: `docs/accessibility.md`, sections "Regras" and "Boas práticas".
- The collection outlet that mounts this layout, and the shared code it imports: `packages/ui/src/patterns/collection/AGENTS.md`.
