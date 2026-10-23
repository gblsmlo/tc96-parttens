import type { FlowConnection } from '@tc96/parttens/flow/canvas/core'
import type {
  FlowInspectorTab,
  FlowLogFilter,
} from '@tc96/parttens/flow/inspector/core'
import { useCallback, useState } from 'react'

export type FlowInspectorMode = 'view' | 'edit' | 'create'

export interface FlowCreation {
  after?: string
  connection?: FlowConnection
}

export function useFlowPageState() {
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [mode, setMode] = useState<FlowInspectorMode>('view')
  const [tab, setTab] = useState<FlowInspectorTab>('build')
  const [logFilter, setLogFilter] = useState<FlowLogFilter>('step')
  const [creation, setCreation] = useState<FlowCreation>({})
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantExpanded, setAssistantExpanded] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [locked, setLocked] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [confirmingClear, setConfirmingClear] = useState(false)

  const openInspector = useCallback(
    (next: FlowInspectorMode, context: FlowCreation = {}) => {
      setMode(next)
      setCreation(context)
      setTab('build')
      setInspectorOpen(true)
    },
    [],
  )
  const closeInspector = useCallback(() => {
    setInspectorOpen(false)
    setMode('view')
  }, [])

  return {
    assistantExpanded,
    assistantOpen,
    closeInspector,
    confirmingClear,
    creation,
    inspectorOpen,
    locked,
    logFilter,
    mode,
    openInspector,
    pendingDelete,
    setAssistantExpanded,
    setAssistantOpen,
    setConfirmingClear,
    setLocked,
    setLogFilter,
    setMode,
    setPendingDelete,
    setSnapToGrid,
    setTab,
    snapToGrid,
    tab,
  }
}

export type FlowPageState = ReturnType<typeof useFlowPageState>
