# ActionBar

Not a pattern: the controlled bar a consumer shows over selected records, with the selection count, groups of actions, submenus in a popover and a clear button. The root barrel `packages/parttens/src/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state: the consumer passes `selectedCount`, `selectedRows` and `actions` and handles `onSelect` and `onClearSelection`.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `action-bar.tsx`, the bar and its types |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/button`, `@tc96/ui/menu`, `@tc96/utils`, `lucide-react` and React only. It never imports a pattern.

## Dependents

Imported by path, not through `index.ts`, so moving `components/action-bar.tsx` breaks them:

- `collection/layouts/data-grid/components/data-grid-selection-actions.tsx` (the `ActionBarContext` type), which makes the `collection` registry item ship this folder.

## Invariants

- Renders nothing while `selectedCount` is below 1.
- An item with `submenu` opens a non-modal `Menu` above the bar (`side="top"`) and never calls its own `onSelect`; each submenu item calls its `onSelect` with the same `{ selectedCount, selectedRows }` context.
- The bar is `role="toolbar"` named "Ações dos itens selecionados"; the clear button exists only with `onClearSelection`, named "Limpar seleção".
- Floating placement belongs to the caller: `DataGridSelectionActions` and `CollectionFrameOverlay` position the bar, the bar itself does not.

## Styling

- `data-slot="action-bar"` on the root, for consumers and tests; not styled.
- Group dividers are an `hr` with `aria-orientation="vertical"`. Colors only from theme tokens (`bg-popover`, `border`, `bg-border`).
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bunx biome check packages/parttens/src/action-bar
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/action-bar
```

`Patterns/ActionBar` (`apps/storybook/src/patterns/action-bar/`) holds the interaction tests as `play` functions, runs axe with `test: 'error'`, and carries the `Usage` and `API Reference` sections of its `Doc` page.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "ActionBar, Pagination e Toolbar: uma pasta por componente da sidebar".
