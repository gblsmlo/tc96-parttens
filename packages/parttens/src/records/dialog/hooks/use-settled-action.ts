import { useEffect, useRef, useState } from 'react'
import type { RecordDialogSettlement } from '../core'

export function useSettledAction(open: boolean, onAccepted: () => void) {
  const [pending, setPending] = useState(false)
  const running = useRef(false)
  const mounted = useRef(true)
  const generation = useRef(0)
  const accepted = useRef(onAccepted)
  const focusOnFailure = useRef<HTMLElement | null>(null)

  useEffect(() => {
    accepted.current = onAccepted
  })

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (open) return
    generation.current += 1
    running.current = false
    setPending(false)
  }, [open])

  useEffect(() => {
    if (pending) return
    focusOnFailure.current?.focus()
    focusOnFailure.current = null
  }, [pending])

  const run = async (
    action: () => RecordDialogSettlement,
    focusTarget: HTMLElement | null = null,
  ) => {
    if (running.current) return
    const started = generation.current
    running.current = true
    focusOnFailure.current = focusTarget
    setPending(true)
    let settled = false
    try {
      settled = await action()
    } catch {
      settled = false
    }
    if (!mounted.current || started !== generation.current) return
    running.current = false
    setPending(false)
    if (settled) {
      focusOnFailure.current = null
      accepted.current()
    }
  }

  return { pending, run }
}
