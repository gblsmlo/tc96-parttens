# Data Table

A semantic `<table>` on COSS `Table` and TanStack Table v9, with optional row selection, sorting and client-side pagination. Unlike `DataGrid`, it is not a WAI-ARIA grid: there is no roving focus, cell selection, column menu, pinning, grouping or virtualization, and column resizing is opt-in through `enableColumnResizing`, and the header is plain content. The consumer owns the cells (a checkbox, a sort button, a pagination control) and drives the instance from `useDataTable`. `DataGridPagination` also accepts this table.

## Cell renderers

Rows are memoized below the component that calls `useDataTable`. A row re-renders when its `row`, its `selected` and `canSelect` state, the visible columns or `table.options.meta` change. A cell renderer must derive from its `row`, `column`, `cell` and `table.options.meta`. A custom cell that reads other table state (sorting, pagination, filters) during render is not re-rendered when that state changes, because the row is memoized. Pass what the cell needs through `meta`, or read it from the row.

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