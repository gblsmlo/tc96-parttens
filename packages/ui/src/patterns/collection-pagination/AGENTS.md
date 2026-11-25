# CollectionPagination

Not a pattern: the page bar of a paginated collection (`CollectionPagination`), placed in `CollectionFrameFooter`, under the Gallery layout and, through `DataGridPagination`, under the Data Grid. The root barrel `packages/ui/src/patterns/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no page: the consumer passes the page, the page count and the page size and handles the callbacks.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `collection-pagination.tsx` |
| `index.ts` | the barrel |

Import direction: `components/` → `@tc96/ui/<component>` (`pagination`, `button`, `select`), `@tc96/utils`, `@phosphor-icons/react` and React only. It never imports a pattern.

## Dependents

- `collection/layouts/data-grid/components/data-grid-pagination.tsx` imports `components/collection-pagination` by path; stories import through `@tc96/ui/patterns`.
- The `collection` entry of `docs/architecture/public-api-exports.json` no longer lists `CollectionPagination*`; the root `parttens` entry does.
- The `collection` registry item ships this folder through `itemAreas` in `packages/registry/src/manifest.ts`.

## Invariants

- `CollectionPagination` keeps no page: the consumer passes `page` and `pageCount` and handles `onPageChange`, which receives the target page, never a delta. It clamps: `lastPage` is `max(pageCount, 1)` and the page is clamped into `[1, lastPage]`, so `page={9}` with `pageCount={0}` renders `1 / 1`.
- The `first–last de total` summary renders only when both `total` and `pageSize` are defined, reads `0 de 0` when `total` is 0, and sits in a `p` with `aria-live="polite"`. `label` becomes the `aria-label` of the COSS `Pagination` `nav`; the button labels default to pt-BR and come from `buttonLabels` (`first`, `previous`, `next`, `last`), and the summary text comes from `formatRange(first, last, total)` (`0, 0, 0` for an empty collection), so the pattern never joins words in another language; `DataGridPagination` forwards both and its `label`. Its props spread after `data-slot`, so `DataGridPagination` replaces `collection-pagination` with `data-grid-pagination`.
- The rows-per-page selector (COSS `Select`, `data-slot="collection-pagination-page-size"`) renders only when `pageSizeOptions`, `onPageSizeChange` and `pageSizeLabel` are all passed. `pageSizeLabel` is a prop and not a fixed pt-BR string because it is new text, and the visible label also names the select (`aria-labelledby`). With the selector the summary moves from the start to the end, beside the page buttons; without it the markup is unchanged. The selector reports the new size only: `DataGridPagination` calls `setPageSize` and returns to page one.

## Styling

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-slot="collection-pagination\|collection-pagination-page\|collection-pagination-page-size"` | the `CollectionPagination` root and its `page / count` text and the rows-per-page selector; the `nav`, list and items keep the COSS `pagination*` slots | consumers and tests; not styled |

- No `cva`; the buttons are ghost `icon-sm` COSS buttons and the `nav` is COSS `Pagination`. Colors only from theme tokens.
- `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bunx biome check packages/ui/src/patterns/collection-pagination
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/collection-pagination
```

Interface tests are `play` functions in `apps/storybook/src/patterns/collection-pagination/behavior.stories.tsx`, on the five pages of `Patterns/CollectionPagination`. `collection-pagination-layouts.tsx` holds `ComposedCollectionPagination`, which keeps the page and the page size for the Playground, Layouts and Usages, and `StatefulPagination`, which keeps only the page for the Behavior plays.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- The frame it sits in: `packages/ui/src/patterns/collection/AGENTS.md` (`CollectionFrameFooter`).
