import type { TimelineBadgeData } from '../shared/types'

export interface Timeline4Actor {
  image?: string
  name: string
}

export interface Timeline4Entry {
  actor: Timeline4Actor
  badge?: TimelineBadgeData
  id: string
  time: string
  title: string
}

export interface Timeline4Labels {
  description: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  feed: string
  loading: string
  retry: string
  title: string
  trigger: string
}

export interface Timeline4Props {
  className?: string
  entries: Timeline4Entry[]
  error?: boolean
  labels?: Partial<Timeline4Labels>
  onOpenChange: (open: boolean) => void
  onRetry?: () => void
  open: boolean
  pending?: boolean
}
