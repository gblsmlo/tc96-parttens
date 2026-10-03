# Kanban

A controlled board for one collection: the consumer passes `columns` (`id`, `title`, `count`, `cards`, optional `color`, `collapsed`, `hidden`), a `renderCard` function and a `getKey`, and `KanbanView` lays them out as columns with a mobile column switcher. Passing `onMoveCard` turns on card drag with dnd-kit (pointer, touch and keyboard); the consumer accepts the move by returning `true` (or a promise) and rejects it with `false`, which rolls the board back. The view fetches, filters, sorts and persists nothing.

## Benchmark

Reproduce from the repo root:

```bash
bun run bench:kanban                                   # bun scripts/bench/kanban.bench.ts
bun scripts/bench/kanban.bench.ts --json scripts/bench/results/kanban.base.json
bun scripts/bench/kanban.bench.ts --compare scripts/bench/results/kanban.base.json --gate
```

`--gate` exits 1 when any render counter rose or a scenario disappeared; timing differences only warn. The bench imports `KanbanView` from the public entry and counts how many times the consumer's `renderCard` ran (`cards`). Cases are 5 columns x 20 cards and 10 columns x 100 cards, data from `seededRandom(96)`; the wrapper holds the columns in state and accepts every reported move, so the DOM really changes. `KanbanView` renders the active column twice in JSDOM (the mobile switcher and the desktop board are both in the DOM), so mount counts one extra column of cards.

| Scenario | What it does | What `cards` counts |
| --- | --- | --- |
| mount | a fresh mount of the board | every `renderCard` call of the first render |
| parent re-render | a wrapper counter button re-renders `KanbanView` with the same props | cards re-rendered although nothing changed; expected 0 |
| collapse and expand column | a wrapper button collapses column 1 and expands it again | the cards of that column mounting again; expected one column of cards |
| switch mobile column | the column selector buttons switch to column 1 and back | the cards of the mobile column mounting again, twice |
| drag right and back | focus the grip of the first card, Space, ArrowRight, Space (column 0 to column 1), then ArrowLeft back | renders of every card except the dragged one; expected 0 |
| reorder down and back | the same with ArrowDown then ArrowUp inside column 0 | renders of every card except the dragged one; expected 0 |

The drag scenarios run on their own cases (`..., drag`), without the harness profiler, so they report `cards` only (no `commits` or profiler time). JSDOM has no layout, so the bench mocks `getBoundingClientRect` (one 100px cell per card and column) for dnd-kit's keyboard collision, and drives the drags outside React's `act` scope, because dnd-kit waits for React commits between its steps. The dragged card is excluded from the count and the commit counter is dropped for these cases because dnd-kit's overlay re-renders it two or three times per drag and adds or removes a commit depending on animation-frame timing. Each drag scenario ends where it started, so every iteration costs the same. The 10 x 100 drags run 3 iterations with no warmup (one pair of drags takes about 15 s in JSDOM), and the wall time of every drag scenario is dominated by dnd-kit and the bench's waits, so compare render counts, not wall time.

Baseline: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), React 19.1.1 development build, AMD Ryzen 3 3200G with Radeon Vega Graphics x4, seed 96, 5 iterations per scenario with 1 warmup (mount: 3, fresh container, no warmup), medians. File: `scripts/bench/results/kanban.base.json`. Render counts are deterministic and gate; times are a report, and differences under 10% are noise.

| Case | Scenario | n | Cards | Commits | Wall (ms) | Profiler (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 5 columns x 20 cards | mount | 3 | 120 | 3 | 181.5 | 104.3 |
| 5 columns x 20 cards | parent re-render | 5 | 0 | 1 | 13.5 | 4.0 |
| 5 columns x 20 cards | collapse and expand column | 5 | 20 | 3 | 59.4 | 17.7 |
| 5 columns x 20 cards | switch mobile column | 5 | 40 | 2 | 17.8 | 7.6 |
| 10 columns x 100 cards | mount | 3 | 1100 | 3 | 4410.1 | 469.8 |
| 10 columns x 100 cards | parent re-render | 5 | 0 | 1 | 43.0 | 7.8 |
| 10 columns x 100 cards | collapse and expand column | 5 | 100 | 3 | 1573.6 | 56.6 |
| 10 columns x 100 cards | switch mobile column | 5 | 200 | 2 | 55.3 | 22.3 |
| 5 columns x 20 cards, drag | drag right and back | 5 | 0 | - | 2728.2 | - |
| 5 columns x 20 cards, drag | reorder down and back | 5 | 0 | - | 2721.3 | - |
| 10 columns x 100 cards, drag | drag right and back | 3 | 0 | - | 15122.7 | - |
| 10 columns x 100 cards, drag | reorder down and back | 3 | 0 | - | 13873.7 | - |

Reading the table: the board is already in good shape. A parent re-render renders 0 cards, and a drag renders 0 cards other than the dragged one, at both sizes. Mount costs every card plus one more column (120 and 1100), because the mobile column switcher and the desktop board are both in the DOM and only hidden by CSS. Switching the mobile column remounts that column's cards (40 and 200), and collapsing and expanding a column renders its cards once (20 and 100); both are one column's worth, not the board. Wall time in the 10 x 100 cases is dominated by dnd-kit registering and measuring every sortable, not by React: mount spends 4.4 s on the wall and 0.47 s in render.
