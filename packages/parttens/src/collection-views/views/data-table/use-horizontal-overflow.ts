'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'

export interface HorizontalOverflow {
  end: boolean
  start: boolean
}

export function useHorizontalOverflow<TElement extends HTMLElement>(): [
  RefObject<TElement | null>,
  HorizontalOverflow,
] {
  const ref = useRef<TElement>(null)
  const [overflow, setOverflow] = useState<HorizontalOverflow>({
    end: false,
    start: false,
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      const offset = Math.abs(element.scrollLeft)
      const maxOffset = element.scrollWidth - element.clientWidth
      const next = { end: offset < maxOffset - 1, start: offset > 1 }
      setOverflow((current) =>
        current.end === next.end && current.start === next.start
          ? current
          : next,
      )
    }

    measure()
    element.addEventListener('scroll', measure, { passive: true })
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(measure)
    observer?.observe(element)
    if (element.firstElementChild) observer?.observe(element.firstElementChild)

    return () => {
      element.removeEventListener('scroll', measure)
      observer?.disconnect()
    }
  }, [])

  return [ref, overflow]
}
