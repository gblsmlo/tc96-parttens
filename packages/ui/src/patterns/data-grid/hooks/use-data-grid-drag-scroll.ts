import { type MouseEvent, type PointerEvent, useRef, useState } from 'react'
import {
  DRAG_CLICK_SUPPRESSION_MS,
  DRAG_SCROLL_THRESHOLD_PX,
} from '../lib/constants'
import { isDragScrollExcludedTarget } from '../lib/dom'

interface DragScrollGesture {
  dragging: boolean
  pointerId: number
  startScrollLeft: number
  startX: number
  startY: number
}

interface SuppressedDragClick {
  until: number
  x: number
  y: number
}

export function useDataGridDragScroll() {
  const [isDragScrolling, setIsDragScrolling] = useState(false)
  const gestureRef = useRef<DragScrollGesture | null>(null)
  const suppressedClickRef = useRef<SuppressedDragClick | null>(null)

  function resetGesture(grid?: HTMLDivElement) {
    const gesture = gestureRef.current
    if (grid && gesture && grid.hasPointerCapture?.(gesture.pointerId)) {
      grid.releasePointerCapture(gesture.pointerId)
    }
    gestureRef.current = null
    setIsDragScrolling(false)
  }

  function onPointerDownCapture(event: PointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      event.pointerType === 'touch' ||
      isDragScrollExcludedTarget(event.target)
    ) {
      return
    }

    const grid = event.currentTarget
    if (grid.scrollWidth <= grid.clientWidth) return

    gestureRef.current = {
      dragging: false,
      pointerId: event.pointerId,
      startScrollLeft: grid.scrollLeft,
      startX: event.clientX,
      startY: event.clientY,
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return

    const deltaX = event.clientX - gesture.startX
    const deltaY = event.clientY - gesture.startY
    const horizontalMovement = Math.abs(deltaX)

    if (!gesture.dragging) {
      if (
        horizontalMovement < DRAG_SCROLL_THRESHOLD_PX ||
        horizontalMovement <= Math.abs(deltaY)
      ) {
        return
      }
      event.currentTarget.setPointerCapture?.(event.pointerId)
      gesture.dragging = true
      setIsDragScrolling(true)
    }

    event.preventDefault()
    event.currentTarget.scrollLeft = Math.max(
      0,
      Math.min(
        event.currentTarget.scrollWidth - event.currentTarget.clientWidth,
        gesture.startScrollLeft - deltaX,
      ),
    )
  }

  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    if (gesture.dragging) {
      suppressedClickRef.current = {
        until: performance.now() + DRAG_CLICK_SUPPRESSION_MS,
        x: event.clientX,
        y: event.clientY,
      }
    }
    resetGesture(event.currentTarget)
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    const suppressed = suppressedClickRef.current
    if (!suppressed) return

    suppressedClickRef.current = null
    const isExpired = performance.now() > suppressed.until
    const isReleaseClick =
      Math.abs(event.clientX - suppressed.x) <= DRAG_SCROLL_THRESHOLD_PX &&
      Math.abs(event.clientY - suppressed.y) <= DRAG_SCROLL_THRESHOLD_PX
    if (isExpired || !isReleaseClick) return

    event.preventDefault()
    event.stopPropagation()
  }

  return {
    isDragScrolling,
    onClickCapture,
    onLostPointerCapture: onPointerEnd,
    onPointerCancel: onPointerEnd,
    onPointerDownCapture,
    onPointerMove,
    onPointerUp: onPointerEnd,
  }
}
