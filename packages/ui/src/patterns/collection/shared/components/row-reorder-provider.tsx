'use client'

import type { Plugins } from '@dnd-kit/abstract'
import { Accessibility } from '@dnd-kit/dom'
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/react'
import { isSortable, isSortableOperation } from '@dnd-kit/react/sortable'
import { type ReactNode, useMemo } from 'react'
import { useLatestCallback } from '../hooks/use-latest-callback'
import { RowReorderContext } from '../hooks/use-row-reorder'
import {
  type RowDragAnnouncements,
  type RowMove,
  resolveRowMove,
} from '../lib/row-reorder'

export interface RowReorderProviderProps {
  active: boolean
  announcements?: RowDragAnnouncements
  children: ReactNode
  getCollectionIndexes: () => readonly number[]
  indexByRowId: ReadonlyMap<string, number>
  onRowMove?: (move: RowMove) => void
  rowIds: readonly string[]
}

export function RowReorderProvider({
  active,
  announcements,
  children,
  getCollectionIndexes,
  indexByRowId,
  onRowMove,
  rowIds,
}: RowReorderProviderProps) {
  const context = useMemo(() => ({ indexByRowId }), [indexByRowId])
  const handleDragEnd = useLatestCallback((event: DragEndEvent) => {
    if (event.canceled || !isSortableOperation(event.operation)) return
    const { source, target } = event.operation
    if (!(source && target)) return
    const move = resolveRowMove({
      collectionIndexes: getCollectionIndexes(),
      rowIds,
      sourceId: String(source.id),
      targetIndex: target.index,
    })
    if (move) onRowMove?.(move)
  })
  const getAnnouncements = useLatestCallback(() => announcements)
  const getRowCount = useLatestCallback(() => rowIds.length)
  const hasAnnouncements = Boolean(announcements)
  const hasOverAnnouncement = Boolean(announcements?.over)
  const instructions = announcements?.instructions
  const plugins = useMemo(
    () =>
      hasAnnouncements
        ? createPlugins({
            getAnnouncements,
            getRowCount,
            hasOverAnnouncement,
            instructions,
          })
        : undefined,
    [
      getAnnouncements,
      getRowCount,
      hasAnnouncements,
      hasOverAnnouncement,
      instructions,
    ],
  )

  if (!active) return children

  return (
    <RowReorderContext value={context}>
      <DragDropProvider onDragEnd={handleDragEnd} plugins={plugins}>
        {children}
      </DragDropProvider>
    </RowReorderContext>
  )
}

interface CreatePluginsInput {
  getAnnouncements: () => RowDragAnnouncements | undefined
  getRowCount: () => number
  hasOverAnnouncement: boolean
  instructions: string | undefined
}

function createPlugins({
  getAnnouncements,
  getRowCount,
  hasOverAnnouncement,
  instructions,
}: CreatePluginsInput) {
  const configured = Accessibility.configure({
    announcements: {
      dragend: (event: DragEndEvent) => {
        const { operation } = event
        if (!isSortable(operation.source)) return
        return getAnnouncements()?.end({
          canceled: event.canceled,
          fromIndex: operation.source.initialIndex,
          rowCount: getRowCount(),
          rowId: String(operation.source.id),
          toIndex: operation.source.index,
        })
      },
      dragover: hasOverAnnouncement
        ? (event: DragOverEvent) => {
            const { operation } = event
            if (!isSortableOperation(operation)) return
            const { source, target } = operation
            if (!(source && target) || source.id === target.id) return
            return getAnnouncements()?.over?.({
              index: source.index,
              overIndex: target.index,
              overRowId: String(target.id),
              rowCount: getRowCount(),
              rowId: String(source.id),
            })
          }
        : undefined,
      dragstart: (event: DragStartEvent) => {
        const { operation } = event
        if (!isSortable(operation.source)) return
        return getAnnouncements()?.start({
          index: operation.source.index,
          rowCount: getRowCount(),
          rowId: String(operation.source.id),
        })
      },
    },
    ...(instructions
      ? { screenReaderInstructions: { draggable: instructions } }
      : {}),
  })
  return (defaults: Plugins): Plugins =>
    defaults.map((plugin) => (plugin === Accessibility ? configured : plugin))
}
