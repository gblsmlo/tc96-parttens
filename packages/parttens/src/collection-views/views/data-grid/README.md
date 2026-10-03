# Data Grid

A WAI-ARIA grid on TanStack Table v9: roving-focus cell navigation, cell selection, optional row selection, column menu (sort, move, pin, hide), keyboard and pointer column resize, pinned columns, group rows with collapse, drag-scroll, optional row virtualization, and a default cell renderer per `meta.variant`. The component is controlled: the consumer passes data and handles events, and nothing is fetched, filtered or persisted inside the grid.

## Usage

```tsx
import {
  DataGrid,
  DataGridSearch,
  DataGridSelectionSummary,
  createSelectColumn,
  useDataGrid,
  type DataGridColumnDef,
} from '@tc96/parttens'

const columns: DataGridColumnDef<Invoice>[] = [
  createSelectColumn<Invoice>(),
  { accessorKey: 'customer', header: 'Customer', meta: { label: 'Customer', type: 'title' } },
  { accessorKey: 'amount', header: 'Amount', meta: { label: 'Amount', variant: 'number', align: 'end' } },
]

function Invoices({ invoices }: { invoices: Invoice[] }) {
  const { table } = useDataGrid<Invoice>({
    columns,
    data: invoices,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (invoice) => invoice.id,
  })

  return (
    <>
      <DataGridSearch table={table} />
      <DataGridSelectionSummary table={table} />
      <DataGrid aria-label="Invoices" table={table} />
    </>
  )
}
```

`useDataGrid` creates the TanStack table with every feature the grid reads (sorting, filtering, pagination, selection, visibility, ordering, pinning, sizing, resizing) and keeps the state locally. `tableOptions` is the escape hatch for anything else. Toolbar parts take the same `table`: `DataGridSearch`, `DataGridFilterMenu`, `DataGridSelectionSummary`, and the sections `DataGridSortSubmenu`, `DataGridColumnsSubmenu`, `DataGridDensitySubmenu` for `ViewSettingsMenu`.

## `DataGrid` props

| Prop | Meaning |
| --- | --- |
| `table` | the instance from `useDataGrid` |
| `pagination` | footer pagination; defaults to the table (`enablePagination`); `false` scrolls instead |
| `footer` | replaces the pagination slot |
| `fillColumn` | column that absorbs spare width; defaults to the last unpinned common column; `false` keeps declared widths |
| `density` | `short`, `medium`, `tall`, `extra-tall`; defaults to the table meta |
| `isLoading`, `loadingRowCount` | skeleton rows |
| `emptyMessage` | text of the empty row |
| `maxHeight` | viewport max height |
| `getRowGroup` | group value per row; one group row per run of equal values |
| `collapsedGroupIds`, `defaultCollapsedGroupIds`, `onCollapsedGroupIdsChange` | group collapse, controlled or not |
| `getRowSelected` | marks extra rows as selected |
| `onRowAdd`, `addRowLabel` | trailing add row |
| `virtualize`, `overscan` | row virtualization; ignored with `getRowGroup` or while loading |
| `selectionActions` | node or render function shown while rows are selected |
| `className`, `aria-label` | root class and grid name |

## Performance notes

- Rows are `memo` components. Focus and cell selection are passed as primitives to the one row that owns them, so a focus move or a click re-renders that row only, not the grid. Sorting re-renders only rows whose `aria-rowindex` changed.
- Cells are `memo` too; the pointer, click and key handlers are one stable set shared by every cell (see `AGENTS.md`).
- Keep `columns`, `data` and `getRowGroup` referentially stable (`useMemo` or module scope). A new `columns` array re-creates the columns and re-renders every row; an inline `getRowGroup` recomputes the group model on every render.
- `onCellValueChange` may be inline: `useDataGrid` exposes a stable wrapper that calls the latest function. `tableOptions.meta` should be stable, since a new object re-renders every row.
- A cell renderer must derive from its `row`, `column`, `cell` and `table.options.meta`. A custom cell that reads other table state (sorting, filters, pagination) during render is not re-rendered when that state changes, because the row is memoized.
- Selected cells and the focused cell survive hiding a column or filtering and come back when the column or rows return (owner decision, 2026-10-03). Selection of rows that left the dataset is dropped; use `getRowId` so ids are stable.
- For thousands of rows turn on `virtualize`; it mounts only the visible rows.

## Benchmark

Reproduce from the repo root:

```bash
bun run bench:data-grid --json baseline.json   # before your change
bun run bench:data-grid --compare baseline.json
```

Environment: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), `virtualize` off, data seed 96, 3 iterations per scenario (mount: 2, no warmup; 1 warmup elsewhere), medians. The "before" column is the grid before the refactor, "after" is the grid in this folder; both from `bench-data-grid.ts` runs on the same machine. Cell renders count how many times a column `cell` function ran. Differences under about 10% are noise: the same code mounted 1000x20 in 5.7 s and 7.3 s in two baseline runs.

| Case | Scenario | Wall before (ms) | Wall after (ms) | Δ wall | Profiler before (ms) | Profiler after (ms) | Δ profiler | Cell renders before | Cell renders after | Heap before (MB) | Heap after (MB) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 200x10 | mount | 950.6 | 954.4 | +0% | 843.0 | 848.8 | +1% | 2000 | 2000 | 31.3 | 34.1 |
| 200x10 | focus move | 161.4 | 17.9 | -89% | 87.7 | 10.4 | -88% | 2000 | 2 | - | - |
| 200x10 | select click | 198.2 | 40.0 | -80% | 94.6 | 7.9 | -92% | 2000 | 2 | - | - |
| 200x10 | select shift-click | 191.1 | 37.4 | -80% | 86.3 | 7.0 | -92% | 2000 | 2 | - | - |
| 200x10 | sort toggle | 187.0 | 53.5 | -71% | 85.5 | 18.8 | -78% | 2000 | 0 | - | - |
| 200x10 grouped | mount (cold, n=1) | 671.9 | 686.1 | +2% | 595.0 | 589.9 | -1% | 2000 | 2000 | - | - |
| 200x10 grouped | group collapse toggle | 216.1 | 75.9 | -65% | 137.1 | 57.6 | -58% | 2000 | 201 | - | - |
| 1000x20 | mount | 7343.7 | 7877.2 | +7% | 6762.7 | 7232.4 | +7% | 20000 | 20000 | 334.8 | 361.5 |
| 1000x20 | focus move | 1456.3 | 49.5 | -97% | 768.6 | 21.0 | -97% | 20000 | 2 | - | - |
| 1000x20 | select click | 1694.7 | 236.0 | -86% | 770.9 | 13.7 | -98% | 20000 | 2 | - | - |
| 1000x20 | select shift-click | 1608.9 | 232.6 | -86% | 686.8 | 11.4 | -98% | 20000 | 2 | - | - |
| 1000x20 | sort toggle | 1766.6 | 362.6 | -79% | 761.0 | 80.6 | -89% | 20000 | 0 | - | - |
| 1000x20 grouped | mount (cold, n=1) | 5572.8 | 5912.6 | +6% | 4941.9 | 5189.6 | +5% | 20000 | 20000 | - | - |
| 1000x20 grouped | group collapse toggle | 1868.1 | 565.2 | -70% | 1161.6 | 444.8 | -62% | 20000 | 2001 | - | - |

Reading the table: interactions (focus move, cell select, sort, group collapse) re-render a handful of cells instead of the whole page; mount is up 0 to 7% (heap +8 to 9%), inside the noise band; the largest mount delta, 1000x20 at +7%, is below the ~10% threshold. Group collapse still renders about one group's worth of cells (201 and 2001), because the rows it adds or removes are mounted or unmounted.
