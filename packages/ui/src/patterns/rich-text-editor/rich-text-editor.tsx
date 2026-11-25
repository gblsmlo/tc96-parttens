'use client'

import { AtIcon } from '@phosphor-icons/react'
import { stripRichTextNodeIds } from '@tc96/ui/helpers/rich-text'
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
  type PlateContentProps,
  type PlateEditor,
  useEditorReadOnly,
  useEditorRef,
  usePlateEditor,
} from 'platejs/react'
import type {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react'
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
  type RichTextAvatar,
  type RichTextBlock,
  type RichTextEditorFeatures,
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
  avatar?: RichTextAvatar
  id: string
  label: string
}

export type RichTextEditorInstance = PlateEditor

export interface RichTextEditorHandle {
  editor: RichTextEditorInstance
  focusStart: () => void
}

export interface RichTextEditorOptions {
  blockDragLabels?: BlockDragLabels
  defaultValue?: RichTextValue
  draggableBlocks?: boolean
  features?: RichTextEditorFeatures
  maxListDepth?: number
  mentions?: readonly RichTextMention[]
}

export interface RichTextEditorProps {
  'aria-label': string
  autoFocus?: boolean
  blockLabels?: Readonly<Record<RichTextBlock, string>>
  blockDragLabels?: BlockDragLabels
  blockTypeLabel?: string
  children?: ReactNode
  extraBlockLabels?: Readonly<Record<RichTextExtraBlock, string>>
  className?: string
  contentClassName?: string
  defaultValue?: RichTextValue
  draggableBlocks?: boolean
  editor?: RichTextEditorInstance
  features?: RichTextEditorFeatures
  floatingToolbar?: boolean
  floatingToolbarActions?: ReactNode
  floatingToolbarMarks?: readonly RichTextMark[]
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
  readOnly?: boolean
  ref?: Ref<RichTextEditorHandle>
  slashMenuEmptyLabel?: string
  slashMenuLabel?: string
  toolbar?: ReactNode
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

type PlaceholderProps = Parameters<
  NonNullable<PlateContentProps['renderPlaceholder']>
>[0]

function renderPlaceholder({
  attributes,
  children,
}: PlaceholderProps): ReactElement {
  return (
    <span
      {...attributes}
      aria-hidden="true"
      className="text-muted-foreground"
      style={{ ...attributes.style, opacity: 1 }}
    >
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
    | 'autoFocus'
    | 'contentClassName'
    | 'mentions'
    | 'onExitStart'
    | 'onPickImage'
    | 'placeholder'
  > & {
    selectableBlocks: boolean
    toolbarRef: RefObject<HTMLDivElement | null>
  }

function EditorContent({
  'aria-label': ariaLabel,
  autoFocus,
  blockLabels,
  contentClassName,
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
  const readOnly = useEditorReadOnly()
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
        ...(mention.avatar ? { avatar: mention.avatar } : {}),
        block: mention.id,
        icon: AtIcon,
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
        {
          children: [{ text: '' }],
          type: MENTION_TYPE,
          value: option.label,
          ...(option.avatar ? { avatar: option.avatar } : {}),
        },
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
        aria-activedescendant={readOnly ? undefined : activeMenu.activeId}
        aria-controls={activeMenu.open && !readOnly ? activeMenu.id : undefined}
        aria-label={ariaLabel}
        {...(readOnly ? {} : { 'aria-placeholder': placeholder })}
        className={cn(
          'w-full text-base text-foreground outline-none',
          contentClassName,
        )}
        data-slot="rich-text-editor-content"
        onBlur={(event) => {
          slashMenu.onBlur(event)
          mentionMenu.onBlur(event)
        }}
        onKeyDown={handleKeyDown}
        {...(readOnly ? {} : { placeholder })}
        {...(readOnly ? { role: 'document' } : {})}
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

export function useRichTextEditor({
  blockDragLabels = defaultBlockDragLabels,
  defaultValue,
  draggableBlocks = false,
  features,
  maxListDepth = defaultMaxListDepth,
  mentions,
}: Readonly<RichTextEditorOptions> = {}): RichTextEditorInstance {
  return usePlateEditor({
    ...richTextEditorOptions(
      maxListDepth,
      mentions !== undefined,
      draggableBlocks ? blockDragLabels : undefined,
      features,
    ),
    ...(defaultValue ? { value: defaultValue } : {}),
  })
}

type EditorViewProps = Omit<RichTextEditorProps, 'editor'> & {
  editor: RichTextEditorInstance
}

function RichTextEditorView({
  'aria-label': ariaLabel,
  autoFocus = false,
  blockLabels = defaultBlockLabels,
  blockTypeLabel = 'Tipo de bloco',
  children,
  className,
  contentClassName,
  draggableBlocks = false,
  editor,
  extraBlockLabels = defaultExtraBlockLabels,
  floatingToolbar = true,
  floatingToolbarActions,
  floatingToolbarMarks,
  linkLabels = defaultLinkLabels,
  markLabels = defaultMarkLabels,
  mentionEmptyLabel = 'Ninguém com esse nome',
  mentionLabel = 'Pessoas',
  mentions,
  onExitStart,
  onPickImage,
  onValueChange,
  paragraphLabel = 'Texto',
  placeholder,
  readOnly = false,
  ref,
  slashMenuEmptyLabel = 'Nenhum bloco com esse nome',
  slashMenuLabel = 'Blocos',
  toolbar,
  toolbarLabel = 'Formatação',
}: Readonly<EditorViewProps>): ReactElement {
  const toolbarRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    editor,
    focusStart: () => editor.tf.focus({ at: [], edge: 'start' }),
  }))

  return (
    <Plate
      editor={editor}
      onValueChange={withoutSlashInput(onValueChange)}
      readOnly={readOnly}
    >
      <div className={cn('w-full', className)} data-slot="rich-text-editor">
        {toolbar}
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
          {...(contentClassName ? { contentClassName } : {})}
          {...(mentions ? { mentions } : {})}
          {...(onExitStart ? { onExitStart } : {})}
          {...(onPickImage ? { onPickImage } : {})}
          {...(placeholder ? { placeholder } : {})}
        />
        {floatingToolbar && !readOnly ? (
          <FloatingToolbar
            actions={floatingToolbarActions}
            blockLabels={blockLabels}
            blockTypeLabel={blockTypeLabel}
            label={toolbarLabel}
            linkLabels={linkLabels}
            markLabels={markLabels}
            paragraphLabel={paragraphLabel}
            toolbarRef={toolbarRef}
            {...(floatingToolbarMarks ? { marks: floatingToolbarMarks } : {})}
          />
        ) : null}
        {children}
      </div>
    </Plate>
  )
}

function OwnedRichTextEditor({
  blockDragLabels,
  defaultValue,
  draggableBlocks,
  features,
  maxListDepth,
  mentions,
  ...props
}: Readonly<Omit<RichTextEditorProps, 'editor'>>): ReactElement {
  const editor = useRichTextEditor({
    ...(blockDragLabels ? { blockDragLabels } : {}),
    ...(defaultValue ? { defaultValue } : {}),
    ...(draggableBlocks === undefined ? {} : { draggableBlocks }),
    ...(features ? { features } : {}),
    ...(maxListDepth === undefined ? {} : { maxListDepth }),
    ...(mentions ? { mentions } : {}),
  })
  return (
    <RichTextEditorView
      {...props}
      {...(draggableBlocks === undefined ? {} : { draggableBlocks })}
      editor={editor}
      {...(mentions ? { mentions } : {})}
    />
  )
}

export function RichTextEditor({
  editor,
  ...props
}: Readonly<RichTextEditorProps>): ReactElement {
  return editor ? (
    <RichTextEditorView {...props} editor={editor} />
  ) : (
    <OwnedRichTextEditor {...props} />
  )
}
