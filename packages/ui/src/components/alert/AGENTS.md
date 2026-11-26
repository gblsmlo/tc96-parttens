# Alert

An alert is a callout in the flow of the page that tells the user something they should act on or know now: a failed payment, a trial about to end, a new version to reload, a step that nothing reaches. It holds an optional status icon, a title, a description of one or more paragraphs and optional actions. It is announced when it appears (`role="alert"`), so it is rendered when the message happens, not as static copy on load.

The parts come from COSS and are owned by this repo (ADR 0008): every change to how a part looks starts in `TOKENS.md`, the blueprint, and is then copied into `alert.tsx`; a pattern never recreates or wraps a part to restyle it (decision of 2026-11-19). The Storybook node `UI/Alert` documents it in six pages: `API Reference` (MDX: import, anatomy and the contract of each part), `Playground` (title, description, variant, icon and actions as controls), `Stories` (one story per variant on the icon, title and description base, with the variant fixed and the texts, icon and actions as controls), `Behavior` (one `play` per guarantee), `Usages` (real messages) and `Layouts` (the base without an icon or description, with actions, with paragraphs); `Get Started/Component Docs` sets that structure.

## Map

- `alert.tsx`: `Alert`, `AlertTitle`, `AlertDescription` and `AlertAction`.
- `index.ts`: the barrel `@tc96/ui/alert` resolves to.
- `TOKENS.md`: the blueprint and single source of truth of the look: the base, each variant of `alertVariants` and each part as named rows (`layout`, `columns`, `size`, `color`, `icon`).
- `ACCESSIBILITY.md`: role, names, contrast per variant and layout decisions, with their measures.

## Architecture

- Layer: `packages/ui`, the bottom of `templates` → `parttens` → `ui` → `utils`. `alert.tsx` imports only `class-variance-authority` and `cn` from `@tc96/utils`.
- Resolution: `packages/ui/package.json` exports `./alert` as `./src/alert/index.ts`, ahead of the `./*` → `./src/*.tsx` pattern; `tsconfig.base.json` maps `@tc96/ui/*` to `packages/ui/src/*`, which reaches `alert/index.ts` as a folder index.
- Manifest: the `alert` item of `packages/ui/ui.manifest.json` lists the five files of this folder and the status color tokens (`cssVars`). `check:ui-registry` fails on a file here that the manifest does not list.
- Scripts: `scripts/check-boundaries.ts` and `packages/registry/src/build-registry.ts` read a manifest path ending in `/index` as the folder module, so `@tc96/ui/alert` resolves to the `alert` item.
- Consumer: the registry item `ui/alert.json` ships the five files to `<ui alias>/alert/`. A consumer that already has a single `alert.tsx` keeps it, and that file wins over the folder in module resolution.
- Theme: one rule of the consumer's stylesheet belongs to the alert, `[data-slot="alert"]` redefining `--success` and `--warning` as their `-foreground` (`apps/example/packages/ui/src/styles.css`), shared with `[data-slot="toast-icon"]`; see `ACCESSIBILITY.md`.

## Dependents

- `packages/ui/src/patterns/flow/inspector/composition/flow-inspector/flow-inspector.tsx`: the `unconnected` warning, which sets `[&>svg]:text-warning-foreground` itself so its icon passes without the theme rule.
- `alert-dialog.tsx` is a separate COSS item (a modal dialog); an edit here does not reach it.

## Invariants

- `TOKENS.md` and `alert.tsx` carry the same classes: the rows of a table, joined, hold exactly the classes of that string. An edit that touches one and not the other is incomplete, and `scripts/ui-tokens.test.ts` fails on it.
- Every variant keeps the plain 1px `--border`, as the `Card` does; the status shows in the icon and the 4% tint, never in a tinted border (decision of 2026-11-02).
- The root always renders `role="alert"`. A message that is on screen from the first render passes `role="status"` or no live role through props, which spread after the default.
- The icon column opens only for an `svg` that is a direct child (`has-[>svg]`); an icon wrapped in another element lands in the text column.
- The action buttons are the `Button` at `size="sm"`, not the `xs` of the COSS examples (decision of 2026-11-02).
- From `sm` the action sits in the last column, centered across the title and description rows; below `sm` it drops under the text.

## Styling

- `data-slot`: `alert`, `alert-title`, `alert-description`, `alert-action`. `AlertTitle`, `AlertDescription` and `AlertAction` place themselves against `svg` and `[data-slot=alert-*]` siblings, so a replacement element keeps the slot.
- `alertVariants` is not exported.
- A pattern that changes the radius, border or shadow of an `Alert` needs an entry in `scripts/override-exceptions.json`.
- Contrast is fixed in the theme, never in `alert.tsx`; the rule and its ratios are in `ACCESSIBILITY.md`.

## Verify

```bash
bun run typecheck && bun run storybook:typecheck
bun run check:ui-registry && bun run boundaries:check && bun run overrides:check
bun test scripts/ui-tokens.test.ts   # TOKENS.md against the class strings
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/ui/alert
```

An edit of a class the flow inspector relies on runs `src/patterns/flow` as well.

## Pointers

- `ACCESSIBILITY.md` (this folder): the alert's accessibility decisions and measures.
- `TOKENS.md` (this folder): the blueprint of every part.
- Stories: `apps/storybook/src/ui/alert/`; the API text is `api-reference.mdx` there, `alert-layouts.tsx` holds the compositions that `Layouts` shows and `Behavior` tests plus the `ComposedAlert` that `Playground` and `Stories` render, and `alert-controls.ts` holds their args.
- Decision and history: `docs/architecture/tc96-ui.md` (`Alert em pasta própria em packages/ui`), `.specs/adr/0008-ui-owned-source.md`.
