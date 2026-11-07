'use client'

import { type RefObject, useEffect } from 'react'

export const scrollbarInsetStyle = {
  marginBlockEnd: 'calc(var(--scrollbar-inset-end, 0px) + 0.25rem)',
  marginBlockStart: 'calc(var(--scrollbar-inset-start, 0px) + 0.25rem)',
} as const

export function useScrollbarInsets<TElement extends HTMLElement>(
  ref: RefObject<TElement | null>,
  startSelector: string,
  endSelector: string,
  hasEnd: boolean,
): void {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const start = root.querySelector<HTMLElement>(startSelector)
    const end = hasEnd ? root.querySelector<HTMLElement>(endSelector) : null

    const measure = () => {
      root.style.setProperty(
        '--scrollbar-inset-start',
        `${start?.offsetHeight ?? 0}px`,
      )
      root.style.setProperty(
        '--scrollbar-inset-end',
        `${end?.offsetHeight ?? 0}px`,
      )
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    if (start) observer.observe(start)
    if (end) observer.observe(end)
    return () => observer.disconnect()
  }, [endSelector, hasEnd, ref, startSelector])
}
