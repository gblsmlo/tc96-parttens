'use client'

import { KeyboardSensor, PointerSensor } from '@dnd-kit/dom'
import { useSortable } from '@dnd-kit/react/sortable'
import { DotsSixVerticalIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { useCallback } from 'react'
import { useRowReorder } from '../hooks/use-row-reorder'

const ROW_DRAG_SENSORS = [
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

export interface RowDragHandleProps {
  dragType: string
  label: string
  rowId: string
  rowSelector: string
  slot: string
}

function InertRowDragHandle({
  label,
  slot,
}: Pick<RowDragHandleProps, 'label' | 'slot'>) {
  return (
    <Button
      aria-label={label}
      className="touch-none"
      data-slot={slot}
      disabled
      size="icon-xs"
      type="button"
      variant="ghost"
    >
      <DotsSixVerticalIcon aria-hidden="true" />
    </Button>
  )
}

function SortableRowDragHandle({
  dragType,
  index,
  label,
  rowId,
  rowSelector,
  slot,
}: RowDragHandleProps & { index: number }) {
  const { handleRef, isDragSource, ref } = useSortable({
    accept: dragType,
    data: { type: dragType },
    group: dragType,
    id: rowId,
    index,
    sensors: ROW_DRAG_SENSORS,
    transition: null,
    type: dragType,
  })
  const setHandle = useCallback(
    (node: HTMLButtonElement | null) => {
      handleRef(node)
      ref(node?.closest<HTMLElement>(rowSelector) ?? null)
    },
    [handleRef, ref, rowSelector],
  )

  return (
    <Button
      aria-label={label}
      className="cursor-grab touch-none"
      data-dragging={isDragSource || undefined}
      data-slot={slot}
      ref={setHandle}
      size="icon-xs"
      type="button"
      variant="ghost"
    >
      <DotsSixVerticalIcon aria-hidden="true" />
    </Button>
  )
}

export function RowDragHandle(props: RowDragHandleProps) {
  const reorder = useRowReorder()
  const index = reorder?.indexByRowId.get(props.rowId)
  if (index === undefined)
    return <InertRowDragHandle label={props.label} slot={props.slot} />
  return <SortableRowDragHandle index={index} {...props} />
}
