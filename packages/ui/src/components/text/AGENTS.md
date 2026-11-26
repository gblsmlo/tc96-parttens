# Text

Text is the typographic element of the workspace: a label, a description, a heading or a truncated cell, set by props on the theme's type scale instead of loose `text-*` and `font-*` classes. It is a `span` by default and becomes a heading, a paragraph or a label through `render`, so the element carries the semantics and the props carry the look.

COSS has no text element. `Text` started in the removed `packages/elements` layer and moved here on 2026-11-22 as a repo-owned ui component (`origin: "own"` in `ui.manifest.json`, ADR 0008), built on the Base UI `useRender` hook like `Badge`. Every change to how it looks starts in `TOKENS.md`, the blueprint, and is then copied into `text.tsx`. The Storybook node `UI/Text` documents it in six pages: `API Reference`, `Playground`, `Stories`, `Behavior`, `Usages` and `Layouts`; `Get Started/Component Docs` sets that structure.

## Map

- `text.tsx`: `Text`, `TextProps`, `textVariants`, `textSizes` and `TextSize`.
- `index.ts`: the barrel `@tc96/ui/text` resolves to.
- `TOKENS.md`: the blueprint and single source of truth of the look, one block per variant value.
- `ACCESSIBILITY.md`: element, contrast and truncation decisions.

## Architecture

- Layer: `packages/ui`, the bottom of `templates` → `parttens` → `ui` → `utils`. `text.tsx` imports only Base UI (`useRender`, `mergeProps`), `class-variance-authority` and `cn` from `@tc96/utils`.
- Resolution: `packages/ui/package.json` exports `./text` as `./src/text/index.ts`, ahead of the `./*` pattern; `tsconfig.base.json` maps `@tc96/ui/*` to `packages/ui/src/*`, which reaches `text/index.ts` as a folder index.
- Manifest: the `text` item of `packages/ui/ui.manifest.json` lists the five files of this folder with `origin: "own"`; `sync:coss` never touches it. `check:ui-registry` fails on a file here that the manifest does not list.
- Consumer: the registry item `ui/text.json` ships the five files to `<ui alias>/text/`, installed through the `@ui/text` registry dependency of every pattern that imports `@tc96/ui/text`.

## Dependents

- `packages/ui/src/patterns`: `checklist` (header, item card), `collection` (kanban card), `surfaces/settings` (row, section header, collapsed), `toolbar` (collection toolbar).
- Storybook fixtures and templates under `apps/storybook/src` (collection renderers, settings usages, contact detail, companies).

## Invariants

- `TOKENS.md` and `text.tsx` carry the same classes; `scripts/ui-tokens.test.ts` fails when they drift.
- Four variants have defaults, `family="sans"`, `foreground="base"`, `size="base"` and `weight="normal"`, so a bare `Text` is body text in the theme foreground. `align`, `leading`, `tracking` and `truncate` have no default and set no class until passed.
- `size` follows the Tailwind scale one to one (`xs` to `8xl`, `text-<size>`), so the line height is the theme's for that size unless `leading` overrides it.
- A heading is `Text` with `render={<h2 />}` and `family="heading"`; the element, never the size, gives the level.
- `foreground="destructive"` reads `--destructive-foreground`, the text-on-surface pair, never `--destructive`.

## Styling

- `data-slot`: `text`.
- `textVariants` is exported for an element that cannot be passed to `render`; prefer `render`.
- `className` is merged last. Color is a `foreground` value; a raw color class on `Text` bypasses the theme.

## Verify

```bash
bun run typecheck && bun run storybook:typecheck
bun run check:ui-registry && bun run boundaries:check && bun run overrides:check
bun test scripts/ui-tokens.test.ts
cd apps/storybook && bunx vitest run --project=storybook src/ui/text
```

## Pointers

- `ACCESSIBILITY.md` and `TOKENS.md` (this folder).
- Stories: `apps/storybook/src/ui/text/`; the API text is `api-reference.mdx` there.
- Decision: `.specs/adr/0008-ui-owned-source.md`.
