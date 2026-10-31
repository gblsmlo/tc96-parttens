# Gallery View

`GalleryView` renders a collection as a responsive grid. The component is controlled: the consumer passes a `CollectionDefinition` and a `renderRecord` function, and nothing is fetched, filtered, grouped, sorted or persisted inside the view. Card anatomy, interaction and selection belong to the consumer renderer.

## Renderer contract

Each item is rendered through a memoized wrapper keyed on `{ item, renderRecord }`, matching List. `renderRecord` re-runs only when its identity changes or the item object is replaced; a parent render does not call it again. A renderer that closes over other state must change identity when that state changes or include the state in the item.

## Scale

The view is intended for tens to a few hundred visible records. It uses one column by default, two from `sm`, three from `lg` and four from `xl`. Virtualization and pagination stay with the consumer.

## Benchmark

Reproduce from the repo root:

```bash
bun run bench:gallery --json baseline.json
bun scripts/bench/gallery.bench.ts --compare scripts/bench/results/gallery.base.json --gate
```

`--gate` exits 1 when a render counter rises or a scenario disappears. Timing never fails the gate.

Cases: 100 and 1000 items in source order. Data is seeded (seed 96). The bench imports only the public entry of `views/gallery` and counts `items`, the number of times the consumer's `renderRecord` runs, plus `commits`.

| Case | Scenario | Items | Commits | Wall median (ms) | Profiler median (ms) |
| --- | --- | ---: | ---: | ---: | ---: |
| gallery 100 | mount | 100 | 1 | 4.5 | 3.5 |
| gallery 100 | parent re-render | 0 | 1 | 0.8 | 0.1 |
| gallery 1000 | mount | 1000 | 1 | 9.0 | 7.5 |
| gallery 1000 | parent re-render | 0 | 1 | 2.3 | 0.5 |

Environment: 2026-10-12, Bun 1.4.2, JSDOM 26.1.0 with no layout, React 19.1.1 development build, Apple M4 x10, seed 96, 5 iterations per interaction with 1 warmup and 3 fresh-container mount iterations. The committed baseline is `scripts/bench/results/gallery.base.json`. Render counts gate; times are a report and differences below 10% are noise.

Reading the table: mounting calls `renderRecord` once per item, while a parent re-render with unchanged inputs calls it zero times at either scale.
