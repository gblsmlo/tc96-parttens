import { useReactFlow } from '@xyflow/react'
import { type KeyboardEvent, useCallback } from 'react'
import type { FlowCanvasMode } from '../types'

export interface UseFlowShortcutsOptions {
  onDelete?: () => void
  onMode: (mode: FlowCanvasMode) => void
}

export function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.getAttribute('role') === 'textbox'
  )
}

export function useFlowShortcuts({
  onDelete,
  onMode,
}: UseFlowShortcutsOptions) {
  const { fitView, zoomIn, zoomOut, zoomTo } = useReactFlow()

  return useCallback(
    (event: KeyboardEvent) => {
      if (event.defaultPrevented || isTextEntry(event.target)) return
      if (
        !(event.target instanceof Node) ||
        !event.currentTarget.contains(event.target)
      )
        return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.shiftKey && event.code === 'Digit1') {
        event.preventDefault()
        void fitView({ duration: 200 })
        return
      }
      if (event.shiftKey && event.code === 'Digit0') {
        event.preventDefault()
        void zoomTo(1, { duration: 200 })
        return
      }
      if (event.shiftKey) return
      switch (event.key) {
        case 'v':
        case 'V':
          onMode('select')
          return
        case 'h':
        case 'H':
          onMode('pan')
          return
        case '+':
        case '=':
          event.preventDefault()
          void zoomIn({ duration: 200 })
          return
        case '-':
          event.preventDefault()
          void zoomOut({ duration: 200 })
          return
        case 'Backspace':
        case 'Delete':
          if (!onDelete) return
          event.preventDefault()
          onDelete()
          return
        default:
      }
    },
    [fitView, onDelete, onMode, zoomIn, zoomOut, zoomTo],
  )
}
