# Detail sheet pattern

A controlled detail sheet: the consumer passes the Base UI dialog state (`open`, `onOpenChange`) and `DetailSheet` renders a right-side COSS `Sheet` with a header (title, description, actions, close button), a scrollable panel and an optional footer. `DetailGroup` and `DetailRow` lay out the panel as titled `Card` sections with label/value rows, and `DetailSheetAction` is the icon button with tooltip meant for the header. The pattern never fetches or persists and keeps no state of its own; it is the one pattern that still carries a CSS file (`styles/global.css`) until its Tailwind revision.

## Map

| Folder | Holds |
| --- | --- |
| `components/detail-sheet/` | the four components, their barrel `index.ts` and a `core.ts` that re-exports the four props types |
| `hooks/` | `useMediaQuery`, `useIsMobile` and `BREAKPOINTS` over `matchMedia`; nothing in the repo imports it and the barrel does not reach it |
| `styles/` | `global.css`, a full Tailwind entry with theme tokens; nothing imports it (apps included) |
| `core.ts` | React-free surface: the four props types; workspace only, not reached from the barrel |

Import direction: `index.ts` → `components/detail-sheet/index.ts` → the four component files; `core.ts` → `components/detail-sheet/core.ts` only. Components import only COSS (`sheet`, `button`, `card`, `tooltip`), `cn`, `XIcon` from `lucide-react` and the `Dialog` type from `@base-ui/react/dialog`; no component imports `hooks/`.

There is no test file and no `test/dom.ts`.

## Dependents

- No code outside the pattern imports a detail-sheet file by path.
- `packages/parttens/src/index.ts` re-exports `detail-sheet/index`.
- The folder name `detail-sheet` is listed in `patternNames` (`packages/registry/src/manifest.ts`) and in `scripts/test-patterns.ts`; the registry build starts at `detail-sheet/index.ts`. Renaming the folder or its barrel breaks the registry.

## Invariants

Sheet:

- Open and close come only from the Base UI `Dialog.Root` props the consumer spreads into `Sheet` (`open`, `defaultOpen`, `onOpenChange`, `modal`, `disablePointerDismissal`); there is no trigger slot.
- The sheet is always a right-side `SheetPopup` (`max-w-md` from COSS). `useMediaQuery` and `useIsMobile` are present but unused, so there is no viewport switch between sheet, dialog or drawer.
- The header renders only when `title`, `description`, `actions` or `showCloseButton` is truthy. The COSS close button is off (`showCloseButton={false}` on `SheetPopup`) and replaced by the pattern's own `SheetClose` as a ghost `icon-sm` `Button` with the hard-coded `aria-label="Fechar detalhes"`.
- Focus trap, backdrop and dismissal come from Base UI through the COSS `Sheet`; scrolling comes from `SheetPanel`, which wraps content in the COSS `ScrollArea` with `overscrollContain` and `scrollFade`.

Groups, rows and actions:

- `DetailGroup` renders its heading as an `h3` whatever the nesting, and only when `title`, `description` or `action` exists; the rows always sit inside a `Card`.
- `DetailRow` draws `border-t` and removes it with `first:border-t-0`, so separators depend on the rows being direct siblings inside the `Card`. A valid React element passed as `leading` is cloned with `size: 16`; any other node renders as is.
- `DetailSheetAction` forces `size="icon-sm"` and uses `label` both as `aria-label` and as the `TooltipPopup` text.
- No test asserts any of this today.

Registry:

- The registry ships six files: the two barrels and the four component files. `hooks/use-media-query.ts`, `core.ts` and `styles/global.css` are not reached; a new file ships only if a shipped file imports it. The CSS would also fail `assertDistributable` in `packages/registry/src/manifest.ts`, which rejects `:root`, `.dark`, `@theme` or `@utility`.

Pending revision:

- This pattern has not been through the Tailwind review the other patterns received on 2026-10-03. That review should also remove `styles/global.css`, since patterns carry no CSS. Until then, do not touch the pattern's code or its CSS as part of unrelated work.

## Styling

The pattern sets no state attribute of its own; `data-starting-style` and `data-ending-style` on the popup come from Base UI and are styled by `packages/ui/src/sheet.tsx`.

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-slot="detail-group-content"` | the `Card` in `DetailGroup` | consumers; the pattern puts `shadow-none before:hidden` on the `Card` directly |
| `data-slot="detail-sheet-row"` | the `div` of `DetailRow` | consumers; the row styles itself with `border-t first:border-t-0` |
| `[data-slot=sheet-popup]:has([data-slot=sheet-header])` | read by `in-[...]:pt-4` on `SheetPanel` | restores `pt-4` where COSS sets `pt-1` when a header is present |

- COSS slots the pattern depends on: `sheet-popup`, `sheet-header`, `sheet-panel`, `sheet-footer`, `sheet-title`, `sheet-description`, `sheet-close`, `card`.
- No `cva` variant: every class is an inline string in the component file. Colors only from theme tokens (`text-muted-foreground`, `bg-muted`, the base-layer `border`), no palette colors.
- `scripts/override-exceptions.json` has no entry here: `shadow-none` is in the neutral list of `scripts/check-overrides.ts`, `before:hidden` is not a watched category, and the `p-4`/`px-4` on `SheetHeader`, `SheetPanel` and `SheetFooter` are spacing, which the check does not watch.

## Verify

```bash
bunx biome check packages/parttens/src/detail-sheet
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun run build:registry
```

No `bun test` line: with no test file, `scripts/test-patterns.ts` skips the folder and `bun test packages/parttens/src/detail-sheet` exits 1. No story imports any detail-sheet component, so `storybook:test` does not exercise it.

## Pointers

- Public API: `index.ts` and the `detail-sheet` entry of `docs/architecture/public-api-exports.json` (the four components and their props types). Props and defaults are in each component's source. Exporting anything new from the barrel needs a reason recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-parttens.md`, sections "Estrutura interna dos patterns" (why `styles/global.css` remains) and "Acessibilidade dos patterns" (the Tailwind review this pattern has not had yet).
