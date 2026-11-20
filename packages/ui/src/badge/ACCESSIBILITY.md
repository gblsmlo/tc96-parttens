# Badge accessibility

Local accessibility and usability decisions for the badge. The repo-wide rules (WCAG thresholds, contrast fixed without changing token values, axe in every story) are in `docs/accessibility.md`; this file holds what applies only to the badge. Measured on 2026-11-20 in `UI/Badge/Behavior/Variants` (now `UI/Badge/Behavior/Every Variant`), `Default` theme preset, text over the badge background composed on the page `background`.

## Roles and names

- A badge is a `span` with no role: its text is read inline with what it sits next to. It is not a live region; a count that changes while the user reads needs its own announcement.
- An icon before the text is decorative and takes `aria-hidden="true"`.
- A count or a single symbol says nothing alone. Put the meaning in the name of what owns it (`<Button aria-label="Notifications, 3 unread">`) and hide the badge with `aria-hidden`, or give the badge its own `aria-label` (`7 unread messages`).
- Rendered as a link or a button through `render`, the badge takes that element's role and its name from its text.

## Keyboard and focus

- A `span` badge is not focusable. A link or button badge is, and shows a 2px `--ring` ring with a 1px `--background` offset on `:focus-visible` (`--ring` measures 4.53:1 on `background` in light, recorded in `docs/accessibility.md`, `record-preview`).

## Contrast

| Variant | Light | Dark |
| --- | --- | --- |
| `primary` | 14.52:1 | 13.90:1 |
| `secondary` | 13.30:1 | 14.49:1 |
| `outline` | 14.52:1 | 15.02:1 |
| `destructive` (white on `--destructive`) | 4.77:1 | 4.77:1 |
| `error` | 5.34:1 | 5.55:1 |
| `info` | 5.96:1 | 5.52:1 |
| `success` | 4.77:1 | 7.04:1 |
| `warning` | 4.53:1 | 7.53:1 |

Every pair passes 4.5:1 on the page `background`. `warning` in light is 0.03 above the line, and the `text-xs` warning badges of the CRM widgets measure 4.36:1 (an axe exception in `docs/accessibility.md`). The tinted variants (`error`, `info`, `success`, `warning`) are measured on `background`; on another surface, measure again. Color never carries the status alone: the badge text names it.

## Pointer and touch

- Rendered as a `button` or an `a`, the badge gets a pointer cursor, a hover color and, with a coarse pointer, a 44px hit area from an `::after` that does not change its look. A `span` badge has none of these.
- Two fixed sizes at every width: `default` is 20px tall with 12px text, `large` 24px with 14px text. The COSS `sm` size, with 10px text, is removed: no badge text goes under 12px.

## Verified by

The plays in `apps/storybook/src/ui/badge/` check the element (`span`, link, button), the `aria-hidden` icon, the size order, the round count and the focus ring of a link badge; axe runs on every story in the `storybook` and `storybook-dark` projects.
