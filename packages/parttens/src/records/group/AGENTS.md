# Record group pattern

A controlled, collapsible group of rows for record surfaces: `RecordGroup` (a titled `section` with an optional `actions` slot and `footer`), `RecordGroupRow` (a label, an optional leading icon and a value), `RecordGroupItem` (an icon, a title and a trailing control), `RecordGroupLink` (a row that is a link to another record or a document), `RecordGroupSubgroup` (a collapsible subitem inside a group), `RecordGroupMetrics` and `RecordGroupMetric` (a grid of indicator tiles) and `RecordGroupAction` (an icon button for the `actions` slot). The consumer passes the rows, the copy, the link targets and the collapse state when it wants to control it. The pattern never fetches, navigates, edits a value or ships CSS; its only state is the uncontrolled collapse.

## Map

| Folder | Holds |
| --- | --- |
| `composition/record-group/` | `RecordGroup` on the COSS `Collapsible` and its barrel |
| `composition/record-group-row/` | `RecordGroupRow` and its barrel |
| `composition/record-group-action/` | `RecordGroupAction` on the COSS `Button` and its barrel |
| `composition/record-group-item/` | `RecordGroupItem` and its barrel |
| `composition/record-group-link/` | `RecordGroupLink` on Base UI `useRender` and its barrel |
| `composition/record-group-metrics/` | `RecordGroupMetrics`, the tile grid, and its barrel |
| `composition/record-group-metric/` | `RecordGroupMetric` on the COSS `Card` and `Meter` and its barrel |
| `composition/record-group-subgroup/` | `RecordGroupSubgroup` on the COSS `Collapsible` and its barrel |
| `lib/` | `variants.ts`: the group class helper (`cn`), the `cva` variants of the content, of the row, label and value and of the metrics grid; `metric-progress.ts`: the progress clamp |
| `core.ts` | React-free surface: the prop types; workspace only, not reached from the barrel except as types |

Import direction: `composition/` → `lib/`, `core.ts`. `RecordGroupLink` imports `@base-ui/react/use-render` and `merge-props` directly, as `KanbanCard` does, and `core.ts` takes its props type from there. Outgoing: `@tc96/ui/card` for the card and the metric tile, `@tc96/ui/meter` for the metric progress. Outgoing, by file path into `properties`: `shared/property-catalog.ts` (`PropertyIcon`), imported by `core.ts` as a type. The registry ships that file with the `record-group` item.

## Dependents

- `packages/parttens/src/index.ts` re-exports `records/group/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `records/group` for the registry item `record-group`. Renaming the folder breaks the registry and the pattern test run.
- `packages/registry/src/manifest.test.ts` asserts the built item ships `parttens/src/properties/shared/property-catalog.ts`.
- `checklist/lib/variants.ts` reads two CSS variables that the content wrapper sets, in `plain`: `--record-group-hover-offset` (`checklistItemVariants`) and `--record-group-row-height` (`checklistRowVariants`, `md`). They are strings in classes, not imports, so renaming either here breaks the checklist without a type error.

## Invariants

Collapse:

- Controlled when `open` is passed, otherwise uncontrolled from `defaultOpen`. `onOpenChange` runs in both modes; in controlled mode the group does not change until `open` does.
- With `empty` the group starts closed whatever `defaultOpen` says. Only the `empty` flip from `true` to `false` opens it, tracked while rendering; a manual collapse after the flip survives re-renders. The flip does not call `onOpenChange`, a flip back to `true` leaves the state alone, and `empty` never overrides a controlled `open`.
- `empty` also drops the vertical padding of the content and leaves its text at the start, set by the owner on 2026-10-18 (before, it centered the content with `py-6`); the footer, when the user opens an empty group, renders below it.

Footer and actions:

- The footer lives inside `CollapsiblePanel`: it hides with the body, and a closed panel is unmounted, so the footer is not focusable and not in the accessibility tree. Use `actions` for controls that must stay visible when the group is closed.
- Unmounting waits for the 200ms height transition, and Base UI leaves the panel focusable until then (measured in Chromium: the panel is mounted with `data-closed` and a running animation, and a footer button takes focus). The panel therefore gets `inert` as soon as the group is not open; `FooterClosingInteraction` checks focus and `inert` during the transition and the unmount after it.
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
- It has no catalog story: the owner removed `Subgroups` from the catalog on 2026-10-15, and no usage story uses it. Its only coverage is the behavior plays of `Patterns/Records/Group/Composition/Subgroup`, which run axe but do not assert the chevron and content alignment with the row labels.

Metrics:

- `RecordGroupMetric` is its own `dl`, like `RecordGroupRow`, wrapping the `Card`: the `Card` is the `div` that groups the `dt` and the `dd`s, so it keeps `data-slot="card"` and the consumer's card radius. The icon sits in the `dt`, `aria-hidden`.
- The pattern never formats or computes a number: `value` and `target` are nodes, and `progress` is a ratio the consumer computes (leads over planned leads). The pattern only clamps it to 0..1, a non-finite ratio to 0, and passes it to the `Meter` as a percent, named by the label through `aria-labelledby`.
- `target` is muted text after the value (the planned amount or a unit); the pattern adds no separator, so the copy carries it (`de 120 planejados`).

Markup:

- When a `RecordGroupRow` has `leading`, its value cell hides every `[data-slot=property-icon]` (the `leading` axis of `recordGroupRowValueVariants`), so the icon sits on the label and not on the value too. A control's own icon in a popup or dropdown is outside the cell and stays. The selector is the `properties` data contract; the group imports nothing from `properties` at runtime.
- Each `RecordGroupRow` is its own `dl` wrapping a `dt` (label) and a `dd` (value), so a screen reader associates them. A `dd` hosts a `properties` editor and the editor keeps its own `ariaLabel` as name.
- The body (`record-group-content`) is a `div`, empty or not, because it also holds links, items, subgroups and a `Checklist`, which a `dl` does not accept. A row is valid anywhere: in the body, in a subgroup or in a preview.
- The root is a `section` made by the COSS `Collapsible` through `render`; `aria-labelledby` points at the `h2` that wraps the trigger, so the region is named by the title.
- Editability belongs to the value: a `properties` component in a row is read-only or editable through its own props, and `RecordGroupRow` stays presentation.
- `RecordGroupAction` has no tooltip: `label` is its only accessible name and the icon is `aria-hidden`.
- No default copy: every label is a prop.

## Styling

The pattern sets these attributes and styles none of them through a variant:

| Attribute | Where |
| --- | --- |
| `data-slot="record-group"`, `data-variant="plain\|card\|inset"`, `data-empty="true"` | the `section`; `data-variant` always, `data-empty` only when `empty` |
| `data-slot="card"` | the COSS `Card`: in `card` the only child of the `section`, wrapping header and panel; in `inset` the wrapper of `record-group-content` only; none in `plain` |
| `data-slot="record-group-header"`, `record-group-actions`, `record-group-content`, `record-group-footer` | the header, the actions wrapper, the body (a `div`) and the footer wrapper |
| `data-actions-align="between\|start"` | the header, always |
| `data-slot="record-group-row"`, `data-align="start\|between"` | every row, a `dl` |
| `data-slot="record-group-row-label"`, `record-group-row-value` | the `dt` and the `dd` of a row |
| `data-slot="record-group-item"`, `record-group-item-title`, `record-group-item-trailing` | the list row, its title and the trailing control wrapper |
| `data-slot="record-group-link"`, `record-group-link-name`, `record-group-link-meta` | the link row and its two text cells |
| `data-slot="record-group-metrics"`, `record-group-metric`, `record-group-metric-value`, `record-group-metric-target`, `record-group-metric-progress` | the grid, the tile `dl`, the value `dd`, the target inside it and the meter `dd` |
| `data-slot="record-group-subgroup"`, `record-group-subgroup-meta`, `record-group-subgroup-content` | the subgroup, the meta inside its trigger and its rows wrapper |

- Alignment, the header `actionsAlign` and emptiness reach the classes through the `cva` variants, and the group variant through `cn` in `recordGroupClassName` (`gap-1` for `inset`) and in `recordGroupHeaderClassName` (`px-1` for `inset` only, so `plain` and `card` share the base header); the frame is `Card`, and `recordGroupContentVariants` keeps only the `empty` axis; no class is keyed on `data-align`, `data-actions-align`, `data-empty` or `data-variant`.
- The title is never truncated: it wraps inside the header, so a long title never pushes `actions` out, and the region and the trigger keep it as their name.
- The row label is capped at one Tailwind scale step: fixed in `start`, a maximum in `between`, and it truncates past it. `start` is `w-28` (112px), set by the owner on 2026-10-14: it fits labels up to about 15 characters without `leading`, and longer ones truncate (issue #129 had asked for 20, which needed `w-36`); `leading` sits inside the column and takes 24px of it (icon and gap). `Default Interaction` and the `Briefing`, `Versions` and `Details` usages assert that every label is whole, so their fixture labels stay within 112px (88px with `leading`); `LongLabelStartInteraction` asserts the truncation (issue #176).
- `between` rows are a two-track grid: the label track takes what the value leaves and truncates first, but keeps a floor so a long value never crushes it onto the leading icon; past the floor the value shrinks inside its cell, and the row never overflows horizontally.
- `start` fixes the label column in `recordGroupRowLabelVariants`, so every row shares one width whatever its label length.
- `RecordGroupSubgroup` aligns its chevron with the row labels (the row padding variable) and indents its content by `ps-5`, so a row label inside it starts under the subgroup title, in every variant.
- `RecordGroup` wraps `Card`, it does not become it: the `section` keeps `data-slot="record-group"` and the card keeps `data-slot="card"`. `className` styles the `section`, not the visible card, so a per-instance radius goes through `[--card-radius:...]`, which the card inherits when the consumer theme reads it. `lib/variants.ts` carries no `rounded-*` or `border`.
- The `card` and `inset` shells are flat muted panels, set by the owner on 2026-10-15: `recordGroupShellClassName` (`bg-muted/72 p-3 shadow-none before:hidden`) goes on both `Card` uses, so the drop shadow and the `before:` highlight (also a shadow) are gone, and the border and radius stay the `Card`'s. The `card` header carries no `px-1`, since the shell's `p-3` already insets it; the `px-1` of the trigger and of the content wrapper is unchanged and adds to the `p-3`.
- `inset` keeps the header and footer outside the card and frames only the rows wrapper, with the same `px-1 py-1` gutter, `gap-0.5` and unpadded rows as `card` (the content wrapper classes are one shared constant, set by the owner on 2026-10-15), and no divider between rows.
- `RecordGroupRow`, `RecordGroupItem`, `RecordGroupLink` and the `RecordGroupSubgroup` trigger share one row box and the half-row cap of the trailing part, so they line up in one group. The box is three CSS variables set by the content wrapper, read through `recordGroupRowHeightClassName`, `recordGroupRowPaddingClassName` and `recordGroupRowGapClassName` (also the gap of the subgroup content): `inset` and `card` set 32px and `gap-0.5` with no row padding (the shell's `p-3` insets the rows; 36px until the owner lowered it on 2026-10-18), and `plain` sets only the 32px height, so a `Checklist` `plain` row, whose own fallback is 36px, follows the group (set by the owner on 2026-10-15); the fallbacks are 32px, no padding and no gap. No variant defines `--record-group-row-padding` any more, so `RecordGroupRow`, `RecordGroupItem`, `RecordGroupLink` and the subgroup trigger, which all read it, use its `0px` fallback. A row outside any group, such as in a `RecordPreview` body, therefore matches `plain`.
- `plain` has no horizontal gutter at all: the header, the trigger, the content wrapper and the rows carry no `px`, so the chevron, the titles and the row labels share the group's left edge. `inset` keeps `px-1` on the header, the trigger and the content wrapper, and `card` on the trigger and the content wrapper.
- The hover of `RecordGroupLink` and of the `Checklist` `plain` rows is offset by 8px on the inline axis, set by the owner on 2026-10-15: `recordGroupLinkOffsetClassName` gives the link `-mx-2` and adds the same 8px to its padding, both from `--record-group-hover-offset`, which the content wrapper sets in every variant; the fallback is `0px`, so a link outside a group has no offset. The icon and the name keep the group's left edge. The `CollapsiblePanel` is `overflow-hidden` and would clip the offset hover, so `recordGroupPanelClassName` gives it `-mx-2 px-2` in `plain` and `card`; its content box does not move. `inset` needs no panel class: its offset stays inside the shell's padding, which is inside the panel. The offset and the panel class are the same 8px and change together. `Checklist` `plain` reads the same variable on its `li` (`-mx-[var(--record-group-hover-offset,0px)]`), keeping its own `px-2` on the row, so its checkbox lines up with the icon of a `RecordGroupItem`; outside a group the variable is unset and the margin is 0.
- The metric tile is the `Card` with `recordGroupMetricShellClassName` (`h-full gap-2 border-0 p-3 shadow-none before:hidden`), no color and no border, set by the owner on 2026-10-20, so it needs no override exception (`border-0` is neutral); the tile reads only by the `bg-card` fill; `h-full` evens the tiles of a grid row. The grid has no padding, and a content wrapper that holds it drops its own (`has-[[data-slot=record-group-metrics]]:p-0` in `recordGroupContentVariants`), set by the owner on 2026-10-20, so the tiles sit on the shell's `p-3` in `card` and `inset` and on the group's edge in `plain`; rows in the same group lose the `px-1` too. The `Meter` keeps its COSS track and indicator classes.
- The chevron rotates from the trigger's own `data-panel-open` (`group-data-panel-open/trigger:`), set by Base UI.
- `scripts/override-exceptions.json` has one entry here: `Card` with `bg-muted/72` in `record-group.tsx`. `shadow-none` and `before:hidden` are neutral and `p-3` is not an override rule. The trigger is an unstyled Base UI part and `Button` and `CollapsiblePanel` get no color, radius or border class.

## Verify

```bash
bunx biome check packages/parttens/src/records/group
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/records/group
```

The stories are in `apps/storybook/src/patterns/records/group/`, one file per theme under `Patterns/Records/Group/`, with a `!dev` `<Story>Interaction` twin each, and run axe with `test: 'error'`. `record-group.stories.tsx` (`Patterns/Records/Group`) is the root with the `Doc` page: a `Default` story with controls for the root props, the `Empty` story for `empty` (without a footer, at the owner's request on 2026-10-17, so the footer below an empty body is checked only by `FooterFollowsBodyOfOpenedEmptyGroup` in `composition/group-collapse.stories.tsx`), and the `usage` and `api` docs parameters that render its Usage and API Reference sections; update `api` when a part is added, removed or changes its element or slot. `rows.stories.tsx` (`Rows`) covers the label and value layout (`start`, `between`, long labels and values), `header-and-footer.stories.tsx` (`Header and Footer`) the title, `actions` and `footer`, `properties.stories.tsx` (`Properties`) read-only and editable values. `card` has no story of its own since 2026-10-17, at the owner's request: the `variant` control on the root `Default` shows it, and only the class checks of `composition/group-layout.stories.tsx` assert its surface. The theme stories set `component: RecordGroup` and pass the rows as JSX in `args.children`, with no demo component, so the Code panel shows code the consumer can copy; the controls come from `recordGroupArgTypes` in `apps/storybook/src/test-utils/story-arg-types.ts`, because `react-docgen` does not type these props. The row selectors they share are in `fixtures/group-dom.ts`; `fixtures/group-demo.tsx` only feeds the root render. `lists.stories.tsx` (`Patterns/Records/Group/Lists`) covers `RecordGroupItem` with a read-only property (`Default`), an editable property (`EditableProperty`) and an input (`WithInput`), in `plain` and `inset`, and `RecordGroupLink` in `Links`. `usages/blocks.stories.tsx` (`Patterns/Records/Group/Usages`) shows one group per job (Tasks, Triggers, Access, Briefing, Versions, Linked Records, Document, Empty, Billing, Details, Stage, Indicators, Activity, Notes) at 420px wide, the width of a record page footer, each written inside its story's `render`; every story takes the `variant` control from the meta (`recordGroupArgTypes.variant`, options in alphabetical order), `plain` by default and `inset` in Tasks, Activity and Notes, and its play runs only on that default; Notes opens the `NoteDialog` of `records/dialog/note-dialog.tsx`, imported by path; a record page composes the groups its use case needs.

Interface tests are `play` functions in `composition/` (`Patterns/Records/Group/Composition/...`): `Group Collapse` and `Group Layout` for `RecordGroup`, and `Row`, `Action`, `Item`, `Link`, `Metric`, `Metrics` and `Subgroup` for the parts; the pattern has no bun tests. Run them with `cd apps/storybook && bunx vitest run --project=storybook src/patterns/records/group/composition`.

## Pointers

- Public API: `index.ts` and the `record-group` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (`record-group/`). Proposal: issue #81.
