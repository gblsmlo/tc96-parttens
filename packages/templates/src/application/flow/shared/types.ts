import type {
  AssistantLabels,
  AssistantMessage,
  AssistantSuggestion,
} from '@tc96/parttens/chat/assistant/core'
import type { FlowShortcutsPopover } from '@tc96/parttens/flow/canvas/components/flow-shortcuts-popover'
import type { FlowCanvas } from '@tc96/parttens/flow/canvas/composition/flow-canvas/flow-canvas'
import type {
  FlowConnection,
  FlowRunSummary,
  FlowStep,
  FlowStepType,
} from '@tc96/parttens/flow/canvas/core'
import type { FlowInspector } from '@tc96/parttens/flow/inspector/composition/flow-inspector/flow-inspector'
import type {
  FlowLogEntry,
  FlowStepStats,
} from '@tc96/parttens/flow/inspector/core'
import type {
  FlowRunCardLabels,
  FlowStepLibraryLabels,
} from '@tc96/parttens/flow/step-library/core'
import type { ComponentProps, ReactNode } from 'react'
import type { FlowRenderLink } from './render-link'

export type {
  FlowConnection,
  FlowRunSummary,
  FlowStep,
  FlowStepType,
  FlowLogEntry,
  FlowStepStats,
  AssistantMessage,
  AssistantSuggestion,
  FlowRenderLink,
}

export interface FlowPosition {
  x: number
  y: number
}

export interface FlowConnectInput {
  source: string
  sourceHandle?: string
  target: string
}

export interface FlowBreadcrumbItem {
  href?: string
  label: string
}

export interface FlowOwner {
  avatarUrl?: string
  id: string
  name: string
}

export interface FlowStepValues {
  description: string
  name: string
  ownerId?: string
  path?: string
  type: string
}

export interface FlowStepAddOptions {
  after?: string
  connection?: FlowConnection
  position?: FlowPosition
  values?: FlowStepValues
}

export interface FlowAssistantConfig {
  description?: ReactNode
  greeting?: ReactNode
  messages: readonly AssistantMessage[]
  onNewChat?: () => void
  onRetry?: (messageId: string) => void
  onSend: (text: string) => void
  onSuggestion?: (suggestion: AssistantSuggestion) => void
  suggestions?: readonly AssistantSuggestion[]
  typing?: boolean
}

export interface FlowPageLabels {
  actions: string
  add: string
  addStep: string
  askAi: string
  assistantPlaceholder: string
  breadcrumb: string
  cancel: string
  canvasGroup: string
  clearDialogDescription: string
  clearDialogTitle: string
  clearResults: string
  copyJson: string
  delete: string
  deleteConfirm: string
  deleteDialogDescription: (name: string, connections: number) => string
  deleteDialogTitle: (name: string) => string
  detailDescription: string
  detailId: string
  detailInputs: string
  detailLastRun: string
  detailName: string
  detailNext: string
  detailOwner: string
  detailPath: string
  detailOutputs: string
  detailType: string
  edit: string
  formDescription: string
  formName: string
  formNameRequired: string
  formOwner: string
  formOwnerNone: string
  formPath: string
  formType: string
  lock: string
  newStep: string
  next: string
  notAdded: string
  organizeTree: string
  redo: string
  restoreExample: string
  run: string
  runEmptyAction: string
  save: string
  snapToGrid: string
  stepCount: (count: number) => string
  tidy: string
  undo: string
  viewing: string
  canvas?: ComponentProps<typeof FlowCanvas>['labels']
  assistant?: Partial<AssistantLabels>
  inspector?: ComponentProps<typeof FlowInspector>['labels']
  library?: Partial<FlowStepLibraryLabels>
  runCard?: Partial<FlowRunCardLabels>
  shortcuts?: ComponentProps<typeof FlowShortcutsPopover>['labels']
}

export interface FlowEditorProps {
  assistant?: FlowAssistantConfig
  breadcrumbs?: FlowBreadcrumbItem[]
  className?: string
  connections: readonly FlowConnection[]
  icons?: Record<string, ReactNode>
  labels?: Partial<FlowPageLabels>
  loading?: boolean
  logs?: readonly FlowLogEntry[]
  name: string
  onConnect?: (connection: FlowConnectInput) => void
  onConnectionsChange?: (connections: FlowConnection[]) => void
  onCopyJson?: () => void
  onRun?: () => void
  onSelectedStepChange?: (stepId: string | null) => void
  onStepAdd?: (type: FlowStepType, options?: FlowStepAddOptions) => void
  onStepChange?: (stepId: string, values: FlowStepValues) => void
  onStepDelete?: (stepId: string) => void
  onStepDuplicate?: (stepId: string) => void
  onStepsChange?: (steps: FlowStep[]) => void
  owners?: readonly FlowOwner[]
  renderLink?: FlowRenderLink
  run?: FlowRunSummary
  running?: boolean
  selectedStepId?: string | null
  stepStats?: Readonly<Record<string, FlowStepStats>>
  stepTypes: readonly FlowStepType[]
  steps: readonly FlowStep[]
}
