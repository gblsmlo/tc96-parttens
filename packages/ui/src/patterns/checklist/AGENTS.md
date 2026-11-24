# Checklist pattern

A controlled checklist: the consumer passes `items`, the draft title and callbacks, and the pattern renders rows with a checkbox, a title that is a button, an editable field or plain text, author and due-date metadata, a delete button, drag-and-drop ordering (dnd-kit) and a draft row that creates items. The pattern never fetches, persists, reorders `items` itself or ships CSS; its only state is what dnd-kit keeps during a drag and the `EditableText` draft of a title being edited.

## Map

| Folder | Holds |
| --- | --- |
| `composition/checklist/` | `Checklist`: the `section` (or the `div` of `trigger` and `complete`), the header and the body, and the `composing` state of `trigger`; its barrel |
| `components/` | the header, body (read-only or sortable list plus draft row), list (`ol`, wrapped in `Card` in `card`), sortable row, read-only row, draft row, item card with `ChecklistTitle`, metadata, the group (`RecordGroup` with count and `+`) and the trigger button; never public |
| `lib/` | due-date functions, the progress label, `checklistFilterNarrows` (with `filter.test.ts`), dnd-kit sensors and drag handlers, every class string and `cva` variant |
| `types/` | `ChecklistItem`, `ChecklistProps` and the `ChecklistDensity` and `ChecklistVariant` re-exports |
| `core.ts` | React-free surface: the types, `ChecklistDueStatus` and the due-date functions; workspace only, not reached from the barrel |

Import direction: `composition/` → `components/`, `lib/`, `types/`; `components/` → `lib/`, `types/`; `types/` → `lib/variants.ts`; `lib/` never imports `components/` or `composition/`. Outgoing, by file path into `properties`: `display/date/date-property.tsx` (`DateProperty`), `display/person/person-property.tsx` (`PersonProperty`, `PersonPropertyOption`) and `display/editable-text/editable-text.tsx` (`EditableText`, `EditableTextSize`). `editable-text.tsx` imports `editable/index.ts`, so the registry item also ships the four `editable` files. Also by file path, from `components/checklist-group.tsx`: `records/group/composition/record-group/record-group.tsx` (`RecordGroup`), `records/group/composition/record-group-action/record-group-action.tsx` (`RecordGroupAction`) and `records/group/composition/record-group-filter/record-group-filter.tsx` (`RecordGroupFilter`, which brings the COSS `Menu`), which pull `records/group/core.ts`, `records/group/lib/variants.ts` and `properties/shared/property-catalog.ts`; `types/index.ts` and `lib/filter.ts` import the `RecordGroupFilterProps` type from `records/group/core.ts`. The imports stay by path on purpose: one import through the `properties` or `records/group` barrel would make the item ship every file of that pattern (decided 2026-10-11, `docs/architecture/tc96-ui.md`).

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `checklist/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `checklist`. Renaming the folder breaks the registry and the pattern test run.
- The stories import through `@tc96/ui/patterns`, not by file path.
- `records/group/composition/record-group/record-group.tsx`, `record-group-action/record-group-action.tsx`, `record-group-filter/record-group-filter.tsx` and `records/group/core.ts` are imported by path; moving or renaming any of them breaks the checklist.
- `records/group/lib/variants.ts` defines the CSS variables that `checklist/lib/variants.ts` reads in `plain`: `--record-group-hover-offset` (`recordGroupHoverOffset`, read by `checklistItemVariants`) and `--record-group-row-height` (read by `checklistRowVariants`). Renaming either there breaks the checklist without a type error.

## Invariants

Handlers:

- `onItemClick` wins: with it the title is a button, even in an editable row; without it the title is an `EditableText` when the row is editable and plain `Text` when read-only. All three live in `ChecklistTitle`.
- An empty rename is not emitted: `EditableText` gets `revertWhenEmpty` and the commit calls `onItemRename` only with a non-empty title.
- `onItemDelete` shows the delete button; without `onItemAuthorChange` or `onItemDueDateChange` the matching property is read-only.
- `readOnly` renders no `DragDropProvider` and no draft row, and disables every checkbox; `onItemClick` still opens items.

Metadata:

- `authorId` and `dueDate` are three-state: `undefined` hides the property, `null` shows it empty (`No due date` for the date). With both `undefined` the metadata area is not rendered.
- A due date within one day of today renders as a relative label (`formatRelativeDay`); otherwise as a short date. `dueStatus` maps the day offset to `overdue`, `today` or `upcoming`, and a missing date to `upcoming`. The offset is computed in `timeZone` against `new Date()` at render.

Ordering:

- dnd-kit pointer and keyboard sensors are attached to the handle, plus Alt+ArrowUp and Alt+ArrowDown through `handleMoveShortcut`. With fewer than two items the handle is disabled.
- `onItemMove` receives the item id and the target index; a cancelled drag or a drop on the same index emits nothing.

Creating:

- Enter submits the draft `form`; checking the draft checkbox creates the item already completed. The title is trimmed, and an empty or whitespace title is ignored.
- `creating` disables the draft input and checkbox while the consumer persists. With no items the draft checkbox is replaced by a plus icon, so it cannot create a completed item.

Variant:

- `card` (default) wraps the `ol[data-slot="checklist-items"]` in a `Card` (`data-slot="card"`, the only card in the section; the `ol` carries no radius, border or background) and pads the section; the first and last rows read `--card-surface-radius` (set by the consumer theme's `[data-slot="card"]` rule, falling back to `--radius-2xl`, the COSS card radius) minus 1px, so the row corners follow the card. The list must not get `overflow-hidden`: the drag handle sits outside the card, on the left at `-left-9` (`left: -36px`, set by the owner on 2026-11-23; it was `-right-6` from 2026-10-15, and `-left-8` before), so the whole button (32px, 28px from `sm`) stays clear of the card border. The `card` item carries a transparent `before:` bridge of the same 36px on its left, so the pointer crossing the gap to the handle keeps the row hovered and the handle visible.
- `plain` drops the frame and the section padding, so a parent frame, such as `RecordGroup` `inset`, holds the rows. With `md` its row height is `--record-group-row-height`, defined by `RecordGroup` (set by the owner on 2026-10-15): 32px in every group variant (`card` and `inset` were 36px until the owner lowered them on 2026-10-18), the height of a `RecordGroupItem`; outside a group the variable is unset and the row falls back to 36px. The row keeps `px-2`. `card` with `md` stays 40px (`h-10 px-3`) and `sm` stays 32px (`h-8 px-2`), whatever the group. `checklistRowVariants` sets these through compound variants. A parent with `overflow-hidden` (the `RecordGroup` panel) would clip a handle outside the row, so the `RecordGroup` panel clips only vertically (`overflow-x-visible overflow-y-clip`, see `records/group/AGENTS.md`). The handle is outside the row at the start in every variant (set by the owner on 2026-11-23; `plain` had it in the row's action area, after the delete button): the first child of the `li`, absolute at `-left-9` (`left: -36px`), so the row keeps its layout and gets no indent, and the checkbox still lines up with a `RecordGroupItem` icon. `plain` keeps the handle out of `invisible`, so Tab still reaches it for keyboard reordering; `card` keeps it `invisible` until hover. Both `li` variants carry the same transparent 36px `before:` bridge on the left, so the pointer crossing to the handle keeps the row hovered. A parent that clips the inline axis (`overflow-hidden`) hides the handle in either variant.
- The `plain` item (the `li`, which carries the hover) takes `-mx-[var(--record-group-hover-offset,0px)]`, set by the owner on 2026-10-15. `RecordGroup` defines that variable as 8px in every variant, so inside a group the hover extends 8px past the content edge while the row keeps its `px-2` and the checkbox lines up with a `RecordGroupItem` icon; outside a group the variable is unset and the margin is 0. The draft row and the read-only row use the same `li` classes. `card` has no offset: its hover stays inside the frame.

Trigger and complete:

- `complete` renders the checklist in a `RecordGroup` (`plain`) and `trigger` renders it only once there are items (or while `composing`); both share one `div` root, not a `section`, because `RecordGroup` is already the named `region` and an `aria-label` on a plain `div` fails axe. `ariaLabel` is the group title only when `title` is `null` or `undefined`; the region name then includes the count text (`Etapas 1 de 2 concluídos`), so a query matches it by prefix.
- `filter` takes the `RecordGroupFilter` props and renders that filter in the group header, after `actions` and right before the `+` (also with `readOnly`, where the filter stays enabled and the `+` is disabled). It is controlled and filters nothing: the consumer filters the `items` it passes, as every pattern does, so the count reflects the filtered items. `card` and `plain` have no group header and ignore it. A `trigger` whose filter narrows (`checklistFilterNarrows`: a `filterValue` or a section `value` with fewer values than options; a sort alone does not) stays grouped with no items, so filtering everything out never swaps the group for the add button and hides the filter.
- The group is controlled by the checklist (`open` state in `ChecklistGroup`). The `+` action sets it open and focuses the draft input after the commit: an effect focuses a mounted input once the panel is no longer `inert`, and the input's callback ref focuses it when a closed panel, which Base UI unmounts, mounts it again. With `readOnly` it stays in place, disabled (set by the owner on 2026-11-23), so the header keeps its shape.
- The group header shows `ChecklistCount` (`checklist-count`), the same pill as `ChecklistHeader`, which is not rendered. The ring is an inline `svg` (`checklist-count-ring`), not the widgets `ProgressRing`, whose `div` root is not allowed inside the group trigger `button`; it is `aria-hidden`, and the visible `completed/total` is `aria-hidden` too. Inside the trigger the pill carries the pt-BR progress label as `sr-only` text (a `progressbar` role would sit inside a `button`); in `ChecklistHeader` (`meter`) it is a `progressbar` named by that label, with `aria-valuemin`, `aria-valuemax` and `aria-valuenow`.
- `trigger` with no items shows only the ghost button. Its click sets `composing`, which mounts the group with the draft input focused. While `composing` with no items, Escape in an empty draft or the empty draft input losing focus to an element outside the root goes back to the button; Escape also returns focus to it. The blur is observed on the draft input, not on the root, so the root `div` carries no handler. `composing` clears when the list gets items, so deleting the last item shows the button again. `readOnly` with no items renders the button disabled.

Count:

- The count is always the pill (`ChecklistCount`: a ring and `completed/total`), set by the owner on 2026-11-23 to standardize it; the text count at the end of the header (`1 de 2 concluídos`) and the `progress` prop with its bar were removed, along with the `progress` and `progress-track` slots. The header renders only with `title`: the title, then the pill when there are items. Without `title` there is no header and no count.

Copy:

- Default copy is pt-BR (`X de Y concluídos`, the name of the count pill, the row and draft `aria-label`s, the handle tooltip, the `addLabel` default `Adicionar etapas`); the metadata labels `Author`, `Due date` and `No due date` are English.

## Styling

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-completed` | the `li` | `group-data-completed:line-through` and `group-data-completed:text-muted-foreground` on the title |
| `data-dragging` | the sortable `li` | `data-dragging:opacity-40` in `checklistItemVariants` |
| `data-due="overdue\|today\|upcoming"` | `[data-slot=checklist-actions]` | `checklistDueDateVariants({ status })` on the `DateProperty` |
| `data-density`, `data-readonly`, `data-variant` | the `section`, or the `div` of `trigger` and `complete` | consumers; the pattern uses the `density` and `variant` variants instead |

`data-slot` names: `checklist`, `checklist-header`, `checklist-items`, `checklist-item`, `checklist-draft-item`, `checklist-row`, `checklist-drag-handle`, `checklist-title`, `checklist-actions`, `checklist-delete`, `checklist-trigger`, `checklist-count`, `checklist-count-ring`.

- Design axes are `cva` variants in `lib/variants.ts`: `density` on the row, the checkbox hit area and the draft input; `variant` on the section padding (`trigger` and `complete` add none), the plain list layout (`flex flex-col gap-0.5`; the card frame is `Card`), the item radius and the drag handle placement; `status` on the due date. Every class is a complete string, so the Tailwind scanner always sees it.
- `cn` appears only on the root (`section` or `div`), where the consumer's `className` enters.
- Colors only from theme tokens (`text-destructive-foreground`, `text-warning-foreground`, `text-muted-foreground`, `bg-primary`, `bg-muted`); `Card` supplies `bg-card` and the frame; no palette colors.
- `scripts/override-exceptions.json` has no entry for this pattern.

## Verify

```bash
bunx biome check packages/ui/src/patterns/checklist
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/ui/src/patterns/checklist
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/checklist
```

The stories are the six component pages in `apps/storybook/src/patterns/checklist/` (`Patterns/Checklist/API Reference`, `Playground`, `Stories`, `Behavior`, `Usages`, `Layouts`); interface tests are the `play` functions of `behavior.stories.tsx` (`Patterns/Checklist/Behavior`). All run axe with `test: 'error'`. The only bun test is `lib/filter.test.ts`, for `checklistFilterNarrows`.

## Pointers

- Public API: `index.ts` and the `checklist` entry of `docs/architecture/public-api-exports.json`. Props and defaults are in `types/index.ts` and `composition/checklist/checklist.tsx`. The registry ships every file the barrel reaches; exporting anything from `lib/` or `components/` needs a reason recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-ui.md`, sections "Estrutura interna dos patterns" (the layered split, the due-date tokens, `data-*` over conditional classes, `cn` only on the root), "Organização e fronteiras" (`Text` for titles and items) and "Estrutura do consumidor" (due-date functions from `@tc96/ui/helpers/date`); contrast ratios: `docs/accessibility.md`.
