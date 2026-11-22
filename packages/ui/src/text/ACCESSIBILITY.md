# Text accessibility

Local accessibility and usability decisions for the text element. The repo-wide rules (WCAG thresholds, contrast fixed without changing token values, axe in every story) are in `docs/accessibility.md`; this file holds what applies only to `Text`.

## Roles and names

- `Text` is a `span` with no role. Structure comes from the element passed in `render`: a heading is `render={<h2 />}`, a paragraph `render={<p />}`, a form label `render={<label htmlFor="..." />}`. A large `size` never makes a heading by itself.
- Heading levels follow the page outline, not the visual size: an `h3` may be `size="sm"` and an `h2` `size="3xl"`.

## Contrast

- `foreground="base"` (`--foreground`) and `foreground="muted"` (`--muted-foreground`) are the theme's text pairs on `background`, `card` and `popover`; their measured ratios are recorded with the theme in `docs/accessibility.md`.
- `foreground="destructive"` uses `--destructive-foreground`, the pair made for text on a surface (`red-700` light, `red-400` dark, from the ui manifest). `text-destructive` is never used for text.
- `foreground="inherit"` takes the parent's color: the parent owns the pair.
- `muted` below `text-xs` is not used; ~10px text is `text-[0.625rem]` only where `docs/accessibility.md` lists it.

## Truncation

- `truncate` cuts the text to one line with an ellipsis. The full text must reach the user another way: a `title`, a tooltip, or the same value elsewhere on the screen (a detail view). A truncated name is still read whole by a screen reader.

## Verified by

The plays in `apps/storybook/src/ui/text/` check the default classes, the size scale, headings rendered through `render` and the truncated overflow; axe runs on every story in the `storybook` and `storybook-dark` projects.
