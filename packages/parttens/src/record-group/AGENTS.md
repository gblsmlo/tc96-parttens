# Record group pattern

A controlled, collapsible group of rows for record surfaces: `RecordGroup` (a titled `section` with an optional `actions` slot and `footer`), `RecordGroupRow` (a label, an optional leading icon and a value), `RecordGroupItem` (an icon, a title and a trailing control), `RecordGroupLink` (a row that is a link to another record or a document), `RecordGroupSubgroup` (a collapsible subitem inside a group) and `RecordGroupAction` (an icon button for the `actions` slot). The consumer passes the rows, the copy, the link targets and the collapse state when it wants to control it. The pattern never fetches, navigates, edits a value or ships CSS; its only state is the uncontrolled collapse.

## Map

| Folder | Holds |
| --- | --- |
| `composition/record-group/` | `RecordGroup` on the COSS `Collapsible`, its test and barrel |
| `composition/record-group-row/` | `RecordGroupRow`, its test and barrel |
| `composition/record-group-action/` | `RecordGroupAction` on the COSS `Button`, its test and barrel |
| `composition/record-group-item/` | `RecordGroupItem`, its test and barrel |
| `composition/record-group-link/` | `RecordGroupLink` on Base UI `useRender`, its test and barrel |
| `composition/record-group-subgroup/` | `RecordGroupSubgroup` on the COSS `Collapsible`, its test and barrel |
| `lib/` | `variants.ts`: the group class helper (`cn`) and the `cva` variants of the content and of the row, label and value |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: the prop types; workspace only, not reached from the barrel except as types |

Import direction: `composition/` → `lib/`, `core.ts`. `RecordGroupLink` imports `@base-ui/react/use-render` and `merge-props` directly, as `KanbanCard` does, and `core.ts` takes its props type from there. Outgoing, by file path into `properties`: `shared/property-catalog.ts` (`PropertyIcon`), imported by `core.ts` as a type. The registry ships that file with the `record-group` item.

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
- `actions` sits outside the trigger, so it is never part of the title's accessible name and stays visible when closed. `actions` and `footer` render only when passed.
- `actionsAlign="between"` (the default) spreads `actions` to the end of the header; `start` places them 8px after the title, for a command that belongs to the title, such as a ghost button. Either way the title still wraps and `actions` never shrinks.

Items:

- `RecordGroupItem` is the list row: the title is the subject, in ink, and truncates first; the trailing slot takes a read-only property, an editable property or an input and holds at most half the row. It is a `div`, never a link, because a link cannot contain a control; when the whole row opens another record, use `RecordGroupLink`.
- The item never knows its control: the control carries its own accessible name (`ariaLabel`, `aria-label`), as `SettingsRow` does.

Links:

- The whole row is the link: `RecordGroupLink` renders an `a` by default and the consumer's element (a router link, a `button`) through `render`, so the pattern never knows the router. Its accessible name is the name followed by `meta`. It sets `text-start`, so a `button` rendered through `render` keeps the name at the start instead of the button's centered default.
- `meta` is plain text on the right (status, role, or type and date); the pattern gives it no tone. The name truncates first; `meta` takes at most half the row and truncates past it.

Subgroups:

- `RecordGroupSubgroup` is a `div` with an `h3` that wraps the trigger, not a `region`: a group lists many subitems, and one landmark each would flood the landmark list. The `h3` assumes the parent `RecordGroup` `h2`.
- It starts closed (`defaultOpen` `false`, the opposite of `RecordGroup`): a subgroup exists to fold detail. `open` and `onOpenChange` pass straight to the `Collapsible`; there is no `empty`.
- `meta` sits inside the trigger, so a status badge and a date are read with the title.

Markup:

- The root is a `section` made by the COSS `Collapsible` through `render`; `aria-labelledby` points at the `h2` that wraps the trigger, so the region is named by the title.
- Editability belongs to the value: a `properties` component in a row is read-only or editable through its own props, and `RecordGroupRow` stays presentation.
- `RecordGroupAction` has no tooltip: `label` is its only accessible name and the icon is `aria-hidden`.
- No default copy: every label is a prop.

## Styling

The pattern sets these attributes and styles none of them through a variant:

| Attribute | Where |
| --- | --- |
| `data-slot="record-group"`, `data-variant="plain\|card\|inset"`, `data-empty="true"` | the `section`; `data-variant` always, `data-empty` only when `empty` |
| `data-slot="record-group-header"`, `record-group-actions`, `record-group-content`, `record-group-footer` | the header, the actions wrapper, the rows wrapper and the footer wrapper |
| `data-actions-align="between\|start"` | the header, always |
| `data-slot="record-group-row"`, `data-align="start\|between"` | every row |
| `data-slot="record-group-row-label"`, `record-group-row-value` | the two cells of a row |
| `data-slot="record-group-item"`, `record-group-item-title`, `record-group-item-trailing` | the list row, its title and the trailing control wrapper |
| `data-slot="record-group-link"`, `record-group-link-name`, `record-group-link-meta` | the link row and its two text cells |
| `data-slot="record-group-subgroup"`, `record-group-subgroup-meta`, `record-group-subgroup-content` | the subgroup, the meta inside its trigger and its rows wrapper |

- Alignment, the header `actionsAlign` and emptiness reach the classes through the `cva` variants, and the group variant through `cn` in `recordGroupClassName` and the `variant` axis of `recordGroupContentVariants`; no class is keyed on `data-align`, `data-actions-align`, `data-empty` or `data-variant`.
- The title is never truncated: it wraps inside the header, so a long title never pushes `actions` out, and the region and the trigger keep it as their name.
- The row label is capped at a Tailwind scale step: fixed in `start`, a maximum in `between`, and it truncates past it.
- `between` rows are a two-track grid: the label track takes what the value leaves and truncates first, but keeps a floor so a long value never crushes it onto the leading icon; past the floor the value shrinks inside its cell, and the row never overflows horizontally.
- `start` fixes the label column in `recordGroupRowLabelVariants`, so every row shares one width whatever its label length.
- `RecordGroupSubgroup` aligns its chevron with the row labels (`px-2`) and indents its content by `ps-5`, so a row label inside it starts under the subgroup title.
- `inset` keeps the header outside and frames the rows wrapper in a card (`rounded-lg border bg-card`), with the same `px-1 py-1` gutter and `gap-0.5` as `plain`, and no divider between rows.
- `RecordGroupItem` and `RecordGroupLink` share the row height (`min-h-9`), padding (`px-2`) and the half-row cap of the trailing part, so items, links and fields line up in one group.
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

The stories are in `apps/storybook/src/patterns/record-group/`, with a `!dev` `<Story>Interaction` twin each, and run axe with `test: 'error'`. `lists.stories.tsx` (`Patterns/RecordGroup/Lists`) covers `RecordGroupItem` with each trailing control (a `trailing` control on `Default`), in `plain` and `inset`, and `RecordGroupLink` in `Links`. `usages/blocks.stories.tsx` (`Patterns/RecordGroup/Usages`) shows one group per job (Tasks, Access, Briefing, Versions, Linked Records, Document, Document Empty, Billing, Details, Stage) at 420px wide, the width of a record page footer, with fixtures in `fixtures/blocks.tsx`; a record page composes the groups its use case needs.

## Pointers

- Public API: `index.ts` and the `record-group` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (`record-group/`). Proposal: issue #81.
