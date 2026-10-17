# Checklist pattern

A controlled checklist: the consumer passes `items`, the draft title and callbacks, and the pattern renders rows with a checkbox, a title that is a button, an editable field or plain text, author and due-date metadata, a delete button, drag-and-drop ordering (dnd-kit) and a draft row that creates items. The pattern never fetches, persists, reorders `items` itself or ships CSS; its only state is what dnd-kit keeps during a drag and the `EditableText` draft of a title being edited.

## Map

| Folder | Holds |
| --- | --- |
| `composition/checklist/` | `Checklist`: the `section`, the header and the `ol`, read-only or sortable; its test and barrel |
| `components/` | the header, list (`ol`, wrapped in `Card` in `card`), sortable row, read-only row, draft row, item card with `ChecklistTitle`, and metadata; never public |
| `lib/` | due-date functions, dnd-kit sensors and drag handlers, every class string and `cva` variant |
| `types/` | `ChecklistItem`, `ChecklistProps` and the `ChecklistDensity` and `ChecklistVariant` re-exports |
| `test/dom.ts` | the JSDOM setup the test imports; this pattern's own copy |
| `core.ts` | React-free surface: the types, `ChecklistDueStatus` and the due-date functions; workspace only, not reached from the barrel |

Import direction: `composition/` → `components/`, `lib/`, `types/`; `components/` → `lib/`, `types/`; `types/` → `lib/variants.ts`; `lib/` never imports `components/` or `composition/`. Outgoing, by file path into `properties`: `display/date/date-property.tsx` (`DateProperty`), `display/person/person-property.tsx` (`PersonProperty`, `PersonPropertyOption`) and `display/editable-text/editable-text.tsx` (`EditableText`, `EditableTextSize`). `editable-text.tsx` imports `editable/index.ts`, so the registry item also ships the four `editable` files. The imports stay by path on purpose: one import through the `properties` barrel would make the item ship every file of `properties` (decided 2026-10-11, `docs/architecture/tc96-parttens.md`).

## Dependents

- `packages/parttens/src/index.ts` re-exports `checklist/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `checklist`. Renaming the folder breaks the registry and the pattern test run.
- The stories import through `@tc96/parttens`, not by file path.
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

- `card` (default) wraps the `ol[data-slot="checklist-items"]` in a `Card` (`data-slot="card"`, the only card in the section; the `ol` carries no radius, border or background) and pads the section; the first and last rows read `--card-surface-radius` (set by the consumer theme's `[data-slot="card"]` rule, falling back to `--radius-2xl`, the COSS card radius) minus 1px, so the row corners follow the card. The list must not get `overflow-hidden`: the drag handle sits outside the row, on the right at `-right-6` (`right: -24px`, set by the owner on 2026-10-15; it was `-left-8`), so it extends 24px past the row and 23px past the card border.
- `plain` drops the frame and the section padding, so a parent frame, such as `RecordGroup` `inset`, holds the rows. With `md` its row height is `--record-group-row-height`, defined by `RecordGroup` (set by the owner on 2026-10-15): 32px in a `plain` group and 36px in `card` and `inset`, the height of a `RecordGroupItem` in each; outside a group the variable is unset and the row falls back to 36px. The row keeps `px-2`. `card` with `md` stays 40px (`h-10 px-3`) and `sm` stays 32px (`h-8 px-2`), whatever the group. `checklistRowVariants` sets these through compound variants. A parent with `overflow-hidden` (the `RecordGroup` panel) would clip a handle outside the row, so `plain` renders the handle in the row's action area, after the delete button.
- The `plain` item (the `li`, which carries the hover) takes `-mx-[var(--record-group-hover-offset,0px)]`, set by the owner on 2026-10-15. `RecordGroup` defines that variable as 8px in every variant, so inside a group the hover extends 8px past the content edge while the row keeps its `px-2` and the checkbox lines up with a `RecordGroupItem` icon; outside a group the variable is unset and the margin is 0. The draft row and the read-only row use the same `li` classes. `card` has no offset: its hover stays inside the frame.

Copy:

- Default copy is pt-BR (`X de Y concluídos`, the row and draft `aria-label`s, the handle tooltip); the metadata labels `Author`, `Due date` and `No due date` are English.

## Styling

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-completed` | the `li` | `group-data-completed:line-through` and `group-data-completed:text-muted-foreground` on the title |
| `data-dragging` | the sortable `li` | `data-dragging:opacity-40` in `checklistItemVariants` |
| `data-due="overdue\|today\|upcoming"` | `[data-slot=checklist-actions]` | `checklistDueDateVariants({ status })` on the `DateProperty` |
| `data-density`, `data-readonly`, `data-variant` | the `section` | consumers; the pattern uses the `density` and `variant` variants instead |

`data-slot` names: `checklist`, `checklist-header`, `progress`, `progress-track`, `checklist-items`, `checklist-item`, `checklist-draft-item`, `checklist-row`, `checklist-drag-handle`, `checklist-title`, `checklist-actions`, `checklist-delete`.

- Design axes are `cva` variants in `lib/variants.ts`: `density` on the row, the checkbox hit area and the draft input; `variant` on the section padding, the plain list layout (`flex flex-col gap-0.5`; the card frame is `Card`), the item radius and the drag handle placement; `status` on the due date. Every class is a complete string, so the Tailwind scanner always sees it.
- `cn` appears only on the root `section`, where the consumer's `className` enters.
- Colors only from theme tokens (`text-destructive-foreground`, `text-warning-foreground`, `text-muted-foreground`, `bg-primary`, `bg-muted`); `Card` supplies `bg-card` and the frame; no palette colors.
- `scripts/override-exceptions.json` has no entry for this pattern.

## Verify

```bash
bun test --isolate packages/parttens/src/checklist
bunx biome check packages/parttens/src/checklist
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/checklist.stories.tsx
```

The stories in `apps/storybook/src/patterns/checklist.stories.tsx` run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `checklist` entry of `docs/architecture/public-api-exports.json`. Props and defaults are in `types/index.ts` and `composition/checklist/checklist.tsx`. The registry ships every file the barrel reaches; exporting anything from `lib/` or `components/` needs a reason recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-parttens.md`, sections "Estrutura interna dos patterns" (the layered split, the due-date tokens and their contrast ratios, `data-*` over conditional classes, `cn` only on the root), "Organização e fronteiras" (`Text` for titles and items) and "Estrutura do consumidor" (due-date functions from `@tc96/helpers/date`).
