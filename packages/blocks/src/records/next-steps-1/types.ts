import type { RecordsStatusRow } from '../shared/types'

export interface NextStepTask {
  actionLabel: string
  id: string
  title: string
}

export interface NextSteps1Labels {
  dismiss: string
  progress: string
  title: string
}

export interface NextSteps1Props {
  className?: string
  labels?: Partial<NextSteps1Labels>
  onDismiss?: () => void
  onTask?: (id: string) => void
  rows: readonly RecordsStatusRow[]
  tasks?: readonly NextStepTask[]
}
