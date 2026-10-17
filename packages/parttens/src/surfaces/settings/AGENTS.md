# Settings pattern

Controlled frames for a settings screen: `SettingsSection` (a divided card of rows with an optional header), `SettingsSectionHeader`, `SettingsSectionTitle` and `SettingsSectionDescription` (the header above the card), `SettingsRow` (a title, optional description and control slots), and `SettingsCollapsed` (a titled row that expands its content while keeping actions available). The consumer passes all copy, icons and controls; the pattern never holds a setting value, saves, or ships CSS. Only the collapsed row owns its optional open state.

## Map

| Folder | Holds |
| --- | --- |
| `composition/settings-section/` | `SettingsSection`, the header parts, the context that hands the title id to `SettingsSectionTitle`, the test and barrel |
| `composition/settings-row/` | `SettingsRow`, its test and barrel |
| `composition/settings-collapsed/` | `SettingsCollapsed`, a titled collapsible row with a separate actions slot |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: the prop types, reached from the barrel only as types |

Import direction: `composition/` → `core.ts`. Outgoing: `@tc96/elements/text`, `@tc96/ui/card`, `@tc96/ui/collapsible`, `@tc96/utils`, `lucide-react` and React. The registry item depends on the COSS card and collapsible. `composition/settings-section/settings-section.test.tsx` imports `SettingsRow` by file path.

## Dependents

- `packages/parttens/src/index.ts` re-exports `surfaces/settings/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `surfaces/settings` for the registry item `settings`; `packages/registry/src/manifest.test.ts` builds the item and asserts it ships `elements/src/text.tsx`. Renaming the folder breaks the registry and the pattern test run.

## Invariants

- Text versus slots was decided by the owner on 2026-10-08: `title` and `description` stay props with fixed typography, and the control goes in `endSlot`. Do not turn the left side into a free slot.
- The row knows nothing about its control: select, switch, input or read-only text enter through `endSlot`. The control's value, saving and accessible name (`aria-label`) belong to the consumer; the row does not link its title to the control.
- `startSlot`, `description` and `endSlot` render their wrapper only when passed, so a title-only row draws no empty cell.
- `SettingsCollapsed` is a named `section` with an `h2` containing the collapse trigger. Its `actions` slot is a sibling of the trigger, so actions remain visible and do not toggle the content. It starts open unless `defaultOpen` or controlled `open` says otherwise; `onOpenChange` reports toggles. The component has no built-in status behavior or controls.
- With `header`, `SettingsSection` is a `section` whose `aria-labelledby` points at the `h2` of `SettingsSectionTitle` (`useId()` passed by context); without it, it is a plain `div` with no heading and no landmark, for a page whose own title names its single card. A `header` must hold a `SettingsSectionTitle`, or the label points at no element.
- Every section heading in the consumers and usages goes through `SettingsSectionHeader`; a story does not compose its own `h2` and description above a `SettingsSection`. Decided by the owner on 2026-10-11.
- The pattern exports only generic settings frames. A screen named after a consumer domain (project statuses, billing) is a usage story composed from them, never a component here.
- No default copy: every label is a prop.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="settings-section"` | the root, `section` or `div` |
| `data-slot="settings-section-header"`, `settings-section-actions` | the header row above the card and its right cell, drawn only when `actions` is passed |
| `data-slot="settings-section-title"`, `settings-section-description` | the `h2` and the `p` inside the header |
| `data-slot="settings-section-rows"` | the divided wrapper of the rows, inside the `Card` (`data-slot="card"`) |
| `data-slot="settings-row"` | every row |
| `data-slot="settings-row-start"`, `settings-row-heading`, `settings-row-end` | the three cells of a row, in that order |
| `data-slot="settings-row-title"`, `settings-row-description` | the two paragraphs inside the heading |
| `data-slot="settings-collapsed"` | the named collapsible `section` |
| `data-slot="settings-collapsed-title"`, `settings-collapsed-actions`, `settings-collapsed-items` | the heading, separate actions and panel content |

- The card is the COSS `Card` with no class: radius (the consumer theme's `[data-slot="card"]` rule), border, background and shadow stay the card's, so `scripts/override-exceptions.json` has no entry here. `divide-y px-6` sits on the inner `settings-section-rows` wrapper because `divide-*` on the card is a border override; `px-6` is the horizontal padding of the COSS card sections.
- `startSlot` sizes only a direct `svg` child (`[&>svg]:size-4`), so an `IconFrame` keeps its own size.
- The 24px between the text and the control is `gap-3` on the row plus `ms-3` on the end cell. No class is keyed on a `data-slot`.
- `SettingsCollapsed` uses the muted rounded header with a chevron next to its title. The usage supplies `first:pt-2 last:pb-2` on the group and wraps groups in one child of `SettingsSection`, leaving 8px inside the card without separators between groups.

## Verify

```bash
bun test --isolate packages/parttens/src/surfaces/settings
bunx biome check packages/parttens/src/surfaces/settings
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/surfaces/settings
```

The stories are in `apps/storybook/src/patterns/surfaces/settings/`, with a `!dev` `<Story>Interaction` twin each, and run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `settings` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions and measured contrast: `docs/architecture/tc96-parttens.md`, the `settings/` paragraphs. Source: Lemind `packages/patterns/src/settings/`.
