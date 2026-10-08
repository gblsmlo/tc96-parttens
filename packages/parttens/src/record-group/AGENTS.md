# Record group pattern

A controlled, collapsible group of label and value rows for record surfaces: `RecordGroup` (a titled `section` with an optional `actions` slot and `footer`), `RecordGroupRow` (a label, an optional leading icon and a value) and `RecordGroupAction` (an icon button for the `actions` slot). The consumer passes the rows, the copy and the collapse state when it wants to control it. The pattern never fetches, edits a value or ships CSS; its only state is the uncontrolled collapse.

## Map

| Folder | Holds |
| --- | --- |
| `composition/record-group/` | `RecordGroup` on the COSS `Collapsible`, its test and barrel |
| `composition/record-group-row/` | `RecordGroupRow`, its test and barrel |
| `composition/record-group-action/` | `RecordGroupAction` on the COSS `Button`, its test and barrel |
| `lib/` | `variants.ts`: the group class helper (`cn`) and the `cva` variants of the content and of the row, label and value |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: the prop types; workspace only, not reached from the barrel except as types |

Import direction: `composition/` → `lib/`, `core.ts`. Outgoing, by file path into `properties`: `shared/property-catalog.ts` (`PropertyIcon`), imported by `core.ts` as a type. The registry ships that file with the `record-group` item.

## Dependents

- `packages/parttens/src/index.ts` re-exports `record-group/index`.
- `packages/registry/src/manifest.ts` (`patternNames`) and `scripts/test-patterns.ts` list the folder name `record-group`. Renaming the folder breaks the registry and the pattern test run.
- `packages/registry/src/manifest.test.ts` asserts the built item ships `parttens/src/properties/shared/property-catalog.ts`.

## Invariants

Collapse:

- Controlled when `open` is passed, otherwise uncontrolled from `defaultOpen`. `onOpenChange` runs in both modes; in controlled mode the group does not change until `open` does.
- With `empty` the group starts closed whatever `defaultOpen` says. Only the `empty` flip from `true` to `false` opens it, tracked while rendering; a manual collapse after the flip survives re-renders. The flip does not call `onOpenChange`, a flip back to `true` leaves the state alone, and `empty` never overrides a controlled `open`.
- `empty` also centers the content; the footer, when the user opens an empty group, renders below it.

Footer and actions:

- The footer lives inside `CollapsiblePanel`: it hides with the body, and a closed panel is unmounted, so the footer is not focusable and not in the accessibility tree. Use `actions` for controls that must stay visible when the group is closed.
- Unmounting waits for the 200ms height transition, and Base UI leaves the panel focusable until then (measured in Chromium: the panel is mounted with `data-closed` and a running animation, and a footer button takes focus). The panel therefore gets `inert` as soon as the group is not open; `FooterClosingInteraction` checks focus and `inert` during the transition and the unmount after it. jsdom stubs `getAnimations`, so only the story sees this.
- `actions` sits outside the trigger, so it is never part of the title's accessible name and stays visible when closed. `actions` and `footer` render only when passed.

Markup:

- The root is a `section` made by the COSS `Collapsible` through `render`; `aria-labelledby` points at the `h2` that wraps the trigger, so the region is named by the title.
- Editability belongs to the value: a `properties` component in a row is read-only or editable through its own props, and `RecordGroupRow` stays presentation.
- `RecordGroupAction` has no tooltip: `label` is its only accessible name and the icon is `aria-hidden`.
- No default copy: every label is a prop.

## Styling

The pattern sets these attributes and styles none of them through a variant:

| Attribute | Where |
| --- | --- |
| `data-slot="record-group"`, `data-variant="plain\|card"`, `data-empty="true"` | the `section`; `data-variant` always, `data-empty` only when `empty` |
| `data-slot="record-group-header"`, `record-group-actions`, `record-group-content`, `record-group-footer` | the header, the actions wrapper, the rows wrapper and the footer wrapper |
| `data-slot="record-group-row"`, `data-align="start\|between"` | every row |
| `data-slot="record-group-row-label"`, `record-group-row-value` | the two cells of a row |

- Alignment and emptiness reach the classes through the `cva` variants, and the group variant through `cn` in `recordGroupClassName`; no class is keyed on `data-align`, `data-empty` or `data-variant`.
- The title is never truncated: it wraps inside the header, so a long title never pushes `actions` out, and the region and the trigger keep it as their name.
- The row label is capped at a Tailwind scale step: fixed in `start`, a maximum in `between`, and it truncates past it.
- `between` rows are a two-track grid: the label track takes what the value leaves and truncates first, but keeps a floor so a long value never crushes it onto the leading icon; past the floor the value shrinks inside its cell, and the row never overflows horizontally.
- `start` fixes the label column in `recordGroupRowLabelVariants`, so every row shares one width whatever its label length.
- The chevron rotates from the trigger's own `data-panel-open` (`group-data-panel-open/trigger:`), set by Base UI.
- `scripts/override-exceptions.json` has no entry here: the trigger is an unstyled Base UI part and `Button` and `CollapsiblePanel` get no color, radius or border class.

## Verify

```bash
bun test --isolate packages/parttens/src/record-group
bunx biome check packages/parttens/src/record-group
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook src/patterns/record-group
```

The stories are in `apps/storybook/src/patterns/record-group/`, with a `!dev` `<Story>Interaction` twin each, and run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `record-group` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (`record-group/`). Proposal: issue #81.
