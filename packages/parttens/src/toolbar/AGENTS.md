# Toolbar

Not a pattern: the toolbar frame of a collection (`CollectionToolbar`, `CollectionToolbarGroup`) with start, center and end slots, and the view switcher that sits in it (`ViewSwitcherMenu`, `ViewSwitcherSearch`, `ViewSwitcherItems`, `ViewSwitcherItem`, `ViewSwitcherCreate`). The root barrel `packages/parttens/src/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state beyond the view switcher popover's `open`: the consumer passes `variant`, the slots, the views and the selection and handles the callbacks.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `collection-toolbar.tsx`, `view-switcher.tsx` and `collection-toolbar.test.ts`, the bun check of the root barrel's toolbar surface |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/<component>`, `@tc96/ui/text`, `@tc96/utils`, `@phosphor-icons/react` and React only; `collection-toolbar.test.ts` imports the root barrel `../../index`. It never imports a pattern.

## Dependents

- No file outside the folder imports `components/` by path; stories import through `@tc96/parttens`.
- No runtime file of a pattern imports this folder. The `collection` registry item ships it through `itemAreas` in `packages/registry/src/manifest.ts`, and `build-registry.ts` fails when an area the aggregate exports ships with no item.

## Invariants

Toolbar:

- `variant` defaults to `plain`, not the COSS frame (`default`). `plain` and `text` strip the frame with `items-center rounded-none border-0 bg-transparent p-0`. `aria-label` defaults to `Controles da coleção`.
- With `variant="text"`, `title` renders as an `h2` and `description` as a muted `p`; in the other variants `title` is the HTML `title` attribute and `description` is typed `never`.
- `startSlot`, `centerSlot` and `endSlot` are destructured so they never reach the DOM. Without `centerSlot` the end group carries `ms-auto`; with it, start and end become `flex-1 basis-0` (an `aria-hidden` spacer stands in for a missing side) so the center group sits at the toolbar's midpoint whatever the side widths.
- `components/collection-toolbar.test.ts` pins the root barrel's toolbar surface: `ViewSettingsMenu`, `ViewSettingsSection`, `PresetsMenu` and `Action` must exist, and `SavedViewsMenu`, `FilterMenu` and `SettingsMenu` must not. Those live in `collection/shared/`, not here. The `Patterns/Toolbar/Behavior` plays check `hover:bg-accent` and `w-56` by class name, because `:hover` does not respond to synthetic events.

View switcher:

- `ViewSwitcherMenu` is a `Popover` (`role="dialog"`), not a menu, and its trigger is a `ToolbarButton`, so it must render inside a `CollectionToolbar`. A `ViewSwitcherItem` label is a `PopoverClose`; pressing an item in its `options` menu closes the popover through a context `ViewSwitcherMenu` provides, because that menu is a separate Base UI tree.
- `ViewSwitcherItems` with `loading` renders its children first and then `aria-hidden` skeleton rows, with `aria-busy` on the `fieldset`, so a view already known (the default one) stays selectable while the saved views load.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-variant="default\|plain\|text"` | the toolbar root | consumers; the component picks its classes from the `variant` prop, and `apps/storybook/src/patterns/toolbar/behavior.stories.tsx` asserts the attribute in plays |
| `data-selected` | the selected `ViewSwitcherItem` | consumers and tests |

- `data-slot` names set here: `view-switcher-search`, `view-switcher-items`, `view-switcher-item`, `view-switcher-create`. `toolbar` and `toolbar-group` come from COSS.
- No `cva` variants: the only design axis is the `variant` conditional inside `CollectionToolbar`, and every class is a complete string. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bun test --isolate packages/parttens/src/toolbar
bunx biome check packages/parttens/src/toolbar
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/toolbar
```

Interface tests are `play` functions in `apps/storybook/src/patterns/toolbar/`, on the six pages of `Patterns/Toolbar`: `behavior.stories.tsx` (toolbar, slots, variants, keyboard, and the settings, presets and action parts that render inside it) and `behavior/view-switcher.stories.tsx` (one story per view switcher case, same title `Patterns/Toolbar/Behavior`). The view switcher has no node of its own: its Stories are in `stories/view-switcher.stories.tsx` (title `Patterns/Toolbar/Stories`) and its structures in `layouts.stories.tsx`. The only bun test left is `components/collection-toolbar.test.ts`, which renders nothing. Stories run axe with `test: 'error'`. `toolbar-layouts.tsx` holds the stateful compositions (`ComposedToolbar` and the others) that Playground, Stories, Layouts, Usages and Behavior share, and `toolbar-controls.ts` their controls. The toolbar stories are typed `StoryObj<typeof CollectionToolbar>`, not `StoryObj<typeof meta>`: `CollectionToolbarProps` is a union, and with `typeof meta` the story args collapse to `never`. The layout wrapper is the `ToolbarCanvas` decorator, `w-full max-w-6xl p-6`.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "ActionBar, Pagination e Toolbar: uma pasta por componente da sidebar".
