# Settings pattern

Controlled frames for a settings screen: `SettingsSection` (a divided card of rows with an optional `h2` title) and `SettingsRow` (a title, an optional description, an optional `startSlot` before them and the control in `endSlot`). The consumer passes the copy and the control; the pattern never holds a value, saves, or ships CSS, and it has no state.

## Map

| Folder | Holds |
| --- | --- |
| `composition/settings-section/` | `SettingsSection`, its test and barrel |
| `composition/settings-row/` | `SettingsRow`, its test and barrel |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: the prop types, reached from the barrel only as types |

Import direction: `composition/` → `core.ts`. Outgoing: `@tc96/elements/text`, `@tc96/utils` and React only; no COSS component, so the registry item has no `registryDependencies`. `composition/settings-section/settings-section.test.tsx` imports `SettingsRow` by file path.

## Dependents

- `packages/parttens/src/index.ts` re-exports `settings/index`.
- `packages/registry/src/manifest.ts` (`patternNames`) and `scripts/test-patterns.ts` list the folder name `settings`; `packages/registry/src/manifest.test.ts` builds the item and asserts it ships `elements/src/text.tsx`. Renaming the folder breaks the registry and the pattern test run.

## Invariants

- Text versus slots was decided by the owner on 2026-10-08: `title` and `description` stay props with fixed typography, and the control goes in `endSlot`. Do not turn the left side into a free slot.
- The row knows nothing about its control: select, switch, input or read-only text enter through `endSlot`. The control's value, saving and accessible name (`aria-label`) belong to the consumer; the row does not link its title to the control.
- `startSlot`, `description` and `endSlot` render their wrapper only when passed, so a title-only row draws no empty cell.
- With `title`, `SettingsSection` is a `section` whose `aria-labelledby` points at the `h2` above the card (`useId()`); without it, it is a plain `div` with no heading and no landmark, for a page whose own title names its single card.
- No default copy: every label is a prop.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="settings-section"` | the root, `section` or `div` |
| `data-slot="settings-section-title"`, `settings-section-card` | the `h2` and the card that holds the rows |
| `data-slot="settings-row"` | every row |
| `data-slot="settings-row-start"`, `settings-row-heading`, `settings-row-end` | the three cells of a row, in that order |
| `data-slot="settings-row-title"`, `settings-row-description` | the two paragraphs inside the heading |

- The card is the pattern's own `div` (`divide-y rounded-lg border bg-card px-4`), not the COSS `Card`, so `scripts/override-exceptions.json` has no entry here. `rounded-lg` is the `--radius` the Kanban cards and widgets use.
- `startSlot` sizes only a direct `svg` child (`[&>svg]:size-4`), so an `IconFrame` keeps its own size.
- The 24px between the text and the control is `gap-3` on the row plus `ms-3` on the end cell. No class is keyed on a `data-slot`.

## Verify

```bash
bun test --isolate packages/parttens/src/settings
bunx biome check packages/parttens/src/settings
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/settings
```

The stories are in `apps/storybook/src/patterns/settings/`, with a `!dev` `<Story>Interaction` twin each, and run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `settings` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions and measured contrast: `docs/architecture/tc96-parttens.md`, the `settings/` paragraphs. Source: Lemind `packages/patterns/src/settings/`.
