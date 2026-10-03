# Shared components

Guide for agents working in `packages/parttens/src/shared`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only at the boundary with an external `className`, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. This folder is not a pattern: it holds components that the root barrel `packages/parttens/src/index.ts` exports through `export * from './shared/index'` and that other patterns reuse by relative import. It is distinct from the per-pattern `shared/` folders (`collection-views/shared/`, `properties/shared/`, `widgets/shared/`), which are internal to their pattern and reached only through that pattern's barrel.

## What it is

Three controlled building blocks for collections: a pagination bar (`CollectionPagination`), a toolbar frame with start and end slots (`CollectionToolbar` and `CollectionToolbarGroup`) and two menu options with a trailing check indicator (`MenuRadioOption`, `MenuCheckboxOption`). They keep no state of their own: the consumer passes `page`, `variant`, `value` or `checked` and handles the callbacks.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports the three component files, values and types | yes, through the root barrel |
| `components/collection-pagination.tsx` | `CollectionPagination`, `CollectionPaginationProps`; the private `summarizeRange` | yes |
| `components/collection-pagination.test.tsx` | JSDOM tests with Testing Library; imports `collection-views/test/dom` | — |
| `components/collection-toolbar.tsx` | `CollectionToolbar`, `CollectionToolbarGroup`, `CollectionToolbarProps`, `CollectionToolbarGroupProps` | yes |
| `components/collection-toolbar.test.tsx` | JSDOM tests that import the root barrel `../../index` and compose with `collection-views` menus | — |
| `components/menu-selection-item.tsx` | `MenuRadioOption`, `MenuCheckboxOption`, `MenuRadioOptionProps`, `MenuCheckboxOptionProps`; the private `CheckIcon` and `selectionItemClassName` | yes |

Only what `index.ts` exports is public, and every file in `components/` is reached from it. `packages/registry/src/build-registry.ts` reads the root barrel, treats `./shared/index` as an area rather than a pattern, and ships the area's barrel with every pattern whose files import it; a new file here must be imported from `index.ts` or from a pattern that the registry follows. The ten names in `index.ts` are recorded in `docs/architecture/public-api-exports.json`, so adding or removing one changes the baseline. The folder has no `test/dom.ts`: both test files import `../../collection-views/test/dom`.

Import direction: this folder imports only from `@tc96/ui/<component>`, `@tc96/elements/text`, `@tc96/utils`, `lucide-react` and React, never from a pattern. Patterns import it by relative path: `collection-views/views/data-grid/components/data-grid-pagination.tsx` uses `CollectionPagination`, `collection-views/views/data-grid/components/data-grid-density-submenu.tsx` uses `MenuRadioOption`, `collection-views/views/data-grid/components/data-grid-columns-submenu.tsx` uses `MenuCheckboxOption`, `properties/composition/property-collection.tsx` uses `MenuCheckboxOption`, and the `collection-views` tests (`data-grid-search.test.tsx`, `data-grid-selection-summary.test.tsx`, `shared/components/collection-filter-submenu.test.tsx`, `shared/components/collection-search-field.test.tsx`) mount `CollectionToolbar`. Stories import all of them from `@tc96/parttens`: `apps/storybook/src/patterns/shared/`, `apps/storybook/src/patterns/collection-views/default.stories.tsx`, `collection-views/views/data-grid.stories.tsx` and `collection-views/views/kanban/kanban-column.stories.tsx`.

## Public API

```ts
interface CollectionPaginationProps
  extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  label: string                       // aria-label of the nav, in the collection's vocabulary
  onPageChange: (page: number) => void // receives the target page, never a delta
  page: number                        // 1-based
  pageCount: number
  pageSize?: number                   // with total, renders the range summary
  total?: number
}

interface CollectionToolbarBaseProps
  extends Omit<ComponentProps<typeof ToolbarPrimitive>, 'title'> {
  endSlot?: ReactNode
  startSlot?: ReactNode
}

type CollectionToolbarProps = CollectionToolbarBaseProps &
  (
    | {
        variant: 'text'
        title: string                 // rendered as an h2
        description: string           // rendered as a p
      }
    | {
        variant?: 'default' | 'plain' // default is the COSS frame; plain sits on the page
        title?: string                // HTML title attribute
        description?: never
      }
  )

type CollectionToolbarGroupProps = ComponentProps<typeof ToolbarGroup>

type MenuRadioOptionProps = MenuPrimitive.RadioItem.Props
type MenuCheckboxOptionProps = MenuPrimitive.CheckboxItem.Props
```

Behavior worth knowing before changing it:

- `CollectionPagination` clamps: `lastPage` is `max(pageCount, 1)` and the current page is clamped into `[1, lastPage]`, so `page={9}` with `pageCount={0}` renders `1 / 1`. First and previous are disabled at page 1, next and last at `lastPage`; the four buttons call `onPageChange` with `1`, `currentPage - 1`, `currentPage + 1` and `lastPage`.
- The summary `first–last de total` renders only when both `total` and `pageSize` are defined, reads `0 de 0` when `total` is 0, and sits in a `p` with `aria-live="polite"`. The `label` prop becomes the `aria-label` of the COSS `Pagination` `nav`; the button labels are fixed strings (`Primeira página`, `Página anterior`, `Próxima página`, `Última página`) and the page counter `span` carries `aria-current="page"`. The buttons are COSS `Button` with `size="icon-sm"` and `variant="ghost"`.
- `CollectionToolbar` wraps the COSS `Toolbar` (Base UI `Toolbar.Root`, role `toolbar`) with `aria-label` defaulting to `Controles da coleção`. `variant` defaults to `plain`; `plain` and `text` add `items-center rounded-none border-0 bg-transparent p-0` over the COSS frame, `text` sets `min-h-14` and the other two `h-9 md:h-10`.
- With `variant="text"` the `title` and `description` render through `Text` as an `h2` (`family="heading"`, `size="lg"`, `weight="semibold"`) and a muted `p` inside a leading `ToolbarGroup`; in the other variants `title` is passed through as the HTML `title` attribute and `description` is not accepted.
- `startSlot` and `endSlot` each render inside a COSS `ToolbarGroup` (the end group with `ms-auto`), `children` render between them, and both slot props are destructured so they never reach the DOM. `CollectionToolbarGroup` is a pass-through of `ToolbarGroup`.
- `collection-toolbar.test.tsx` also pins the root barrel's toolbar surface: `ViewSettingsMenu`, `ViewSettingsSection`, `PresetsMenu` and `Action` must exist and `SavedViewsMenu`, `FilterMenu` and `SettingsMenu` must not; those components live in `collection-views/shared/`, not here. The test checks `hover:bg-accent` on the triggers and `w-56` on the menu by class name, because `:hover` does not respond to synthetic events.
- `MenuRadioOption` and `MenuCheckboxOption` are Base UI `Menu.RadioItem` and `Menu.CheckboxItem` with their indicator and an inline check `svg`; selection state, `data-highlighted`, `data-disabled` and keyboard navigation come from Base UI. Their class string is the COSS `MenuCheckboxItem` one with a two-column grid (`grid-cols-[1fr_.75rem]`, `gap-4`, `pe-2.5`) that keeps the label in the first column and the indicator in the trailing one.

## Styling contract

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-variant="default\|plain\|text"` | the toolbar root | consumers; the component picks its classes from the `variant` prop, and `toolbar.stories.tsx` asserts the attribute in a play |
| `data-highlighted`, `data-disabled` | set by Base UI on the radio and checkbox items | `data-highlighted:bg-accent`, `data-highlighted:text-accent-foreground`, `data-disabled:pointer-events-none`, `data-disabled:opacity-64` in `selectionItemClassName` |
| `data-side` | set by the Base UI positioner on an ancestor of the items | `in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]` in `selectionItemClassName` |

There are no `cva` variants and no `lib/variants.ts`; the only design axis is the `variant` conditional inside `CollectionToolbar`, and every class is a complete string. Colors come only from theme tokens (`text-muted-foreground`, `text-foreground`, `bg-accent`, `text-accent-foreground`, `bg-transparent`); no palette colors. `scripts/override-exceptions.json` has no entry for this folder, and `bun run overrides:check` passes with the current classes.

`data-slot` names set here: `collection-pagination`, `collection-pagination-page`, `menu-radio-option`, `menu-checkbox-option`. Inherited from the COSS components: `pagination`, `pagination-content`, `pagination-item`, `toolbar`, `toolbar-group`.

## Verify

```bash
bun test --isolate packages/parttens/src/shared
bunx biome check packages/parttens/src/shared
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/shared/pagination.stories.tsx src/patterns/shared/toolbar.stories.tsx
```

The stories are `Patterns/Pagination` in `apps/storybook/src/patterns/shared/pagination.stories.tsx` and `Patterns/Toolbar` in `apps/storybook/src/patterns/shared/toolbar.stories.tsx`, and run axe with `test: 'error'`.
