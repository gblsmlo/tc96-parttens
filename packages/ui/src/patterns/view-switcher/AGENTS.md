# ViewSwitcher

Not a pattern: the control that picks the saved view of a collection (`ViewSwitcherMenu`, `ViewSwitcherSearch`, `ViewSwitcherItems`, `ViewSwitcherItem`, `ViewSwitcherCreate`), usually placed in the `left` slot of a `CollectionToolbar`. The root barrel `packages/ui/src/patterns/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state beyond the popover's `open`: the consumer passes the views and the selection and handles the callbacks.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `view-switcher.tsx`, every part |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/<component>`, `@tc96/utils`, `@phosphor-icons/react` and React only. It never imports a pattern or the toolbar folder.

## Dependents

- The table and data grid blocks import `components/view-switcher` by path (`blocks/data/shared/table/table-view-switcher.tsx`, `blocks/data/shared/grid/grid-view-switcher.tsx`, `finance/finance-1/finance-1-view-switcher.tsx`, `finance/finance-2/finance-2-view-switcher.tsx`); stories import through `@tc96/ui/patterns`.
- The `collection` registry item ships this folder through `itemAreas` in `packages/registry/src/manifest.ts`.

## Invariants

- `ViewSwitcherMenu` is a `Popover` (`role="dialog"`), not a menu, because it holds a search field and, in each view, an options button, which a `role="menu"` cannot contain. Its trigger is a COSS `ToolbarButton`, so it must render inside a `CollectionToolbar`.
- A `ViewSwitcherItem` label is a `PopoverClose`; pressing an item in its `options` menu closes the popover through a context `ViewSwitcherMenu` provides, because that menu is a separate Base UI tree.
- A `ViewSwitcherItem` `count` is `aria-hidden` and never joined to the label: the label button is named by the consumer's `aria-label`, or by `label` alone. `0` renders, `undefined` renders nothing. The trigger shows no count: it names the active view only.
- `ViewSwitcherItems` with `loading` renders its children first and then `aria-hidden` skeleton rows, with `aria-busy` on the `fieldset`, so a view already known (the default one) stays selectable while the saved views load.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-selected` | the selected `ViewSwitcherItem` | consumers and tests |

- `data-slot` names set here: `view-switcher-search`, `view-switcher-items`, `view-switcher-item`, `view-switcher-item-count`, `view-switcher-create`.
- The trigger `variant` is `default` (COSS `Button` `secondary`, the default) or `ghost`; no `cva` here. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bunx biome check packages/ui/src/patterns/view-switcher
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/view-switcher
```

Interface tests are `play` functions in `apps/storybook/src/patterns/view-switcher/behavior.stories.tsx`, on the five pages of `Patterns/ViewSwitcher`, one story per guarantee and one per non-default trigger `variant`. The plays check button variants by class name, because `:hover` does not respond to synthetic events. `view-switcher-layouts.tsx` holds `ComposedViewSwitcher`, the stateful composition that the Playground, Layouts, Usages and the `CollectionToolbar` stories share. `ViewSwitcherCanvas` puts the story in the `left` slot of a `CollectionToolbar`.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- The frame it sits in: `packages/ui/src/patterns/toolbar/AGENTS.md`.
