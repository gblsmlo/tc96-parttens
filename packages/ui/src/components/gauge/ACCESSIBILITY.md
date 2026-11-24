# Gauge accessibility

Local accessibility and usability decisions for the gauge. The repo-wide rules (WCAG thresholds, contrast fixed without changing token values, axe in every story) are in `docs/accessibility.md`; this file holds what applies only to `Gauge` and `GaugeStack`.

## Roles and names

- `Gauge` is a Base UI `Meter`: a `div` with `role="meter"`, `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. It needs a name: `aria-label`, or `aria-labelledby` pointing at the visible label. `getAriaValueText` replaces the default percentage when the value reads better as `3 of 5 checks`.
- A ring that only repeats a number already shown as text is decorative: use `GaugeRing`, an `aria-hidden` `div` with no meter role, as `ProgressRing` does.
- Segments, the ring's circles and the bar indicator are `aria-hidden`; only the meter carries the value.
- `GaugeStack` is a list: name the `ul` with `aria-label`, and each part's `label` is its `sr-only` text, which must hold the name and the share.

## Contrast

- The filled part is a graphical object and needs 3:1 against `--muted` and against the card. The `foreground` and `primary` tones pass in the example theme; measure `success`, `warning` and `info` fills on `card` before relying on them alone, and record the ratios in `docs/accessibility.md`.
- Color never carries the meaning alone: the value is in the meter or in text next to it, and stack parts have their labels.

## Pointer and touch

- The gauge is not interactive.

## Verified by

The plays in `apps/storybook/src/ui/gauge/` check the meter role and value, the clamp, the filled segment count, empty apart from zero, the decorative `GaugeRing` and the stack labels; axe runs on every story in the `storybook` and `storybook-dark` projects.
