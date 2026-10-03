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

Baseline: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), React 19.1.1 development build, AMD Ryzen 3 3200G with Radeon Vega Graphics x4, seed 96, 5 iterations per scenario with 1 warmup (mount: 3, fresh container, no warmup), medians. File: `scripts/bench/results/list.base.json`. Render counts are deterministic and gate; times are a report, and differences under 10% are noise.

| Case | Scenario | n | Items | Commits | Wall (ms) | Profiler (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| list 100 | mount | 3 | 100 | 1 | 36.1 | 33.4 |
| list 100 | parent re-render | 5 | 100 | 1 | 9.7 | 4.7 |
| list 1000 | mount | 3 | 1000 | 1 | 149.1 | 137.8 |
| list 1000 | parent re-render | 5 | 1000 | 1 | 62.0 | 23.9 |
| list 100 grouped | mount | 3 | 100 | 1 | 68.0 | 45.1 |
| list 100 grouped | parent re-render | 5 | 100 | 1 | 16.9 | 7.4 |
| list 100 grouped | group collapse and expand | 5 | 200 | 6 | 34.2 | 14.2 |
| list 1000 grouped | mount | 3 | 1000 | 1 | 190.5 | 171.4 |
| list 1000 grouped | parent re-render | 5 | 1000 | 1 | 73.4 | 30.9 |
| list 1000 grouped | group collapse and expand | 5 | 2000 | 6 | 148.7 | 65.1 |

Reading the table: mount costs one `renderItem` call per item, the floor. Every other scenario is waste that grows with the list. A parent re-render with unchanged props calls `renderItem` for every item (100 and 1000, target 0), because `ListView` maps `collection.items` straight into `renderItem` and `ListGroup` is not memoized (`components/list-view.tsx`, `components/list-group.tsx`). Collapsing and expanding one group calls it for every item twice (200 and 2000, target one group's worth), because the collapsed state lives in `ListView` and re-renders every group, and a collapsed group still builds its items before `CollapsiblePanel` hides them. Each click also takes 3 commits; two are Base UI Collapsible's own and do not touch items.
