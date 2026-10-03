import { pointerIntersection } from '@dnd-kit/collision'
import {
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from '@dnd-kit/dom'
import { useSortable } from '@dnd-kit/react/sortable'
import { cn } from '@tc96/utils'
import { GripVerticalIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const OWN_GESTURE_TARGETS = [
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled]):not([data-slot="kanban-card-open-trigger"])',
  'a[href]',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="slider"]',
  '[role="switch"]',
].join(',')

const KANBAN_CARD_SENSORS = [
  PointerSensor.configure({
    activatorElements: (source) => [source.element],
    preventActivation: (event, source) =>
      event.target instanceof Element &&
      !source.handle?.contains(event.target) &&
      event.target.closest(OWN_GESTURE_TARGETS) !== null,
    activationConstraints: (event) =>
      event.pointerType === 'touch'
        ? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })]
        : [new PointerActivationConstraints.Distance({ value: 5 })],
  }),
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

interface SortableKanbanCardProps {
  children: ReactNode
  columnId: string
  dragLabel: string
  id: string
  index: number
}

export function SortableKanbanCard({
  children,
  columnId,
  dragLabel,
  id,
  index,
}: SortableKanbanCardProps) {
  const { handleRef, isDragSource, ref } = useSortable({
    accept: 'kanban-card',
    collisionDetector: pointerIntersection,
    data: { cardId: id, columnId, type: 'card' },
    group: columnId,
    id,
    index,
    sensors: KANBAN_CARD_SENSORS,
    transition: null,
    type: 'kanban-card',
  })

  return (
    <div
      className={cn(
        'relative min-w-0 cursor-grab',
        isDragSource && 'opacity-0',
      )}
      data-kanban-card-container=""
      data-kanban-card-draggable=""
      ref={ref}
    >
      <button
        aria-label={dragLabel}
        className="absolute top-1 left-1 z-10 flex size-6 cursor-grab touch-none items-center justify-center rounded-md bg-card text-muted-foreground opacity-0 outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        data-kanban-card-drag-handle=""
        data-kanban-card-drag-id={id}
        ref={handleRef}
        type="button"
      >
        <GripVerticalIcon aria-hidden="true" className="size-4" />
      </button>
      {children}
    </div>
  )
}
