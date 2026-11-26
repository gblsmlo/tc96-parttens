# ViewSettingsMenu

Not a pattern: the display settings of a collection in one menu (`ViewSettingsMenu`, `ViewSettingsSection`) and the parts that organize its fields (`ViewSettingsSubmenu`, `ViewSettingsFieldSection`, `ViewSettingsShowAllFields`), usually placed in the `right` slot of a `CollectionToolbar`. The root barrel `packages/ui/src/patterns/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state: the consumer passes the modes, the active mode, the filter count and the sections, groups and sorts the fields itself, and handles the callbacks.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `view-settings-menu.tsx`: the popover, its layout tabs, the footer and the section; `view-settings-submenu.tsx`, `view-settings-field-section.tsx`, `view-settings-show-all-fields.tsx`: the field organization, built on `ViewSettingsSection` and the menu items |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/<component>`, `@tc96/utils`, `@phosphor-icons/react`, React and `../../toolbar/components/collection-toolbar-menu-trigger`. It never imports a pattern.

## Dependents

- The table and data grid blocks import `components/view-settings-menu` by path (`packages/ui/src/blocks/data/<domain>/*/`); `Tasks3` and `Tasks4` (`blocks/data/tasks/tasks-{3,4}/tasks-{3,4}-toolbar.tsx`) also import `components/view-settings-submenu`; stories import through `@tc96/ui/patterns`.
- The `collection` entry of `docs/architecture/public-api-exports.json` no longer lists `ViewSettings*`; the root `parttens` entry does.
- The `collection` registry item ships this folder through `itemAreas` in `packages/registry/src/manifest.ts`.

## Invariants

- The trigger is the toolbar's menu trigger, a ghost `ToolbarButton`, so `ViewSettingsMenu` must render inside a `CollectionToolbar`.
- The layout tabs render only with two modes or more. Up to three sit in one row (`data-layout="inline"`), four or more stack the icon above the label (`data-layout="stacked"`); the popup is `w-80` (320px) up to three tabs and `w-96` from four, so a submenu trigger fits its label and current value (`Responsável`, `Sem responsável`) with room between them.
- `ViewSettingsSubmenu` shows the label of the current option after its own label, and the option's icon in place of its own when the option has one, so the trigger reads the state without opening it. Without `value` no option is checked.
- `ViewSettingsFieldSection` renders nothing for an empty list and shows the field count in its label; each row is a switch with `closeOnClick={false}`, so the menu stays open while fields are toggled.
- `ViewSettingsShowAllFields` keeps the menu open and stays disabled while `hiddenCount` is zero.
- The footer renders the clear item only with `onClearFilters`, and it stays disabled while `activeFilterCount` is zero; the reset item renders only with `onReset` and is disabled by `resetDisabled`; the save item renders only with `onSavePreference`. The order is clear, reset, save: clear and reset go back to a starting point, save moves forward from it. Clear and reset keep the menu open, so the result shows in the sections; save closes it.
- The trigger text is `formatTriggerLabel(label, activeFilterCount)` (default `label (count)`) only when the count is above zero, so a consumer in another language passes the function instead of a concatenated string.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-slot="view-settings-mode-tab"`, `data-layout="inline\|stacked"` | each layout tab | the component, and the plays in `apps/storybook/src/patterns/view-settings-menu/behavior.stories.tsx` |
| `data-checked` | the active tab (Base UI) | the component: `background` with a shadow, `input` in dark |
| `data-slot="view-settings-current-value"` | the current value in a `ViewSettingsSubmenu` trigger | the component: `muted-foreground`, end-aligned |
| `data-slot="view-settings-field-count"`, `data-field` | the count in a field section label, each field row | the plays |

- No `cva`: the arrangement is a conditional on the mode count, and every class is a complete string. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bunx biome check packages/ui/src/patterns/view-settings-menu
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/view-settings-menu
```

Interface tests are `play` functions in `apps/storybook/src/patterns/view-settings-menu/behavior.stories.tsx`, on the five pages of `Patterns/ViewSettingsMenu`. `view-settings-menu-layouts.tsx` holds `ComposedViewSettings`, the stateful composition that the Playground, Layouts, Usages and the `CollectionToolbar` stories share; `FieldSettingsLayout` in the same file groups and sorts the fields for the field settings. `view-settings-menu-data.tsx` holds the modes, filters and fields. `ViewSettingsCanvas` puts the story in the `right` slot of a `CollectionToolbar`. `FilterRadioSubmenu`, an item for the sections, stays in `collection/shared/` and on the `Patterns/Collection` pages.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- The frame it sits in: `packages/ui/src/patterns/toolbar/AGENTS.md`.
