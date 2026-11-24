# Stats pattern

One number per card: `MetricWidget` (label, value, trend, a header slot and `children` for whatever sharpens the number) and `AreaMetricWidget` (the same card with an area chart under the value). The consumer passes the value already aggregated and formatted through `format`; the pattern never fetches, sums or stores anything and keeps no state. A row or grid of cards is a block (`Blocks/Application/Stats`, `Blocks/Application/Dashboard`), never this pattern.

## Map

| Folder | Holds |
| --- | --- |
| `metric-widget.tsx`, `area-metric-widget.tsx` | the two cards |
| `index.ts` | the barrel the `stats` registry item and the public API baseline read |

Import direction: both files import `Amount`, `WidgetShell` and (`MetricWidget` only) `TrendIndicator` from `../widgets/shared/` by relative path, the way `collection` imports `action-bar`; the `stats` registry item ships those files with it. `widgets/` never imports this folder. Recharts is used only by `AreaMetricWidget`.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `stats/index`; the stories import from `@tc96/ui/patterns`.
- `packages/ui/src/blocks/application/stats/stats-7/stats-7.tsx` and `packages/ui/src/blocks/application/dashboard/dashboard-4/dashboard-4.tsx` import `@tc96/ui/patterns/stats/area-metric-widget` by path.
- `packages/registry/src/manifest.ts` (`patternNames`, `patternSources`) and `scripts/test-patterns.ts` list `stats`.

## Invariants

- Both cards render `WidgetShell` with `aria-labelledby` pointing at a `useId()` title, so each is a `region` named by `label`; plays query `getByRole('region', { name })`.
- `MetricWidget` renders a number through `Amount` with `dimFraction` and any other `value` as given; the trend row renders only when `change` or `changeLabel` is set.
- `tone="inverted"` on `MetricWidget` wraps the card in `<div className="dark contents" data-slot="metric-widget-scope">` and sets `data-tone` on the shell; the dark palette comes from the consumer's theme.
- `AreaMetricWidget` draws its chart inside a `div aria-hidden="true"` with `data-slot="area-metric-chart"`, because the card already shows the value, and drops the chart below two points.

## Styling

| Attribute | Where |
| --- | --- |
| `data-widget="metric"` | the `MetricWidget` shell |
| `data-tone="default\|inverted"` | the `MetricWidget` shell |
| `data-slot="area-metric-chart"` | the `AreaMetricWidget` chart wrapper |

- The frame is the widgets' `WidgetShell`: border, shadow and radius belong to `Card` and the consumer theme. No override exception is registered for this folder.

## Verify

```bash
bunx biome check packages/ui/src/patterns/stats apps/storybook/src/patterns/stats
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/stats
```

Interface tests are `play` functions in `apps/storybook/src/patterns/stats/` (`Patterns/Stats`). There are no bun tests in this folder. `Usages` shows one card per story with real content; compositions of several cards go to blocks.

## Pointers

- Public API: `index.ts` and the `stats` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-ui.md`, section "Patterns: Stats na raiz"; the shared parts are in `packages/ui/src/patterns/widgets/AGENTS.md`.
