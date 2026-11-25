# ViewSettings

Not a pattern: the display settings of a collection in one menu (`ViewSettingsMenu`, `ViewSettingsSection`), usually placed in the `right` slot of a `CollectionToolbar`. The root barrel `packages/ui/src/patterns/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state: the consumer passes the modes, the active mode, the filter count and the sections, and handles the callbacks.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `view-settings.tsx`: the menu, its layout tabs and the section |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/<component>`, `@tc96/utils`, `@phosphor-icons/react`, React and `../../toolbar/components/collection-toolbar-menu-trigger`. It never imports a pattern.

## Dependents

- The table and data grid blocks import `components/view-settings` by path (`packages/ui/src/blocks/data/<domain>/*/`); stories import through `@tc96/ui/patterns`.
- The `collection` entry of `docs/architecture/public-api-exports.json` no longer lists `ViewSettings*`; the root `parttens` entry does.
- The `collection` registry item ships this folder through `itemAreas` in `packages/registry/src/manifest.ts`.

## Invariants

- The trigger is the toolbar's menu trigger, a ghost `ToolbarButton`, so `ViewSettingsMenu` must render inside a `CollectionToolbar`.
- The layout tabs render only with two modes or more. Up to three sit in one row (`data-layout="inline"`), four or more stack the icon above the label (`data-layout="stacked"`); the popup widens with the count (`w-56`, `w-64`, `w-72`, `w-96`), because three labels truncate at 16rem.
- The footer renders the clear item only with `onClearFilters`, and it stays disabled while `activeFilterCount` is zero; the save item renders only with `onSavePreference`. Clear comes before save.
- The trigger text is `formatTriggerLabel(label, activeFilterCount)` (default `label (count)`) only when the count is above zero, so a consumer in another language passes the function instead of a concatenated string.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-slot="view-settings-mode-tab"`, `data-layout="inline\|stacked"` | each layout tab | the component, and the plays in `apps/storybook/src/patterns/view-settings/behavior.stories.tsx` |
| `data-checked` | the active tab (Base UI) | the component: `background` with a shadow, `input` in dark |

- No `cva`: the arrangement is a conditional on the mode count, and every class is a complete string. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bunx biome check packages/ui/src/patterns/view-settings
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/view-settings
```

Interface tests are `play` functions in `apps/storybook/src/patterns/view-settings/behavior.stories.tsx`, on the five pages of `Patterns/ViewSettings`. `view-settings-layouts.tsx` holds `ComposedViewSettings`, the stateful composition that the Playground, Layouts, Usages and the `CollectionToolbar` stories share; `view-settings-data.tsx` holds the modes and filters. `ViewSettingsCanvas` puts the story in the `right` slot of a `CollectionToolbar`. `FilterRadioSubmenu`, an item for the sections, stays in `collection/shared/` and on the `Patterns/Collection` pages.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- The frame it sits in: `packages/ui/src/patterns/toolbar/AGENTS.md`.
