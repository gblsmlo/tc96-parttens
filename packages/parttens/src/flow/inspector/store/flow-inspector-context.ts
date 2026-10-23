import { createContext, useContext } from 'react'
import { defaultFlowInspectorLabels } from '../lib/labels'
import type { FlowInspectorLabels } from '../types'

export interface FlowInspectorContextValue {
  labels: FlowInspectorLabels
  onClose: () => void
}

export const FlowInspectorContext = createContext<
  FlowInspectorContextValue | undefined
>(undefined)

export function useFlowInspectorLabels(
  labels?: Partial<FlowInspectorLabels>,
): FlowInspectorLabels {
  const context = useContext(FlowInspectorContext)
  return { ...(context?.labels ?? defaultFlowInspectorLabels), ...labels }
}

export function useFlowInspectorContext(
  component: string,
): FlowInspectorContextValue {
  const context = useContext(FlowInspectorContext)
  if (!context)
    throw new Error(`${component} must be used inside a FlowInspector.`)
  return context
}
