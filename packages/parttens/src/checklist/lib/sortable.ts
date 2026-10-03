import { KeyboardSensor, PointerSensor } from '@dnd-kit/dom'
import type { DragEndEvent } from '@dnd-kit/react'
import { isSortableOperation } from '@dnd-kit/react/sortable'
import type { KeyboardEvent } from 'react'
import type { ChecklistItem, ChecklistProps } from '../types/index'

export const CHECKLIST_ITEM_TYPE = 'checklist-item'

export const CHECKLIST_SENSORS = [
  PointerSensor,
  KeyboardSensor.configure({
    keyboardCodes: {
      cancel: ['Escape'],
      down: ['ArrowDown'],
      end: ['Space', 'Tab'],
      left: ['ArrowLeft'],
      right: ['ArrowRight'],
      start: ['Space'],
      up: ['ArrowUp'],
    },
  }),
]

export function handleMoveShortcut(
  event: KeyboardEvent<HTMLButtonElement>,
  itemIndex: number,
  itemCount: number,
  onMove: (targetIndex: number) => void,
) {
  if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown'))
    return

  const targetIndex = event.key === 'ArrowUp' ? itemIndex - 1 : itemIndex + 1
  if (targetIndex < 0 || targetIndex >= itemCount) return
  event.preventDefault()
  onMove(targetIndex)
}

export function handleDragEnd(
  event: DragEndEvent,
  items: readonly ChecklistItem[],
  onItemMove: ChecklistProps['onItemMove'],
) {
  if (event.canceled || !isSortableOperation(event.operation)) return

  const { source, target } = event.operation
  if (!source || !target) return

  const itemId = String(source.id)
  const sourceIndex = items.findIndex((item) => item.id === itemId)
  const targetIndex = target.index
  if (sourceIndex < 0 || sourceIndex === targetIndex) return
  onItemMove(itemId, targetIndex)
}
