'use client'

import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  CalendarBlankIcon,
  ChatCenteredDotsIcon,
  CodeBlockIcon,
  CodeSimpleIcon,
  HighlighterIcon,
  ImageIcon,
  ListBulletsIcon,
  ListChecksIcon,
  ListNumbersIcon,
  MinusIcon,
  type Icon as PhosphorIcon,
  QuotesIcon,
  TableIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextHOneIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import { unwrapList } from '@platejs/list-classic'
import { Button } from '@tc96/ui/button'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Toggle } from '@tc96/ui/toggle'
import { ToolbarButton, ToolbarPrimitive } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import {
  useEditorRef,
  useEditorSelector,
  useMarkToolbarButton,
  useMarkToolbarButtonState,
} from 'platejs/react'
import type { ComponentProps, ReactElement } from 'react'
import { applyExtraBlock, type RichTextExtraBlock } from './extra-blocks'
import {
  applyBlock,
  RICH_TEXT_BLOCKS,
  type RichTextAlignment,
  type RichTextBlockWithTitle,
  type RichTextMark,
  setAlignment,
} from './plugins'

const markIcon = {
  bold: TextBIcon,
  code: CodeSimpleIcon,
  highlight: HighlighterIcon,
  italic: TextItalicIcon,
  strikethrough: TextStrikethroughIcon,
  underline: TextUnderlineIcon,
} as const satisfies Record<RichTextMark, PhosphorIcon>

export const blockIcon = {
  blockquote: QuotesIcon,
  h1: TextHOneIcon,
  h2: TextHTwoIcon,
  h3: TextHThreeIcon,
  ol: ListNumbersIcon,
  ul: ListBulletsIcon,
} as const satisfies Record<RichTextBlockWithTitle, PhosphorIcon>

const alignmentIcon = {
  center: TextAlignCenterIcon,
  justify: TextAlignJustifyIcon,
  left: TextAlignLeftIcon,
  right: TextAlignRightIcon,
} as const satisfies Record<RichTextAlignment, PhosphorIcon>

const extraBlockIcon = {
  callout: ChatCenteredDotsIcon,
  code: CodeBlockIcon,
  date: CalendarBlankIcon,
  hr: MinusIcon,
  image: ImageIcon,
  table: TableIcon,
  todo: ListChecksIcon,
} as const satisfies Record<RichTextExtraBlock, PhosphorIcon>

const extraBlockNodeType = {
  callout: 'callout',
  code: 'code_block',
  date: 'date',
  hr: 'hr',
  image: 'img',
  table: 'table',
  todo: 'action_item',
} as const satisfies Record<RichTextExtraBlock, string>

export function RichTextToolbar({
  className,
  ...props
}: Readonly<
  ComponentProps<typeof ToolbarPrimitive.Root> & { 'aria-label': string }
>): ReactElement {
  return (
    <ToolbarPrimitive.Root
      className={cn('flex flex-wrap items-center gap-1', className)}
      data-slot="rich-text-toolbar"
      {...props}
    />
  )
}

export function RichTextToolbarToggle({
  disabled = false,
  icon: Icon,
  label,
  onToggle,
  pressed,
}: Readonly<{
  disabled?: boolean
  icon: PhosphorIcon
  label: string
  onToggle: () => void
  pressed: boolean
}>): ReactElement {
  return (
    <ToolbarButton
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      render={
        <Toggle
          aria-label={label}
          onPressedChange={onToggle}
          pressed={pressed}
          size="sm"
        />
      }
    >
      <Icon aria-hidden="true" />
    </ToolbarButton>
  )
}

export function RichTextMarkButton({
  label,
  mark,
}: Readonly<{ label: string; mark: RichTextMark }>): ReactElement {
  const { props } = useMarkToolbarButton(
    useMarkToolbarButtonState({ nodeType: mark }),
  )

  return (
    <RichTextToolbarToggle
      icon={markIcon[mark]}
      label={label}
      onToggle={props.onClick}
      pressed={props.pressed}
    />
  )
}

export function RichTextBlockButton({
  block,
  label,
}: Readonly<{ block: RichTextBlockWithTitle; label: string }>): ReactElement {
  const editor = useEditorRef()
  const pressed = useEditorSelector(
    (current) => current.api.some({ match: { type: block } }),
    [block],
  )

  return (
    <RichTextToolbarToggle
      icon={blockIcon[block]}
      label={label}
      onToggle={() => {
        applyBlock(editor, block)
        editor.tf.focus()
      }}
      pressed={pressed}
    />
  )
}

export function RichTextExtraBlockButton({
  block,
  label,
}: Readonly<{ block: RichTextExtraBlock; label: string }>): ReactElement {
  const editor = useEditorRef()
  const type = extraBlockNodeType[block]
  const pressed = useEditorSelector(
    (current) => current.api.some({ match: { type } }),
    [type],
  )

  return (
    <RichTextToolbarToggle
      icon={extraBlockIcon[block]}
      label={label}
      onToggle={() => {
        applyExtraBlock(editor, block)
        editor.tf.focus()
      }}
      pressed={pressed}
    />
  )
}

export function RichTextAlignButton({
  alignment,
  label,
}: Readonly<{ alignment: RichTextAlignment; label: string }>): ReactElement {
  const editor = useEditorRef()
  const pressed = useEditorSelector(
    (current) => {
      const entry = current.api.block()
      const align = (entry?.[0] as { align?: string } | undefined)?.align
      return (align ?? 'left') === alignment
    },
    [alignment],
  )

  return (
    <RichTextToolbarToggle
      icon={alignmentIcon[alignment]}
      label={label}
      onToggle={() => {
        setAlignment(editor, alignment)
        editor.tf.focus()
      }}
      pressed={pressed}
    />
  )
}

export function RichTextHistoryButton({
  action,
  label,
}: Readonly<{ action: 'redo' | 'undo'; label: string }>): ReactElement {
  const editor = useEditorRef()
  const available = useEditorSelector(
    (current) =>
      (action === 'undo'
        ? current.history.undos.length
        : current.history.redos.length) > 0,
    [action],
  )

  return (
    <ToolbarButton
      aria-label={label}
      disabled={!available}
      onClick={() => {
        if (action === 'undo') editor.undo()
        else editor.redo()
        editor.tf.focus()
      }}
      onMouseDown={(event) => event.preventDefault()}
      render={<Button size="icon-sm" variant="ghost" />}
    >
      {action === 'undo' ? (
        <ArrowUUpLeftIcon aria-hidden="true" />
      ) : (
        <ArrowUUpRightIcon aria-hidden="true" />
      )}
    </ToolbarButton>
  )
}

type BlockType = RichTextBlockWithTitle | 'p'

export function RichTextBlockSelect({
  blockLabels,
  blocks = RICH_TEXT_BLOCKS,
  label,
  paragraphLabel,
}: Readonly<{
  blockLabels: Readonly<Partial<Record<RichTextBlockWithTitle, string>>>
  blocks?: readonly RichTextBlockWithTitle[]
  label: string
  paragraphLabel: string
}>): ReactElement {
  const editor = useEditorRef()
  const types: readonly BlockType[] = ['p', ...blocks]
  const current = useEditorSelector(
    (state) =>
      blocks.find((block) => state.api.some({ match: { type: block } })) ?? 'p',
    [blocks],
  )
  const labelOf = (value: BlockType) =>
    value === 'p' ? paragraphLabel : (blockLabels[value] ?? value)

  return (
    <Select<BlockType>
      items={types.map((value) => ({ label: labelOf(value), value }))}
      onValueChange={(next) => {
        if (next === null || next === current) return
        if (next === 'p') {
          if (current === 'ul' || current === 'ol') unwrapList(editor)
          else editor.tf.toggleBlock(current)
        } else applyBlock(editor, next)
        editor.tf.focus()
      }}
      value={current}
    >
      <ToolbarButton
        aria-label={label}
        onMouseDown={(event) => event.preventDefault()}
        render={<SelectTrigger className="min-w-32" size="sm" />}
      >
        <SelectValue />
      </ToolbarButton>
      <SelectPopup alignItemWithTrigger={false} sideOffset={8}>
        {types.map((value) => (
          <SelectItem key={value} value={value}>
            {labelOf(value)}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}
