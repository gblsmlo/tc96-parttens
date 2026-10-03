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

Baseline: 2026-10-03, bun 1.3.14, JSDOM 26.1.0 (no layout), React 19.1.1 development build, AMD Ryzen 3 3200G with Radeon Vega Graphics x4, seed 96, 5 iterations per scenario with 1 warmup (mount: 3, fresh container, no warmup), medians. File: `scripts/bench/results/calendar.base.json`. Render counts are deterministic and gate; times are a report, and differences under 10% are noise.

| Case | Scenario | n | Items | Commits | Wall (ms) | Profiler (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| month 100 | mount | 3 | 87 | 1 | 168.3 | 100.4 |
| month 100 | parent re-render | 5 | 87 | 1 | 27.7 | 11.6 |
| month 100 | next period | 5 | 164 | 2 | 210.6 | 105.4 |
| month 100 | keyboard reschedule | 5 | 270 | 6 | 279.2 | 52.5 |
| month 1000 | mount | 3 | 108 | 1 | 160.5 | 89.3 |
| month 1000 | parent re-render | 5 | 108 | 1 | 27.8 | 10.2 |
| month 1000 | next period | 5 | 204 | 2 | 316.7 | 147.2 |
| month 1000 | keyboard reschedule | 5 | 335 | 6 | 333.8 | 101.4 |
| week 100 | mount | 3 | 101 | 2 | 150.1 | 87.0 |
| week 100 | parent re-render | 5 | 101 | 1 | 26.4 | 11.3 |
| week 100 | next period | 5 | 201 | 2 | 331.7 | 151.2 |
| week 100 | keyboard reschedule | 5 | 334 | 6 | 220.7 | 63.5 |
| week 1000 | mount | 3 | 1001 | 2 | 4428.9 | 573.1 |
| week 1000 | parent re-render | 5 | 1001 | 1 | 206.5 | 82.4 |
| week 1000 | next period | 5 | 2001 | 2 | 16049.4 | 1053.2 |
| week 1000 | keyboard reschedule | 5 | 3259 | 6 | 1461.3 | 416.9 |

Reading the table: month mode is bounded by `maxVisibleMonthItems`, so 100 and 1000 items render about the same chips (87 and 108). Every interaction re-renders all of them. A parent re-render with unchanged props renders every visible item (target 0), because `CalendarView` builds each segment's `renderItem` output eagerly and neither the grid, the cells nor `DraggableCalendarItem` are memoized (`components/calendar-view.tsx`). One keyboard reschedule renders all items about three times (270 in month 100, 3259 in week 1000): `useCalendarDragAndDrop` rebuilds `resolveSchedule` when its overrides change, which invalidates the segment memo when the override is set and again when it is cleared, and the drop target state lives on the whole day cell or column, so every chip in it re-renders while the pointer moves. The time grid is not capped, so week 1000 renders every item on mount (1001) and twice on a period change: that is volume, which virtualization or a visible-range cap addresses, not memo.
