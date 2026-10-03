# Rich text editor pattern

Guide for agents working in `packages/parttens/src/rich-text-editor`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only at the boundary with an external `className`, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder is flat today; it adopts the layered layout described there (`composition/`, `components/`, `lib/`, `types/`, `test/`) when it is next split. The Plate setup was ported from the flash-card project on 2026-10-03, as recorded in `docs/architecture/tc96-parttens.md`.

## What it is

A Notion-style editor on Plate (Slate) with the UI built from COSS components, plus a page title. `RichTextEditor` renders an editable area with no box of its own, a floating toolbar over the selection, a `/` menu for blocks, an optional `@` menu for mentions and an optional drag handle per top-level block. `EditorTitle` is an `h1` with a borderless `textarea` that never keeps a line break. The vocabulary is closed: `RICH_TEXT_ELEMENTS` and `RICH_TEXT_MARKS` name every node type the editor emits, and the document the consumer receives never carries node ids or the `/` menu input. The pattern keeps no document state beyond the Plate editor instance; it does no upload, no fetching and no persistence.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel; every public name below comes from here | yes |
| `rich-text-editor.tsx` | `RichTextEditor`, `defaultMaxListDepth`, `RichTextEditorProps`, `RichTextEditorHandle`, `RichTextMention`, `RichTextValue`; also `defaultExtraBlockLabels` and `withoutSlashInput`, which the barrel does not export | yes, except `defaultExtraBlockLabels` and `withoutSlashInput` |
| `editor-title.tsx` | `EditorTitle`, `EditorTitleProps`, `EditorTitleHandle` | yes |
| `plugins.tsx` | the Plate configuration: `richTextEditorOptions`, the element and leaf components, markdown input rules, the blockquote and list-depth normalizers, the slash and mention plugins; `RICH_TEXT_MARKS`, `RICH_TEXT_BLOCKS`, `RICH_TEXT_ELEMENTS`, `RichTextMark`, `RichTextBlock`, `applyBlock`, `SLASH_INPUT_TYPE`, `MENTION_INPUT_TYPE`, `MENTION_TYPE`, `hasTriggerInput`, `hasSlashInput` | partly: the three `RICH_TEXT_*` arrays, the two types and `applyBlock` |
| `slash-menu.tsx` | `slashMenuOptions`, `filterSlashMenuOptions`, `SlashMenuBlock`, `SlashMenuOption`, `SlashInput`, `currentSlashInput`, `applySlashMenuOption`, `dismissSlashInput`, `useSlashMenu`, `SlashMenuState`, `SlashMenu`, `SlashMenuProps` | partly: `slashMenuOptions`, `filterSlashMenuOptions`, `SlashMenuBlock`, `SlashMenuOption` |
| `extra-blocks.tsx` | `RICH_TEXT_EXTRA_BLOCKS`, `RichTextExtraBlock`, `RICH_TEXT_EXTRA_ELEMENTS`, `applyExtraBlock`, `extraBlockPlugins` (todo, callout, code block, hr, date, table, image elements), `RichTextImage`, `insertImage` | partly: `RICH_TEXT_EXTRA_BLOCKS`, `RichTextExtraBlock`, `RichTextImage` |
| `floating-toolbar.tsx` | `FloatingToolbar`, `FloatingToolbarProps`, `blockIcon`; the block type `Select`, mark toggles and block toggles | no |
| `link-button.tsx` | `LinkButton`, `LinkButtonLabels`: the toolbar toggle that opens a `Popover` with an `Input` and applies `upsertLink` | partly: `LinkButtonLabels` |
| `block-draggable.tsx` | `BlockDragLabels`, `defaultBlockDragLabels`, `blockDragPlugins` (`BlockSelectionPlugin` and `DndPlugin`), `selectCurrentBlock`, the `DraggableBlock` wrapper and the labeled selection input | no |
| `plugins.test.tsx` | bun tests: node ids, list depth, blockquote flattening, markdown shortcuts, `applyBlock`, pasted HTML | — |
| `slash-menu.test.tsx` | bun tests: options and filtering, `slash_input` in the document, `onValueChange` while the menu is open | — |
| `editor-title.test.tsx` | bun tests: empty label, flattened line breaks, counter and Enter | — |
| `test/dom.ts` | the JSDOM setup the test files import; a copy owned by this pattern | — |

Only what `index.ts` exports is public. The registry copies every file this barrel reaches, so a new file must be imported from one of these, and an internal name (`useSlashMenu`, `richTextEditorOptions`, `blockDragPlugins`) should not be exported from the barrel without a reason recorded in `docs/architecture/tc96-parttens.md`.

Import direction inside the folder: `rich-text-editor.tsx` → `floating-toolbar.tsx`, `slash-menu.tsx`, `block-draggable.tsx`, `extra-blocks.tsx`, `plugins.tsx`; `plugins.tsx` → `block-draggable.tsx` and `extra-blocks.tsx`; `slash-menu.tsx` → `plugins.tsx`, `extra-blocks.tsx` and `blockIcon` from `floating-toolbar.tsx`; `floating-toolbar.tsx` → `link-button.tsx` and `plugins.tsx`; `editor-title.tsx` imports nothing from the folder. Outside the folder the pattern uses `@tc96/helpers/rich-text` (`flattenTitle`, `formatTitleCounter`, `stripRichTextNodeIds`; the tests also use `richTextElementTypes` and `richTextHasNodeId`), `@tc96/ui` (`button`, `checkbox`, `input`, `popover`, `select`, `toggle`, `toolbar`) and `@tc96/utils`.

## Public API

```ts
const RICH_TEXT_MARKS = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'highlight'] as const
const RICH_TEXT_BLOCKS = ['h2', 'h3', 'blockquote', 'ul', 'ol'] as const        // the blocks the toolbar toggles
const RICH_TEXT_EXTRA_BLOCKS = ['todo', 'callout', 'code', 'hr', 'date', 'table', 'image'] as const  // reachable only by the `/` menu
const RICH_TEXT_ELEMENTS = [
  'p', 'h2', 'h3', 'blockquote', 'ul', 'ol', 'li', 'lic', 'a', 'mention',
  'action_item', 'callout', 'code_block', 'hr', 'date', 'table', 'tr', 'td', 'th', 'img',
] as const                                                                      // every element type a document may carry
type RichTextMark = (typeof RICH_TEXT_MARKS)[number]
type RichTextBlock = (typeof RICH_TEXT_BLOCKS)[number]
type RichTextExtraBlock = (typeof RICH_TEXT_EXTRA_BLOCKS)[number]
type RichTextValue = Value                                                      // Plate's `Value`: the array of top-level elements
const defaultMaxListDepth = 4

interface RichTextMention { id: string; label: string }
interface RichTextImage { alt?: string; url: string }
interface RichTextEditorHandle { focusStart: () => void }

interface RichTextEditorProps {
  'aria-label': string
  autoFocus?: boolean                          // focuses the end of the document on mount
  blockLabels?: Readonly<Record<RichTextBlock, string>>
  blockDragLabels?: BlockDragLabels            // { handle: string; selection: string }
  blockTypeLabel?: string
  extraBlockLabels?: Readonly<Record<RichTextExtraBlock, string>>
  className?: string
  defaultValue?: RichTextValue                 // initial document only; there is no `value` prop
  draggableBlocks?: boolean                    // turns on the drag handle and block selection
  linkLabels?: LinkButtonLabels                // { apply, button, remove, url }
  markLabels?: Readonly<Record<RichTextMark, string>>
  maxListDepth?: number                        // integer >= 1, default 4
  mentionEmptyLabel?: string
  mentionLabel?: string
  mentions?: readonly RichTextMention[]        // enables the `@` menu
  onExitStart?: () => void                     // ArrowUp on the first line or Backspace at the start
  onPickImage?: () => Promise<RichTextImage | null>  // enables the image option of the `/` menu
  onValueChange?: (value: RichTextValue) => void
  paragraphLabel?: string
  placeholder?: string
  ref?: Ref<RichTextEditorHandle>
  slashMenuEmptyLabel?: string
  slashMenuLabel?: string
  toolbarLabel?: string
}

interface EditorTitleHandle { focusEnd: () => void }

interface EditorTitleProps {
  autoFocus?: boolean
  className?: string
  counterFrom?: number                         // the counter shows from this length on
  defaultValue?: string
  emptyLabel: string                           // placeholder and the sr-only name while empty
  label?: string                               // default 'Título'
  max?: number                                 // `maxLength` of the field
  onArrowDownAtEnd?: () => void                // for the consumer to move focus to the body
  onChange?: (value: string) => void
  onEnter?: () => void
  ref?: Ref<EditorTitleHandle>
}

interface SlashMenuOption {
  block: SlashMenuBlock | (string & {})        // SlashMenuBlock = RichTextBlock | RichTextExtraBlock | 'p'
  icon?: LucideIcon
  keywords: readonly string[]
  label: string
}
function slashMenuOptions(labels: Readonly<Record<SlashMenuBlock, string>>): SlashMenuOption[]
function filterSlashMenuOptions(options: readonly SlashMenuOption[], query: string): SlashMenuOption[]
function applyBlock(editor: SlateEditor, block: RichTextBlock | 'p'): void
```

Behavior worth knowing before changing it:

- The document never carries node ids or the `/` menu input. The editor runs with `nodeId: { initialValueIds: 'always' }` so that block selection and drag have ids, and `withoutSlashInput` wraps `onValueChange`: a value that contains a `slash_input` or `mention_input` node (`hasTriggerInput`) is not emitted, and every emitted value goes through `stripRichTextNodeIds`. `plugins.test.tsx` and `slash-menu.test.tsx` cover both.
- `defaultValue` seeds the editor and is not read again; every later change arrives through `onValueChange`. There is no `value` prop and no read-only prop.
- Plugins enabled by `richTextEditorOptions`: paragraph, `h2`, `h3`, blockquote (own plugin, flattens blocks pasted inside it with a line break between them), classic lists (`ul`, `ol`, `li`, `lic`; `TaskListPlugin` disabled), `ListDepthPlugin` (caps nesting at `maxListDepth` on normalize and on Tab; Shift+Tab at depth 1 and Tab without room return `false` so focus leaves the editor), link, the extra blocks (`img` void, `action_item`, `callout`, `code_block`, `hr`, `date`, `table`, `tr`, `td`, `th`), slash, mention (only when `mentions` is passed), block drag (only when `draggableBlocks`), bold, italic, underline, highlight (`Mod+Shift+H`), strikethrough (`Mod+Shift+X`), code (`Mod+E`). `richTextEditorOptions` throws `RangeError` when `maxListDepth` is not an integer of at least 1.
- Markdown shortcuts at block start: `#` and `##` make `h2`, `###` makes `h3`, `>` a blockquote, `-` and `*` a bulleted list, `1.` a numbered list; `**`, `*` or `_`, `~~` and backticks mark text. A shortcut does not fire inside a block of the same type, list shortcuts do not fire inside a list item, and underline has no input rule. Pasted `H1` maps to `h2`, `H4` to `H6` map to `h3`.
- `applyBlock` is the single path for the toolbar, the `Select` and the `/` menu: lists go through `toggleList`, and any other block first unwraps a list item.
- `/` menu: typing `/` at block start or after a space inserts a non-void `slash_input` inline whose text is the `/` and the query, so both stay in the document while the menu is open. `useSlashMenu` reads it from the selection (`currentSlashInput`), filters with `filterWords` over `label` and `keywords`, and the listbox never takes focus: `PlateContent` carries `aria-activedescendant` and `aria-controls`, options are `role="option"` with `aria-selected`, `tabIndex={-1}` and `data-highlighted` on the active one, and `onMouseDown` is prevented so the editor keeps focus. In the editable, ArrowDown and ArrowUp cycle the active option, Enter applies it (with no match it dismisses and lets the event through), Escape dismisses to literal text, Space with an empty query or no match dismisses. Blur, the cursor leaving the node (`unwrapStaleTriggerInputs`) and an empty or prefix-less node (`triggerNormalizer`) also unwrap or remove it. The `image` option exists only when `onPickImage` is passed; choosing it removes the input, awaits the promise and inserts an `img` block through `insertImage`.
- `@` menu: the same hook with `MENTION_INPUT_TYPE`, triggered after whitespace or at block start, with options from `mentions`; selecting inserts a `mention` element (`value` = label) followed by a space. The editor does not search people.
- `draggableBlocks`: each top-level block (`path.length === 1`) is wrapped by `DraggableBlock` with a `Button` `ghost` `icon-xs` handle (`aria-label` from `blockDragLabels.handle`) bound to `useDraggable`, a drop line from `useDropLine` and `opacity-50` while dragging; `Alt+ArrowUp` and `Alt+ArrowDown` on the handle move the block by `moveNodes`. Escape in the editor selects the current block (`selectCurrentBlock`); on the selection plugin's hidden input, labeled with `blockDragLabels.selection` and handled by a native `keydown` listener, Backspace and Delete remove the selected blocks, ArrowUp and ArrowDown move the selection, Enter and Escape deselect and refocus the editor. `DndProvider` uses `HTML5Backend`.
- Floating toolbar: a COSS `PopoverPopup` with `tooltipStyle`, anchored to the selection rectangle, open while the selection is expanded with non-empty text, the pointer is up and focus is inside the editable, the toolbar, a `[data-slot=select-popup]` or a `[data-slot=popover-popup]`. Escape dismisses it for that selection; `Alt+F10` in the editor focuses the first `[data-slot=toolbar-button]`. It holds the block type `Select`, one toggle per `RICH_TEXT_MARKS`, the link button (`validateUrl`, `upsertLink`, `unwrapLink`) and one toggle per `RICH_TEXT_BLOCKS`.
- The highlight mark is the boolean `highlight` leaf rendered as `mark` with `bg-warning/30 text-foreground dark:bg-warning/25`; there is no free text color.
- `autoFocus` (default `false` on both components): the editor calls `editor.tf.focus({ edge: 'endEditor' })` in an effect; the title focuses the `textarea` with the caret at the end. `focusStart()` on the editor ref focuses the start of the document; `focusEnd()` on the title ref focuses the end of the field.
- `onExitStart` fires on ArrowUp when the DOM caret is on the first line of the first block, or on Backspace at the document start when the first block is a paragraph; the title hands Enter to `onEnter` and ArrowDown at the end of its text to `onArrowDownAtEnd`, so a consumer can move focus between the two.
- `EditorTitle` flattens every line break to a space (`flattenTitle`) on change, keeps the caret in place, renders the `emptyLabel` as `sr-only` text inside the `h1` while empty, and shows `formatTitleCounter(length, max)` when `max` and `counterFrom` are set and the length reaches `counterFrom`.
- Links render as `a` with `target="_blank"` and `rel="noopener noreferrer"`; mentions and dates render with `contentEditable={false}`; the date block formats with `Intl.DateTimeFormat('pt-BR')`. All default labels are in pt-BR and are props.

## Styling contract

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-highlighted` | the active `[data-slot=slash-menu-option]` button | `data-highlighted:bg-accent data-highlighted:text-accent-foreground` in the same class string |
| `data-block-selected` | `[data-slot=rich-text-block]` when `draggableBlocks` is on and the block is selected | consumers; the pattern draws the selection with a `bg-primary/12` overlay element instead |
| `data-slot` | every element listed below | consumers |

Decisions recorded on 2026-10-03 in `docs/architecture/tc96-parttens.md`, section "Acessibilidade dos patterns", that apply here: the `/` menu option is a single class string styled by `data-highlighted:`, not a conditional pair; the block drag handle wrapper is `opacity-0` and shows with `group-hover/block:opacity-100`, `focus-within:opacity-100` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch; the highlight mark uses `bg-warning/30 text-foreground dark:bg-warning/25` instead of a palette yellow; the caret is the focus indicator of the editable area, which carries `outline-none`, and the title field does the same while its `h1` draws `has-focus-visible:bg-muted`. Dragging state is `isDragging && 'opacity-50'` through `cn`, not a `data-*` attribute.

There are no `cva` variants: every class is a literal string on the element, so the Tailwind scanner always sees it. Colors come only from theme tokens (`text-foreground`, `text-muted-foreground`, `text-primary`, `text-accent-foreground`, `bg-muted`, `bg-accent`, `bg-primary`, `bg-warning`, `border-border`, with opacity modifiers such as `/12`, `/48`, `/80`); no palette colors and no arbitrary values. `scripts/override-exceptions.json` has no entry for this pattern. The pattern reads three COSS `data-slot` names (`toolbar-button`, `select-popup`, `popover-popup`) to manage focus.

`data-slot` names: `rich-text-editor`, `rich-text-editor-content`, `rich-text-block`, `floating-toolbar`, `slash-menu`, `slash-menu-option`, `slash-menu-status`, `editor-title`, `editor-title-heading`, `editor-title-field`, `editor-title-counter`.

## Verify

```bash
bun test --isolate packages/parttens/src/rich-text-editor
bunx biome check packages/parttens/src/rich-text-editor
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/rich-text-editor
```

The stories live in `apps/storybook/src/patterns/rich-text-editor/` and run axe with `test: 'error'`; the editor and title stories limit `aria-hidden-focus` to `[aria-hidden="true"]:not([data-base-ui-focus-guard])` because the Base UI `Popover` focus guards belong to COSS:

| File | Title |
| --- | --- |
| `rich-text-editor.stories.tsx` | `Patterns/Rich Text Editor` |
| `editor-title.stories.tsx` | `Patterns/Rich Text Editor/Editor Title` |
| `usages/blog.stories.tsx` | `Patterns/Rich Text Editor/Usages/Blog` |
| `usages/tasks.stories.tsx` | `Patterns/Rich Text Editor/Usages/Tasks` |
| `usages/other.stories.tsx` | `Patterns/Rich Text Editor/Usages/Other` |
