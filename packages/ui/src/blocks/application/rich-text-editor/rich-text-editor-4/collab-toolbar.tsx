'use client'

import { ArrowUUpLeftIcon, ArrowUUpRightIcon } from '@phosphor-icons/react'
import type { YHistoryEditor } from '@platejs/yjs'
import { Button } from '@tc96/ui/button'
import {
  RichTextBlockButton,
  RichTextBlockSelect,
  RichTextMarkButton,
  RichTextToolbar,
} from '@tc96/ui/patterns/rich-text-editor'
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from '@tc96/ui/toolbar'
import { useEditorRef } from 'platejs/react'
import { type ReactElement, useEffect, useReducer } from 'react'
import { CommentToolbarButton } from './comments'
import type { RichTextEditor4Labels } from './types'

function HistoryButton({
  action,
  label,
}: Readonly<{ action: 'redo' | 'undo'; label: string }>): ReactElement {
  const editor = useEditorRef()
  const [, refresh] = useReducer((count: number) => count + 1, 0)
  const manager = (editor as unknown as Partial<YHistoryEditor>).undoManager
  useEffect(() => {
    if (!manager) return
    manager.on('stack-item-added', refresh)
    manager.on('stack-item-popped', refresh)
    manager.on('stack-cleared', refresh)
    return () => {
      manager.off('stack-item-added', refresh)
      manager.off('stack-item-popped', refresh)
      manager.off('stack-cleared', refresh)
    }
  }, [manager])
  const stack = action === 'undo' ? manager?.undoStack : manager?.redoStack
  return (
    <ToolbarButton
      aria-label={label}
      disabled={!stack || stack.length === 0}
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

export function CollabToolbar({
  labels,
}: Readonly<{ labels: RichTextEditor4Labels }>): ReactElement {
  const { blocks, tools } = labels
  return (
    <RichTextToolbar
      aria-label={tools.format}
      className="sticky top-0 z-20 border-b bg-background px-3 py-2"
    >
      <ToolbarGroup>
        <HistoryButton action="undo" label={tools.undo} />
        <HistoryButton action="redo" label={tools.redo} />
      </ToolbarGroup>
      <ToolbarSeparator orientation="vertical" />
      <RichTextBlockSelect
        blockLabels={blocks}
        blocks={['h2', 'h3', 'blockquote']}
        label={tools.blockType}
        paragraphLabel={tools.paragraph}
      />
      <ToolbarSeparator orientation="vertical" />
      <ToolbarGroup>
        <RichTextMarkButton label={tools.bold} mark="bold" />
        <RichTextMarkButton label={tools.italic} mark="italic" />
        <RichTextMarkButton label={tools.underline} mark="underline" />
        <RichTextMarkButton label={tools.strikethrough} mark="strikethrough" />
        <RichTextMarkButton label={tools.code} mark="code" />
      </ToolbarGroup>
      <ToolbarSeparator orientation="vertical" />
      <ToolbarGroup>
        <RichTextBlockButton block="ul" label={tools.bulletList} />
        <RichTextBlockButton block="ol" label={tools.numberedList} />
      </ToolbarGroup>
      <ToolbarSeparator orientation="vertical" />
      <ToolbarGroup>
        <CommentToolbarButton label={tools.comment} />
      </ToolbarGroup>
    </RichTextToolbar>
  )
}
