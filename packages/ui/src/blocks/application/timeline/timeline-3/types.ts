export type Timeline3Status = 'approved' | 'pending' | 'rejected'

export interface Timeline3Owner {
  image?: string
  name: string
}

export interface Timeline3Step {
  date: string
  id: string
  name: string
  owner: Timeline3Owner
  status: Timeline3Status
}

export interface Timeline3Labels {
  approve: string
  currentStep: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  loading: string
  reject: string
  retry: string
  statuses: Record<Timeline3Status, string>
  title: string
}

export interface Timeline3Props {
  className?: string
  currentStepId?: string
  error?: boolean
  labels?: Partial<Timeline3Labels>
  onApprove?: (stepId: string) => void
  onReject?: (stepId: string) => void
  onRetry?: () => void
  pending?: boolean
  steps: Timeline3Step[]
}
