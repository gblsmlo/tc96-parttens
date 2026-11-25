# ListView

A flat or grouped list of one collection, usable alone or mounted by `CollectionLayoutOutlet`. The consumer passes the collection, the grouping and `renderRecord`, usually built from the `ListRow` parts. Its only state is the uncontrolled group collapse.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `ListView`, `ListGroup`, the `ListRow` parts with `ListRowSelect`, the `ListViewHeader` parts, the row skeleton and the memoized item |
| `index.ts` | the barrel |

Import direction: `components/` → `collection/shared/lib/project-collection.ts`, `interactive-descendants.ts`, `skeleton-keys.ts` and `collection/types/`. It never imports another layout. The folder is `list-view/` because `list/` is the List pattern.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `index.ts`; `collection/composition/collection-layout-outlet.tsx` imports the view by file path and mounts it, so the `collection` registry item ships this folder.
- `scripts/bench/list.bench.ts` imports `index.ts`.
- `scripts/override-exceptions.json` keys two `Separator` entries by `components/list-group.tsx` and `components/list-view.tsx`.

## Invariants

- `ListView` renders the flat collection with `h2` titles and grouped lists with `h3`. The group collapse button is named by `getGroupToggleLabel(label, collapsed)`, whose English default (`Expand`/`Collapse` and the label) predates the pt-BR rule and stays for current callers. An empty flat list (`grouping === null`, not loading) renders `emptyMessage` in the COSS `Empty` block, like an empty group. With `collapseEmptyGroups`, a manual choice wins, an untouched group reopens when it gets items, every group stays open while loading, and `onCollapsedGroupIdsChange` reports the effective list.
- `ListRow` is only structure: the root `article` and its `ListRow*` slots, with no content props; the consumer fills each slot. `ListRowOpenTrigger` stretches over the row (`after:absolute inset-0` against the `relative` root). `ListRowLeading` and `ListRowField` are `pointer-events-none` with `interactiveDescendants` raised, so a plain area reaches the trigger; a focusable that is not a control (a `tabindex="0"` span, such as `DateProperty` with `tooltip`) takes pointer events so its tooltip opens on hover, and a click on it is forwarded to the row's trigger with `.click()`, while a control (`interactiveControls`) keeps its click. Clicks that bubble through a portal (a popover inside a property) or were `preventDefault`ed are not forwarded. `ListRowAction` sits above the trigger with `z-10`. Both areas share one internal `PlainArea`, whose `onClick` carries the only comment in the layout, a `biome-ignore` for `noStaticElementInteractions` and `useKeyWithClickEvents`: the click is a mouse-only mirror of the trigger, which is the keyboard path.
- `ListRowSelect` with children hides the media and shows the checkbox on `group-hover/list-row`, `group-focus-within/list-row`, when it holds a `[data-checked]` and on `pointer-coarse`, so the checkbox stays reachable by keyboard and touch; without children it is a plain checkbox before the other leading parts. Selection is the consumer's: `ListRow selected` only paints the row and sets `data-state="selected"`.
- `ListRowSkeleton` wraps the row in an `output` with `aria-busy`, because an `article` cannot be `status`.
- Rows sit 2px apart (`gap-0.5` on `list-view-items` and `list-group-items`); a plain `ListRowSelect` sits 16px before the icon (`me-3` over the leading `gap-1`).
- `header` renders a column header row above the list, sticky at the top at `z-30`; with it the wrapper has no padding and only the body (`list-view-body`) keeps `p-2`, the header spans the full width with `px-4` so its cells line up with the rows (`px-2` of the body plus `px-2` of the row), and the group headers stick at `top-9`, below it. Its `ListViewHeaderCell` hides below `lg` like `ListRowField` unless `always`, so a cell given the field's width stays aligned with it. With `onSort` the cell label is a button and `sortDirection` shows the arrow; the sort itself is the consumer's.
- `ListView` is `min-h-0 flex-1` and scrolls itself through the `ScrollArea` of `@tc96/ui/scroll-area`, fading only its bottom edge through `viewportProps`, because its group headers stick to the top opaque, at `z-20` above the row fields' `z-10`, and a top fade would wash them out.
- The consumer's renderer runs in a memoized leaf below the stateful component: it re-runs only when its identity or inputs change, so a renderer that reads other state with a stable identity goes stale.

- `ListRow` `density` is the shared `CollectionDensity`, with the row heights of the tables: `compact` (`py-1`), `short` (36px, the default), `medium` 44px, `tall` 56px, `extra-tall` 72px.

## Styling

| Attribute | Where | Read by |
| --- | --- | --- |
| `data-slot="list-row-select\|list-row-select-media"`, `data-reveal` | `ListRowSelect`, its media and the wrapper that swaps the media for the checkbox | consumers and tests; the swap reads `group/list-row` and `group/list-row-select` |
| `data-collection-grouping`, `data-interactive` | `ListView`, `ListRow` | consumers |
| `data-state="selected"`, `data-density` | `ListRow` | consumers |
| `data-media="avatar\|icon\|none"`, `data-lines`, `data-pills` | the `output` of `ListRowSkeleton`, from `loadingAnatomy` | tests, to check the loading row follows the row anatomy; not styled |
| `data-slot="list-view-header\|list-view-header-row\|list-view-header-cell"` | the sticky header wrapper, `ListViewHeader` and `ListViewHeaderCell` | consumers and tests |
| `data-slot="list-row"`, `list-row-leading\|body\|title\|title-trigger\|description\|header\|content\|footer\|trailing\|field\|action` | the `ListRow` root and slots | consumers and tests; the slot order is checked in the `RowAnatomy` story of `Patterns/ListView/API Reference`, the click contract in `Patterns/ListView/Behavior` |

- Hover-only affordances pair `group-hover` with `group-focus-within` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch in v4.
- `scripts/override-exceptions.json` has two `Separator` entries with `bg-border/40` (`components/list-group.tsx` and `components/list-view.tsx`).

## Verify

```bash
bunx biome check packages/ui/src/patterns/list-view
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/list-view
bun scripts/bench/list.bench.ts --compare scripts/bench/results/list.base.json --gate
```

Run the bench when rendering changed: `--gate` exits 1 when a render counter rose or a scenario disappeared; timing only warns. Regenerate the baseline with `--json` on an idle machine and update `README.md` in the same change.

`Patterns/ListView` (`apps/storybook/src/patterns/list-view/`) is documented in the six component pages; its `Usages` and `Behavior` read `collection/fixtures/tasks.ts`.

## Pointers

- Public API: `index.ts` and the `patterns` entry of `docs/architecture/public-api-exports.json`.
- Section "Calendar, Gallery, List e Data Table: o renderizador do consumidor numa folha memoizada" of the architecture doc.
- Decisions: `docs/architecture/tc96-ui.md`; accessibility: `docs/accessibility.md`, sections "Regras" and "Boas práticas".
- The collection outlet that mounts this layout, and the shared code it imports: `packages/ui/src/patterns/collection/AGENTS.md`.
