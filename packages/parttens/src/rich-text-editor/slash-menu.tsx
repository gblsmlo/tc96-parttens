'use client'

import { filterWords } from '@platejs/combobox'
import { Popover, PopoverPopup } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import {
  CalendarIcon,
  ImageIcon,
  ListTodoIcon,
  type LucideIcon,
  MessageSquareWarningIcon,
  MinusIcon,
  SquareCodeIcon,
  TableIcon,
  TextIcon,
} from 'lucide-react'
import {
  ElementApi,
  NodeApi,
  type Path,
  PathApi,
  RangeApi,
  type SlateEditor,
} from 'platejs'
import { useEditorRef, useEditorSelector } from 'platejs/react'
import type { FocusEvent, KeyboardEvent, ReactElement } from 'react'
import { useMemo, useState } from 'react'
import {
  applyExtraBlock,
  RICH_TEXT_EXTRA_BLOCKS,
  type RichTextExtraBlock,
} from './extra-blocks'
import { blockIcon } from './floating-toolbar'
import {
  applyBlock,
  MENTION_INPUT_TYPE,
  RICH_TEXT_BLOCKS,
  type RichTextBlock,
  SLASH_INPUT_TYPE,
} from './plugins'

export type SlashMenuBlock = RichTextBlock | RichTextExtraBlock | 'p'

export interface SlashMenuOption {
  block: SlashMenuBlock | (string & {})
  icon?: LucideIcon
  keywords: readonly string[]
  label: string
}

const keywords = {
  blockquote: ['citacao', 'quote'],
  callout: ['destaque', 'aviso', 'nota', 'callout'],
  code: ['codigo', 'code', 'bloco'],
  date: ['data', 'hoje', 'date'],
  hr: ['divisor', 'linha', 'separador', 'divider'],
  image: ['imagem', 'foto', 'figura', 'image'],
  table: ['tabela', 'grade', 'table'],
  todo: ['tarefa', 'checklist', 'todo', 'checkbox'],
  h2: ['titulo', 'secao', 'heading'],
  h3: ['subtitulo', 'heading'],
  ol: ['lista', 'numerada', 'ordenada', 'numeros'],
  p: ['texto', 'paragrafo', 'normal'],
  ul: ['lista', 'marcadores', 'topicos', 'bullet'],
} as const satisfies Record<SlashMenuBlock, readonly string[]>

const optionIcon = {
  ...blockIcon,
  callout: MessageSquareWarningIcon,
  code: SquareCodeIcon,
  date: CalendarIcon,
  hr: MinusIcon,
  image: ImageIcon,
  table: TableIcon,
  p: TextIcon,
  todo: ListTodoIcon,
} as const satisfies Record<SlashMenuBlock, LucideIcon>

export function slashMenuOptions(
  labels: Readonly<Record<SlashMenuBlock, string>>,
): SlashMenuOption[] {
  return (['p', ...RICH_TEXT_BLOCKS, ...RICH_TEXT_EXTRA_BLOCKS] as const).map(
    (block) => ({
      block,
      keywords: keywords[block],
      label: labels[block],
    }),
  )
}

export function filterSlashMenuOptions(
  options: readonly SlashMenuOption[],
  query: string,
): SlashMenuOption[] {
  const needle = query.trim()
  if (needle === '') return [...options]
  return options.filter((option) =>
    filterWords(`${option.label} ${option.keywords.join(' ')}`, needle),
  )
}

export interface SlashInput {
  path: Path
  query: string
}

export function currentSlashInput(
  editor: SlateEditor,
  inputType: string = SLASH_INPUT_TYPE,
): SlashInput | null {
  const { selection } = editor
  if (!selection || RangeApi.isExpanded(selection)) return null
  const entry = editor.api.above({
    at: selection,
    match: { type: inputType },
  })
  if (!entry) return null
  const [node, path] = entry
  return { path, query: NodeApi.string(node).slice(1) }
}

export function applySlashMenuOption(
  editor: SlateEditor,
  input: SlashInput,
  block: SlashMenuBlock,
): void {
  editor.tf.removeNodes({ at: input.path })
  if ((RICH_TEXT_EXTRA_BLOCKS as readonly string[]).includes(block))
    applyExtraBlock(editor, block as RichTextExtraBlock)
  else applyBlock(editor, block as RichTextBlock | 'p')
}

export function dismissSlashInput(
  editor: SlateEditor,
  input: SlashInput,
): void {
  editor.tf.unwrapNodes({ at: input.path })
}

function unwrapSlashInputs(editor: SlateEditor): void {
  const leftovers = [
    ...editor.api.nodes({
      at: [],
      match: (node) =>
        ElementApi.isElement(node) &&
        (node.type === SLASH_INPUT_TYPE || node.type === MENTION_INPUT_TYPE),
    }),
  ]
  for (const [, path] of leftovers.reverse())
    editor.tf.unwrapNodes({ at: path })
}

const sameInput = (a: SlashInput | null, b: SlashInput | null) =>
  a === b ||
  (a !== null &&
    b !== null &&
    a.query === b.query &&
    PathApi.equals(a.path, b.path))

export interface SlashMenuState {
  activeId: string | undefined
  activeIndex: number
  anchor: {
    contextElement?: Element
    getBoundingClientRect: () => DOMRect
  } | null
  id: string
  matches: SlashMenuOption[]
  open: boolean
  apply: (option: SlashMenuOption) => void
  onBlur: (event: FocusEvent) => void
  onKeyDown: (event: KeyboardEvent) => boolean
  optionId: (option: SlashMenuOption) => string
  setActiveIndex: (index: number) => void
}

export function useSlashMenu({
  id,
  inputType = SLASH_INPUT_TYPE,
  onSelect,
  options,
}: Readonly<{
  id: string
  inputType?: string
  onSelect?: (
    editor: SlateEditor,
    input: SlashInput,
    option: SlashMenuOption,
  ) => void
  options: readonly SlashMenuOption[]
}>): SlashMenuState {
  const editor = useEditorRef()
  const input = useEditorSelector(
    (current) => currentSlashInput(current, inputType),
    [inputType],
    { equalityFn: sameInput },
  )
  const select = (option: SlashMenuOption) => {
    if (!input) return
    if (onSelect) onSelect(editor, input, option)
    else applySlashMenuOption(editor, input, option.block as SlashMenuBlock)
  }
  const [active, setActive] = useState<{
    index: number
    query: string
  } | null>(null)

  const query = input?.query ?? ''
  const matches = useMemo(
    () => filterSlashMenuOptions(options, query),
    [options, query],
  )
  const activeIndex =
    active?.query === query
      ? Math.max(0, Math.min(active.index, matches.length - 1))
      : 0
  const activeOption = matches[activeIndex]
  const open = input !== null

  const anchor = useMemo(() => {
    if (!input) return null
    return {
      contextElement: editor.api.toDOMNode(editor) as Element | undefined,
      getBoundingClientRect: () => {
        const node = NodeApi.get(editor, input.path)
        return (
          (node && editor.api.toDOMNode(node)?.getBoundingClientRect()) ||
          new DOMRect()
        )
      },
    }
  }, [editor, input])

  const optionId = (option: SlashMenuOption) => `${id}-${option.block}`

  const apply = (option: SlashMenuOption) => {
    select(option)
  }

  const onKeyDown = (event: KeyboardEvent): boolean => {
    if (!open || !input) return false
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        if (matches.length === 0) return false
        event.preventDefault()
        const step = event.key === 'ArrowDown' ? 1 : -1
        setActive({
          index: (activeIndex + step + matches.length) % matches.length,
          query,
        })
        return true
      }
      case 'Enter': {
        if (!activeOption) {
          dismissSlashInput(editor, input)
          return false
        }
        event.preventDefault()
        select(activeOption)
        return true
      }
      case 'Escape': {
        event.preventDefault()
        dismissSlashInput(editor, input)
        return true
      }
      case ' ': {
        if (query === '' || matches.length === 0)
          dismissSlashInput(editor, input)
        return false
      }
      default:
        return false
    }
  }

  return {
    activeId: open && activeOption ? optionId(activeOption) : undefined,
    activeIndex,
    anchor,
    apply,
    id,
    matches,
    onBlur: (event) => {
      if (
        event.currentTarget.ownerDocument.activeElement === event.currentTarget
      )
        return
      unwrapSlashInputs(editor)
    },
    onKeyDown,
    open,
    optionId,
    setActiveIndex: (index) => setActive({ index, query }),
  }
}

export interface SlashMenuProps {
  emptyLabel: string
  label: string
  menu: SlashMenuState
}

export function SlashMenu({
  emptyLabel,
  label,
  menu,
}: Readonly<SlashMenuProps>): ReactElement {
  const empty = menu.matches.length === 0
  return (
    <Popover onOpenChange={() => undefined} open={menu.open}>
      <PopoverPopup
        align="start"
        anchor={menu.anchor}
        className="min-w-56"
        finalFocus={false}
        initialFocus={false}
        role="presentation"
        side="bottom"
        sideOffset={4}
        tooltipStyle
      >
        <div
          aria-label={label}
          className="flex flex-col gap-0.5"
          data-slot="slash-menu"
          id={menu.id}
          role="listbox"
        >
          {menu.matches.map((option, index) => {
            const Icon =
              option.icon ??
              optionIcon[option.block as SlashMenuBlock] ??
              TextIcon
            const active = index === menu.activeIndex
            return (
              <button
                aria-selected={active}
                className={cn(
                  'flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-start text-foreground text-sm outline-none sm:min-h-7',
                  active && 'bg-accent text-accent-foreground',
                )}
                data-highlighted={active || undefined}
                data-slot="slash-menu-option"
                id={menu.optionId(option)}
                key={option.block}
                onClick={() => menu.apply(option)}
                onMouseDown={(event) => event.preventDefault()}
                onPointerMove={() => menu.setActiveIndex(index)}
                role="option"
                tabIndex={-1}
                type="button"
              >
                <Icon
                  aria-hidden="true"
                  className="size-4 shrink-0 opacity-80"
                />
                {option.label}
              </button>
            )
          })}
        </div>
        <output
          className={cn(
            'block text-muted-foreground text-sm',
            empty ? 'px-2 py-1' : 'sr-only',
          )}
          data-slot="slash-menu-status"
        >
          {empty ? emptyLabel : ''}
        </output>
      </PopoverPopup>
    </Popover>
  )
}
