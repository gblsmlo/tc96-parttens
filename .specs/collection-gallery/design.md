---
capability: collection-gallery
status: Accepted
approved-by: owner, conversation on 2026-10-12
---

# Collection Gallery design

## Structural questions

1. **Who owns the data?** The consumer owns the collection and every record; Gallery derives no domain state.
2. **Who supplies variable content?** The consumer supplies `renderItem`, as in List and Kanban.
3. **Where do failure and waiting stop?** Loading is an explicit Gallery prop; data errors and async boundaries stay with the consumer.

## Decision

Create `views/gallery/` as an independently usable renderer with `GalleryViewProps<TItem>`. It receives a `CollectionDefinition<TItem>`, `renderItem`, optional `loading`, skeleton count and labels, and an empty message. Its renderer leaf is memoized on `{ item, renderItem }`, matching the existing List contract.

`CollectionViewOutlet` adds a `gallery` branch, optional Gallery configuration and a `renderGalleryItem` callback. It throws the same targeted runtime error used by Calendar, Data Table and Kanban when the active renderer is absent.

Gallery does not export a card abstraction. The reference story composes `CardSurface`, `Text`, read-only `DateProperty` and `PersonProperty`, `Separator` and Lucide icons, so title scale, foregrounds, border, radius and shadow continue to come from existing APIs and the consumer theme. The footer places the date first and the person last; the person display keeps only the avatar.

## Layout

The root is a responsive CSS grid with one column by default, two from `sm`, three from `lg` and four from `xl`, with a scale spacing step between cards. The view adds no page background or outer padding. The renderer owns card anatomy and height; the Storybook example uses a full-height card to keep each row aligned.

## States

- **Content:** items render in collection order.
- **Loading:** the view is `aria-busy` and renders the requested number of CardSurface-based skeletons; consumer renderers do not run.
- **Empty:** the COSS `Empty` composition renders the provided message.

## Alternatives rejected

- Fixed document fields were rejected because files and arbitrary records do not share one schema.
- A Gallery compound card was rejected because `CardSurface`, `Text` and the existing COSS components already own that anatomy and scale.

## Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-10-12 | Generic `renderItem` contract | Matches the controlled List and Kanban renderers. |
| 2026-10-12 | No Gallery-specific card primitive | Avoids duplicating existing UI and element APIs. |
| 2026-10-12 | Flat source order | Grouping and sorting remain consumer responsibilities. |

