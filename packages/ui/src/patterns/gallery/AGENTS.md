# Gallery

A grid of cards for one collection, usable alone or mounted by `CollectionLayoutOutlet`. The consumer passes the collection and `renderRecord`. It keeps no state.

## Map

| Folder | Holds |
| --- | --- |
| `components/` | `GalleryView`, the memoized item and the card skeleton |
| `index.ts` | the barrel |

Import direction: `components/` → `collection/shared/lib/skeleton-keys.ts` and `collection/types/`. It never imports another layout.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `index.ts`; `collection/composition/collection-layout-outlet.tsx` imports the view by file path and mounts it, so the `collection` registry item ships this folder.
- `scripts/bench/gallery.bench.ts` imports `index.ts`.

## Invariants

- `GalleryView` renders the flat `collection.records` in source order and never groups, sorts or owns card anatomy. The grid has one column, two from `sm` and three from `lg`. It never paginates: `pageSize` (3, 6, 9 or 12, whole rows of three) only sizes the page the consumer passes, so loading renders that many skeletons and the grid reserves the rows of a full page (`minmax(13rem, auto)`, the card `min-h-52`) at each breakpoint, and a partial last page keeps the height. Each size maps to one complete class string, so the Tailwind scanner sees every class. Loading renders `loadingRecordCount` skeletons (four by default) shaped by `loadingRecordAnatomy` (`eyebrow`, `action`, `titleLines`, `descriptionLines`, `footer`, `density`), at the real line heights of the COSS `Card`, and an empty collection renders `emptyMessage` through the COSS `Empty` block.
- `GalleryRowSkeleton` wraps the card in an `output` with `aria-busy`, because an `article` cannot be `status`.
- The consumer's renderer runs in a memoized leaf below the stateful component: it re-runs only when its identity or inputs change, so a renderer that reads other state with a stable identity goes stale.

## Styling

| Attribute | Where | Read by |
| --- | --- | --- |
| `data-slot="gallery-view"` | the `GalleryView` grid root | consumers and tests; not styled outside the view |
| `data-page-size` | the `GalleryView` grid root, when `pageSize` is set | tests; not styled |
| `data-density`, `data-description-lines` | the `output` of `GalleryRowSkeleton`, from `loadingRecordAnatomy` | tests; not styled |

- Colors only from theme tokens; the card is the theme's `Card`.

## Verify

```bash
bunx biome check packages/ui/src/patterns/gallery
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/gallery
bun scripts/bench/gallery.bench.ts --compare scripts/bench/results/gallery.base.json --gate
```

Run the bench when rendering changed: `--gate` exits 1 when a render counter rose or a scenario disappeared; timing only warns. Regenerate the baseline with `--json` on an idle machine and update `README.md` in the same change.

`Patterns/Gallery` (`apps/storybook/src/patterns/gallery/`) is documented in the six component pages; its `Usages` and `Behavior` read `collection/fixtures/documents.ts`.

## Pointers

- Public API: `index.ts` and the `patterns` entry of `docs/architecture/public-api-exports.json`.
- Section "Gallery: grid controlado para registros" of the architecture doc.
- Decisions: `docs/architecture/tc96-ui.md`; accessibility: `docs/accessibility.md`, sections "Regras" and "Boas práticas".
- The collection outlet that mounts this layout, and the shared code it imports: `packages/ui/src/patterns/collection/AGENTS.md`.
