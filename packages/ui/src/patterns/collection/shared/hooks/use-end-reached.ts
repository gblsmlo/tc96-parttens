import { type RefObject, useEffect, useRef } from 'react'
import { isNearEnd, shouldFireEndReached } from '../lib/end-reached'
import { useLatestCallback } from './use-latest-callback'

export interface EndReachedGeometry {
  bottomInset: number
  rowHeight: number
}

interface UseEndReachedOptions {
  enabled: boolean
  loadingMore: boolean
  measure: (element: HTMLElement) => EndReachedGeometry
  onEndReached?: () => void
  rowCount: number
  scrollRef: RefObject<HTMLElement | null>
  threshold: number
}

export function useEndReached({
  enabled,
  loadingMore,
  measure,
  onEndReached,
  rowCount,
  scrollRef,
  threshold,
}: UseEndReachedOptions) {
  const firedForCountRef = useRef<number | undefined>(undefined)

  const check = useLatestCallback(() => {
    const element = scrollRef.current
    if (!(element && enabled)) return
    const geometry = measure(element)
    const nearEnd = isNearEnd({
      bottomInset: geometry.bottomInset,
      clientHeight: element.clientHeight,
      rowHeight: geometry.rowHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
      threshold,
    })
    const fire = shouldFireEndReached({
      firedForCount: firedForCountRef.current,
      loading: loadingMore,
      nearEnd,
      rowCount,
    })
    if (!fire) return
    firedForCountRef.current = rowCount
    onEndReached?.()
  })

  useEffect(() => {
    if (enabled && !loadingMore && rowCount > 0) check()
  }, [check, enabled, loadingMore, rowCount])

  useEffect(() => {
    const element = scrollRef.current
    if (!(element && enabled)) return
    element.addEventListener('scroll', check, { passive: true })
    return () => element.removeEventListener('scroll', check)
  }, [check, enabled, scrollRef])
}
