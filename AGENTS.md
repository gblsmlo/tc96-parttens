# AGENTS.md

Guide for AI coding agents working in this repository. For product context read `README.md`; for boundaries and decisions read `docs/architecture/tc96-parttens.md` (written in Portuguese).

## What this repo is

`@tc96/parttens` is a set of React patterns (collection views, properties, detail sheet, editable, checklist, widgets) that a CLI copies as source into a consumer's workspace. Patterns carry no business rules, no CSS, no tokens and no theme: only layout classes on top of the consumer's COSS components.

Stack: Bun workspaces, React 19, TypeScript, Tailwind CSS v4, Base UI, Storybook 10, Biome.

## Layout

```text
packages/
  parttens/    pattern source (collection-views, properties, detail-sheet, editable, checklist, widgets)
  elements/    components COSS does not have (Text, IconFrame)
  helpers/     React-free functions (amount formatting, dates)
  ui/          COSS components, unmodified, locked by coss.lock.json
  utils/       shared helpers (cn)
  registry/    registry build and the CLI published as @tc96/parttens
apps/
  storybook/   stories and interaction tests
  example/     example consumer; owns the theme (apps/example/packages/ui/src/styles.css)
  docs/        documentation site
docs/architecture/  boundaries and decisions
scripts/            boundary, COSS, override and public API checks
```

## Rules that are enforced by scripts

- **Layering:** imports only go down: `parttens` → `elements` → `ui` → `utils` (`helpers` is React-free). Checked by `bun run boundaries:check`.
- **`packages/ui` is read-only.** It is a COSS snapshot; `bun run check:coss` rejects any file that is not a COSS item. Never edit it by hand; use `bun run sync:coss`. Themes and tokens belong to the consumer, not to `packages/ui`.
- **Overriding COSS styles needs a registered exception.** Any `className` that overrides a COSS component's border, radius, etc. must be listed with a reason in `scripts/override-exceptions.json`, or `bun run overrides:check` fails. Update the entry whenever the class changes.
- **Public API baseline:** adding or removing exports changes `docs/architecture/public-api-exports.json`. Regenerate with `bun scripts/verify-public-api.ts --record` and mention it in the summary, since the diff may include unrelated pending exports.
- Pattern `shared/` code is internal; export through the pattern's `index.ts` only when it is meant to be public.

## Commands

```bash
bun install
bun run storybook            # dev server
bun run typecheck            # tsc --noEmit
bun run storybook:typecheck
bun run lint:ci              # biome on scripts and registry
bun run storybook:lint
bun run check:coss && bun run boundaries:check && bun run overrides:check
bun run verify:public-api
bun run test                 # ui/utils, helpers, boundaries, patterns, registry
bun run storybook:test       # vitest browser + axe (a11y violations fail)
bun run check                # full gate; run before a release or PR
```

Run a single pattern's tests from the repo root, for example `bun test packages/parttens/src/widgets`. Running `bun test packages/parttens` as a whole hits failures that exist before your change; use `scripts/test-patterns.ts` (`bun run test:patterns`) for the supported run.

Before reporting a change as done, run Biome on the files you touched, `typecheck`, the relevant tests and the three check scripts above.

## Code conventions

- Biome formatting: 2 spaces, single quotes, no semicolons. Do not hand-format against it.
- **No comments in pattern or component code** (no JSDoc, no inline notes). The component name, its types and `docs/architecture/tc96-parttens.md` carry the explanation. Exception: exported functions in `packages/helpers` get JSDoc in English, with `@param` when a parameter is not obvious and `@returns` when it helps.
- Use `cn` from `@tc96/utils` for class merging and import COSS components through `@tc96/ui/<component>`.
- Components are controlled: the consumer passes prepared data and handles events. No fetching, filtering, sorting or persistence inside a pattern.
- Widgets render through `CardWidgetShell` (`packages/parttens/src/widgets/shared/card-widget-shell.tsx`); keep card radius, border and shadow decisions there.
- Prefer composition and the existing shared widgets (`IconFrame`, metric, stat list, avatar stack) over new one-off markup.
- Docs and architecture decisions are in Portuguese; code, stories, README and this file are in English.

## Visual work (widgets, stories, theme)

- Stories live in `apps/storybook/src/patterns/`. The Storybook theme is the example app's `styles.css`, imported by `.storybook/preview.ts`; do not add a separate theme file or CSS rule in Storybook.
- Do not give story wrappers a background, so the page inherits `bg-background` and card contrast stays visible.
- When refining a visual pattern, also audit contrast (WCAG 4.5:1 for text, 3:1 for graphics, with the numeric ratios), spacing and composition, check a light and dark screenshot of the story, and record scale decisions in the architecture doc. Token findings are notes for the consumer, not fixes in `packages/ui`.
- Stories must pass axe: `a11y.test` is set to `error`.

## Git

- Work on a feature branch; `main` is the base for PRs.
- Commit messages follow `feat: ...` style seen in `git log`.
- Do not commit, push or publish unless asked. Before any npm publish, stop and ask the user to run `npm login`.
