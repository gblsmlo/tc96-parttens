export type RunMonitorStatus =
  | 'failed'
  | 'pending'
  | 'running'
  | 'succeeded'
  | 'waiting-approval'

export interface RunMonitorStep {
  description?: string
  durationMs?: number
  id: string
  name: string
  owner?: string
  status: RunMonitorStatus
}

export interface RunMonitorConnection {
  id: string
  source: string
  target: string
}

export interface RunMonitorLabels {
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
  statuses: Record<RunMonitorStatus, string>
  summary: (completed: number, total: number) => string
  summaryTitle: string
  title: string
}

export interface RunMonitorProps {
  className?: string
  connections: RunMonitorConnection[]
  error?: boolean
  labels?: Partial<RunMonitorLabels>
  onApprove?: (stepId: string) => void
  onReject?: (stepId: string) => void
  onReplay?: () => void
  onRetry?: () => void
  pending?: boolean
  steps: RunMonitorStep[]
}
