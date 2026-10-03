'use client'

import { stripRichTextNodeIds } from '@tc96/helpers/rich-text'
import { cn } from '@tc96/utils'
import { AtSignIcon } from 'lucide-react'
import {
  PointApi,
  RangeApi,
  type SlateEditor,
  type TRange,
  type Value,
} from 'platejs'
import {
  Plate,
  PlateContent,
  type RenderPlaceholderProps,
  useEditorRef,
  usePlateEditor,
} from 'platejs/react'
import type { KeyboardEvent, ReactElement, Ref, RefObject } from 'react'
import { useEffect, useId, useImperativeHandle, useMemo, useRef } from 'react'
import {
  type BlockDragLabels,
  defaultBlockDragLabels,
  selectCurrentBlock,
} from './block-draggable'
import {
  insertImage,
  type RichTextExtraBlock,
  type RichTextImage,
} from './extra-blocks'
import { FloatingToolbar } from './floating-toolbar'
import type { LinkButtonLabels } from './link-button'
import {
  hasTriggerInput,
  MENTION_INPUT_TYPE,
  MENTION_TYPE,
  type RichTextBlock,
  type RichTextMark,
  richTextEditorOptions,
} from './plugins'
import {
  applySlashMenuOption,
  SlashMenu,
  type SlashMenuBlock,
  type SlashMenuOption,
  slashMenuOptions,
  useSlashMenu,
} from './slash-menu'

export type RichTextValue = Value

export interface RichTextMention {
  id: string
  label: string
}

export interface RichTextEditorHandle {
  focusStart: () => void
}

export interface RichTextEditorProps {
  'aria-label': string
  autoFocus?: boolean
  blockLabels?: Readonly<Record<RichTextBlock, string>>
  blockDragLabels?: BlockDragLabels
  blockTypeLabel?: string
  extraBlockLabels?: Readonly<Record<RichTextExtraBlock, string>>
  className?: string
  defaultValue?: RichTextValue
  draggableBlocks?: boolean
  linkLabels?: LinkButtonLabels
  markLabels?: Readonly<Record<RichTextMark, string>>
  maxListDepth?: number
  mentionEmptyLabel?: string
  mentionLabel?: string
  mentions?: readonly RichTextMention[]
  onExitStart?: () => void
  onPickImage?: () => Promise<RichTextImage | null>
  onValueChange?: (value: RichTextValue) => void
  paragraphLabel?: string
  placeholder?: string
  ref?: Ref<RichTextEditorHandle>
  slashMenuEmptyLabel?: string
  slashMenuLabel?: string
  toolbarLabel?: string
}

export const defaultMaxListDepth = 4

const defaultLinkLabels = {
  apply: 'Aplicar',
  button: 'Link',
  remove: 'Remover',
  url: 'Endereço do link',
} as const satisfies LinkButtonLabels

const defaultMarkLabels = {
  bold: 'Negrito',
  code: 'Código',
  highlight: 'Destaque de texto',
  italic: 'Itálico',
  strikethrough: 'Tachado',
  underline: 'Sublinhado',
} as const satisfies Record<RichTextMark, string>

export const defaultExtraBlockLabels = {
  callout: 'Destaque',
  code: 'Bloco de código',
  date: 'Data de hoje',
  hr: 'Divisor',
  image: 'Imagem',
  table: 'Tabela',
  todo: 'Lista de tarefas',
} as const satisfies Record<RichTextExtraBlock, string>

const defaultBlockLabels = {
  blockquote: 'Citação',
  h2: 'Título de seção',
  h3: 'Subtítulo',
  ol: 'Lista numerada',
  ul: 'Lista com marcadores',
} as const satisfies Record<RichTextBlock, string>

function renderPlaceholder({
  attributes,
  children,
}: RenderPlaceholderProps): ReactElement {
  return (
    <span {...attributes} aria-hidden="true" className="text-muted-foreground">
      {children}
    </span>
  )
}

function domCaret(
  editor: SlateEditor,
): { range: TRange; rect: DOMRect } | null {
  const domSelection = editor.api
    .toDOMNode(editor)
    ?.ownerDocument.getSelection()
  if (!domSelection || domSelection.rangeCount === 0) return null
  const range = editor.api.toSlateRange(domSelection, {
    exactMatch: false,
    suppressThrow: true,
  })
  if (!range || RangeApi.isExpanded(range)) return null
  const domRange = domSelection.getRangeAt(0)
  const rect = domRange.getClientRects()[0] ?? domRange.getBoundingClientRect()
  return { range, rect }
}

export function withoutSlashInput(
  onValueChange?: (value: RichTextValue) => void,
) {
  return ({ value }: { value: RichTextValue }) => {
    if (!hasTriggerInput(value))
      onValueChange?.(stripRichTextNodeIds(value) as RichTextValue)
  }
}

function atDocumentStart(editor: SlateEditor, range: TRange): boolean {
  const start = editor.api.start([])
  return start !== undefined && PointApi.equals(range.anchor, start)
}

function onFirstLine(
  editor: SlateEditor,
  range: TRange,
  caret: DOMRect,
): boolean {
  if (range.anchor.path[0] !== 0) return false
  const first = editor.children[0]
  const block = first && editor.api.toDOMNode(first)?.getBoundingClientRect()
  if (!block || caret.height === 0) return false
  return caret.top < block.top + caret.height
}

type EditorContentProps = Required<
  Pick<
    RichTextEditorProps,
    | 'aria-label'
    | 'blockLabels'
    | 'extraBlockLabels'
    | 'mentionEmptyLabel'
    | 'mentionLabel'
    | 'paragraphLabel'
    | 'slashMenuEmptyLabel'
    | 'slashMenuLabel'
  >
> &
  Pick<
    RichTextEditorProps,
    'autoFocus' | 'mentions' | 'onExitStart' | 'onPickImage' | 'placeholder'
  > & {
    selectableBlocks: boolean
    toolbarRef: RefObject<HTMLDivElement | null>
  }

function EditorContent({
  'aria-label': ariaLabel,
  autoFocus,
  blockLabels,
  extraBlockLabels,
  mentionEmptyLabel,
  mentionLabel,
  mentions,
  onExitStart,
  onPickImage,
  paragraphLabel,
  placeholder,
  selectableBlocks,
  slashMenuEmptyLabel,
  slashMenuLabel,
  toolbarRef,
}: EditorContentProps): ReactElement {
  const editor = useEditorRef()
  useEffect(() => {
    if (autoFocus) editor.tf.focus({ edge: 'endEditor' })
  }, [autoFocus, editor])
  const options = useMemo(
    () =>
      slashMenuOptions({
        ...blockLabels,
        ...extraBlockLabels,
        p: paragraphLabel,
      }).filter((option) => option.block !== 'image' || onPickImage),
    [blockLabels, extraBlockLabels, onPickImage, paragraphLabel],
  )
  const slashMenu = useSlashMenu({
    id: useId(),
    onSelect: (current, input, option) => {
      if (option.block !== 'image') {
        applySlashMenuOption(current, input, option.block as SlashMenuBlock)
        return
      }
      current.tf.removeNodes({ at: input.path })
      onPickImage?.().then((image: RichTextImage | null) => {
        if (image) insertImage(current, image)
        current.tf.focus()
      })
    },
    options,
  })
  const mentionOptions = useMemo<SlashMenuOption[]>(
    () =>
      (mentions ?? []).map((mention) => ({
        block: mention.id,
        icon: AtSignIcon,
        keywords: [],
        label: mention.label,
      })),
    [mentions],
  )
  const mentionMenu = useSlashMenu({
    id: useId(),
    inputType: MENTION_INPUT_TYPE,
    onSelect: (current, input, option) => {
      current.tf.removeNodes({ at: input.path })
      current.tf.insertNodes(
        { children: [{ text: '' }], type: MENTION_TYPE, value: option.label },
        { select: true },
      )
      current.tf.insertText(' ')
    },
    options: mentionOptions,
  })
  const activeMenu = mentionMenu.open ? mentionMenu : slashMenu

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return
    if (mentionMenu.onKeyDown(event)) return
    if (slashMenu.onKeyDown(event)) return
    if (event.key === 'Escape' && selectableBlocks) {
      if (selectCurrentBlock(editor)) event.preventDefault()
      return
    }
    if (event.key === 'F10' && event.altKey) {
      const first = toolbarRef.current?.querySelector<HTMLElement>(
        '[data-slot=toolbar-button]',
      )
      if (!first) return
      event.preventDefault()
      first.focus()
      return
    }
    if (!onExitStart || (event.key !== 'ArrowUp' && event.key !== 'Backspace'))
      return
    const caret = domCaret(editor)
    if (!caret) return
    if (
      event.key === 'ArrowUp' &&
      onFirstLine(editor, caret.range, caret.rect)
    ) {
      event.preventDefault()
      onExitStart()
      return
    }
    if (
      event.key === 'Backspace' &&
      editor.children[0]?.type === 'p' &&
      atDocumentStart(editor, caret.range)
    ) {
      event.preventDefault()
      onExitStart()
    }
  }

  return (
    <>
      <PlateContent
        aria-activedescendant={activeMenu.activeId}
        aria-controls={activeMenu.open ? activeMenu.id : undefined}
        aria-label={ariaLabel}
        aria-placeholder={placeholder}
        className="w-full text-base text-foreground outline-none"
        data-slot="rich-text-editor-content"
        onBlur={(event) => {
          slashMenu.onBlur(event)
          mentionMenu.onBlur(event)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        renderPlaceholder={renderPlaceholder}
      />
      <SlashMenu
        emptyLabel={slashMenuEmptyLabel}
        label={slashMenuLabel}
        menu={slashMenu}
      />
      <SlashMenu
        emptyLabel={mentionEmptyLabel}
        label={mentionLabel}
        menu={mentionMenu}
      />
    </>
  )
}

export function RichTextEditor({
  'aria-label': ariaLabel,
  autoFocus = false,
  blockLabels = defaultBlockLabels,
  blockDragLabels = defaultBlockDragLabels,
  blockTypeLabel = 'Tipo de bloco',
  className,
  defaultValue,
  draggableBlocks = false,
  extraBlockLabels = defaultExtraBlockLabels,
  linkLabels = defaultLinkLabels,
  markLabels = defaultMarkLabels,
  maxListDepth = defaultMaxListDepth,
  mentionEmptyLabel = 'Ninguém com esse nome',
  mentionLabel = 'Pessoas',
  mentions,
  onExitStart,
  onPickImage,
  onValueChange,
  paragraphLabel = 'Texto',
  placeholder,
  ref,
  slashMenuEmptyLabel = 'Nenhum bloco com esse nome',
  slashMenuLabel = 'Blocos',
  toolbarLabel = 'Formatação',
}: Readonly<RichTextEditorProps>): ReactElement {
  const editor = usePlateEditor({
    ...richTextEditorOptions(
      maxListDepth,
      mentions !== undefined,
      draggableBlocks ? blockDragLabels : undefined,
    ),
    ...(defaultValue ? { value: defaultValue } : {}),
  })
  const toolbarRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    focusStart: () => editor.tf.focus({ at: [], edge: 'start' }),
  }))

  return (
    <Plate editor={editor} onValueChange={withoutSlashInput(onValueChange)}>
      <div className={cn('w-full', className)} data-slot="rich-text-editor">
        <EditorContent
          aria-label={ariaLabel}
          autoFocus={autoFocus}
          blockLabels={blockLabels}
          extraBlockLabels={extraBlockLabels}
          mentionEmptyLabel={mentionEmptyLabel}
          mentionLabel={mentionLabel}
          paragraphLabel={paragraphLabel}
          selectableBlocks={draggableBlocks}
          slashMenuEmptyLabel={slashMenuEmptyLabel}
          slashMenuLabel={slashMenuLabel}
          toolbarRef={toolbarRef}
          {...(mentions ? { mentions } : {})}
          {...(onExitStart ? { onExitStart } : {})}
          {...(onPickImage ? { onPickImage } : {})}
          {...(placeholder ? { placeholder } : {})}
        />
        <FloatingToolbar
          blockLabels={blockLabels}
          blockTypeLabel={blockTypeLabel}
          label={toolbarLabel}
          linkLabels={linkLabels}
          markLabels={markLabels}
          paragraphLabel={paragraphLabel}
          toolbarRef={toolbarRef}
        />
      </div>
    </Plate>
  )
}
