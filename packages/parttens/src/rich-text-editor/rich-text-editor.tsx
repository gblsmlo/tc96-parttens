'use client'

import { cn } from '@tc96/utils'
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
import { useId, useImperativeHandle, useMemo, useRef } from 'react'
import { FloatingToolbar } from './floating-toolbar'
import {
  hasSlashInput,
  type RichTextBlock,
  type RichTextMark,
  richTextEditorOptions,
} from './plugins'
import { SlashMenu, slashMenuOptions, useSlashMenu } from './slash-menu'

export type RichTextValue = Value

export interface RichTextEditorHandle {
  focusStart: () => void
}

export interface RichTextEditorProps {
  'aria-label': string
  blockLabels?: Readonly<Record<RichTextBlock, string>>
  className?: string
  defaultValue?: RichTextValue
  markLabels?: Readonly<Record<RichTextMark, string>>
  maxListDepth?: number
  onExitStart?: () => void
  onValueChange?: (value: RichTextValue) => void
  paragraphLabel?: string
  placeholder?: string
  ref?: Ref<RichTextEditorHandle>
  slashMenuEmptyLabel?: string
  slashMenuLabel?: string
  toolbarLabel?: string
}

export const defaultMaxListDepth = 4

const defaultMarkLabels = {
  bold: 'Negrito',
  code: 'Código',
  italic: 'Itálico',
  strikethrough: 'Tachado',
  underline: 'Sublinhado',
} as const satisfies Record<RichTextMark, string>

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
    if (!hasSlashInput(value)) onValueChange?.(value)
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
    | 'paragraphLabel'
    | 'slashMenuEmptyLabel'
    | 'slashMenuLabel'
  >
> &
  Pick<RichTextEditorProps, 'onExitStart' | 'placeholder'> & {
    toolbarRef: RefObject<HTMLDivElement | null>
  }

function EditorContent({
  'aria-label': ariaLabel,
  blockLabels,
  onExitStart,
  paragraphLabel,
  placeholder,
  slashMenuEmptyLabel,
  slashMenuLabel,
  toolbarRef,
}: EditorContentProps): ReactElement {
  const editor = useEditorRef()
  const options = useMemo(
    () => slashMenuOptions({ ...blockLabels, p: paragraphLabel }),
    [blockLabels, paragraphLabel],
  )
  const slashMenu = useSlashMenu({ id: useId(), options })

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return
    if (slashMenu.onKeyDown(event)) return
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
        aria-activedescendant={slashMenu.activeId}
        aria-controls={slashMenu.open ? slashMenu.id : undefined}
        aria-label={ariaLabel}
        aria-placeholder={placeholder}
        className="w-full text-base text-foreground outline-none"
        data-slot="rich-text-editor-content"
        onBlur={slashMenu.onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        renderPlaceholder={renderPlaceholder}
      />
      <SlashMenu
        emptyLabel={slashMenuEmptyLabel}
        label={slashMenuLabel}
        menu={slashMenu}
      />
    </>
  )
}

export function RichTextEditor({
  'aria-label': ariaLabel,
  blockLabels = defaultBlockLabels,
  className,
  defaultValue,
  markLabels = defaultMarkLabels,
  maxListDepth = defaultMaxListDepth,
  onExitStart,
  onValueChange,
  paragraphLabel = 'Texto',
  placeholder,
  ref,
  slashMenuEmptyLabel = 'Nenhum bloco com esse nome',
  slashMenuLabel = 'Blocos',
  toolbarLabel = 'Formatação',
}: Readonly<RichTextEditorProps>): ReactElement {
  const editor = usePlateEditor({
    ...richTextEditorOptions(maxListDepth),
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
          blockLabels={blockLabels}
          paragraphLabel={paragraphLabel}
          slashMenuEmptyLabel={slashMenuEmptyLabel}
          slashMenuLabel={slashMenuLabel}
          toolbarRef={toolbarRef}
          {...(onExitStart ? { onExitStart } : {})}
          {...(placeholder ? { placeholder } : {})}
        />
        <FloatingToolbar
          blockLabels={blockLabels}
          label={toolbarLabel}
          markLabels={markLabels}
          toolbarRef={toolbarRef}
        />
      </div>
    </Plate>
  )
}
