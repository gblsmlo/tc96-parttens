'use client'

import { cn } from '@tc96/utils'
import type { PointerEvent } from 'react'
import { useRef } from 'react'
import {
  type CalendarResizeEdge,
  type CalendarResizeGrid,
  resizeCalendarSchedule,
} from '../lib/resize'
import type { CalendarItemSchedule } from '../types'

const MINUTES_PER_DAY = 1440

interface ResizeGesture {
  edgeTime: number
  originY: number
  pixelsPerMinute: number
  pointerId: number
  preview: CalendarItemSchedule | null
  source: CalendarItemSchedule
}

export interface CalendarResizeHandleProps {
  edge: CalendarResizeEdge
  grid: CalendarResizeGrid
  onCommit: (schedule: CalendarItemSchedule) => void
  onPreview: (schedule: CalendarItemSchedule | null) => void
  schedule: CalendarItemSchedule
}

const edgeTimeOf = (schedule: CalendarItemSchedule, edge: CalendarResizeEdge) =>
  (edge === 'start' ? schedule.start : schedule.end)?.getTime() ?? 0

export function CalendarResizeHandle({
  edge,
  grid,
  onCommit,
  onPreview,
  schedule,
}: CalendarResizeHandleProps) {
  const gestureRef = useRef<ResizeGesture | null>(null)

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const column = event.currentTarget.closest('[data-calendar-date]')
    const height = column?.getBoundingClientRect().height ?? 0
    if (height <= 0) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    gestureRef.current = {
      edgeTime: edgeTimeOf(schedule, edge),
      originY: event.clientY,
      pixelsPerMinute: height / MINUTES_PER_DAY,
      pointerId: event.pointerId,
      preview: null,
      source: schedule,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return

    const next = resizeCalendarSchedule(
      gesture.source,
      edge,
      (event.clientY - gesture.originY) / gesture.pixelsPerMinute,
      grid,
    )
    if (!next) return
    const edgeTime = edgeTimeOf(next, edge)
    if (edgeTime === gesture.edgeTime) return

    gesture.edgeTime = edgeTime
    gesture.preview =
      edgeTime === edgeTimeOf(gesture.source, edge) ? null : next
    onPreview(gesture.preview)
  }

  const finishGesture = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return null

    gestureRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    return gesture
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = finishGesture(event)
    if (!gesture) return

    if (gesture.preview) onCommit(gesture.preview)
    else onPreview(null)
  }

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (finishGesture(event)) onPreview(null)
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-x-0 z-30 h-1.5 cursor-ns-resize touch-none rounded-sm hover:bg-foreground/10 pointer-coarse:h-3',
        edge === 'start' ? 'top-0' : 'bottom-0',
      )}
      data-calendar-item-resize={edge}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}
