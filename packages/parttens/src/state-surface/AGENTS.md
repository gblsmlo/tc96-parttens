# State surface pattern

Controlled surfaces for the state of a region: `StateSurface` shows one of five kinds (empty, no result, error, permission, not found) in place of data, and `StateGuard` mounts its children only when the state is `data`. The consumer passes the state and the copy; the pattern never fetches, maps API error codes to kinds or ships CSS.

## Map

| Folder | Holds |
| --- | --- |
| `core.ts` | React-free surface: kinds tuple, kind to role map, prop types |
| `composition/state-surface/` | `StateSurface` on the COSS `Empty` |
| `composition/state-guard/` | `StateGuard` and its loading block |
| `test/dom.ts` | the JSDOM setup the tests import; a copy owned by this pattern |

Import direction: `composition/state-guard/` → `composition/state-surface/` → `core.ts`. Composition imports COSS (`empty`, `spinner`), `IconFrame` from `@tc96/elements/icon-frame` and `lucide-react`; `core.ts` imports only React types.

## Dependents

- `packages/parttens/src/index.ts` re-exports `state-surface/index`.
- Nothing else imports this pattern yet; adoption in `collection-views` and `record-dialog` is a later unit. A pattern that imports it by file path receives the files without the barrel.

## Invariants

- The role is fixed by kind and no `aria-live` is set: `error` and `permission` are `alert`, the others `status`. There is no override prop.
- `icon` replaces the default icon inside the `IconFrame` (`shape="rounded"`, `variant="color"`, `size="xl"`); `null` removes the frame entirely. The frame is decorative and `aria-hidden`.
- `actions` is a slot; the pattern forces no button variant.
- Loading is not a kind: the `StateGuard` loading block is an `output` (implicit `status`) with `data-slot="state-guard-loading"` and no `data-kind`, and its `Spinner` is `aria-hidden`. The `output` is used because Biome's `useSemanticElements` rejects `role="status"` on a `div`.
- `surface` is required whenever `state` is not `data`; the loading `surface` accepts an optional description.

## Styling

| Attribute | Where |
| --- | --- |
| `data-kind` | the `Empty` root of `StateSurface`, one of the five kinds |
| `data-slot="state-guard-loading"` | the loading block of `StateGuard` |

- `error` and `permission` pass `color` from `STATE_SURFACE_ICON_COLORS` (`var(--destructive)`), so `IconFrame` sets the icon color and a 6% tint inline and no bg class is added. The other kinds pass no `color` and use `bg-muted/60` through `className` with the default `text-foreground`. Do not add a bg class to the colored kinds: the inline background wins.
- No class overrides a COSS border, radius or typography; `scripts/override-exceptions.json` has no entry for this pattern.

## Verify

```bash
bun test --isolate packages/parttens/src/state-surface
bunx biome check packages/parttens/src/state-surface
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/state-surface
```

## Pointers

- Public API: `index.ts` and the `state-surface` entry of `docs/architecture/public-api-exports.json`.
- Decisions and measured contrast: `docs/architecture/tc96-parttens.md`; plan: `docs/plans/2026-10-04-state-surface.md`.
