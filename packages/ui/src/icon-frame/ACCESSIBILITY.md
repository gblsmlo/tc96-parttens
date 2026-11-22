# IconFrame accessibility

Local accessibility and usability decisions for the icon frame. The repo-wide rules (WCAG thresholds, contrast fixed without changing token values, axe in every story) are in `docs/accessibility.md`; this file holds what applies only to `IconFrame`.

## Roles and names

- The frame is decorative and renders with `aria-hidden="true"`, icon included. The name of the thing it marks comes from the text beside it (the account name, the step title, the state heading).
- When a frame is the only content of a control, name the control (`aria-label` on the button), not the frame.

## Contrast

- The icon is a graphical object and needs 3:1 against what is behind it. With `variant="color"` and a `color`, the background is that color at 6% composed on the surface, so the icon contrast is close to the color on the surface itself; measure each new color on `background` and on `card`.
- Measured pairs (`docs/accessibility.md`): `state-surface` `text-foreground` on `bg-muted/60` 13.80:1 light and 15.12:1 dark, `var(--destructive)` on its 6% tint 3.37:1 and 4.68:1; gamification `--warning-foreground` and `--success-foreground` in `color` frames 4.6:1 and 5.0:1 light, 8.8:1 and 7.8:1 dark.
- Color never carries the meaning alone: the text beside the frame names the category or status.

## Pointer and touch

- The frame is not interactive. Sizes run from 24px (`xs`) to 56px (`xl`); a frame inside a control does not change the control's 44px hit area.

## Verified by

The plays in `apps/storybook/src/ui/icon-frame/` check the decorative `span`, `render`, the size and shape attributes, the 24px frame with a 16px icon at `xs`, and the tint of `variant="color"` against `plain`; axe runs on every story in the `storybook` and `storybook-dark` projects.
