'use client'

import {
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from '@dnd-kit/dom'
import { useDraggable } from '@dnd-kit/react'
import { cn } from '@tc96/utils'
import { GripVerticalIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import type { CalendarItemDragData } from '../lib/drag-and-drop'

export const CALENDAR_ITEM_SENSORS = [
  PointerSensor.configure({
    /**
     * Exigir 5px de deslocamento separa clique de arraste na alça; no toque fica
     * o atraso, para não competir com o scroll da grade.
     */
    activationConstraints: (event) =>
      event.pointerType === 'touch'
        ? [new PointerActivationConstraints.Delay({ tolerance: 5, value: 250 })]
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

export interface DraggableCalendarItemProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  dragLabel: string
  /** Tipo do draggable — casa com o `accept` das células (timed × all-day). */
  dragType: 'calendar-item' | 'calendar-item-all-day'
  id: string
  itemData: CalendarItemDragData
  itemKey: string
  style?: CSSProperties
}

export function DraggableCalendarItem({
  children,
  className,
  disabled = false,
  dragLabel,
  dragType,
  id,
  itemData,
  itemKey,
  style,
}: DraggableCalendarItemProps) {
  const { handleRef, isDragSource, ref } = useDraggable({
    data: itemData,
    disabled,
    id,
    sensors: CALENDAR_ITEM_SENSORS,
    type: dragType,
  })

  // Só a alça arrasta. O dnd-kit transforma o ativador em botão, e um botão
  // esconde o que contém da tecnologia assistiva; por isso o chip e o gatilho
  // de abrir ficam fora da alça. Sem arraste não há alça nem ativador: o
  // dnd-kit marcaria o próprio chip como botão.
  return (
    <div
      className={cn(
        'group/calendar-drag flex min-w-0 rounded-md',
        isDragSource && 'opacity-40',
        className,
      )}
      data-calendar-item-draggable={disabled ? undefined : ''}
      data-calendar-item-id={itemKey}
      ref={disabled ? undefined : ref}
      style={style}
    >
      {disabled ? null : (
        <button
          aria-label={dragLabel}
          className="flex w-4 shrink-0 cursor-grab touch-none items-center justify-center rounded-sm text-muted-foreground opacity-0 outline-none transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing group-hover/calendar-drag:opacity-100"
          data-calendar-item-drag-handle=""
          data-calendar-item-drag-id={id}
          ref={handleRef}
          type="button"
        >
          <GripVerticalIcon aria-hidden="true" className="size-3" />
        </button>
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
