# Charts pattern

`ScatterChart`: a scatter plot on TanStack Charts where the consumer passes prepared rows and accessors for x, y, size, color and key. The tooltip text, the focus callback and the select callback receive the consumer's original row, typed as `TDatum`. The pattern never fetches, filters, aggregates or formats numbers by itself and keeps no state.

## Map

| Folder | Holds |
| --- | --- |
| `scatter-chart.tsx` | the chart and its React adapter host |
| `lib/sqrt-radius.ts` | the square-root radius scale, pure and covered by `sqrt-radius.test.ts` |
| `index.ts` | the barrel the `charts` registry item and the public API baseline read |

Import direction: `scatter-chart.tsx` → `lib/`. Nothing outside this folder is imported; TanStack Charts is imported only through exact subpaths (`/react`, `/scales/linear`, `/scales/ordinal`, `/tooltip`).

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `charts/index`; the stories import from `@tc96/ui/patterns`.
- `packages/registry/src/manifest.ts` (`patternNames`, `patternSources`) and `scripts/test-patterns.ts` list `charts`.

## Invariants

- Point area, not radius, grows with `size`: `sqrtRadiusScale` maps `sqrt(size)` linearly onto `radiusRange`, because a linear radius makes large values look quadratically bigger. Equal sizes get the middle radius; negative sizes count as zero.
- The x and y domains are inferred by TanStack Charts from the `scaleLinear` factory, with `nice` and grid on; the pattern never fixes them.
- The chart is one `svg` with `role="img"`, `tabindex="0"`, `aria-label` from `ariaLabel` and a `desc` from `ariaDescription`; keyboard focus moves between points with the arrow keys and reaches `onFocusChange`.
- Without `formatTooltip`, the default TanStack tooltip renders the channel values.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="scatter-chart"` | the wrapper around the chart host |

- Colors default to the consumer's `--chart-1` to `--chart-5` tokens; `colors` replaces them. No override exception is registered for this folder.

## Verify

```bash
bun test packages/ui/src/patterns/charts
bunx biome check packages/ui/src/patterns/charts apps/storybook/src/patterns/charts
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/charts
```

Interface tests are `play` functions in `apps/storybook/src/patterns/charts/` (`Patterns/Charts`).

## Pointers

- Public API: `index.ts` and the `charts` entry of `docs/architecture/public-api-exports.json`.
