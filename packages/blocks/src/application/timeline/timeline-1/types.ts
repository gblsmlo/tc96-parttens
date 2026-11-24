import type { TimelineBadgeData } from '../shared/types'

export interface Timeline1Attachment {
  id: string
  label: string
}

export interface Timeline1Event {
  action: string
  actor: string
  attachments?: Timeline1Attachment[]
  avatarSrc?: string
  id: string
  status?: TimelineBadgeData
  time: string
}

export interface Timeline1Labels {
  attachments: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
  title: string
}

export interface Timeline1Props {
  className?: string
  error?: boolean
  events: Timeline1Event[]
  labels?: Partial<Timeline1Labels>
  onRetry?: () => void
  pending?: boolean
}
