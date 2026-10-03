'use client'

import { DndPlugin, useDraggable, useDropLine } from '@platejs/dnd'
import {
  BlockSelectionAfterEditable,
  BlockSelectionPlugin,
  useBlockSelected,
} from '@platejs/selection/react'
import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import { GripVerticalIcon } from 'lucide-react'
import type { SlateEditor, TElement } from 'platejs'
import type { RenderNodeWrapper } from 'platejs/react'
import { useEditorRef, usePluginOption } from 'platejs/react'
import type { KeyboardEvent, ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export interface BlockDragLabels {
  handle: string
  selection: string
}

export const defaultBlockDragLabels = {
  handle: 'Mover bloco',
  selection: 'Blocos selecionados',
} as const satisfies BlockDragLabels

function DraggableBlock({
  children,
  element,
  label,
}: Readonly<{
  children: ReactNode
  element: TElement
  label: string
}>): ReactElement {
  const editor = useEditorRef()
  const { handleRef, isDragging, nodeRef } = useDraggable({ element })
  const { dropLine } = useDropLine()
  const selected = useBlockSelected(
    typeof element.id === 'string' ? element.id : undefined,
  )

  const moveByKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!event.altKey) return
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const path = editor.api.findPath(element)
    if (!path) return
    const index = path[0] ?? 0
    const target = event.key === 'ArrowUp' ? index - 1 : index + 1
    if (target < 0 || target >= editor.children.length) return
    editor.tf.moveNodes({ at: path, to: [target] })
  }

  return (
    <div
      className={cn(
        'slate-selectable group/block relative',
        isDragging && 'opacity-50',
      )}
      data-block-selected={selected || undefined}
      data-slot="rich-text-block"
      ref={nodeRef}
    >
      <div
        className="absolute inset-s-0 top-0 z-10 -translate-x-full pe-1 pointer-coarse:opacity-100 opacity-0 transition-opacity focus-within:opacity-100 group-hover/block:opacity-100"
        contentEditable={false}
      >
        <Button
          aria-label={label}
          onKeyDown={moveByKeyboard}
          onMouseDown={(event) => event.stopPropagation()}
          ref={handleRef}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <GripVerticalIcon aria-hidden="true" />
        </Button>
      </div>
      {children}
      {selected ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1 inset-y-0 rounded-md bg-primary/12"
          contentEditable={false}
        />
      ) : null}
      {dropLine ? (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 h-0.5 bg-primary',
            dropLine === 'top' ? '-top-px' : '-bottom-px',
          )}
          contentEditable={false}
        />
      ) : null}
    </div>
  )
}

const blockDraggable =
  (label: string): RenderNodeWrapper =>
  ({ element, path }) => {
    if (path.length !== 1) return undefined
    return ({ children }) => (
      <DraggableBlock element={element} label={label}>
        {children}
      </DraggableBlock>
    )
  }

function removeSelectedBlocks(editor: SlateEditor): void {
  const api = editor.getApi(BlockSelectionPlugin).blockSelection
  const nodes = api.getNodes()
  const first = nodes[0]?.[1]
  if (!first) return
  editor.tf.withoutNormalizing(() => {
    for (const [, path] of [...nodes].reverse())
      editor.tf.removeNodes({ at: path })
  })
  api.deselect()
  if (editor.children.length === 0)
    editor.tf.insertNodes(editor.api.create.block(), { at: [0] })
  const index = Math.min(first[0] ?? 0, editor.children.length - 1)
  editor.tf.select(editor.api.end([index]) ?? [])
  editor.tf.focus()
}

function LabeledBlockSelection({
  label,
}: Readonly<{ label: string }>): ReactElement {
  const editor = useEditorRef()
  const shadowInput = usePluginOption(BlockSelectionPlugin, 'shadowInputRef')

  useEffect(() => {
    const input = shadowInput?.current
    if (!input) return
    input.setAttribute('aria-label', label)
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const api = editor.getApi(BlockSelectionPlugin).blockSelection
      if (api.getNodes().length === 0) return
      const handled = () => {
        event.preventDefault()
        event.stopPropagation()
      }
      switch (event.key) {
        case 'Backspace':
        case 'Delete':
          handled()
          removeSelectedBlocks(editor)
          break
        case 'Escape':
          handled()
          api.deselect()
          editor.tf.focus()
          break
        case 'ArrowUp':
        case 'ArrowDown':
          handled()
          api.moveSelection(event.key === 'ArrowUp' ? 'up' : 'down')
          break
        case 'Enter':
          handled()
          api.deselect()
          editor.tf.focus()
          break
      }
    }
    input.addEventListener('keydown', onKeyDown)
    return () => input.removeEventListener('keydown', onKeyDown)
  }, [editor, label, shadowInput])

  return <BlockSelectionAfterEditable />
}

export function selectCurrentBlock(editor: SlateEditor): boolean {
  const index = editor.selection?.anchor.path[0]
  const id = index === undefined ? undefined : editor.children[index]?.id
  if (typeof id !== 'string') return false
  editor.getApi(BlockSelectionPlugin).blockSelection.set(id)
  return true
}

export const blockDragPlugins = (label: string, selectionLabel: string) => [
  BlockSelectionPlugin.configure({
    options: {
      enableContextMenu: false,
      isSelectable: (_element, path) => path.length === 1,
    },
    render: {
      afterEditable: () => <LabeledBlockSelection label={selectionLabel} />,
    },
  }),
  DndPlugin.configure({
    options: { enableScroller: false },
    render: {
      aboveNodes: blockDraggable(label),
      aboveSlate: ({ children }) => (
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      ),
    },
  }),
]
