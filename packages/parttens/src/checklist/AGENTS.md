# Checklist pattern

Guide for agents working in `packages/parttens/src/checklist`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only at the boundary with an external `className`, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder follows the pattern structure described there (`composition/`, `components/`, `lib/`, `types/`, `test/`, `core.ts`), the same layout as `collection-views`, `detail-sheet` and `editable`.

## What it is

A controlled checklist: the consumer passes `items` and callbacks, the pattern renders rows with a checkbox, an editable or clickable title, author and due-date metadata, a delete button, drag-and-drop ordering (dnd-kit) and a draft row to create items. It has no state of its own beyond what dnd-kit and the COSS fields keep for editing.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `composition/index.ts` and `types/index.ts` | yes |
| `core.ts` | the React-free surface: the three types, `ChecklistDueStatus` and the due-date functions | workspace only; not reached from the barrel |
| `composition/index.ts` | re-exports `composition/checklist/index.ts` | through the barrel |
| `composition/checklist/index.ts` | exports `Checklist` | through the barrel |
| `composition/checklist/checklist.tsx` | `Checklist`: the `section`, the header and the `ol`, read-only or sortable | yes |
| `composition/checklist/checklist.test.tsx` | JSDOM tests with Testing Library | — |
| `components/checklist-header.tsx` | `ChecklistHeader`: title, `X de Y concluídos` and the `progressbar` | no |
| `components/checklist-row.tsx` | `ChecklistRow` (sortable `li` with drag handle and tooltip) and `ChecklistDeleteButton` | no |
| `components/checklist-read-only-row.tsx` | `ChecklistReadOnlyRow`: same card, disabled checkbox, no handle | no |
| `components/checklist-draft-row.tsx` | `ChecklistDraftRow`: the `form` that creates an item by Enter or by checking | no |
| `components/checklist-item-card.tsx` | `ChecklistItemCard` (the row grid) and `ChecklistTitle` (button, editable or plain) | no |
| `components/checklist-metadata.tsx` | `ChecklistMetadata`: `PersonProperty` for the author and `DateProperty` for the due date | no |
| `lib/due-date.ts` | `calendarDayOffset`, `dueStatus`, `formatChecklistDueDate` | through `core.ts` |
| `lib/sortable.ts` | dnd-kit sensors, item type, `handleDragEnd`, `handleMoveShortcut` (Alt+Arrow) | no |
| `lib/variants.ts` | every class string and `cva` variant, plus `ChecklistDensity` and `ChecklistDueStatus` | no |
| `types/index.ts` | `ChecklistItem`, `ChecklistProps`, re-export of `ChecklistDensity` | through the barrel |
| `test/dom.ts` | the JSDOM setup the test file imports; a copy owned by this pattern | — |

Only what `index.ts` exports is public. The registry copies every file this barrel reaches, so a new file must be imported from one of these, and nothing in `lib/` or `components/` should be exported from the barrel without a reason recorded in `docs/architecture/tc96-parttens.md`. A new layer (`hooks/`, `store/`) is created only when it has code to hold, with its own `index.ts` if the barrel reaches it.

Import direction inside the folder: `composition/` → `components/` → `lib/` and `types/`; `types/` imports only from `lib/variants.ts` and from `properties`; `lib/` never imports from `components/` or `composition/`.

## Public API

```ts
interface ChecklistItem {
  authorId?: string | null   // undefined hides the author; null shows it empty
  completed: boolean
  dueDate?: string | null    // ISO date; undefined hides it; null shows "No due date"
  id: string
  title: string
}

interface ChecklistProps extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  ariaLabel: string
  authorOptions?: readonly PersonPropertyOption[]
  creating?: boolean                 // disables the draft row while the consumer persists
  density?: 'md' | 'sm'
  feedback?: ReactNode               // rendered after the list, for the consumer's messages
  items: readonly ChecklistItem[]
  locale?: string                    // default 'en-US'
  newItemTitle: string               // the draft row is controlled too
  onCreate: (title: string, completed: boolean) => void
  onItemClick?: (item: ChecklistItem) => void      // turns the title into a button
  onItemAuthorChange?: (id: string, authorId: string) => void
  onItemCompletionChange: (id: string, completed: boolean) => void
  onItemDelete?: (id: string) => void              // shows the delete button
  onItemDueDateChange?: (id: string, dueDate: string | null) => void
  onItemMove: (id: string, targetIndex: number) => void
  onItemRename: (id: string, title: string) => void
  onNewItemTitleChange: (title: string) => void
  progress?: boolean                 // shows the progress bar
  readOnly?: boolean                 // disables editing, ordering and creation
  title?: ReactNode
  timeZone?: string                  // default 'UTC'
}
```

Behavior worth knowing before changing it:

- The title is a button when `onItemClick` exists, an `EditableText` when the row is editable, and plain `Text` when read-only. All three live in `ChecklistTitle`.
- A due date within one day renders as a relative label (`formatRelativeDay`); otherwise as a short date. `dueStatus` maps the day offset to `overdue`, `today` or `upcoming`.
- Ordering: dnd-kit pointer and keyboard sensors on the handle, plus Alt+ArrowUp and Alt+ArrowDown handled by `handleMoveShortcut`. With fewer than two items the handle is disabled.
- Creating: Enter submits the draft `form`; checking the draft checkbox creates the item already completed. An empty or whitespace title is ignored.

## Styling contract

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-completed` | the `li` | `group-data-completed:line-through` and `group-data-completed:text-muted-foreground` on the title |
| `data-dragging` | the sortable `li` | `data-dragging:opacity-40` in `CHECKLIST_ITEM_CLASSNAME` |
| `data-due="overdue\|today\|upcoming"` | `[data-slot=checklist-actions]` | `checklistDueDateVariants({ status })` on the `DateProperty` |
| `data-density`, `data-readonly` | the `section` | consumers; the pattern uses the `density` variants instead |

Design axes are `cva` variants in `lib/variants.ts`: `density` on the row, the checkbox hit area and the draft input; `status` on the due date. Every class is a complete string, so the Tailwind scanner always sees it. Colors come only from theme tokens (`text-destructive-foreground`, `text-warning-foreground`, `text-muted-foreground`, `bg-primary`, `bg-muted`, `border-border/60`); no palette colors.

`data-slot` names: `checklist`, `checklist-header`, `progress`, `progress-track`, `checklist-items`, `checklist-item`, `checklist-draft-item`, `checklist-row`, `checklist-drag-handle`, `checklist-title`, `checklist-actions`, `checklist-delete`.

## Verify

```bash
bun test --isolate packages/parttens/src/checklist
bunx biome check packages/parttens/src/checklist
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/checklist.stories.tsx
```

The stories are `Patterns/Checklist` in `apps/storybook/src/patterns/checklist.stories.tsx` and run axe with `test: 'error'`.
