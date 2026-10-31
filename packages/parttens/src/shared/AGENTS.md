# Shared components

Not a pattern: two menu options with a trailing check (`MenuRadioOption`, `MenuCheckboxOption`) that the root barrel `packages/parttens/src/index.ts` exports through `export * from './shared/index'` and that patterns reuse by relative import. The folder is distinct from the per-pattern `shared/` folders (`collection/shared/`, `properties/shared/`, `widgets/shared/`), which are internal to their pattern. It never imports a pattern and keeps no state: the consumer passes `checked` and handles the callbacks. Its final place is pending: the owner decided on 2026-10-31 to leave it here while `CollectionPagination` and `CollectionToolbar` moved to `pagination/` and `toolbar/`.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `menu-selection-item.tsx` |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/menu`, `@tc96/utils` and React only.

## Dependents

Patterns import the component file by path, not through `index.ts`, so renaming or moving it breaks them:

- `components/menu-selection-item.tsx` (`MenuRadioOption`): `collection/layouts/data-grid/components/data-grid-density-submenu.tsx`, `collection/layouts/data-table/data-table-aggregation-cell.tsx`, `collection/shared/components/collection-filter-submenu.tsx`.
- `components/menu-selection-item.tsx` (`MenuCheckboxOption`): `collection/layouts/data-grid/components/data-grid-columns-submenu.tsx`, `collection/layouts/data-table/data-table-columns-submenu.tsx`, `properties/composition/property-collection.tsx`.
- `packages/registry/src/build-registry.ts` treats `./shared/index` in the root barrel as an area, not a pattern, and ships the area's barrel with every item whose files import it. A new file here must be reached from `index.ts` or from a pattern the registry follows.

## Invariants

- `MenuRadioOption` and `MenuCheckboxOption` are Base UI `Menu.RadioItem` and `Menu.CheckboxItem` with their indicator and an inline check `svg`; selection, highlight and keyboard navigation come from Base UI. Their class string is the COSS `MenuCheckboxItem` one with a two-column grid (`grid-cols-[1fr_.75rem]`) that keeps the indicator in the trailing column.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-highlighted`, `data-disabled` | set by Base UI on the menu options | `data-highlighted:` and `data-disabled:` variants in `selectionItemClassName` |
| `data-side` | set by the Base UI positioner on an ancestor of the options | `in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]` in `selectionItemClassName` |

- `data-slot` names set here: `menu-radio-option`, `menu-checkbox-option`. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bunx biome check packages/parttens/src/shared
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
```

The options have no test or story of their own; the view settings and filter submenu stories in `Patterns/Toolbar` and the collection usages exercise them.

## Pointers

- Public API: `index.ts`, `packages/parttens/src/index.ts` and the names recorded in `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-parttens.md`, sections "Estrutura interna dos patterns" and "ActionBar, Pagination e Toolbar: uma pasta por componente da sidebar".
