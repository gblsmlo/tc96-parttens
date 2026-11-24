# Gauge

Gauge shows how much of a range one value fills: a bar, a row of segments or a ring, all on the Base UI `Meter`, so the value is announced as a meter. `GaugeRing` is the ring drawing alone, decorative and without a meter. `GaugeStack` shows how a total splits into parts. Neither knows what the number means: the consumer passes `value`, `max`, the tone and the accessible name.

COSS has `Meter` and `Progress` but no segmented bar, stacked bar or ring; each widget and block built its own until 2026-11-24, when `Gauge` was added here as a repo-owned ui component (`origin: "own"` in `ui.manifest.json`, ADR 0008). Every change to how it looks starts in `TOKENS.md`, the blueprint, and is then copied into `gauge.tsx`. The Storybook node `UI/Gauge` documents it in five pages: `API Reference`, `Playground`, `Layouts`, `Behavior` and `Usages`.

## Map

- `gauge.tsx`: `Gauge`, `GaugeRing`, `GaugeStack`, their props, `gaugeVariants`, the pure `gaugeRatio` and `filledSegments`, and the value lists `gaugeVariantNames`, `gaugeSizes`, `gaugeTones` with their types.
- `index.ts`: the barrel `@tc96/ui/gauge` resolves to.
- `TOKENS.md`: the blueprint of every part, size and tone.
- `ACCESSIBILITY.md`: roles, names and contrast.

## Architecture

- Layer: `packages/ui`. `gauge.tsx` imports only Base UI `Meter`, `class-variance-authority` and `cn` from `@tc96/utils`.
- Resolution: `packages/ui/package.json` exports `./gauge` as `./src/gauge/index.ts`, ahead of the `./*` pattern.
- Manifest: the `gauge` item of `packages/ui/ui.manifest.json` lists the five files with `origin: "own"`; `sync:coss` never touches it.

## Dependents

- `packages/parttens/src/widgets/shared/progress-ring.tsx`: `ProgressRing` renders `GaugeRing` with `data-slot="progress-ring"`, so its public name, DOM hooks, text content and plays stay as they were.
- `apps/storybook/src/patterns/stats/stats-layouts.tsx` (`LeadsOverviewCard`).

## Invariants

- `TOKENS.md` and `gauge.tsx` carry the same classes; `scripts/ui-tokens.test.ts` fails when they drift.
- `value` is clamped to `[min, max]` before it reaches the `Meter`, and the fill uses the same ratio; `max <= min` reads as empty fill, not a division by zero.
- `empty` is not zero: it drops the indicator (and the filled segments), dashes the ring track and sets `data-empty="true"`; at zero `data-empty` is absent.
- `segmented` fills `Math.round(ratio * segments)` segments; the segments are `aria-hidden`, the meter carries the value.
- Props spread last, so a consumer can override `data-slot`, as `ProgressRing` does.
- The Base UI `Meter` root renders a hidden text node (`x`), so an `aria-hidden` `Gauge` still changes the `textContent` of its container; a decorative ring is `GaugeRing`, which has no meter. `Gauge` with `variant="ring"` and `GaugeRing` share one private drawing, `GaugeRingGraphic`.
- `GaugeStack` sizes each part by `flexGrow: value`; a negative value counts as zero. The label is the part's whole accessible text: the consumer passes it already formatted (`Vendas 38,7%`), the component composes nothing.

## Styling

- `data-slot`: `gauge`, `gauge-ring`, `gauge-track`, `gauge-indicator`, `gauge-segment`, `gauge-stack`, `gauge-stack-part`; `data-variant`, `data-size`, `data-tone`, `data-empty`, and `data-filled` on a filled segment.
- A part color in `GaugeStack` goes through `color` (inline), never a `bg-*` class.

## Verify

```bash
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check
bun test scripts/ui-tokens.test.ts
cd apps/storybook && bunx vitest run --project=storybook src/ui/gauge
```

## Pointers

- `ACCESSIBILITY.md` and `TOKENS.md` (this folder).
- Stories: `apps/storybook/src/ui/gauge/`; the API text is `api-reference.mdx` there.
- Decisions: `.specs/adr/0008-ui-owned-source.md`; `docs/architecture/tc96-parttens.md`, section "UI: Gauge".
