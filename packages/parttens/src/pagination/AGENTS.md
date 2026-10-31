# Pagination

Not a pattern: `CollectionPagination`, the controlled page bar for a collection. The root barrel `packages/parttens/src/index.ts` re-exports `index.ts`, so the registry treats this folder as an area that ships only with the items whose files import it. It keeps no state: the consumer passes `page` and `pageCount` and handles `onPageChange`.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `collection-pagination.tsx` and its test |
| `index.ts` | the barrel |

There is no `test/dom.ts`: the test imports `collection/test/dom.ts`, so moving that file breaks it.

Import direction: `components/` → `@tc96/ui/pagination`, `@tc96/ui/button`, `@tc96/utils`, `lucide-react` and React only. It never imports a pattern.

## Dependents

- `collection/layouts/data-grid/components/data-grid-pagination.tsx` imports `components/collection-pagination.tsx` by path, which makes the `collection` registry item ship this folder.

## Invariants

- `CollectionPagination` clamps: `lastPage` is `max(pageCount, 1)` and the page is clamped into `[1, lastPage]`, so `page={9}` with `pageCount={0}` renders `1 / 1`. `onPageChange` receives the target page, never a delta.
- The `first–last de total` summary renders only when both `total` and `pageSize` are defined, reads `0 de 0` when `total` is 0, and sits in a `p` with `aria-live="polite"`. `label` becomes the `aria-label` of the COSS `Pagination` `nav`; the button labels are fixed pt-BR strings.

## Styling

- `data-slot` names set here: `collection-pagination`, `collection-pagination-page`; `pagination*` come from COSS.
- Colors only from theme tokens. `scripts/override-exceptions.json` has no entry for this folder.

## Verify

```bash
bun test --isolate packages/parttens/src/pagination
bunx biome check packages/parttens/src/pagination
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/pagination
```

`Patterns/Pagination` (`apps/storybook/src/patterns/pagination/`) runs axe with `test: 'error'`. The meta renders the component directly, keeps the page in `useState` and reports to a typed `onPageChange` spy, so `page` has no control; the layout wrapper is a `w-full max-w-6xl p-6` decorator.

## Pointers

- Public API: `index.ts` and the `parttens` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "ActionBar, Pagination e Toolbar: uma pasta por componente da sidebar".
