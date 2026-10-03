'use client'

import { Popover, PopoverPopup } from '@tc96/ui/popover'
import { Toggle } from '@tc96/ui/toggle'
import {
  ToolbarButton,
  ToolbarGroup,
  ToolbarPrimitive,
  ToolbarSeparator,
} from '@tc96/ui/toolbar'
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  type LucideIcon,
  StrikethroughIcon,
  TextQuoteIcon,
  UnderlineIcon,
} from 'lucide-react'
import { RangeApi, type SlateEditor, type TRange } from 'platejs'
import {
  useEditorRef,
  useEditorSelector,
  useMarkToolbarButton,
  useMarkToolbarButtonState,
} from 'platejs/react'
import type { ReactElement, RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  applyBlock,
  RICH_TEXT_BLOCKS,
  RICH_TEXT_MARKS,
  type RichTextBlock,
  type RichTextMark,
} from './plugins'

const markIcon = {
  bold: BoldIcon,
  code: CodeIcon,
  italic: ItalicIcon,
  strikethrough: StrikethroughIcon,
  underline: UnderlineIcon,
} as const satisfies Record<RichTextMark, LucideIcon>

export const blockIcon = {
  blockquote: TextQuoteIcon,
  h2: Heading2Icon,
  h3: Heading3Icon,
  ol: ListOrderedIcon,
  ul: ListIcon,
} as const satisfies Record<RichTextBlock, LucideIcon>

function ToolbarToggle({
  icon: Icon,
  label,
  onToggle,
  pressed,
}: Readonly<{
  icon: LucideIcon
  label: string
  onToggle: () => void
  pressed: boolean
}>): ReactElement {
  return (
    <ToolbarButton
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

function MarkButton({
  label,
  mark,
}: Readonly<{ label: string; mark: RichTextMark }>): ReactElement {
  const { props } = useMarkToolbarButton(
    useMarkToolbarButtonState({ nodeType: mark }),
  )

  return (
    <ToolbarToggle
      icon={markIcon[mark]}
      label={label}
      onToggle={props.onClick}
      pressed={props.pressed}
    />
  )
}

function BlockButton({
  block,
  label,
}: Readonly<{ block: RichTextBlock; label: string }>): ReactElement {
  const editor = useEditorRef()
  const pressed = useEditorSelector(
    (current) => current.api.some({ match: { type: block } }),
    [block],
  )

  return (
    <ToolbarToggle
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

const sameRange = (a: TRange | null, b: TRange | null) =>
  a === b || (a !== null && b !== null && RangeApi.equals(a, b))

function selectionAnchor(editor: SlateEditor, selection: TRange) {
  return {
    contextElement: editor.api.toDOMNode(editor) as Element | undefined,
    getBoundingClientRect: () =>
      editor.api.toDOMRange(selection)?.getBoundingClientRect() ??
      new DOMRect(),
  }
}

export interface FloatingToolbarProps {
  blockLabels: Readonly<Record<RichTextBlock, string>>
  label: string
  markLabels: Readonly<Record<RichTextMark, string>>
  toolbarRef: RefObject<HTMLDivElement | null>
}

export function FloatingToolbar({
  blockLabels,
  label,
  markLabels,
  toolbarRef,
}: Readonly<FloatingToolbarProps>): ReactElement {
  const editor = useEditorRef()
  const selection = useEditorSelector(
    (current) => current.selection as TRange | null,
    [],
    { equalityFn: sameRange },
  )
  const [pointerDown, setPointerDown] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [dismissed, setDismissed] = useState<TRange | null>(null)

  useEffect(() => {
    const editable = editor.api.toDOMNode(editor)
    const inside = (node: EventTarget | null) =>
      node instanceof Node &&
      ((editable?.contains(node) ?? false) ||
        (toolbarRef.current?.contains(node) ?? false))
    const down = (event: PointerEvent) => {
      if (editable?.contains(event.target as Node)) setPointerDown(true)
    }
    const up = () => setPointerDown(false)
    const focusIn = (event: FocusEvent) => setFocusWithin(inside(event.target))
    const focusOut = (event: FocusEvent) =>
      setFocusWithin(inside(event.relatedTarget))
    document.addEventListener('pointerdown', down)
    document.addEventListener('pointerup', up)
    document.addEventListener('pointercancel', up)
    document.addEventListener('focusin', focusIn)
    document.addEventListener('focusout', focusOut)
    return () => {
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerup', up)
      document.removeEventListener('pointercancel', up)
      document.removeEventListener('focusin', focusIn)
      document.removeEventListener('focusout', focusOut)
    }
  }, [editor, toolbarRef])

  const expanded =
    selection !== null &&
    RangeApi.isExpanded(selection) &&
    editor.api.string(selection) !== ''
  const open =
    expanded && !pointerDown && focusWithin && !sameRange(dismissed, selection)

  const anchor = useMemo(
    () => (selection ? selectionAnchor(editor, selection) : null),
    [editor, selection],
  )

  const dismiss = useCallback(() => {
    setDismissed(selection)
    if (toolbarRef.current?.contains(document.activeElement)) editor.tf.focus()
  }, [editor, selection, toolbarRef])

  return (
    <Popover
      onOpenChange={(next, details) => {
        if (next) return
        if (
          details.reason === 'escape-key' ||
          details.reason === 'outside-press'
        )
          dismiss()
      }}
      open={open}
    >
      <PopoverPopup
        anchor={anchor}
        finalFocus={false}
        initialFocus={false}
        role="presentation"
        side="top"
        sideOffset={8}
        tooltipStyle
      >
        <ToolbarPrimitive.Root
          aria-label={label}
          className="relative flex items-center gap-1 text-foreground"
          data-slot="floating-toolbar"
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return
            event.preventDefault()
            dismiss()
          }}
          ref={toolbarRef}
        >
          <ToolbarGroup className="gap-0.5">
            {RICH_TEXT_MARKS.map((mark) => (
              <MarkButton key={mark} label={markLabels[mark]} mark={mark} />
            ))}
          </ToolbarGroup>
          <ToolbarSeparator orientation="vertical" />
          <ToolbarGroup className="gap-0.5">
            {RICH_TEXT_BLOCKS.map((block) => (
              <BlockButton
                block={block}
                key={block}
                label={blockLabels[block]}
              />
            ))}
          </ToolbarGroup>
        </ToolbarPrimitive.Root>
      </PopoverPopup>
    </Popover>
  )
}
