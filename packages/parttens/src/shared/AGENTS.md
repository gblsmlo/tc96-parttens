# Shared components

Not a pattern: three controlled building blocks for collections that the root barrel `packages/parttens/src/index.ts` exports through `export * from './shared/index'` and that patterns reuse by relative import. They are a pagination bar (`CollectionPagination`), a toolbar frame with start and end slots (`CollectionToolbar`, `CollectionToolbarGroup`) and two menu options with a trailing check (`MenuRadioOption`, `MenuCheckboxOption`). The folder is distinct from the per-pattern `shared/` folders (`collection-views/shared/`, `properties/shared/`, `widgets/shared/`), which are internal to their pattern. It never imports a pattern and keeps no state: the consumer passes `page`, `variant`, `value` or `checked` and handles the callbacks.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | the three component files and their tests |
| `index.ts` | the barrel; every file in `components/` is reached from it |

There is no `test/dom.ts`: both test files import `collection-views/test/dom.ts`, so moving that file breaks them.

Import direction: `components/` → `@tc96/ui/<component>`, `@tc96/elements/text`, `@tc96/utils`, `lucide-react` and React only. `components/collection-toolbar.test.tsx` also imports the root barrel `../../index`.

## Dependents

Patterns import the component files by path, not through `index.ts`, so renaming or moving one breaks them:

- `components/collection-pagination.tsx`: `collection-views/views/data-grid/components/data-grid-pagination.tsx`.
- `components/menu-selection-item.tsx` (`MenuRadioOption`): `collection-views/views/data-grid/components/data-grid-density-submenu.tsx`, `collection-views/shared/components/collection-filter-submenu.tsx`.
- `components/menu-selection-item.tsx` (`MenuCheckboxOption`): `collection-views/views/data-grid/components/data-grid-columns-submenu.tsx`, `properties/composition/property-collection.tsx`.
- `components/collection-toolbar.tsx`: the tests `collection-views/views/data-grid/components/data-grid-search.test.tsx`, `collection-views/views/data-grid/components/data-grid-selection-summary.test.tsx`, `collection-views/shared/components/collection-filter-submenu.test.tsx` and `collection-views/shared/components/collection-search-field.test.tsx`.
- `packages/registry/src/build-registry.ts` treats `./shared/index` in the root barrel as an area, not a pattern, and ships the area's barrel with every pattern whose files import it. A new file here must be reached from `index.ts` or from a pattern the registry follows.
- Stories import from `@tc96/parttens`: `apps/storybook/src/patterns/shared/` and `apps/storybook/src/patterns/collection-views/default.stories.tsx`.

## Invariants

Pagination:

- `CollectionPagination` clamps: `lastPage` is `max(pageCount, 1)` and the page is clamped into `[1, lastPage]`, so `page={9}` with `pageCount={0}` renders `1 / 1`. `onPageChange` receives the target page, never a delta.
- The `first–last de total` summary renders only when both `total` and `pageSize` are defined, reads `0 de 0` when `total` is 0, and sits in a `p` with `aria-live="polite"`. `label` becomes the `aria-label` of the COSS `Pagination` `nav`; the button labels are fixed pt-BR strings.

Toolbar:

- `variant` defaults to `plain`, not the COSS frame (`default`). `plain` and `text` strip the frame with `items-center rounded-none border-0 bg-transparent p-0`. `aria-label` defaults to `Controles da coleção`.
- With `variant="text"`, `title` renders as an `h2` and `description` as a muted `p`; in the other variants `title` is the HTML `title` attribute and `description` is typed `never`.
- `startSlot` and `endSlot` are destructured so they never reach the DOM; the end group carries `ms-auto`.
- `components/collection-toolbar.test.tsx` pins the root barrel's toolbar surface: `ViewSettingsMenu`, `ViewSettingsSection`, `PresetsMenu` and `Action` must exist, and `SavedViewsMenu`, `FilterMenu` and `SettingsMenu` must not. Those live in `collection-views/shared/`, not here. The test checks `hover:bg-accent` and `w-56` by class name, because `:hover` does not respond to synthetic events.

Menu options:

- `MenuRadioOption` and `MenuCheckboxOption` are Base UI `Menu.RadioItem` and `Menu.CheckboxItem` with their indicator and an inline check `svg`; selection, highlight and keyboard navigation come from Base UI. Their class string is the COSS `MenuCheckboxItem` one with a two-column grid (`grid-cols-[1fr_.75rem]`) that keeps the indicator in the trailing column.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-variant="default\|plain\|text"` | the toolbar root | consumers; the component picks its classes from the `variant` prop, and `apps/storybook/src/patterns/shared/toolbar.stories.tsx` asserts the attribute in a play |
| `data-highlighted`, `data-disabled` | set by Base UI on the menu options | `data-highlighted:` and `data-disabled:` variants in `selectionItemClassName` |
| `data-side` | set by the Base UI positioner on an ancestor of the options | `in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]` in `selectionItemClassName` |

- `data-slot` names set here: `collection-pagination`, `collection-pagination-page`, `menu-radio-option`, `menu-checkbox-option`. `pagination*`, `toolbar` and `toolbar-group` come from COSS.
- No `cva` variants: the only design axis is the `variant` conditional inside `CollectionToolbar`, and every class is a complete string. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder, and `bun run overrides:check` passes with the current classes.

## Verify

```bash
bun test --isolate packages/parttens/src/shared
bunx biome check packages/parttens/src/shared
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/shared/pagination.stories.tsx src/patterns/shared/toolbar.stories.tsx
```

Stories in `apps/storybook/src/patterns/shared/` run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts`, `packages/parttens/src/index.ts` and the ten names recorded in `docs/architecture/public-api-exports.json`. Adding or removing an export here changes the baseline.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (the shared area ships with each pattern that uses it; each pattern and `shared/` carry an `AGENTS.md`).
