import { type RefObject, useCallback, useRef, useState } from 'react'

export interface RecordDraft<T extends object> {
  draft: T
  latest: RefObject<T>
  reset: () => void
  update: (patch: Partial<T>) => void
}

export function useRecordDraft<T extends object>(
  initial: T | (() => T),
): RecordDraft<T> {
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
