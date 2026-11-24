# Menu

A menu is a list of actions or options that opens from a trigger and floats above the page: the account menu of the shell, the "more" button of a row, the view and column settings of a collection. It holds plain actions, links, checkbox and radio choices, grouped and separated, with optional icons and keyboard shortcuts, and it can open nested submenus. It is keyboard first: arrow keys move through the items, typing jumps to one, `Escape` closes and focus returns to the trigger.

The parts come from COSS on top of Base UI `Menu` and are owned by this repo (ADR 0008): every change to how a part looks starts in `TOKENS.md`, the blueprint, and is then copied into `menu.tsx`; a pattern never recreates or wraps a part to restyle it (decision of 2026-11-19). Storybook documents it in the six pages under `UI/Menu`: `API Reference` (the hand-written contract of every part, with the `Anatomy`), `Playground`, `Stories` (one per item state), `Behavior` (one `play` per guarantee), `Usages` (whole menus with real content) and `Layouts` (how the parts combine).

## Map

- `menu.tsx`: every part and the `DropdownMenu*` aliases.
- `index.ts`: the barrel `@tc96/ui/menu` resolves to.
- `TOKENS.md`: the blueprint and single source of truth of the look: every element of every part with its full class string, split into named rows (`layout`, `size`, `size:sm`, `color`, states).
- `ACCESSIBILITY.md`: roles, keyboard, contrast and touch decisions, with their measures.

## Architecture

- Layer: `packages/ui`, the bottom of `templates` → `parttens` → `ui` → `utils`. `menu.tsx` imports only Base UI, `@phosphor-icons/react` and `cn` from `@tc96/utils`.
- Resolution: `packages/ui/package.json` exports `./menu` as `./src/menu/index.ts`, ahead of the `./*` → `./src/*.tsx` pattern that serves the single-file components; `tsconfig.base.json` maps `@tc96/ui/*` to `packages/ui/src/*`, which reaches `menu/index.ts` as a folder index.
- Manifest: the `menu` item of `packages/ui/ui.manifest.json` lists the five files of this folder. `check:coss` fails on a file here that the manifest does not list.
- Scripts: `scripts/check-boundaries.ts` and `packages/registry/src/build-registry.ts` read a manifest path ending in `/index` as the folder module, so `@tc96/ui/menu` still resolves to the `menu` item.
- Consumer: the registry item `ui/menu.json` ships the five files to `<ui alias>/menu/`, so the consumer imports `<ui alias>/menu` and also receives the agent docs. A consumer that already has a single `menu.tsx` keeps it, and that file wins over the folder in module resolution.
- Theme: two rules of the consumer's stylesheet belong to the menu, the focus outline and the shortcut color (`apps/example/packages/ui/src/styles.css`); see `ACCESSIBILITY.md`.

## Dependents

- `packages/ui/src/chat/chat-message-actions.tsx`.
- `packages/parttens`: `collection` (data-grid and data-table submenus, filter submenu), `properties/composition/property-collection.tsx`, `action-bar`, `toolbar`, `flow/canvas`.
- `packages/blocks`: the shell user menu and workspace switcher, the workflow editor and agent builder.
- `context-menu.tsx` is a separate COSS item with its own copies of the item classes; an edit here does not reach it.

## Invariants

- The check of `MenuCheckboxItem` and `MenuRadioItem` sits in a trailing column after the label, as in `SelectItem` and the `switch` variant; the label span is `flex items-center gap-2`, so an icon may precede the text.
- `inset` padding equals the label start after an icon (`ps-7.5`, `sm:ps-7`), on items, link items, submenu triggers and group labels.
- `TOKENS.md` and `menu.tsx` carry the same classes: the rows of an element's table, joined, hold exactly the classes of its string. An edit that touches one and not the other is incomplete, and `scripts/ui-tokens.test.ts` fails on it.
- Items are 44px tall with a coarse pointer (`pointer-coarse:min-h-11`).
- `MenuShortcut` renders `aria-hidden`; an item with a shortcut sets `aria-keyshortcuts` (`Meta+K`).
- A disabled item ignores the pointer, so it says why it is disabled inside the item, not in a tooltip.
- `MenuPopup` is at least 160px wide (`min-w-40`) whatever `w-*` it gets, and pads the list by 8px (`p-2`). `MenuSubPopup` is a `MenuPopup` with `side="inline-end"` and `data-slot="menu-sub-content"`.
- Focus moves to the highlighted item (Base UI); keyboard focus shows through `:focus-visible`, so the pointer never draws the outline.

## Styling

- `data-slot`: `menu-trigger`, `menu-positioner`, `menu-popup`, `menu-sub-content`, `menu-group`, `menu-label`, `menu-item`, `menu-link-item`, `menu-checkbox-item`, `menu-radio-group`, `menu-radio-item`, `menu-separator`, `menu-shortcut`, `menu-sub`, `menu-sub-trigger`.
- `data-variant` (`default`, `destructive`) on items and link items; `data-inset` on items, link items, submenu triggers and group labels.
- Base UI state attributes used for style: `data-highlighted`, `data-disabled`, `data-checked`, `data-unchecked`, `data-popup-open`, `data-side`.
- Contrast is fixed in the theme, never in `menu.tsx`; the rules and their ratios are in `ACCESSIBILITY.md`.

## Verify

```bash
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check
bun test scripts/ui-tokens.test.ts   # TOKENS.md against the class strings
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/ui/menu
```

An edit of a class a pattern or template relies on runs the whole Storybook suite.

## Pointers

- `ACCESSIBILITY.md` (this folder): the menu's accessibility decisions and measures.
- `TOKENS.md` (this folder): the blueprint of every part.
- Stories: `apps/storybook/src/ui/menu/`; the API Reference is `api-reference.mdx` there, and the compositions the pages share are in `menu-layouts.tsx`. A change to a prop, a default or a `data-*` attribute updates that page by hand: nothing checks it.
- Decision and history: `docs/architecture/tc96-parttens.md` (`Itens de menu do COSS ficam em packages/ui`), `.specs/adr/0008-ui-owned-source.md`.
