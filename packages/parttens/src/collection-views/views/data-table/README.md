# Data Table

A semantic `<table>` on COSS `Table` and TanStack Table v9, with optional row selection, sorting and client-side pagination. Unlike `DataGrid`, it is not a WAI-ARIA grid: there is no roving focus, cell selection, column menu, resizing, pinning, grouping or virtualization, and the header is plain content. The consumer owns the cells (a checkbox, a sort button, a pagination control) and drives the instance from `useDataTable`. `DataGridPagination` also accepts this table.

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

Baseline: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), React 19.1.1 development build, AMD Ryzen 3 3200G with Radeon Vega Graphics x4, seed 96, 5 iterations per scenario with 1 warmup (mount: 3, fresh container, no warmup), medians. File: `scripts/bench/results/data-table.base.json`. Render counts are deterministic and gate; times are a report, and differences under 10% are noise.

| Case | Scenario | n | Cells | Commits | Wall (ms) | Profiler (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 200x10 | mount | 3 | 2000 | 1 | 304.7 | 268.3 |
| 200x10 | select click | 5 | 2000 | 1 | 57.4 | 29.5 |
| 200x10 | sort toggle | 5 | 2000 | 1 | 66.7 | 28.8 |
| 200x10 | parent re-render | 5 | 2000 | 1 | 46.7 | 25.1 |
| 1000x20 | mount | 3 | 20000 | 1 | 1269.0 | 1166.1 |
| 1000x20 | select click | 5 | 20000 | 1 | 366.2 | 211.5 |
| 1000x20 | sort toggle | 5 | 20000 | 1 | 497.8 | 234.0 |
| 1000x20 | parent re-render | 5 | 20000 | 1 | 355.6 | 202.9 |
| 200x10 paged | mount | 3 | 500 | 1 | 36.1 | 33.1 |
| 200x10 paged | pagination next/prev | 5 | 500 | 1 | 41.7 | 35.4 |
| 200x10 paged | parent re-render | 5 | 500 | 1 | 14.9 | 6.4 |
| 1000x20 paged | mount | 3 | 1000 | 1 | 65.4 | 60.0 |
| 1000x20 paged | pagination next/prev | 5 | 1000 | 1 | 75.6 | 65.5 |
| 1000x20 paged | parent re-render | 5 | 1000 | 1 | 24.9 | 12.3 |

Reading the table: every scenario renders every cell on screen. Selecting one row, toggling a sort or re-rendering the parent with unchanged props costs 2000 cells at 200x10 and 20000 at 1000x20 (target: one row for selection, 0 for sort and parent re-render), because `DataTable` renders rows and cells inline from `rows.map` with no memoized row or cell and `useDataTable` keeps row selection in its own state. Paged cases render one page (500 and 1000 cells), so pagination bounds the cost rather than fixing it. `DataGrid` memoizes rows below the component that calls `useTable` and gets 2 cells and 0; the same approach applies here, but how the table subscribes to its state is an architecture decision, not a memo.
