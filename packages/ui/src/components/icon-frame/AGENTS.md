# IconFrame

IconFrame is the decorative frame around the icon of an asset, a category, a channel, a step or a state: a circle or a rounded square with the icon centered, tinted from a brand or status color or left plain. It never carries meaning by itself; the text next to it names the thing.

COSS has no icon frame. `IconFrame` started in the removed `packages/elements` layer and moved here on 2026-11-22 as a repo-owned ui component (`origin: "own"` in `ui.manifest.json`, ADR 0008), built on the Base UI `useRender` hook like `Badge`. ADR 0006 uses it as the `icon-tile` of ReUI. Every change to how it looks starts in `TOKENS.md`, the blueprint, and is then copied into `icon-frame.tsx`. The Storybook node `UI/IconFrame` documents it in six pages: `API Reference`, `Playground`, `Stories`, `Behavior`, `Usages` and `Layouts`.

## Map

- `icon-frame.tsx`: `IconFrame`, `IconFrameProps`, `iconFrameVariants`, `iconFrameStyle` and the value lists `iconFrameShapes`, `iconFrameSizes`, `iconFrameVariantNames` with their types.
- `index.ts`: the barrel `@tc96/ui/icon-frame` resolves to.
- `TOKENS.md`: the blueprint of the base, shapes, sizes and variants.
- `ACCESSIBILITY.md`: decorative role and contrast decisions.

## Architecture

- Layer: `packages/ui`, the bottom of `templates` → `parttens` → `ui` → `utils`. `icon-frame.tsx` imports only Base UI (`useRender`, `mergeProps`), `class-variance-authority` and `cn` from `@tc96/utils`.
- Resolution: `packages/ui/package.json` exports `./icon-frame` as `./src/icon-frame/index.ts`, ahead of the `./*` pattern.
- Manifest: the `icon-frame` item of `packages/ui/ui.manifest.json` lists the five files of this folder with `origin: "own"`; `sync:coss` never touches it.
- Consumer: the registry item `ui/icon-frame.json` ships the five files to `<ui alias>/icon-frame/`, installed through the `@ui/icon-frame` registry dependency of every pattern that imports it.

## Dependents

- `packages/ui/src/patterns`: `flow` (canvas step icon, inspector header, step library item, run card), `surfaces/state` (`StateSurface`), `widgets` (finance, gamification, and `widgets/shared/index.ts`, which re-exports `IconFrame` and its types from the widgets barrel), `wizard` (step item).
- `packages/ui/src/blocks/application/shell/shared/workspace-switcher.tsx`.
- `iconFrameStyle` is imported alone by `apps/storybook/src/patterns/collection/usages/documents.stories.tsx`.

## Invariants

- `TOKENS.md` and `icon-frame.tsx` carry the same classes; `scripts/ui-tokens.test.ts` fails when they drift.
- The frame is decorative: `aria-hidden="true"` is a default prop, overridable only through props for the rare frame that is the only content of a named control.
- `color` is applied inline by `iconFrameStyle`: in `variant="color"` it sets `color` and a 6% `color-mix` background, in `variant="plain"` only `color`. Without `color` the frame uses `bg-muted text-foreground` (or a transparent background in `plain`).
- An icon without a `size-*` class takes the size of the frame's size step; a `size-*` class on the icon wins.
- `data-shape`, `data-size` and `data-variant` always carry the resolved values, defaults included.

## Styling

- `data-slot`: `icon-frame`, with `data-shape`, `data-size` and `data-variant`.
- `iconFrameVariants` and `iconFrameStyle` are exported for an element that cannot be passed to `render`.
- A brand or status color goes through `color`, not a `bg-*`/`text-*` class: `color` keeps the tint and the icon color in step.

## Verify

```bash
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check
bun test scripts/ui-tokens.test.ts
cd apps/storybook && bunx vitest run --project=storybook src/ui/icon-frame
```

## Pointers

- `ACCESSIBILITY.md` and `TOKENS.md` (this folder).
- Stories: `apps/storybook/src/ui/icon-frame/`; the API text is `api-reference.mdx` there.
- Decisions: `.specs/adr/0008-ui-owned-source.md`, `.specs/adr/0006-flow-family-on-react-flow.md`.
