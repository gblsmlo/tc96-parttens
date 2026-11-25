import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RichTextEditor1SaveState } from './types'

export function useDebouncedSave(
  onSave: ((value: RichTextValue) => void) | undefined,
  delay: number,
) {
  const [state, setState] = useState<RichTextEditor1SaveState>('saved')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const handler = useRef(onSave)

  useEffect(() => {
    handler.current = onSave
  }, [onSave])

  useEffect(() => () => clearTimeout(timer.current), [])

  const schedule = useCallback(
    (value: RichTextValue) => {
      if (!handler.current) return
      setState('unsaved')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        handler.current?.(value)
        setState('saved')
      }, delay)
    },
    [delay],
  )

  return { schedule, state: onSave ? state : null }
}
