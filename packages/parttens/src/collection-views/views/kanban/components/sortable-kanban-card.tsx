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

const KANBAN_CARD_SENSORS = [
  PointerSensor.configure({
    /**
     * Exigir deslocamento minimo separa clique de arraste na alca; no toque
     * mantem-se o atraso, para nao competir com o scroll da coluna.
     */
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

  // So a alca arrasta. O dnd-kit transforma o ativador em botao, e um botao
  // esconde o que contem da tecnologia assistiva; por isso o card e as acoes
  // dele ficam fora da alca.
  return (
    <div
      className={cn(
        'group/kanban-drag flex min-w-0 max-w-full items-start gap-0.5',
        isDragSource && 'opacity-0',
      )}
      data-kanban-card-container=""
      data-kanban-card-draggable=""
      ref={ref}
    >
      <button
        aria-label={dragLabel}
        className="flex h-8 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground opacity-0 outline-none transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing group-hover/kanban-drag:opacity-100"
        data-kanban-card-drag-handle=""
        data-kanban-card-drag-id={id}
        ref={handleRef}
        type="button"
      >
        <GripVerticalIcon aria-hidden="true" className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
