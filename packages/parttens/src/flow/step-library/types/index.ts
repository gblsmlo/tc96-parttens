import type { ReactNode } from 'react'
import type { FlowRunSummary, FlowStepType } from '../../canvas/core'
import type {
  FlowRunCardLabels,
  FlowStepGroup,
  FlowStepLibraryLabels,
} from '../core'

export interface FlowStepLibraryProps {
  children?: ReactNode
  className?: string
  collapsed?: boolean
  groups: readonly FlowStepGroup[]
  icons?: Record<string, ReactNode>
  labels?: Partial<FlowStepLibraryLabels>
  loading?: boolean
  onAdd: (type: FlowStepType) => void
}

export interface FlowStepLibraryGroupProps {
  collapsed?: boolean
  group: FlowStepGroup
  icons?: Record<string, ReactNode>
  onAdd: (type: FlowStepType) => void
}

export interface FlowStepLibraryItemProps {
  collapsed?: boolean
  icon?: ReactNode
  onAdd: (type: FlowStepType) => void
  type: FlowStepType
}

export interface FlowRunCardProps {
  className?: string
  icon?: ReactNode
  labels?: Partial<FlowRunCardLabels>
  run: FlowRunSummary
}
