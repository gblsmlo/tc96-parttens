# Alert accessibility

Local accessibility and usability decisions for the alert parts. The repo-wide rules (WCAG thresholds, contrast fixed without changing token values, axe in every story) are in `docs/accessibility.md`; this file holds what applies only to the alert. Measured on 2026-11-20 on every variant with an icon, title and description, `Default` theme preset, colors composed on the page `background`; the 2026-11-02 record (`docs/accessibility.md`, `Flow Inspector, Alert e Toast do COSS`) gave the same values.

## Roles and names

- The root is a `div` with `role="alert"`, an assertive live region: a screen reader announces it as soon as it is inserted. Render it when the message happens. A message that is on screen from the first render, as a standing notice, passes `role="status"` or no live role; props spread after the default.
- The alert has no accessible name of its own; the title and description are read as its content.
- An icon that carries the status takes `role="img"` and an `aria-label` (`Warning`); an icon the title already explains takes `aria-hidden="true"`.

## Keyboard and focus

- The alert is not focusable and does not move focus. Its actions are `Button`s in the tab order where they appear.

## Contrast

Text is measured against 4.5:1, the icon (non-text) against 3:1, each over the alert background composed on the page `background`.

| Variant | Title, light / dark | Description, light / dark | Icon, light / dark |
| --- | --- | --- | --- |
| `default` | 14.52:1 / 15.02:1 | 5.48:1 / 5.00:1 | 5.48:1 / 5.00:1 |
| `error` | 13.54:1 / 15.81:1 | 5.11:1 / 5.27:1 | 4.26:1 / 3.62:1 |
| `info` | 13.87:1 / 15.40:1 | 5.24:1 / 5.13:1 | 3.44:1 / 4.47:1 |
| `success` | 13.76:1 / 15.16:1 | 5.19:1 / 5.05:1 | 4.87:1 / 8.53:1 |
| `warning` | 13.74:1 / 14.97:1 | 5.19:1 / 4.98:1 | 4.56:1 / 9.48:1 |

The COSS `success` and `warning` icons read `--success` and `--warning`, which measured 2.29:1 and 1.99:1 in light (2026-11-02). The consumer's stylesheet fixes them without changing a token value or `alert.tsx`: `[data-slot="alert"]` redefines `--success` as `--success-foreground` and `--warning` as `--warning-foreground` (`apps/example/packages/ui/src/styles.css`), so the icon and the 4% tint of those two variants come from the darker shade. A consumer without that rule gets the failing icons back in light; that is why the flow inspector also sets `[&>svg]:text-warning-foreground` on its own alert. Color never carries the status alone: the title names it.

## Layout that carries meaning

- From `sm` the action sits after the text, centered across the title and the description; below `sm` it drops under the text, so the buttons never squeeze the copy on a phone.
- The icon column opens only for an `svg` that is a direct child; the title and description then start at the same edge, after the icon.

## Verified by

The plays of `UI/Alert/Behavior` check the `alert` role and slots, the `status` role a standing notice passes, the named status icon of each variant, the `aria-hidden` icon and the text column after it, the action callbacks and the 10px gap between description paragraphs; axe runs on every story in the `storybook` and `storybook-dark` projects.
