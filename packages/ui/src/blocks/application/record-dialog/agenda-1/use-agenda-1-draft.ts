import { type RefObject, useCallback, useRef, useState } from 'react'

export interface Agenda1Draft<T extends object> {
  draft: T
  latest: RefObject<T>
  reset: () => void
  update: (patch: Partial<T>) => void
}

export function useAgenda1Draft<T extends object>(
  initial: T | (() => T),
): Agenda1Draft<T> {
  const [initialDraft] = useState(initial)
  const [draft, setDraft] = useState(initialDraft)
  const latest = useRef(initialDraft)

  const update = useCallback((patch: Partial<T>) => {
    latest.current = { ...latest.current, ...patch }
    setDraft(latest.current)
  }, [])

  const reset = useCallback(() => {
    latest.current = initialDraft
    setDraft(initialDraft)
  }, [initialDraft])

  return { draft, latest, reset, update }
}
