# Record group pattern

A controlled, collapsible group of rows for record surfaces: `RecordGroup` (a titled `section` with an optional `actions` slot and `footer`), `RecordGroupRow` (a label, an optional leading icon and a value), `RecordGroupItem` (an icon, a title and a trailing control), `RecordGroupLink` (a row that is a link to another record or a document), `RecordGroupSubgroup` (a collapsible subitem inside a group), `RecordGroupMetrics` and `RecordGroupMetric` (a grid of indicator tiles) `RecordGroupAction` (an icon button for the `actions` slot), `RecordGroupFilter` (an icon button for the `actions` slot that opens a filter and sort menu), `RecordGroupDivider` (a line between the children of a group) and `RecordStatusBadge` (the status badge every row uses). The consumer passes the rows, the copy, the link targets and the collapse state when it wants to control it. The pattern never fetches, navigates, edits a value or ships CSS; its only state is the uncontrolled collapse.

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
| `composition/record-group-filter/` | `RecordGroupFilter` on the COSS `Menu` and `Button`, and its barrel |
| `composition/record-group-divider/` | `RecordGroupDivider` on the COSS `Separator` and its barrel |
| `composition/record-status-badge/` | `RecordStatusBadge` on the COSS `Badge` and its barrel |
| `lib/` | `variants.ts`: the group class helper (`cn`), the panel overflow (`recordGroupPanelClassName`), the `cva` variants of the content, of the row, label and value and of the metrics grid; `metric-progress.ts`: the progress clamp |
| `core.ts` | React-free surface: the prop types; workspace only, not reached from the barrel except as types |

Import direction: `composition/` → `lib/`, `core.ts`. `RecordGroupLink` imports `@base-ui/react/use-render` and `merge-props` directly, as `KanbanCard` does, and `core.ts` takes its props type from there. Outgoing: `@tc96/ui/card` for the card and the metric tile, `@tc96/ui/meter` for the metric progress. Outgoing, by file path into `properties`: `shared/property-catalog.ts` (`PropertyIcon`), imported by `core.ts` as a type. The registry ships that file with the `record-group` item.

## Dependents

- `packages/parttens/src/index.ts` re-exports `records/group/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `records/group` for the registry item `record-group`. Renaming the folder breaks the registry and the pattern test run.
- `packages/registry/src/manifest.test.ts` asserts the built item ships `parttens/src/properties/shared/property-catalog.ts`.
- `checklist/components/checklist-group.tsx` imports `composition/record-group/record-group.tsx`, `composition/record-group-action/record-group-action.tsx` and `composition/record-group-filter/record-group-filter.tsx` by file path, and `checklist/types/index.ts` and `checklist/lib/filter.ts` import the `RecordGroupFilterProps` type from `core.ts`, (the `trigger` and `complete` variants of `Checklist`); moving or renaming either breaks the checklist.
- `checklist/lib/variants.ts` reads two CSS variables that the content wrapper sets, in `plain`: `--record-group-hover-offset` (`checklistItemVariants`) and `--record-group-row-height` (`checklistRowVariants`, `md`). They are strings in classes, not imports, so renaming either here breaks the checklist without a type error.

## Invariants

Collapse:

- Controlled when `open` is passed, otherwise uncontrolled from `defaultOpen`. `onOpenChange` runs in both modes; in controlled mode the group does not change until `open` does.
- `collapsible={false}` drops the `Collapsible`, as in `RecordGroupSubgroup`: the root is a plain `section` named by the `h2`, the `h2` holds the title with no button and no chevron, the body and `footer` are always rendered, and `open`, `defaultOpen`, `onOpenChange` and `chevron` are ignored. It is for a group that must stay visible, such as the body of a `RecordDialog`.
- `title` is optional. Without it there is no `h2`, no trigger and no `aria-labelledby`, so the `section` is not a named region and the user cannot fold it; the header renders only when `actions` is passed. Pair it with `collapsible={false}` when another element already names the content, as the accordion trigger does in `Project Setup` of `Patterns/Records/RecordDialog/Usages`.
- With `empty` the group starts closed whatever `defaultOpen` says. Only the `empty` flip from `true` to `false` opens it, tracked while rendering; a manual collapse after the flip survives re-renders. The flip does not call `onOpenChange`, a flip back to `true` leaves the state alone, and `empty` never overrides a controlled `open`.
- `empty` also drops the vertical padding of the content and leaves its text at the start, set by the owner on 2026-10-18 (before, it centered the content with `py-6`); the footer, when the user opens an empty group, renders below it.

Footer and actions:

- The footer lives inside `CollapsiblePanel`: it hides with the body, and a closed panel is unmounted, so the footer is not focusable and not in the accessibility tree. Use `actions` for controls that must stay visible when the group is closed.
- Unmounting waits for the 200ms height transition, and Base UI leaves the panel focusable until then (measured in Chromium: the panel is mounted with `data-closed` and a running animation, and a footer button takes focus). The panel therefore gets `inert` as soon as the group is not open; the root `Behavior` story checks focus and `inert` during the transition and the unmount after it.
- `actions` sits outside the trigger, so it is never part of the title's accessible name and stays visible when closed. `actions` and `footer` render only when passed.
- `actionsAlign="between"` (the default) spreads `actions` to the end of the header; `start` places them 8px after the title, for a command that belongs to the title, such as a ghost button. Either way the title still wraps and `actions` never shrinks.
- `chevron="start"` (the default) puts the chevron before the title; `end` puts it right after the title, inside the trigger, not at the header edge, so `actions` keep their place in both `actionsAlign` values. `RecordGroupSubgroup` takes the same prop, where `end` sits at the end of its full-width trigger.

Items:

- `RecordGroupItem` is the list row: the title is the subject, in ink, and truncates first; the trailing slot takes a read-only property, an editable property or an input and holds at most half the row. It is a `div`, never a link, because a link cannot contain a control; when the whole row opens another record, use `RecordGroupLink`.
- The item never knows its control: the control carries its own accessible name (`ariaLabel`, `aria-label`), as `SettingsRow` does.
- `interactive` (decided by the owner on 2026-11-19) is for an item whose title is a link or a button: the row takes the hover of `RecordGroupLink` (`hover:bg-accent`, the same 8px inline offset through `recordGroupLinkOffsetClassName`) and `data-interactive="true"`, while the action stays on the title control and a trailing control keeps its own. The row is still a `div`.
- The trailing slot of a layout row holds, in this order, the meta text (a date, an amount, a duration), a `RecordStatusBadge` and the three-dots menu, within half the row.
- `leading` of `RecordGroupItem` and `RecordGroupLink` sizes only a direct `svg` child (`[&>svg]:size-4`), so a `Checkbox` or an `IconFrame` in `leading` keeps its own icon size.

Links:

- The whole row is the link: `RecordGroupLink` renders an `a` by default and the consumer's element (a router link, a `button`) through `render`, so the pattern never knows the router. Its accessible name is the name followed by `meta`. It sets `text-start`, so a `button` rendered through `render` keeps the name at the start instead of the button's centered default.
- `meta` is plain text on the right (status, role, or type and date); the pattern gives it no tone. The name truncates first; `meta` takes at most half the row and truncates past it.

Subgroups:

- `RecordGroupSubgroup` is a `div` with an `h3` that wraps the trigger, not a `region`: a group lists many subitems, and one landmark each would flood the landmark list. The `h3` assumes the parent `RecordGroup` `h2`.
- It starts closed (`defaultOpen` `false`, the opposite of `RecordGroup`): a subgroup exists to fold detail. `open` and `onOpenChange` pass straight to the `Collapsible`; there is no `empty`.
- `count` sits right after the title in the trigger, `gap-1` away (the trigger gap), muted and `tabular-nums` (set by the owner on 2026-11-19); `meta` stays at the end of the trigger for a status or a date.
- `meta` sits inside the trigger, so a status badge and a date are read with the title.
- `chevron="end"` moves the chevron after `count` and `meta`, at the end of the trigger; `meta` and the end chevron share one trailing span, so the chevron stays next to `meta` instead of splitting the free space with it.
- `collapsible={false}` drops the `Collapsible`: the `h3` holds the title, `count` and `meta` with no button and no chevron, the content is always rendered, and `open`, `defaultOpen`, `onOpenChange` and `chevron` are ignored. It is for a child of a grouped group (`RecordGroupDivider` between subgroups) that must stay visible.
- The panel is `overflow-hidden` for the height transition, so it takes `-mx` and `px` of `--record-group-hover-offset` (`recordGroupSubgroupPanelClassName`): a `RecordGroupLink` or an `interactive` item inside keeps its 8px hover offset unclipped, as in the group panel.
- It has no catalog story: the owner removed `Subgroups` from the catalog on 2026-10-15, and no usage story uses it. Its coverage is the `Subgroup …` plays of `Patterns/Records/Group/Behavior` (`behavior/subgroup.stories.tsx`), which run axe and assert the end chevron position and the content of a non-collapsible subgroup starting under its title, but not the start chevron alignment with the row labels; the arrangements of `Patterns/Records/Group/Layouts` that hold subgroups (`Finance Grouped`, `Relations`, `Court With Properties`, `Service Grouped`, `Tasks Grouped`) are opened and checked by the `… Rows Fit` plays.

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
- In the layout stories every add action uses `PlusIcon` (set by the owner on 2026-11-19), whether it is a `RecordGroupAction` or a `+` that opens a menu of types; `label` says what it adds.

Divider:

- `RecordGroupDivider` splits a group into children (decided by the owner on 2026-11-19): a group whose children are `RecordGroupSubgroup`s puts one divider between each pair, as in `Finance Grouped` of `Patterns/Records/Group/Layouts`. It is the COSS `Separator`, horizontal, `my-1` on top of the row gap, in the theme `border` color, and not focusable. The children carry no actions: the only trigger stays in the parent header, a `+` whose menu lists the types the group can add.

Filter:

- `RecordGroupFilter` is the default filter of every group (decided by the owner on 2026-11-19): an icon button for `actions`, named by `label`, that opens a COSS `Menu` with a checkbox group (`filterOptions`) and a radio group (`sortOptions`); each section renders only when its options are passed, and `label` also names the menu popup (`role="menu"`). The owner moved it from a `Popover` with `fieldset`, `Checkbox` and `RadioGroup` to the `Menu` on 2026-11-23, to follow `UI/Menu/Usages/View Settings`: each section is a `MenuGroup` named by its `MenuGroupLabel` (Base UI wires `aria-labelledby`), the options are `MenuCheckboxItem`s and `MenuRadioItem`s, and a `MenuSeparator` sits between consecutive groups. Checkbox and radio items do not close the menu (`closeOnClick` is `false` by default in Base UI for both); `Escape` closes it and returns focus to the trigger. The menu keeps Base UI's default `modal`. The sort radio group is a nested `role="group"` of the sort `MenuGroup`, so a filter with a sort holds two groups for it, and only the outer one is named.
- It is controlled and applies nothing: `onFilterChange` returns the checked values in option order and `onSortChange` the chosen value; `sections` adds more checkbox lists (one `MenuGroup` each, with its own label, options, value and `onChange`) after the `filterOptions` list (issue #343); the consumer filters and sorts the rows it passes, and passes `empty` when none is left. No default copy: `label`, `filterLabel`, `sortLabel` and every option label are props.

Status:

- `RecordStatusBadge` is the single source of a status in a row (decided by the owner on 2026-11-19): one size (the COSS `Badge` default), `children` as the text and an optional `color`, any CSS color, usually a theme token such as `var(--success-foreground)`. With `color` the background is the color at 8% and the text is the color mixed 90% with `--foreground`, so a `--warning-foreground` status reaches 4.5:1 on the tint; without it the badge is the neutral `secondary`. The consumer maps each status to a color and passes the same color to the row `IconFrame`.
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
| `data-interactive="true"` | an `interactive` `RecordGroupItem`; not styled |
| `data-slot="record-group-link"`, `record-group-link-name`, `record-group-link-meta` | the link row and its two text cells |
| `data-slot="record-group-metrics"`, `record-group-metric`, `record-group-metric-value`, `record-group-metric-target`, `record-group-metric-progress` | the grid, the tile `dl`, the value `dd`, the target inside it and the meter `dd` |
| `data-slot="record-group-filter"`, `record-group-filter-options`, `record-group-filter-sort` | the `MenuPopup` of `RecordGroupFilter`, each checkbox `MenuGroup` and the sort `MenuGroup`; `MenuPopup` and `MenuGroup` spread their props after their own slot, so these replace `menu-popup` and `menu-group`, as `MenuSubPopup` does with `menu-sub-content`; no CSS or story selects those two slots here |
| `data-record-group-divider` | the `Separator` of `RecordGroupDivider`, which keeps `data-slot="separator"`; not styled |
| `data-color="custom\|neutral"` | the `Badge` of `RecordStatusBadge`, `custom` when `color` is passed; the `Badge` keeps `data-slot="badge"` |
| `data-slot="record-group-subgroup"`, `record-group-subgroup-count`, `record-group-subgroup-meta`, `record-group-subgroup-content` | the subgroup, the meta inside its trigger and its rows wrapper |

- Alignment, the header `actionsAlign` and emptiness reach the classes through the `cva` variants, and the group variant through `cn` in `recordGroupClassName` (`gap-1` for `inset`) and in `recordGroupHeaderClassName` (`px-1` for `inset` only, so `plain` and `card` share the base header); the frame is `Card`, and `recordGroupContentVariants` keeps only the `empty` axis; no class is keyed on `data-align`, `data-actions-align`, `data-empty` or `data-variant`.
- The title is never truncated: it wraps inside the header, so a long title never pushes `actions` out, and the region and the trigger keep it as their name.
- The row label is capped at one Tailwind scale step: fixed in `start`, a maximum in `between`, and it truncates past it. `start` is `w-28` (112px), set by the owner on 2026-10-14: it fits labels up to about 15 characters without `leading`, and longer ones truncate (issue #129 had asked for 20, which needed `w-36`); `leading` sits inside the column and takes 24px of it (icon and gap). `Row Start Labels Share One Column` in `Patterns/Records/Group/Behavior` and the `Details` usage assert that every short label is whole, so their fixture labels stay within 112px (88px with `leading`), and the `Briefing` and `Versions` usages keep labels of that length; the same Behavior story also asserts the truncation of a long one (issue #176).
- `between` rows are a two-track grid: the label track takes what the value leaves and truncates first, but keeps a floor so a long value never crushes it onto the leading icon; past the floor the value shrinks inside its cell, and the row never overflows horizontally.
- `start` fixes the label column in `recordGroupRowLabelVariants`, so every row shares one width whatever its label length.
- `RecordGroupSubgroup` aligns its chevron with the row labels (the row padding variable); its content carries no indent, so a row label inside it starts at the chevron, in every variant.
- `RecordGroup` wraps `Card`, it does not become it: the `section` keeps `data-slot="record-group"` and the card keeps `data-slot="card"`. `className` styles the `section`, not the visible card, so a per-instance radius goes through `[--card-radius:...]`, which the card inherits when the consumer theme reads it. `lib/variants.ts` carries no `rounded-*` or `border`.
- The `card` and `inset` shells are flat muted panels, set by the owner on 2026-10-15: `recordGroupShellClassName` (`bg-muted/72 p-3 shadow-none before:hidden`) goes on both `Card` uses, so the drop shadow and the `before:` highlight (also a shadow) are gone, and the border and radius stay the `Card`'s. The `card` header carries no `px-1`, since the shell's `p-3` already insets it; the `px-1` of the trigger and of the content wrapper is unchanged and adds to the `p-3`.
- `inset` keeps the header and footer outside the card and frames only the rows wrapper, with the same `px-1 py-1` gutter, `gap-1` and unpadded rows as `card` (the content wrapper classes are one shared constant, set by the owner on 2026-10-15), and no divider between rows.
- `RecordGroupRow`, `RecordGroupItem`, `RecordGroupLink` and the `RecordGroupSubgroup` trigger share one row box and the half-row cap of the trailing part, so they line up in one group. The box is three CSS variables set by the content wrapper, read through `recordGroupRowHeightClassName`, `recordGroupRowPaddingClassName` and `recordGroupRowGapClassName` (also the gap of the subgroup content): every variant sets the 4px gap (`gap-1`, set by the owner on 2026-11-19; `inset` and `card` had `gap-0.5` and `plain` none), `inset` and `card` set 32px with no row padding (the shell's `p-3` insets the rows; 36px until the owner lowered it on 2026-10-18), and `plain` sets the 32px height too, so a `Checklist` `plain` row, whose own fallback is 36px, follows the group (set by the owner on 2026-10-15); the fallbacks are 32px, no padding and no gap. No variant defines `--record-group-row-padding` any more, so `RecordGroupRow`, `RecordGroupItem`, `RecordGroupLink` and the subgroup trigger, which all read it, use its `0px` fallback. A row outside any group, such as in a `RecordPreview` body, therefore matches `plain`.
- `plain` has no horizontal gutter at all: the header, the trigger, the content wrapper and the rows carry no `px`, so the chevron, the titles and the row labels share the group's left edge. `inset` keeps `px-1` on the header, the trigger and the content wrapper, and `card` on the trigger and the content wrapper.
- The hover of `RecordGroupLink` and of the `Checklist` `plain` rows is offset by 8px on the inline axis, set by the owner on 2026-10-15: `recordGroupLinkOffsetClassName` gives the link `-mx-2` and adds the same 8px to its padding, both from `--record-group-hover-offset`, which the content wrapper sets in every variant; the fallback is `0px`, so a link outside a group has no offset. The icon and the name keep the group's left edge. The COSS `CollapsiblePanel` is `overflow-hidden`; `recordGroupPanelClassName` replaces that with `overflow-x-visible overflow-y-clip` in every variant (set by the owner on 2026-11-23), so the height transition still clips vertically while content may paint past the inline edges: the `Checklist` drag handle sits 36px outside its row, on the left, and stays visible. `overflow: clip` on one axis keeps `visible` on the other (with `hidden` it would compute to `auto`), so the panel never becomes a scroll container. It also gets `-mx-2 px-2` in `plain` and `card`, from when the panel clipped the offset hover; its content box does not move. `inset` needs no panel class: its offset stays inside the shell's padding, which is inside the panel. The offset and the panel class are the same 8px and change together. `Checklist` `plain` reads the same variable on its `li` (`-mx-[var(--record-group-hover-offset,0px)]`), keeping its own `px-2` on the row, so its checkbox lines up with the icon of a `RecordGroupItem`; its drag handle is absolute, outside the row, and adds no indent. Outside a group the variable is unset and the margin is 0.
- The metric tile is the `Card` with `recordGroupMetricShellClassName` (`h-full gap-2 border-0 p-3 shadow-none before:hidden`), no color and no border, set by the owner on 2026-10-20, so it needs no override exception (`border-0` is neutral); the tile reads only by the `bg-card` fill; `h-full` evens the tiles of a grid row. The grid has no padding, and a content wrapper that holds it drops its own (`has-[[data-slot=record-group-metrics]]:p-0` in `recordGroupContentVariants`), set by the owner on 2026-10-20, so the tiles sit on the shell's `p-3` in `card` and `inset` and on the group's edge in `plain`; rows in the same group lose the `px-1` too. The `Meter` keeps its COSS track and indicator classes.
- The trailing wrapper of `RecordGroupItem` has `gap-1`, set by the owner on 2026-11-19, so a label next to a menu button keeps 4px between them; a single control is unaffected.
- The footer wrapper has `py-2` and no inline padding or margin, set by the owner on 2026-11-19: it is as wide as the header and the body in every variant, and the footer content starts at the group edge.
- The chevron rotates from the trigger's own `data-panel-open` (`group-data-panel-open/trigger:`), set by Base UI.
- `scripts/override-exceptions.json` has one entry here: `Card` with `bg-muted/72` in `record-group.tsx`. `shadow-none` and `before:hidden` are neutral and `p-3` is not an override rule. The trigger is an unstyled Base UI part and `Button` and `CollapsiblePanel` get no color, radius or border class.

## Verify

```bash
bunx biome check packages/parttens/src/records/group
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/records/group
```

The stories are in `apps/storybook/src/patterns/records/group/` and run axe with `test: 'error'`, on the six pages of `Patterns/Records/Group` (moved on 2026-11-22; the structure is in `Get Started/Component Docs`). `api-reference.mdx` is the API Reference, one section per part, attached to the hidden `api-reference.stories.tsx`, whose anatomy stories (`Anatomy` for the shell, then rows, items, links, subgroup and metric) keep the slot-order plays, the shell one also checking that the footer is as wide as the header and the body; update the page when a part is added, removed or changes its element, slot or `data-*`. `playground.stories.tsx` and `stories.stories.tsx` render `ComposedRecordGroup` (`record-group-layouts.tsx`, a details group of `RecordGroupRow`s) with the args of `record-group-controls.ts`; Stories has one value per `variant`, `actionsAlign`, `chevron`, `empty` and `defaultOpen`. Behavior is `behavior.stories.tsx` (the title wrapping beside the action, actions while closed, the footer `inert` during the transition and gone after it, an empty group opening with its text at the start, and a `plain` `Checklist` taking the 32px row) plus `behavior/`, one file per part (`group-collapse`, `group-layout`, `rows`, `items`, `link`, `subgroup`, `metric`, `metrics`, `action`, `filter`, `divider`, `status-badge`) and `arrangements.stories.tsx`, whose `… Rows Fit` plays render each arrangement, open its subgroups and check that no row overflows its group, subgroup headings fit and tinted badges carry their color. Layouts is `layouts.stories.tsx`, one story per arrangement, rendering the group compositions of `layouts/*.tsx` (support modules, not story files; `behavior/` imports them too): property rows, items, links and metrics, then the arrangements modeled on the Lemind record pages, with menus and a `RecordGroupFilter` where the use case needs them, whose filter and sort live in the story state since the pattern never filters or sorts: `Documents` (`RecordGroupLink` rows for files, and for a file, a bookmark, an external link and a note in `Mixed Documents`; `Documents With Menu` uses `RecordGroupItem` with a link title and a three-dots menu, since a link row cannot hold a button), `Tasks` (`RecordGroupItem` rows with the checkbox in `leading`; `Tasks Agenda` mixes them with deadline and event `RecordGroupLink` rows whose `IconFrame` `xs` keeps every name on one column; `Tasks Grouped` has `Prazos`, `Audiências e eventos` and `Tarefas` subgroups), `Finance` (generic `Summary` totals as `between` rows, `Entries` as links with an `IconFrame` whose icon is the direction and whose color is the situation token and an amount and situation badge in `meta`, with menu and filter; specific `Installments` of a contract and `Expenses` of a case with reimbursement totals as rows in the `footer`; `Finance Grouped` is one group of collapsible subgroups split by `RecordGroupDivider`, with `Horas`, `Valores e provisão` and `Reembolsos`), `Feed` (publications and movements as `RecordGroupLink` rendered as a `button` that opens a reader `Dialog`, unread state as a `font-medium` `text-primary` title and a read one in `text-muted-foreground`, with no dot and no `leading`, filter and paging in the `footer`), `Activity` (sentence rows with a 24px `Avatar` and a relative `time`, phase history, filter, paging), `Timesheet` (hour totals, entries with a billing `RecordStatusBadge`, menu and filter with a footer total), `Parties` (representatives as an indented list under each party, not a `RecordGroupSubgroup`, whose trigger cannot hold the contact link or the menu), `Affiliations` (links with the job title in `meta` and the state badge), `Relations` (typed links in `RecordGroupSubgroup`s with a `count`, a `+` menu of the types to link, proceedings named by case number and apensos), `Events` (modality icon and state badge, menu by modality and state), `Matter Grouped` (the parties of the lawsuit, with a `+` for a person or a company and a filter by pole), `Court` (number as the link name, role and stage in `meta`, the court in the accessible name and `title`; `Court With Properties` gives each proceeding a subgroup of `SelectProperty` rows) and `Service` (`Atendimentos` and `Notas` subgroups with a channel `IconFrame` and the channel as hidden text in the link). Row selectors are in `fixtures/group-dom.ts`. `usages.stories.tsx` (`Patterns/Records/Group/Usages`) shows one group per job (Tasks, Triggers, Access, Briefing, Versions, Linked Records, Document, Empty, Billing, Details, Stage, Indicators, Activity, Notes) at 420px wide, the width of a record page footer, each written inside its story's `render`, `plain` except `inset` in Tasks, Activity and Notes, with a light play that leaves the story as rendered; Notes opens the `NoteDialog` of `records/dialog/note-dialog.tsx`, imported by path; `Patterns/Checklist` links to its Tasks story.

Interface tests are the `play` functions of `Patterns/Records/Group/Behavior` (`behavior.stories.tsx` and `behavior/`) and the anatomy plays of the hidden API Reference stories; the pattern has no bun tests. Run them with `cd apps/storybook && bunx vitest run --project=storybook src/patterns/records/group`, then with `--project=storybook-dark`.

## Pointers

- Public API: `index.ts` and the `record-group` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (`record-group/`). Proposal: issue #81.
