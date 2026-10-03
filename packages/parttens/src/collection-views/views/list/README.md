# List View

`ListView` renders a collection as a flat list or as collapsible groups. The component is controlled: the consumer passes a `CollectionDefinition` (or prepared `groups`) and a `renderItem` function, and nothing is fetched, filtered, sorted or persisted inside the view. Group collapse is the only state it owns, and it can be controlled with `collapsedGroupIds`. Selection and keyboard navigation are not part of the view: they belong to the items the consumer renders.

## Renderer contract

Each item is rendered through a memoized wrapper keyed on `{ item, renderItem }`. `renderItem` re-runs only when its identity changes or when the item object itself is replaced; a parent re-render, a group toggle or a replaced sibling does not call it. A renderer that reads other state (selection, a hover id, a store) through a stable identity goes stale: either pass a new `renderItem` when that state changes (for example with `useCallback` and the state in its dependencies) or put the state inside the item object.

## Benchmark

Reproduce from the repo root:

```bash
bun run bench:list --json baseline.json   # same as: bun scripts/bench/list.bench.ts
bun scripts/bench/list.bench.ts --compare scripts/bench/results/list.base.json --gate
```

`--gate` exits 1 when any render counter rose in any scenario, or when a scenario disappeared. Timing never fails the gate.

Cases: 100 and 1000 items, flat and grouped into 10 groups. Data is seeded (seed 96). The bench imports only the public entry of `views/list` and counts `items`, the number of times the consumer's `renderItem` ran, plus `commits`.

| Scenario | What it does | What it counts |
| --- | --- | --- |
| mount | mounts the view in a fresh container | `renderItem` calls for the whole list |
| parent re-render | a wrapper counter button re-renders `ListView` with the same props | `renderItem` calls caused by an unrelated parent update |
| group collapse and expand (grouped cases) | clicks the "Collapse Status 0" trigger, then "Expand Status 0", each flushed on its own | `renderItem` calls for two collapse state changes; the state returns to the start |

Not benchmarked: selection click and keyboard navigation, because `ListView` has neither; items and their selection state are the consumer's.

Environment: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), React 19.1.1 development build, AMD Ryzen 3 3200G with Radeon Vega Graphics x4, seed 96, 5 iterations per scenario with 1 warmup (mount: 3, fresh container), medians. Before is the view before the memoized leaf, after is this folder; same machine, same adapter, run one after the other. The after file is the committed baseline `scripts/bench/results/list.base.json`. Render counts gate; times are a report and differences under 10% are noise.

| Case | Scenario | Items before | Items after | Wall before (ms) | Wall after (ms) | Δ wall | Profiler before (ms) | Profiler after (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| list 100 | mount | 100 | 100 | 36.1 | 35.9 | -1% | 33.4 | 33.0 |
| list 100 | parent re-render | 100 | 0 | 9.7 | 2.5 | -74% | 4.7 | 0.4 |
| list 1000 | mount | 1000 | 1000 | 149.1 | 202.2 | +36% | 137.8 | 153.8 |
| list 1000 | parent re-render | 1000 | 0 | 62.0 | 15.9 | -74% | 23.9 | 1.5 |
| list 100 grouped | mount | 100 | 100 | 68.0 | 57.2 | -16% | 45.1 | 38.3 |
| list 100 grouped | parent re-render | 100 | 0 | 16.9 | 8.0 | -53% | 7.4 | 4.4 |
| list 100 grouped | group collapse and expand | 200 | 10 | 34.2 | 24.9 | -27% | 14.2 | 10.7 |
| list 1000 grouped | mount | 1000 | 1000 | 190.5 | 184.2 | -3% | 171.4 | 163.5 |
| list 1000 grouped | parent re-render | 1000 | 0 | 73.4 | 19.6 | -73% | 30.9 | 3.5 |
| list 1000 grouped | group collapse and expand | 2000 | 100 | 148.7 | 63.5 | -57% | 65.1 | 22.2 |

Reading the table: a parent re-render with unchanged props renders 0 items (100 and 1000 before), and collapsing and expanding a group renders only that group's items, once, on expand (10 and 100; 200 and 2000 before). Mount still renders every item. In this run mount at 1000 items was +36% wall and +12% profiler while the other mounts moved -16% to -1%; the memo adds one component per item, so treat it as a possible small mount cost and re-measure before reading it as a regression.