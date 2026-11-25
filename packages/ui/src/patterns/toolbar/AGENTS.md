# Toolbar

Not a pattern: the toolbar frame of a collection (`CollectionToolbar`, `CollectionToolbarGroup`) with `left`, `center` and `right` slots and a `mode`, the heading parts for the `left` slot (`CollectionToolbarHeading`, `CollectionToolbarTitle`, `CollectionToolbarDescription`), and the internal menu trigger that the controls in its slots share. The root barrel `packages/ui/src/patterns/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state: the consumer passes `mode` and the slots. The controls that fill the slots have their own folders: `view-switcher/` and `view-settings-menu/`.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `collection-toolbar.tsx`; `collection-toolbar-heading.tsx`, the heading parts; `collection-toolbar-menu-trigger.tsx`, the ghost `ToolbarButton` that opens a menu, internal and not exported; and `collection-toolbar.test.ts`, the bun check of the root barrel's toolbar surface |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/<component>`, `@tc96/utils` and React only; `collection-toolbar.test.ts` imports the root barrel `../../index`. It never imports a pattern.

## Dependents

- The table and data grid blocks import `components/collection-toolbar` and `components/collection-toolbar-heading` by path (`packages/ui/src/blocks/data/`); stories import through `@tc96/ui/patterns`.
- `view-settings-menu/components/view-settings-menu.tsx` and `collection/shared/components/collection-presets-menu.tsx` import `components/collection-toolbar-menu-trigger` by path.
- The `collection` registry item ships this folder through `itemAreas` in `packages/registry/src/manifest.ts`, and `build-registry.ts` fails when an area the aggregate exports ships with no item.

## Invariants

- `CollectionToolbar` is only the frame: no heading, no `children`. The `left` slot holds either the heading parts or the view switcher, never both (decided 2026-11-24).
- `CollectionToolbarTitle` is an `h2` and `CollectionToolbarDescription` a muted `p`, both truncated on one line; the description returns `null` for `null`, `undefined` or `''`, so a block passes a description that may be missing without its own condition.
- `mode` defaults to `plain`, which strips the COSS frame with `rounded-none border-0 bg-transparent p-0`; `default` keeps it. Height is `min-h-9 md:min-h-10`, not fixed, so a two-line `left` grows the bar. `aria-label` defaults to `Controles da coleção`.
- `left`, `center` and `right` are destructured so they never reach the DOM. Without `center` the right group carries `ms-auto`; with it, both sides become `flex-1 basis-0` (an `aria-hidden` spacer stands in for a missing side) so the center group sits at the toolbar's midpoint whatever the side widths.
- `collection-toolbar-menu-trigger.tsx` renders a Base UI `ToolbarButton`, so every control built on it (`ViewSettingsMenu`, `PresetsMenu`) must render inside a `CollectionToolbar`.
- `components/collection-toolbar.test.ts` pins the root barrel's toolbar surface: `ViewSettingsMenu`, `ViewSettingsSection`, `PresetsMenu` and `Action` must exist, and `SavedViewsMenu`, `FilterMenu` and `SettingsMenu` must not.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-mode="default\|plain"` | the toolbar root | consumers; the component picks its classes from the `mode` prop, and `apps/storybook/src/patterns/collection-toolbar/behavior.stories.tsx` and the table and data grid block plays assert it |

- `data-slot` names set here: `collection-toolbar-heading`, `collection-toolbar-title`, `collection-toolbar-description`. `toolbar` and `toolbar-group` come from COSS.
- No `cva` variants: the only design axis is the `mode` conditional inside `CollectionToolbar`, and every class is a complete string. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bun test --isolate packages/ui/src/patterns/toolbar
bunx biome check packages/ui/src/patterns/toolbar
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/collection-toolbar
```

Interface tests are `play` functions in `apps/storybook/src/patterns/collection-toolbar/behavior.stories.tsx`, on the five pages of `Patterns/CollectionToolbar` (API Reference, Playground, Layouts, Behavior, Usages); `PresetsMenu` and `Action` are tested there too, inside the bar. Layouts are only arrangements of the slots, drawn with anatomy placeholders (`DefaultSlots` and the others in `toolbar-layouts.tsx`), because each screen fills them its own way; what fills them lives in Usages, each story naming the layout it fills. The Playground picks the content of each slot with a select, and `ComposedToolbar` builds the view switcher and the view settings from the compositions in `apps/storybook/src/patterns/view-switcher/` and `view-settings-menu/`. The only bun test is `components/collection-toolbar.test.ts`, which renders nothing. Stories run axe with `test: 'error'`. The layout wrapper is the `ToolbarCanvas` decorator, `w-full max-w-6xl p-6`.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-ui.md`, section "ActionBar, Pagination e Toolbar: uma pasta por componente da sidebar".
