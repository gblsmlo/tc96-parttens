export type Flow3Status =
  | 'failed'
  | 'pending'
  | 'running'
  | 'succeeded'
  | 'waiting-approval'

export interface Flow3Step {
  description?: string
  durationMs?: number
  id: string
  name: string
  owner?: string
  status: Flow3Status
}

export interface Flow3Connection {
  id: string
  source: string
  target: string
}

export interface Flow3Labels {
  approvalDescription: string
  approvalsTitle: string
  approve: string
  approveStep: (name: string) => string
  canvas: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  loading: string
  noApprovals: string
  reject: string
  rejectStep: (name: string) => string
  replay: string
  retry: string
  statuses: Record<Flow3Status, string>
  summary: (completed: number, total: number) => string
  summaryTitle: string
  title: string
}

export interface Flow3Props {
  className?: string
  connections: Flow3Connection[]
  error?: boolean
  labels?: Partial<Flow3Labels>
  onApprove?: (stepId: string) => void
  onReject?: (stepId: string) => void
  onReplay?: () => void
  onRetry?: () => void
  pending?: boolean
  steps: Flow3Step[]
}
