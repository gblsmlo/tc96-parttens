# Detail sheet pattern

Guide for agents working in `packages/parttens/src/detail-sheet`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only at the boundary with an external `className`, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder follows the pattern structure described there (`components/`, `hooks/`, `core.ts`), the same layout as `checklist`, `collection-views` and `editable`, and it is the one pattern whose Tailwind revision is still pending (see "Pending revision").

## What it is

A controlled detail sheet: the consumer passes the Base UI dialog state (`open`, `onOpenChange`) and the pattern renders a right-side COSS `Sheet` with a header (title, description, actions, close button), a scrollable panel and an optional footer. `DetailGroup` and `DetailRow` lay out the panel content as titled `Card` sections with label/value rows, and `DetailSheetAction` is the icon button with tooltip meant for the header. The pattern keeps no state of its own.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `components/detail-sheet/index.ts` | yes |
| `core.ts` | the React-free surface: re-exports the four props types from `components/detail-sheet/core.ts` | workspace only; not reached from the barrel |
| `components/detail-sheet/index.ts` | exports `DetailSheet`, `DetailGroup`, `DetailRow`, `DetailSheetAction` and their props types | through the barrel |
| `components/detail-sheet/core.ts` | re-exports `DetailGroupProps`, `DetailRowProps`, `DetailSheetActionProps`, `DetailSheetProps` from `./index`; imported only by the pattern's `core.ts` | workspace only; not reached from the barrel |
| `components/detail-sheet/detail-sheet.tsx` | `DetailSheet`, `DetailSheetProps`: the `Sheet` root, the right-side `SheetPopup`, header, `SheetPanel` and `SheetFooter` | yes |
| `components/detail-sheet/detail-group.tsx` | `DetailGroup`, `DetailGroupProps`: a `section` with an `h3` heading, description, action slot and a `Card` for the rows | yes |
| `components/detail-sheet/detail-row.tsx` | `DetailRow`, `DetailRowProps`: a `div` row with leading icon tile, label, description and right-aligned value | yes |
| `components/detail-sheet/detail-sheet-action.tsx` | `DetailSheetAction`, `DetailSheetActionProps`: an `icon-sm` `Button` wrapped in a `Tooltip` | yes |
| `hooks/use-media-query.ts` | `useMediaQuery`, `useIsMobile`, `MediaQueryInput` and the `BREAKPOINTS` map over `matchMedia` and `useSyncExternalStore` | no: nothing in the repo imports it and the barrel does not reach it |
| `styles/global.css` | a full Tailwind entry: `@import "tailwindcss"` and the Inter and Geist Mono fonts, `@source`, `@custom-variant dark`, an `@theme inline` block with color, radius, font and animation tokens, `:root` and `.dark` token values and an `@layer base` reset | no: nothing in the repo imports it (apps included), the registry does not ship it, and it stays only until this pattern's revision, per the root `AGENTS.md` |

The pattern has no test file and no `test/dom.ts`. `scripts/test-patterns.ts` skips a folder without `*.test.ts(x)`, and `bun test packages/parttens/src/detail-sheet` exits 1 with no tests found.

Only what `index.ts` exports is public. The registry (`packages/registry/src/build-registry.ts`) starts at `packages/parttens/src/detail-sheet/index.ts` and follows the import graph with `ts.preProcessFile`, so `dist/registry/detail-sheet.json` ships six files: the two barrels and the four component files. `hooks/use-media-query.ts` and `styles/global.css` are not reached and are not shipped; the CSS would also fail `assertDistributable` in `packages/registry/src/manifest.ts`, which rejects any file containing `:root`, `.dark`, `@theme` or `@utility`. A new file must be imported from one of the shipped files, and nothing in `components/` should be exported from the barrel without a reason recorded in `docs/architecture/tc96-parttens.md`.

Import direction inside the folder: `index.ts` → `components/detail-sheet/index.ts` → the four component files. The components import only COSS (`@tc96/ui/sheet`, `@tc96/ui/button`, `@tc96/ui/card`, `@tc96/ui/tooltip`), `cn` from `@tc96/utils`, `XIcon` from `lucide-react`, the `Dialog` type from `@base-ui/react/dialog` and React; no component imports `hooks/`. `core.ts` imports only `components/detail-sheet/core.ts`.

## Public API

```ts
interface DetailSheetProps extends Omit<Dialog.Root.Props, 'children'> {
  // Base UI Dialog.Root: open, defaultOpen, onOpenChange, modal (default true), ...
  actions?: ReactNode          // header slot, rendered before the close button
  children?: ReactNode         // the SheetPanel content
  description?: ReactNode
  footer?: ReactNode           // renders a SheetFooter only when present
  showCloseButton?: boolean    // default true
  title?: ReactNode
}

interface DetailGroupProps extends Omit<ComponentProps<'section'>, 'title'> {
  action?: ReactNode           // right of the heading
  children?: ReactNode         // rendered inside the Card
  description?: ReactNode
  title?: ReactNode
}

interface DetailRowProps extends ComponentProps<'div'> {
  description?: ReactNode
  label: ReactNode
  leading?: ReactNode          // icon tile; a React element is cloned with size={16}
  value?: ReactNode
}

interface DetailSheetActionProps
  extends Omit<ButtonProps, 'aria-label' | 'children' | 'render' | 'size'> {
  children: ReactNode          // the icon
  label: string                // becomes aria-label and the tooltip text
}
```

`useMediaQuery` and `useIsMobile` are not part of the public API: `index.ts` does not reach `hooks/use-media-query.ts`, and `docs/architecture/public-api-exports.json` lists only the four components and their props types for `detail-sheet`.

Behavior worth knowing before changing it:

- Open and close are controlled by the Base UI `Dialog.Root` props the consumer spreads into `Sheet` (`open`, `defaultOpen`, `onOpenChange`, `modal`, `disablePointerDismissal`); `DetailSheet` keeps no state and has no trigger slot.
- The sheet is always a right-side `SheetPopup` (`side="right"`, `max-w-md` from COSS). The pattern never calls `useMediaQuery` or `useIsMobile`, so there is no viewport-based switch between sheet, dialog or drawer; the hook is present but unused.
- The header renders only when `title`, `description`, `actions` or `showCloseButton` is truthy. The COSS close button is turned off (`showCloseButton={false}` on `SheetPopup`) and replaced by the pattern's own `SheetClose` rendered as `Button size="icon-sm" variant="ghost"` with the hard-coded `aria-label="Fechar detalhes"`.
- Focus trapping, backdrop and dismissal come from Base UI through the COSS `Sheet`; scrolling comes from `SheetPanel`, which wraps its content in the COSS `ScrollArea` with `overscrollContain` and `scrollFade`.
- `DetailGroup` renders its heading as an `h3` whatever the nesting, and only when `title`, `description` or `action` exists; the rows always sit inside a `Card`.
- `DetailRow` draws `border-t` and removes it on the first row (`first:border-t-0`), so separators depend on the rows being direct siblings inside the `Card`. A valid React element passed as `leading` is cloned with `size: 16`; any other node is rendered as is.
- `DetailSheetAction` forces `size="icon-sm"`, defaults `variant` to `ghost`, and uses `label` both as `aria-label` and as the `TooltipPopup` text.
- No test asserts any of this today.

## Styling contract

The pattern sets no state attribute of its own. The open and transition states on the popup (`data-starting-style`, `data-ending-style`) come from Base UI and are styled by the COSS `sheet.tsx`. What the pattern sets or reads:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-slot="detail-group-content"` | the `Card` in `DetailGroup` | consumers; the pattern puts `shadow-none before:hidden` on the `Card` directly |
| `data-slot="detail-sheet-row"` | the `div` of `DetailRow` | consumers; the row styles itself with `border-t first:border-t-0` |
| `[data-slot=sheet-popup]:has([data-slot=sheet-header])` | read by `in-[...]:pt-4` on `SheetPanel` | restores `pt-4` where COSS sets `pt-1` when a header is present |

There is no `cva` variant and no `lib/variants.ts`: every class is an inline string in the component file, so the Tailwind scanner sees it whole. Colors come only from theme tokens (`text-muted-foreground`, `bg-muted`, the `border` default from the base layer); no palette colors. `scripts/override-exceptions.json` has no entry for this pattern: `shadow-none` is in the neutral list of `scripts/check-overrides.ts`, `before:hidden` is not a watched category, and `p-4` on `SheetHeader`, `p-4` on `SheetPanel` and `px-4` on `SheetFooter` are spacing, which the check does not watch, so `overrides:check` passes without an exception.

`data-slot` names set by the pattern: `detail-group-content`, `detail-sheet-row`. COSS slots it depends on: `sheet-popup`, `sheet-header`, `sheet-panel`, `sheet-footer`, `sheet-title`, `sheet-description`, `sheet-close`, `card`.

### Pending revision

This pattern has not been through the Tailwind review the other patterns received on 2026-10-03; the decisions are in `docs/architecture/tc96-parttens.md`, section "Acessibilidade dos patterns". That review should also remove `styles/global.css`, as it did for `collection-views`, `properties` and `editable`, since patterns carry no CSS. Until then, do not touch the pattern's code or its CSS as part of unrelated work.

## Verify

```bash
bunx biome check packages/parttens/src/detail-sheet
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun run build:registry
```

There is no `bun test` line because the pattern has no test file. There are no stories for this pattern: `apps/storybook/src/` has no file that imports `DetailSheet`, `DetailGroup`, `DetailRow` or `DetailSheetAction`, so nothing in `storybook:test` exercises it.
