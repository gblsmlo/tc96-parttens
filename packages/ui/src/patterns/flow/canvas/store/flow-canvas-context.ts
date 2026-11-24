import { createContext, type ReactNode, useContext } from 'react'
import type {
  FlowConnection,
  FlowDirection,
  FlowStepAction,
  FlowStepType,
} from '../core'
import type { FlowCanvasLabels, FlowCanvasMode } from '../types'

export interface FlowCanvasContextValue {
  connections: readonly FlowConnection[]
  direction: FlowDirection
  edgeControls: boolean
  icons: Record<string, ReactNode>
  labels: FlowCanvasLabels
  locked: boolean
  mode: FlowCanvasMode
  onConnectionsChange?: (connections: FlowConnection[]) => void
  onStepAction?: (
    action: FlowStepAction,
    stepId: string,
    connection?: FlowConnection,
  ) => void
  setMode: (mode: FlowCanvasMode) => void
  stepMenu: boolean
  stepTypes: readonly FlowStepType[]
}

export const FlowCanvasContext = createContext<
  FlowCanvasContextValue | undefined
>(undefined)

export function useFlowCanvasContext(
  component: string,
): FlowCanvasContextValue {
  const context = useContext(FlowCanvasContext)
  if (!context)
    throw new Error(`${component} must be used inside a FlowCanvas.`)
  return context
}
