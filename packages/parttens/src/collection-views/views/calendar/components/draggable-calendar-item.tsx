'use client'

import {
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from '@dnd-kit/dom'
import { useDraggable } from '@dnd-kit/react'
import { cn } from '@tc96/utils'
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from 'react'
import { useRef } from 'react'

import type { CalendarItemDragData } from '../lib/drag-and-drop'

export const CALENDAR_ITEM_SENSORS = [
  PointerSensor.configure({
    /**
     * O chip inteiro é o handle de arraste e também hospeda o gatilho de abrir.
     * O padrão do dnd-kit dispararia o arraste já no `pointerdown` e cancelaria
     * o `click` seguinte — o chip pararia de abrir o Preview. Exigir 5px de
     * deslocamento separa clique de arraste; no toque fica o atraso, para não
     * competir com o scroll da grade.
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
  const { isDragSource, ref } = useDraggable({
    data: itemData,
    disabled,
    id,
    sensors: CALENDAR_ITEM_SENSORS,
    type: dragType,
  })
  const pointerMovedRef = useRef(false)

  const handlePointerDownCapture = (event: ReactPointerEvent<HTMLElement>) => {
    pointerMovedRef.current = false
    const target = event.target
    if (
      target instanceof Element &&
      target.closest('[data-calendar-item-action]')
    ) {
      event.stopPropagation()
    }
  }
  const handlePointerMoveCapture = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.buttons !== 0) pointerMovedRef.current = true
  }
  const handleClickCapture = (event: ReactMouseEvent<HTMLElement>) => {
    if (!pointerMovedRef.current) return
    pointerMovedRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section
      aria-label={dragLabel}
      className={cn(
        'min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring',
        !disabled && 'touch-none cursor-grab active:cursor-grabbing',
        isDragSource && 'opacity-40',
        className,
      )}
      data-calendar-item-drag-id={id}
      data-calendar-item-draggable={disabled ? undefined : ''}
      data-calendar-item-id={itemKey}
      onClickCapture={handleClickCapture}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMoveCapture={handlePointerMoveCapture}
      ref={ref}
      style={style}
    >
      {children}
    </section>
  )
}
