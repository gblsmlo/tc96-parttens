# Icon row pattern

`IconRow`: one row of an `IconFrame` with the icon, a title, an optional description and an optional `actions` slot at the end. It serves three uses through `render`: a static `div` with buttons or a menu in `actions`, a whole-row link or button (a call to action, with a chevron in `actions`), and a choice, where the row is the `label` of the COSS `Radio` or `Checkbox` placed in `actions` inside a `RadioGroup` or `CheckboxGroup`. The consumer passes every text, the element, the handlers and the group state; the pattern never fetches, navigates, checks or ships CSS, and keeps no state.

## Map

| Folder | Holds |
| --- | --- |
| `composition/icon-row/` | `IconRow` on Base UI `useRender`, with the own `@tc96/ui/icon-frame` and `@tc96/ui/text` |
| `lib/` | `variants.ts`: the row `cva` by variant and the content, description and actions classes |
| `core.ts` | React-free surface: `iconRowVariants` and the props type, whose `render` type comes from `@base-ui/react/use-render` |

Import direction: `composition/` → `lib/`, `core.ts`. No import into another pattern.

## Dependents

- `packages/parttens/src/index.ts` re-exports `icon-row/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `icon-row` for the registry item `icon-row`.

## Invariants

- The name is not `ListRow`: `collection` already exports `ListRow` (its List layout row, an `article` with a heading) and uses `data-slot="list-row"`, and the two barrels share `@tc96/parttens`.
- The children are `span`s (the content, the title and description `Text`, the actions wrapper), so the row stays valid when `render` gives it an `a`, a `button` or a `label`.
- The interactive look keys on the element, not on a prop: `[:is(a,button,label)&]` gives the cursor and the `bg-muted/50` hover, and `[label&]:has-data-checked:border-primary` marks a checked choice in `outline`. A `div` row with a `Switch` in `actions` therefore never takes the checked border.
- The row is `w-full` and `text-start`, because a `button` shrinks to its content and centers its text.
- `actions` never shrinks; the title truncates first and the description clamps at two lines (`line-clamp-2`).
- A link or button row cannot hold another control; `actions` there holds a decorative chevron. A choice row takes its name from the `label` text (title and description), which Base UI links to the hidden input of the `Radio` or `Checkbox`.

## Styling

- `outline`: `rounded-lg border`; `plain`: no border or radius, for a `ul` that draws `border` and `divide-y` (the `Divided Rows` and `Link Rows` layouts).
- The icon frame is `IconFrame` with `shape="rounded"` and `size="sm"` (32px); `iconColor` goes to its `color`.
- Title and description are `Text` (`size="sm"`; the title `weight="medium"` and `truncate`, the description `foreground="muted"`), never loose type classes.
- `data-slot`: `icon-row` (with `data-variant`), `icon-row-content`, `icon-row-title`, `icon-row-description`, `icon-row-actions`; the frame keeps the `icon-frame` slot of `IconFrame`.
- No override exceptions.

## Verify

```bash
bunx biome check packages/parttens/src/icon-row apps/storybook/src/patterns/icon-row
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run src/patterns/icon-row
```

The stories are in `apps/storybook/src/patterns/icon-row/`, on the five pages of `Patterns/IconRow`; the plays run in the light and dark projects with axe. The pattern has no bun tests.

## Pointers

- Public API: `index.ts` and the `icon-row` entry of `docs/architecture/public-api-exports.json`.
- `Patterns/IconRow/API Reference` (`apps/storybook/src/patterns/icon-row/api-reference.mdx`): the consumer contract of the three uses.
