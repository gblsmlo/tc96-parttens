# Calendar

A day, week or month calendar of one collection, usable alone or mounted by `CollectionLayoutOutlet`. The consumer passes the collection, `getRecordSchedule`, the mode, the time zone and the renderer; items drag and resize with dnd-kit and pointer capture, and the new window is reported through `onRecordReschedule`. Its only state is the optimistic override and the live resize preview.

## Map

| Folder | Holds |
| --- | --- |
| `composition/calendar-view/` | `CalendarView` |
| `composition/calendar-event-chip/` | `CalendarEventChip` and its parts, with the chip test |
| `components/` | the time grid, day column, month grid and cells, all-day cell, resize handle, item skeleton and draggable item |
| `hooks/` | drag and drop, the clock |
| `lib/` | layout, slot, drag and resize math, each with its test |
| `types.ts` | the schedule, slot, placement and reschedule contracts |

Import direction: `composition/` → `components/`, `hooks/`, `lib/`, `types.ts` and `collection/types/`; the date helpers come from `@tc96/ui/helpers`. It never imports another layout.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `index.ts`; `collection/composition/collection-layout-outlet.tsx` imports the view by file path and mounts it, so the `collection` registry item ships this folder.
- `scripts/bench/calendar.bench.ts` imports `index.ts`.

## Invariants

- Calendar drops on a day or all-day cell keep the wall-clock time and the absolute duration (DST-safe); time-column drops snap the block's top edge to `snapMinutes`. The override lives until `getRecordSchedule` matches it, and a drop resolving to the same window is ignored. Without `onRecordReschedule` no handle or draggable marker exists (tested).
- A calendar item drags from its whole body like a kanban card, except interactive descendants; `CalendarEventChipOpenTrigger` drags only past 5px (touch: 250ms delay, 5px tolerance). The grip handle, visible only on keyboard focus, is the keyboard and assistive-technology activator.
- `CalendarEventChipOpenTrigger` sits at `z-[1]` inside the `isolate` chip: in `block` the time has `opacity-70` and `order-last`, so without it the time paints over the trigger and swallows the click (#327). `data-calendar-item-action` stays above it with `z-10`; `BlockTimeOpensTheItem` in `Patterns/Calendar/Behavior` clicks the block time.
- `onSlotSelect` fires only for a click that both starts and ends on the bare time-grid column (not on an item, resize edge or the end of a drag), and is ignored while `loading`. The slot is the pointer position floored to `snapMinutes`, one `snapMinutes` long, clamped to the day. Without the prop the column has no handler, no cursor class and no tab stop: the time grid is pointer-only for creation, and the consumer's toolbar action is the keyboard path.
- A full month cell collapses its overflow behind a "+N" `Popover` that lists only the hidden segments, so no item renders twice with the same drag id; an item drags out of the popup like any chip. With `onDaySelect`, the popup's day title is a `PopoverClose` that calls it; without it, the title is plain text.
- In the time grid, a timed item with an `end` gets two pointer-only resize edges (`aria-hidden`, no tab stop) on its top and bottom (top only on the first segment, bottom only on the last). The pointer drags an edge with pointer capture and a live preview that never touches the optimistic override; release goes through the same `onRecordReschedule` commit as a drop. The keyboard path is the move handle, so an item keeps two tab stops like a kanban card: Alt+ArrowUp/ArrowDown moves the start and Shift+ArrowUp/ArrowDown the end, one grid line at a time, announced through `aria-keyshortcuts` and ignored while a drag is active. The moved edge lands on the `snapMinutes` wall-clock grid of `timeZone`, and the item keeps at least `snapMinutes` of duration. Items without `end`, all-day items and month chips do not resize.
- The consumer's renderer runs in a memoized leaf below the stateful component: it re-runs only when its identity or inputs change, so a renderer that reads other state with a stable identity goes stale.

## Styling

| Attribute | Where | Read by |
| --- | --- | --- |
| `data-calendar-item-action` | controls inside `CalendarEventChip` | the chip variants raise them above the open trigger with `z-10` |
| `data-calendar-item-drag-id` | drag wrappers and handles | focus restore after a move; not styled |
| `data-calendar-date`, `data-today`, `data-outside-month`, `data-calendar-mode` | calendar cells, columns, root | consumers and tests |
| `data-calendar-item-resize="start\|end"` | the resize buttons on time-grid items | tests and the drag sensor, which never starts a move from an edge; the edge measures its `[data-calendar-date]` column to turn pixels into minutes |
| `data-density`, `data-display`, `data-variant`, `data-tone`, `data-completed` | `CalendarEventChip` | consumers; the chip styles through `calendarEventChipVariants` |

- Variants live in `calendarEventChipVariants`; every class is a complete string. A condition emits one class through a ternary.
- The positioned wrapper of each time-grid item (`calendar-day-column.tsx`) is the size container `calendar-item`, which the chip's `block` variant queries: the time follows the title, and below two lines of height (2.625rem) both share one wrapping row whose second line falls outside the block, so a short item always shows its title and shows the time only when it fits.
- Colors only from theme tokens; the time-grid hour lines read `var(--border)`.
- Hover-only affordances pair `group-hover` with `group-focus-within` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch in v4.
- The chip draws `has-focus-visible:ring-2` on the `article` because the open trigger removes the native outline.
- Time-grid hour labels are `text-[0.625rem]` pending a `--text-2xs` token in the consumer's theme.
- Not findings: `outline-none` next to `focus-visible:` and the `dark:` opacity steps on chip tones follow COSS.

## Verify

```bash
bun test --isolate packages/ui/src/patterns/calendar
bunx biome check packages/ui/src/patterns/calendar
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/calendar
bun scripts/bench/calendar.bench.ts --compare scripts/bench/results/calendar.base.json --gate
```

Run the bench when rendering changed: `--gate` exits 1 when a render counter rose or a scenario disappeared; timing only warns. Regenerate the baseline with `--json` on an idle machine and update `README.md` in the same change.

`Patterns/Calendar` (`apps/storybook/src/patterns/calendar/`) is documented in the six component pages; its `Usages` and `Behavior` read `events.ts` through `collection/fixtures/calendar-workspace.tsx` and `collection/fixtures/calendar-view-harness.tsx`, with the toolbar of `collection/fixtures/calendar-toolbar.tsx`.

## Pointers

- Public API: `index.ts` and the `patterns` entry of `docs/architecture/public-api-exports.json`.
- Sections "Calendar: `onSlotSelect` para criar a partir de um slot vazio" and "Calendar, Gallery, List e Data Table: o renderizador do consumidor numa folha memoizada" of the architecture doc.
- Decisions: `docs/architecture/tc96-ui.md`; accessibility: `docs/accessibility.md`, sections "Regras" and "Boas práticas".
- The collection outlet that mounts this layout, and the shared code it imports: `packages/ui/src/patterns/collection/AGENTS.md`.
