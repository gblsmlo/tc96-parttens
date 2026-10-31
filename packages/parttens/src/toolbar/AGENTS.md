# Toolbar

Not a pattern: the toolbar frame of a collection (`CollectionToolbar`, `CollectionToolbarGroup`) with start, center and end slots, and the view switcher that sits in it (`ViewSwitcherMenu`, `ViewSwitcherSearch`, `ViewSwitcherItems`, `ViewSwitcherItem`, `ViewSwitcherCreate`). The root barrel `packages/parttens/src/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state beyond the view switcher popover's `open`: the consumer passes `variant`, the slots, the views and the selection and handles the callbacks.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `collection-toolbar.tsx`, `view-switcher.tsx` and `collection-toolbar.test.ts`, the bun check of the root barrel's toolbar surface |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/<component>`, `@tc96/elements/text`, `@tc96/utils`, `lucide-react` and React only; `collection-toolbar.test.ts` imports the root barrel `../../index`. It never imports a pattern.

## Dependents

- No file outside the folder imports `components/` by path; stories import through `@tc96/parttens`.
- No runtime file of a pattern imports this folder, so no registry item ships it today.

## Invariants

Toolbar:

- `variant` defaults to `plain`, not the COSS frame (`default`). `plain` and `text` strip the frame with `items-center rounded-none border-0 bg-transparent p-0`. `aria-label` defaults to `Controles da coleção`.
- With `variant="text"`, `title` renders as an `h2` and `description` as a muted `p`; in the other variants `title` is the HTML `title` attribute and `description` is typed `never`.
- `startSlot`, `centerSlot` and `endSlot` are destructured so they never reach the DOM. Without `centerSlot` the end group carries `ms-auto`; with it, start and end become `flex-1 basis-0` (an `aria-hidden` spacer stands in for a missing side) so the center group sits at the toolbar's midpoint whatever the side widths.
- `components/collection-toolbar.test.ts` pins the root barrel's toolbar surface: `ViewSettingsMenu`, `ViewSettingsSection`, `PresetsMenu` and `Action` must exist, and `SavedViewsMenu`, `FilterMenu` and `SettingsMenu` must not. Those live in `collection/shared/`, not here. The `Patterns/Toolbar/Behavior` plays check `hover:bg-accent` and `w-56` by class name, because `:hover` does not respond to synthetic events.

View switcher:

- `ViewSwitcherMenu` is a `Popover` (`role="dialog"`), not a menu, and its trigger is a `ToolbarButton`, so it must render inside a `CollectionToolbar`. A `ViewSwitcherItem` label is a `PopoverClose`; pressing an item in its `options` menu closes the popover through a context `ViewSwitcherMenu` provides, because that menu is a separate Base UI tree.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-variant="default\|plain\|text"` | the toolbar root | consumers; the component picks its classes from the `variant` prop, and `apps/storybook/src/patterns/toolbar/toolbar.stories.tsx` asserts the attribute in a play |
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

Interface tests are `play` functions in `apps/storybook/src/patterns/toolbar/`: `behavior.stories.tsx` (`Patterns/Toolbar/Behavior`: slots, center slot, view settings, presets and action) and `view-switcher/behavior.stories.tsx` (`Patterns/Toolbar/View Switcher/Behavior`: one story per view switcher case), plus the `Interaction` twins of the documented stories. The only bun test left is `components/collection-toolbar.test.ts`, which renders nothing. Stories in `apps/storybook/src/patterns/toolbar/` (`Patterns/Toolbar` and `Patterns/Toolbar/View Switcher`) run axe with `test: 'error'`. The documented stories render the component directly, with no helper component, so the Code panel shows code the consumer can paste: each meta sets `component` and the args, a slot whose content has no state is JSX in `args` (`centerSlot` in `WithCenterSlot`), and slot content with state lives in the story's named `render`. Each play runs in a `!dev` `<Story>Interaction` twin; the view switcher `Default` renders the same composition as the toolbar's `Default` inside a `CollectionToolbar`, because `ViewSwitcherMenu` needs the toolbar context. The toolbar stories are typed `StoryObj<typeof CollectionToolbar>`, not `StoryObj<typeof meta>`: `CollectionToolbarProps` is a union, and with `typeof meta` the story args collapse to `never`. The layout wrapper is a decorator: `w-full max-w-6xl p-6` in the toolbar stories, `p-2` in the view switcher ones.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "ActionBar, Pagination e Toolbar: uma pasta por componente da sidebar".
