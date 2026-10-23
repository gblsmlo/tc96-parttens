import type { Edge, Node } from '@xyflow/react'
import type { ReactNode } from 'react'
import type {
  FlowConnection,
  FlowDirection,
  FlowRunStatus,
  FlowStep,
  FlowStepAction,
  FlowStepType,
} from '../core'

export type FlowCanvasMode = 'select' | 'pan'

export interface FlowPosition {
  x: number
  y: number
}

export interface FlowConnectInput {
  source: string
  target: string
  sourceHandle?: string
}

export interface FlowCanvasLabels {
  canvas: string
  stepRoleDescription: string
  statuses: Record<FlowRunStatus, string>
  stepName: (name: string, type: string, status: string) => string
  stepToolbar: (name: string) => string
  stepMenu: (name: string) => string
  actions: Record<FlowStepAction, (name: string) => string>
  menuActions: Record<FlowStepAction, string>
  addAfterLeaf: (name: string) => string
  sourceHandle: (name: string) => string
  targetHandle: (name: string) => string
  edgeAdd: (label?: string) => string
  edgeRemove: (label?: string) => string
  controls: string
  mode: string
  select: string
  pan: string
  zoomOut: string
  zoomIn: string
  zoomLevel: (percent: number) => string
  minimap: string
  emptyTitle: string
  emptyDescription: string
}

export interface FlowCanvasProps {
  steps: readonly FlowStep[]
  connections: readonly FlowConnection[]
  stepTypes?: readonly FlowStepType[]
  direction?: FlowDirection
  selectedStepId?: string | null
  locked?: boolean
  snapToGrid?: boolean
  loading?: boolean
  edgeControls?: boolean
  stepMenu?: boolean
  icons?: Record<string, ReactNode>
  labels?: Partial<FlowCanvasLabels>
  className?: string
  children?: ReactNode
  onStepsChange?: (steps: FlowStep[]) => void
  onStepsChangeEnd?: (steps: FlowStep[]) => void
  onConnectionsChange?: (connections: FlowConnection[]) => void
  onConnect?: (connection: FlowConnectInput) => void
  onSelect?: (stepId: string | null) => void
  onStepDrop?: (type: FlowStepType, position: FlowPosition) => void
  onStepAction?: (
    action: FlowStepAction,
    stepId: string,
    connection?: FlowConnection,
  ) => void
}

export interface FlowNodeData extends Record<string, unknown> {
  step: FlowStep
  leaf: boolean
}

export interface FlowEdgeData extends Record<string, unknown> {
  connection: FlowConnection
}

export type FlowNodeType = Node<FlowNodeData, 'step'>
export type FlowEdgeType = Edge<FlowEdgeData, 'step'>

export interface FlowShortcutsLabels {
  trigger: string
  title: string
  select: string
  pan: string
  zoomIn: string
  zoomOut: string
  fit: string
  actualSize: string
  remove: string
}
