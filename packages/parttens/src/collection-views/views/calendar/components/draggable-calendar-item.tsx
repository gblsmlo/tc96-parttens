'use client'

import {
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from '@dnd-kit/dom'
import { useDraggable } from '@dnd-kit/react'
import { cn } from '@tc96/utils'
import { GripVerticalIcon } from 'lucide-react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'

import type { CalendarItemDragData } from '../lib/drag-and-drop'
import type { CalendarResizeDirection, CalendarResizeEdge } from '../lib/resize'

const OWN_GESTURE_TARGETS = [
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled]):not([data-slot="calendar-event-chip-open-trigger"])',
  'a[href]',
  '[data-calendar-item-resize]',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="slider"]',
  '[role="switch"]',
].join(',')

export const CALENDAR_ITEM_SENSORS = [
  PointerSensor.configure({
    activatorElements: (source) => [source.element],
    preventActivation: (event, source) =>
      event.target instanceof Element &&
      !source.handle?.contains(event.target) &&
      event.target.closest(OWN_GESTURE_TARGETS) !== null,
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
  onResizeStep?: (
    edge: CalendarResizeEdge,
    direction: CalendarResizeDirection,
  ) => void
  style?: CSSProperties
}

const RESIZE_KEY_SHORTCUTS =
  'Alt+ArrowUp Alt+ArrowDown Shift+ArrowUp Shift+ArrowDown'

export function DraggableCalendarItem({
  children,
  className,
  disabled = false,
  dragLabel,
  dragType,
  id,
  itemData,
  itemKey,
  onResizeStep,
  style,
}: DraggableCalendarItemProps) {
  const { handleRef, isDragSource, ref } = useDraggable({
    data: itemData,
    disabled,
    id,
    sensors: CALENDAR_ITEM_SENSORS,
    type: dragType,
  })

  const handleResizeKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!onResizeStep || isDragSource) return
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    if (event.altKey === event.shiftKey) return

    event.preventDefault()
    onResizeStep(
      event.altKey ? 'start' : 'end',
      event.key === 'ArrowUp' ? 'earlier' : 'later',
    )
  }

  return (
    <div
      className={cn(
        'relative min-w-0 rounded-md',
        !disabled && 'cursor-grab active:cursor-grabbing',
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
          aria-keyshortcuts={onResizeStep ? RESIZE_KEY_SHORTCUTS : undefined}
          aria-label={dragLabel}
          className="absolute inset-y-0 start-0 z-20 flex w-4 items-center justify-center rounded-s-md bg-background text-muted-foreground opacity-0 outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
          data-calendar-item-drag-handle=""
          data-calendar-item-drag-id={id}
          onKeyDown={handleResizeKey}
          ref={handleRef}
          type="button"
        >
          <GripVerticalIcon aria-hidden="true" className="size-3" />
        </button>
      )}
      {children}
    </div>
  )
}
