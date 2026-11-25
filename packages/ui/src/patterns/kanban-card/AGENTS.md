# KanbanCard

Not a pattern: the structural card a consumer returns from `renderRecord` of `KanbanView`, or renders on its own. The root barrel `packages/ui/src/patterns/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. The card has no content props and keeps no state: the consumer fills each slot and passes `display`, `interactive`, `selected` and `dimmed`.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `kanban-card.tsx`, the card, its slots, `kanbanCardVariants` and their types |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/card`, `@tc96/ui/text`, `@tc96/utils`, Base UI, `class-variance-authority` and React only. It never imports a pattern.

## Dependents

Imported by path, not through `index.ts`, so moving `components/kanban-card.tsx` breaks them:

- `kanban/components/kanban-card-skeleton.tsx`, which makes the `collection` registry item ship this folder.
- `packages/ui/src/blocks/data/shared/collection/data-collection-record-parts.tsx`.
- `scripts/override-exceptions.json` keys 14 `Card` entries by the path of `components/kanban-card.tsx`.

## Invariants

- `KanbanCard` is only structure: the root `article` and its slots, with no content props (decided on 2026-11-14 by the owner, replacing the props anatomy of the Pipeline card). It stays an `article` (tested).
- `KanbanCardHeader` holds `KanbanCardTitle`, `KanbanCardDescription` and `KanbanCardAction`; `KanbanCardBody` is a two-column grid whose label column takes the widest `KanbanCardFieldLabel`, 8px before the values, one `KanbanCardField` per row; `KanbanCardFooter` sits 12px below the body.
- In `minimal` the description, body and footer hide, so a consumer that wants the assignee there puts it in the header.
- `KanbanCardOpenTrigger` is stretched over the card; `KanbanCardAction`, `KanbanCardActionButton`, `KanbanCardControl` and `KanbanCardFieldValue interactive` set `data-kanban-card-action` and sit above it with `z-10`, so their clicks never open the card.
- Drag, the drag handle and the skeleton belong to `kanban/`: the card knows nothing about the board.

## Styling

- `data-slot="card"` and `data-pattern="kanban-card"` on the root; `data-display`, `data-interactive` and `data-state="selected"` for consumers. `data-slot="kanban-card-field|field-label|field-value|control|open-trigger|action-button"` on the slots that are not COSS card parts.
- Variants live in `kanbanCardVariants`; every class is a complete string. The card draws `has-focus-visible:ring-2` on the `article` because the open trigger removes the native outline.
- The radius comes from the consumer theme's `[data-slot="card"]` rule, so the card has no radius class. The 14 override entries each carry the reason of their state (hover fill, the focus ring, the dashed border while `dimmed`, selection).

## Verify

```bash
bunx biome check packages/ui/src/patterns/kanban-card
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/kanban-card src/patterns/kanban
```

`Patterns/KanbanCard` (`apps/storybook/src/patterns/kanban-card/`) is documented in the six component pages: the interaction tests are the `play` functions of `Patterns/KanbanCard/Behavior`, every story runs axe with `test: 'error'`, and `api-reference.mdx` is its API Reference.

## Pointers

- Public API: `index.ts` and the `patterns` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-ui.md`, the collection layouts entry.
