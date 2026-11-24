# Icon row pattern

`List`: one row of an `IconFrame` with the icon, a title, an optional description and an optional `actions` slot at the end. It serves three uses through `render`: a static `div` with buttons or a menu in `actions`, a whole-row link or button (a call to action, with a chevron in `actions`), and a choice, where the row is the `label` of the COSS `Radio` or `Checkbox` placed in `actions` inside a `RadioGroup` or `CheckboxGroup`. The consumer passes every text, the element, the handlers and the group state; the pattern never fetches, navigates, checks or ships CSS, and keeps no state.

## Map

| Folder | Holds |
| --- | --- |
| `composition/list/` | `List` on Base UI `useRender`, with the own `@tc96/ui/icon-frame` and `@tc96/ui/text` |
| `lib/` | `variants.ts`: the row `cva` by variant and the content, description and actions classes |
| `core.ts` | React-free surface: `listVariants` and the props type, whose `render` type comes from `@base-ui/react/use-render` |

Import direction: `composition/` → `lib/`, `core.ts`. No import into another pattern.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `list/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `list` for the registry item `list`.

## Invariants

- The name is `List`, not `ListRow`: `collection` already exports `ListRow` (its List layout row, an `article` with a heading) and uses `data-slot="list-row"`, and the two barrels share `@tc96/ui/patterns`.
- The children are `span`s (the content, the title and description `Text`, the actions wrapper), so the row stays valid when `render` gives it an `a`, a `button` or a `label`.
- The interactive look keys on the element, not on a prop: `[:is(a,button,label)&]` gives the cursor and the `bg-muted/50` hover, and `[label&]:has-data-checked:border-primary` marks a checked choice in `outline`. A `div` row with a `Switch` in `actions` therefore never takes the checked border.
- The row is `w-full` and `text-start`, because a `button` shrinks to its content and centers its text.
- `actions` never shrinks; the title truncates first and the description clamps at two lines (`line-clamp-2`).
- A link or button row cannot hold another control; `actions` there holds a decorative chevron. A choice row takes its name from the `label` text (title and description), which Base UI links to the hidden input of the `Radio` or `Checkbox`.

## Styling

- `outline`: `rounded-lg border`; `plain`: no border or radius, for a `ul` that draws `border` and `divide-y` (the `Divided Rows` and `Link Rows` layouts).
- The icon frame is `IconFrame` with `shape="rounded"` and `size="sm"` (32px); `iconColor` goes to its `color`.
- Title and description are `Text` (`size="sm"`; the title `weight="medium"` and `truncate`, the description `foreground="muted"`), never loose type classes.
- `data-slot`: `list` (with `data-variant`), `list-content`, `list-title`, `list-description`, `list-actions`; the frame keeps the `icon-frame` slot of `IconFrame`.
- No override exceptions.

## Verify

```bash
bunx biome check packages/ui/src/patterns/list apps/storybook/src/patterns/list
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run src/patterns/list
```

The stories are in `apps/storybook/src/patterns/list/`, on the five pages of `Patterns/List`; the plays run in the light and dark projects with axe. The pattern has no bun tests.

## Pointers

- Public API: `index.ts` and the `list` entry of `docs/architecture/public-api-exports.json`.
- `Patterns/List/API Reference` (`apps/storybook/src/patterns/list/api-reference.mdx`): the consumer contract of the three uses.
