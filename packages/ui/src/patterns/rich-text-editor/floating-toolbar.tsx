'use client'

import { Popover, PopoverPopup } from '@tc96/ui/popover'
import {
  ToolbarGroup,
  ToolbarPrimitive,
  ToolbarSeparator,
} from '@tc96/ui/toolbar'
import { RangeApi, type SlateEditor, type TRange } from 'platejs'
import { useEditorRef, useEditorSelector } from 'platejs/react'
import type { ReactElement, ReactNode, RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LinkButton, type LinkButtonLabels } from './link-button'
import {
  RICH_TEXT_BLOCKS,
  RICH_TEXT_MARKS,
  type RichTextBlock,
  type RichTextMark,
} from './plugins'
import {
  RichTextBlockButton as BlockButton,
  RichTextBlockSelect as BlockTypeSelect,
  RichTextMarkButton as MarkButton,
} from './toolbar-parts'

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
  actions?: ReactNode
  blockLabels: Readonly<Record<RichTextBlock, string>>
  blockTypeLabel: string
  label: string
  linkLabels: LinkButtonLabels
  markLabels: Readonly<Record<RichTextMark, string>>
  marks?: readonly RichTextMark[]
  paragraphLabel: string
  toolbarRef: RefObject<HTMLDivElement | null>
}

export function FloatingToolbar({
  actions,
  blockLabels,
  blockTypeLabel,
  label,
  linkLabels,
  markLabels,
  marks = RICH_TEXT_MARKS,
  paragraphLabel,
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
    const inEditable = (node: Node) =>
      editor.api.toDOMNode(editor)?.contains(node) ?? false
    const inside = (node: EventTarget | null) =>
      node instanceof Node &&
      (inEditable(node) ||
        (toolbarRef.current?.contains(node) ?? false) ||
        (node instanceof Element &&
          node.closest('[data-slot=select-popup],[data-slot=popover-popup]') !==
            null))
    const down = (event: PointerEvent) => {
      if (event.target instanceof Node && inEditable(event.target))
        setPointerDown(true)
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
          <BlockTypeSelect
            blockLabels={blockLabels}
            label={blockTypeLabel}
            paragraphLabel={paragraphLabel}
          />
          <ToolbarSeparator orientation="vertical" />
          <ToolbarGroup className="gap-0.5">
            {marks.map((mark) => (
              <MarkButton key={mark} label={markLabels[mark]} mark={mark} />
            ))}
          </ToolbarGroup>
          <ToolbarGroup className="gap-0.5">
            <LinkButton labels={linkLabels} />
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
          {actions ? (
            <>
              <ToolbarSeparator orientation="vertical" />
              <ToolbarGroup className="gap-0.5">{actions}</ToolbarGroup>
            </>
          ) : null}
        </ToolbarPrimitive.Root>
      </PopoverPopup>
    </Popover>
  )
}
