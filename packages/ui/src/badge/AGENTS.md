# Badge

A badge is a short label that sits next to the thing it describes: the status of a record, the stage of a deal, a count of unread items, the plan of a workspace. It reads as part of the surrounding text, holds a few words or a number, and can carry a small icon before the text. It is a `span` by default and becomes a link or a button when it has to be clicked, for example a filter chip or a "New" label that opens the changelog.

The component comes from COSS, built on the Base UI `useRender` hook, and is owned by this repo (ADR 0008): every change to how it looks starts in `TOKENS.md`, the blueprint, and is then copied into `badge.tsx`; a pattern never recreates or wraps the badge to restyle it (decision of 2026-11-19). The Storybook node `UI/Badge` documents it in six pages: `API Reference` (MDX: import, anatomy, the contract of `Badge` and `badgeVariants`), `Playground` (text, variant, size, icon and element as controls), `Stories` (one story per variant, per non-default size and per element on the text-only base, with those props fixed and the text and icon as controls), `Behavior` (one `play` per guarantee), `Usages` (badges in context) and `Layouts` (the base with an icon); `Get Started/Component Docs` sets that structure.

## Map

- `badge.tsx`: `Badge`, `BadgeProps` and `badgeVariants`.
- `index.ts`: the barrel `@tc96/ui/badge` resolves to.
- `TOKENS.md`: the blueprint and single source of truth of the look: the base, the two sizes and each variant of `badgeVariants` as named rows (`layout`, `size`, `size:sm`, `color`, `dark`, `hover`).
- `ACCESSIBILITY.md`: roles, names, focus, contrast per variant and touch decisions, with their measures.

## Architecture

- Layer: `packages/ui`, the bottom of `templates` → `parttens` → `elements` → `ui` → `utils`. `badge.tsx` imports only Base UI (`useRender`, `mergeProps`), `class-variance-authority` and `cn` from `@tc96/utils`.
- Resolution: `packages/ui/package.json` exports `./badge` as `./src/badge/index.ts`, ahead of the `./*` → `./src/*.tsx` pattern; `tsconfig.base.json` maps `@tc96/ui/*` to `packages/ui/src/*`, which reaches `badge/index.ts` as a folder index.
- Manifest: the `badge` item of `packages/ui/ui.manifest.json` lists the five files of this folder and the status color tokens (`cssVars`). `check:coss` fails on a file here that the manifest does not list.
- Scripts: `scripts/check-boundaries.ts` and `packages/registry/src/build-registry.ts` read a manifest path ending in `/index` as the folder module, so `@tc96/ui/badge` resolves to the `badge` item.
- Consumer: the registry item `ui/badge.json` ships the five files to `<ui alias>/badge/`. A consumer that already has a single `badge.tsx` keeps it, and that file wins over the folder in module resolution.
- Theme: no rule of the consumer's stylesheet targets the badge; the status pairs come from the manifest tokens.

## Dependents

- `packages/parttens`: `collection` (data-grid, kanban and list layouts, shared components), `properties/shared` (`PropertySurface` chips), `records/group` (`RecordStatusBadge`), `widgets` (crm, gamification, productivity, shared), `flow` (canvas, inspector, step library), `chat` (assistant panel, chats panel item).
- `packages/templates/src/application/shell/shared`.
- `sidebar.tsx` has its own `SidebarMenuBadge`; an edit here does not reach it.
- `RecordStatusBadge` and the `PropertySurface` chips build on `Badge` with their own classes; read `records/group/AGENTS.md` and `properties/AGENTS.md` before changing the radius, height or padding here.

## Invariants

- `TOKENS.md` and `badge.tsx` carry the same classes: the rows of a table, joined, hold exactly the classes of that `cva` string. An edit that touches one and not the other is incomplete, and `scripts/ui-tokens.test.ts` fails on it.
- Every variant keeps a 1px border (`border-transparent` in the base), so badges of different variants line up at the same height.
- The hover color, the pointer cursor and the 44px coarse hit area apply only when the badge renders as a `button` or an `a` (`[button&,a&]`); a `span` badge never looks clickable.
- The filled variant on `--primary` is named `primary`, not the COSS `default`, and is the default variant (decision of 2026-11-20); `DataGridColumnMeta.badgeVariant` uses the same names.
- Two sizes only, `default` and `large` (the COSS `lg`), with two heights: 20px and 24px at every width. No class of a size changes at a breakpoint, so height, text (12px, 14px) and icon (12px, 14px) stay fixed (decision of 2026-11-20). The COSS `sm` (10px text) is removed and must not come back. A count on an icon button uses `default`.
- A count badge is round through the consumer's `className="rounded-full"`; `min-w-*` equal to `h-*` in every size keeps a one-digit count a circle.

## Styling

- `data-slot`: `badge`.
- `badgeVariants` is exported, so a pattern can give another element the badge look (`badgeVariants({ variant: 'outline' })`); prefer `render` when the element can be passed.
- A pattern that changes the radius, border or shadow of a `Badge` needs an entry in `scripts/override-exceptions.json`.

## Verify

```bash
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check
bun test scripts/ui-tokens.test.ts   # TOKENS.md against the class strings
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/ui/badge
```

An edit of a class a pattern or template relies on runs the whole Storybook suite.

## Pointers

- `ACCESSIBILITY.md` (this folder): the badge's accessibility decisions and measures.
- `TOKENS.md` (this folder): the blueprint of the base, sizes and variants.
- Stories: `apps/storybook/src/ui/badge/`; the API text is `api-reference.mdx` there, and the value lists, Playground controls and shared compositions are `badge-variants.ts`, `badge-controls.ts` and `badge-layouts.tsx`.
- Decision and history: `docs/architecture/tc96-parttens.md` (`Badge em pasta própria em packages/ui`), `.specs/adr/0008-ui-owned-source.md`.
