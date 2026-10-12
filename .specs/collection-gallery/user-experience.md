---
capability: collection-gallery
status: Accepted
approved-by: owner, conversation on 2026-10-12
---

# Collection Gallery user experience

## Experience

Gallery presents a collection as cards that become denser as horizontal space grows. A card can represent a document, file or any other record, while its semantic content and interaction remain supplied by the consumer.

The reference state follows the supplied image: a small source label, record title and description, then date and owner separated at the bottom. The story uses existing card, text, read-only date and person properties, separator and icon APIs and inherits the Storybook page background. The person property shows only its avatar.

## Accessibility

- Gallery itself adds no click behavior or keyboard contract; interactive semantics belong to the rendered card.
- Loading skeletons expose a named `status`, set `aria-busy` and hide decorative card markup from assistive technology.
- The empty state uses the COSS `Empty` composition.
- Light and dark stories run through the repository's axe gate.

## Responsive behavior

- One column on narrow screens.
- Two columns from `sm`.
- Three columns from `lg`.
- Four columns from `xl`, matching the four-card reference at desktop width.

