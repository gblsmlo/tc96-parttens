# Rich text editor pattern

A Notion-style editor on Plate (Slate) with every UI piece taken from COSS, plus a page title. `RichTextEditor` renders an editable area with no box of its own, a floating toolbar over the selection, a `/` menu for blocks, an optional `@` menu for mentions and an optional drag handle per top-level block; `EditorTitle` is an `h1` around a borderless `textarea` that never keeps a line break. The vocabulary is closed: `RICH_TEXT_ELEMENTS` and `RICH_TEXT_MARKS` name every node type the editor emits. The pattern never uploads, fetches, persists or ships CSS; its only state is the Plate editor instance (seeded once by `defaultValue`; there is no `value` or read-only prop), the title draft, the active menu option and the toolbar's dismissed selection.

## Map

The folder is flat; files by role:

| Files | Hold |
| --- | --- |
| `rich-text-editor.tsx`, `editor-title.tsx` | the two components, their props and ref handles, and `withoutSlashInput`, the `onValueChange` filter |
| `plugins.tsx` | `richTextEditorOptions` (the whole Plate setup), core elements and leaves, input rules, normalizers, `applyBlock`, the vocabulary arrays |
| `extra-blocks.tsx`, `block-draggable.tsx` | the blocks reachable only from the `/` menu, `insertImage`, and the opt-in drag and block selection plugins |
| `slash-menu.tsx`, `floating-toolbar.tsx`, `link-button.tsx` | `useSlashMenu` and the listbox shared by `/` and `@`; the toolbar with the block `Select`, mark and block toggles and the link popover |
| `test/dom.ts` | the JSDOM setup the tests import |
| `index.ts` | the barrel; internal names (`useSlashMenu`, `richTextEditorOptions`, `blockDragPlugins`, `withoutSlashInput`) stay out of it |

Import direction: `rich-text-editor.tsx` → every other file except `editor-title.tsx`; `plugins.tsx` → `block-draggable.tsx`, `extra-blocks.tsx`; `slash-menu.tsx` → `plugins.tsx`, `extra-blocks.tsx` and `blockIcon` from `floating-toolbar.tsx`; `floating-toolbar.tsx` → `link-button.tsx`, `plugins.tsx`; `editor-title.tsx` imports nothing from the folder. Outside it: `@tc96/helpers/rich-text` (`flattenTitle`, `formatTitleCounter`, `stripRichTextNodeIds`), COSS and `@tc96/utils`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `rich-text-editor/index`. Storybook, including `apps/storybook/src/test-utils/usage-kit.tsx`, imports through `@tc96/parttens`; no code outside the folder imports one of its files by path.
- The folder name is listed in `packages/registry/src/manifest.ts` (`patternNames`) and `scripts/test-patterns.ts`. Renaming it needs both updated.
- `packages/registry/src/build-registry.ts` turns every external import into a registry dependency versioned from `packages/parttens/package.json`, and throws `Missing dependency version` when the entry is absent. A new `@platejs/*` or `react-dnd` import needs its entry there.

## Invariants

Document:

- The emitted document never carries node ids or a trigger input. The editor runs with `nodeId: { initialValueIds: 'always' }` because block selection and drag need ids; `withoutSlashInput` skips any value containing `slash_input` or `mention_input` (`hasTriggerInput`) and passes the rest through `stripRichTextNodeIds`. `plugins.test.tsx` and `slash-menu.test.tsx` cover both.
- `richTextEditorOptions` throws `RangeError` unless `maxListDepth` is an integer of at least 1. Lists deeper than the cap are flattened on normalize; Tab without room and Shift+Tab at depth 1 return `false`, so focus leaves the editor by keyboard.
- Lists are Plate's classic model (`ul`, `ol`, `li`, `lic`) with `TaskListPlugin` disabled. A blockquote flattens blocks pasted inside it, with a line break between them.
- There is no free text color: highlight is the boolean `highlight` leaf, because a fixed color stored in the document would not follow the consumer's dark theme.

Formatting:

- `applyBlock` is the single path for the toolbar toggles, the block `Select`, markdown shortcuts and the `/` menu: lists go through `toggleList`, any other block first unwraps a list item.
- A markdown shortcut does not fire inside a block of the same type, list shortcuts do not fire inside a list item, and underline has no input rule. `h1` is reserved for `EditorTitle`, so `#` and pasted `H1` make `h2`, and pasted `H4` to `H6` make `h3`.

Menus:

- `slash_input` is a non-void inline whose text is the `/` and the query, instead of Plate's void input, which would steal focus. The listbox never takes focus: `PlateContent` carries `aria-activedescendant` and `aria-controls`, options have `tabIndex={-1}` and a prevented `onMouseDown`, and keys are handled in the editable. `aria-expanded` stays off the editable because axe rejects it on `role="textbox"`.
- Enter with no match dismisses and lets the event through; Escape dismisses to literal text; Space with an empty query or no match dismisses. Blur, the cursor leaving the node (`unwrapStaleTriggerInputs`) and an empty or prefix-less node (`triggerNormalizer`) also unwrap or remove it.
- `@` reuses `useSlashMenu` with `MENTION_INPUT_TYPE` and exists only when `mentions` is passed; the editor never searches people. The image option exists only with `onPickImage`; the pattern never uploads or stores a file.

Toolbar and focus:

- The toolbar is Base UI's unstyled `ToolbarPrimitive.Root`, not the COSS `Toolbar`, whose border, radius and background would duplicate the popup frame and need an override.
- It opens only while the selection is expanded with text, the pointer is up and focus is inside the editable, the toolbar, a `[data-slot=select-popup]` or a `[data-slot=popover-popup]`, so the block `Select` and link popover count as inside. Escape dismisses it for that selection; `Alt+F10` focuses the first `[data-slot=toolbar-button]`.
- `onExitStart` fires on ArrowUp on the first visual line of the first block, or on Backspace at the document start only when the first block is a paragraph. `EditorTitle` hands Enter to `onEnter` and ArrowDown at the end to `onArrowDownAtEnd`; with `focusStart()` and `focusEnd()` the consumer moves focus between title and body.
- `EditorTitle` flattens line breaks on change and keeps the caret in place; while empty it renders `emptyLabel` as `sr-only` inside the `h1`.

Block drag:

- Only top-level blocks (`path.length === 1`) get a handle and can be selected. Escape in the editor selects the current block only when `draggableBlocks` is on.
- The selection plugin's hidden input gets its `aria-label` and a native `keydown` listener, because React's `onKeyDown` never fired in that portal.

Copy: default labels are pt-BR props; the date block formats with `Intl.DateTimeFormat('pt-BR')`; links render with `target="_blank"` and `rel="noopener noreferrer"`.

## Styling

| Attribute | Where |
| --- | --- |
| `data-highlighted` | the active `[data-slot=slash-menu-option]`, styled by `data-highlighted:` in the same class string, not a conditional pair |
| `data-block-selected` | a selected `[data-slot=rich-text-block]`; for consumers only, since the pattern draws selection with a `bg-primary/12` overlay |
| `data-slot` | `rich-text-editor`, `rich-text-editor-content`, `rich-text-block`, `floating-toolbar`, `slash-menu`, `slash-menu-option`, `slash-menu-status`, `editor-title`, `editor-title-heading`, `editor-title-field`, `editor-title-counter` |

- No `cva`: every class is a literal string. Dragging is `isDragging && 'opacity-50'` through `cn`, not a `data-*` attribute.
- Colors only from theme tokens with opacity modifiers; highlight is `bg-warning/30 text-foreground dark:bg-warning/25`, not a palette yellow.
- The drag handle wrapper is `opacity-0` and shows with `group-hover/block:opacity-100`, `focus-within:opacity-100` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch.
- The caret is the focus indicator: the editable and the title field carry `outline-none`, and the title's `h1` draws no focus background, removed by the owner on 2026-10-09.
- `scripts/override-exceptions.json` has no entry for this pattern.

## Verify

```bash
bun test --isolate packages/parttens/src/rich-text-editor
bunx biome check packages/parttens/src/rich-text-editor
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/rich-text-editor
```

Stories in `apps/storybook/src/patterns/rich-text-editor/` run axe with `test: 'error'`. The editor and title stories scope `aria-hidden-focus` to `[aria-hidden="true"]:not([data-base-ui-focus-guard])`, because the Base UI `Popover` focus guards belong to COSS.

## Pointers

- Public API: `index.ts` and the `rich-text-editor` entry of `docs/architecture/public-api-exports.json`. Props and defaults are in `rich-text-editor.tsx` and `editor-title.tsx`. The registry ships every file the barrel reaches, so a new file must be imported from one of them; exporting an internal name needs a reason recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-parttens.md`, sections "Estrutura interna dos patterns" (the Plate port, toolbar, `/` menu, node ids, drag, what was left out), "Acessibilidade dos patterns" (handle visibility, highlight token, caret as focus indicator) and "Registro de decisões" (Plate over Tiptap, Lexical or an own `contenteditable`; COSS UI instead of Plate's component layer).
