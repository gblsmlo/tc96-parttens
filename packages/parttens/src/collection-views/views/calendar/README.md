# Calendar

`CalendarView` renders one collection on a calendar: a month grid, or a time grid (week or day) with an all-day strip, greedy lanes for overlapping items and a "now" line. The component is controlled: the consumer passes the `anchor` instant, the `timeZone`, `getItemSchedule` and `renderItem`, and nothing is fetched or persisted inside the view. With `onItemReschedule` the items can be dragged (pointer or keyboard) to another day or time slot; the callback accepts or rejects the move, and a rejection rolls the item back.

## Renderer contract

`renderItem` re-runs only when its identity, the item object or the segment's date, placement or minutes (`startMinutes`, `endMinutes`, `isStart`, `isEnd`) change. A parent re-render with the same props, and a drag that touches another item, do not call it. A renderer that reads other state through a stable identity (a ref, a module variable, a store read without a subscription) goes stale: pass the value through the item, or give `renderItem` a new identity when that state changes.

## Benchmark

Reproduce from the repo root:

```bash
bun run bench:calendar --json baseline.json   # before your change
bun scripts/bench/calendar.bench.ts --compare scripts/bench/results/calendar.base.json --gate
```

`bun run bench:calendar` is `bun scripts/bench/calendar.bench.ts`. The compare command fails (exit 1) when any render counter rose against the committed baseline or a scenario disappeared; timing differences only print a warning.

The bench drives the view through its public entry only. `renderItem` is wrapped with a counter (`items`), so a render count is how many times the consumer's renderer ran. Data comes from `seededRandom(96)`, `now` and `anchor` are fixed (2026-08-12, `America/Fortaleza`), so results do not depend on the run day. Each case holds `size` items in the anchor period and `size` more in the next one, plus one probe item at 00:30 that the drag scenario moves; all-day items exist only in the week cases.

| Case | What it is |
| --- | --- |
| `month 100`, `month 1000` | month grid, `size` items per month |
| `week 100`, `week 1000` | week time grid, `size` items per week |

| Scenario | What it does | What `items` counts |
| --- | --- | --- |
| mount | a fresh mount of the wrapper | `renderItem` calls of the first render |
| parent re-render | a wrapper counter button re-renders the parent with the same props | `renderItem` calls caused by a parent that changed nothing |
| next period | the wrapper moves `anchor` to the next period and back, so the state returns | `renderItem` calls of both navigations |
| keyboard reschedule | Space, ArrowRight (or ArrowLeft on the way back), Space on the probe item's handle; the wrapper accepts the move and the probe alternates between two days | `renderItem` calls from pick-up to the confirmed drop |

JSDOM has no layout, so the bench mocks `getBoundingClientRect` (a 10px grid keyed by `data-calendar-date`, and the dragged overlay from its `--dnd-*` variables), `elementFromPoint` and `getAnimations`. One arrow press moves the pointer 10px, which is exactly one day cell. The drag scenario runs outside `act` so dnd-kit's signals can flush, and it throws if the probe does not change day.

Environment: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), React 19.1.1 development build, AMD Ryzen 3 3200G with Radeon Vega Graphics x4, seed 96, 5 iterations per scenario with 1 warmup (mount: 3, fresh container), medians. Before is the view before the memoized leaf, after is this folder; same machine, same adapter, run one after the other. The after file is the committed baseline `scripts/bench/results/calendar.base.json`. Render counts gate; times are a report and differences under 10% are noise.

| Case | Scenario | Items before | Items after | Wall before (ms) | Wall after (ms) | Δ wall | Profiler before (ms) | Profiler after (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| month 100 | mount | 86 | 86 | 200.5 | 167.3 | -17% | 122.4 | 97.1 |
| month 100 | parent re-render | 86 | 0 | 25.7 | 24.2 | -6% | 10.5 | 9.5 |
| month 100 | next period | 163 | 133 | 239.8 | 206.4 | -14% | 122.5 | 103.4 |
| month 100 | keyboard reschedule and back | 522 | 1 | 587.2 | 476.5 | -19% | 119.7 | 86.8 |
| month 1000 | mount | 107 | 107 | 196.8 | 154.1 | -22% | 115.2 | 89.3 |
| month 1000 | parent re-render | 107 | 0 | 30.2 | 24.3 | -20% | 11.4 | 8.1 |
| month 1000 | next period | 203 | 161 | 354.3 | 291.5 | -18% | 149.0 | 136.3 |
| month 1000 | keyboard reschedule and back | 652 | 2 | 625.0 | 557.0 | -11% | 182.0 | 138.3 |
| week 100 | mount | 100 | 100 | 129.8 | 132.2 | +2% | 77.3 | 78.2 |
| week 100 | parent re-render | 100 | 0 | 27.7 | 25.4 | -8% | 10.5 | 9.0 |
| week 100 | next period | 200 | 200 | 314.0 | 288.8 | -8% | 146.7 | 140.6 |
| week 100 | keyboard reschedule and back | 650 | 0 | 451.0 | 375.7 | -17% | 115.7 | 79.1 |
| week 1000 | mount | 1000 | 1000 | 4423.8 | 4171.9 | -6% | 550.3 | 534.0 |
| week 1000 | parent re-render | 1000 | 0 | 199.6 | 165.2 | -17% | 79.9 | 59.0 |
| week 1000 | next period | 2000 | 2000 | 16367.9 | 14875.5 | -9% | 1044.6 | 955.7 |
| week 1000 | keyboard reschedule and back | 6500 | 0 | 2851.2 | 2426.7 | -15% | 793.9 | 632.4 |

Reading the table: a parent re-render with unchanged props renders 0 items (it rendered every visible item), and dragging an item to the next day and back renders 0 other items in the week cases and 1 or 2 in month (522 to 6500 before): the 1 or 2 are items hidden behind a day's `+N` that the move reveals and hides again. The count no longer depends on how many items the calendar holds. A month period change renders fewer items (shared days keep their chips), the week time grid still mounts every item (1000, and 2000 across a period change) because it is not capped, which is volume, not memo. The dragged item is not counted and the drag scenario has no commit counter, because dnd-kit's overlay re-renders it a varying number of times and its animation-frame timing adds or removes a commit. Mount and period changes moved within the noise band.