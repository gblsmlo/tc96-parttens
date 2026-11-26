import { SparkleIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import type { RichTextEditorInstance } from '@tc96/ui/patterns/rich-text-editor'
import type { TRange } from 'platejs'
import { type ReactElement, useLayoutEffect, useState } from 'react'
import type { RichTextEditor5Labels } from './types'

export interface SelectionBubbleProps {
  editor: RichTextEditorInstance
  labels: RichTextEditor5Labels
  onAsk: () => void
  onSpelling: () => void
  onSummary: () => void
  range: TRange | null
}

export function SelectionBubble({
  editor,
  labels,
  onAsk,
  onSpelling,
  onSummary,
  range,
}: Readonly<SelectionBubbleProps>): ReactElement | null {
  const [box, setBox] = useState<{ left: number; top: number } | null>(null)

  useLayoutEffect(() => {
    if (!range) {
      setBox(null)
      return
    }
    const update = () => {
      const rect = editor.api.toDOMRange(range)?.getBoundingClientRect()
      setBox(
        rect && (rect.width > 0 || rect.height > 0)
          ? { left: rect.left + rect.width / 2, top: rect.top }
          : null,
      )
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [editor, range])

  if (!range || !box) return null
  const left = Math.min(Math.max(box.left, 150), window.innerWidth - 150)
  return (
    <fieldset
      className="-translate-x-1/2 -translate-y-full fixed z-30 flex flex-wrap items-center gap-1 rounded-lg border bg-popover p-1 text-popover-foreground shadow-(shadow:--popover-shadow)"
      data-slot="selection-bubble"
      onMouseDown={(event) => event.preventDefault()}
      style={{ left, top: Math.max(box.top - 8, 48) }}
    >
      <legend className="sr-only">{labels.bubble}</legend>
      <Button onClick={onSummary} size="sm" variant="ghost">
        {labels.bubbleSummary}
      </Button>
      <Button onClick={onSpelling} size="sm" variant="ghost">
        {labels.bubbleSpelling}
      </Button>
      <Button onClick={onAsk} size="sm" variant="outline">
        <SparkleIcon aria-hidden="true" />
        {labels.bubbleAsk}
      </Button>
    </fieldset>
  )
}
