---
capability: collection-gallery
status: Accepted
approved-by: owner, conversation on 2026-10-12
---

# Collection Gallery requirements

## Problem

`CollectionViewMode` has renderers for calendar, grid, table, kanban and list, but no gallery for documents, files or records that are easier to scan as cards in a responsive grid.

## Outcome

The collection pattern exposes a `gallery` mode and a standalone `GalleryView`. The consumer supplies prepared records and renders each record; the pattern owns only the responsive grid, loading state and empty state.

## Requirements

- `gallery` is a valid `CollectionViewMode` and can be mounted by `CollectionViewOutlet`.
- `GalleryView` reads `CollectionDefinition.items` in consumer order and keys them with `getKey`.
- The consumer supplies card content with `renderItem`; the pattern does not prescribe document fields.
- The view provides accessible loading and empty states with existing COSS and element components.
- The reference story follows the supplied screenshot with cards for documents, an owner and a date.
- The story and pattern use existing theme tokens, typography variants, card surfaces, avatar composition and skeletons.
- The pattern adds no fetching, filtering, sorting, persistence, business rules, CSS file, theme token or UI primitive.

## Non-functional assumptions

- Scale is tens to a few hundred visible records; virtualization is outside this capability.
- Rendering remains deterministic and safe for server rendering.
- Security and privacy remain the consumer's responsibility because the view receives only already-prepared React content.
- A stable `renderItem` does not re-run on an unrelated parent render when the item identity is unchanged, matching List and Kanban.

## Non-goals

- Grouping, selection, drag and drop, pagination or card actions owned by the view.
- A document schema with fixed title, description, owner or date fields.
- A new Gallery-specific card primitive.

