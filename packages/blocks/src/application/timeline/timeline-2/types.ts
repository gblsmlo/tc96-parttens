export type Timeline2ChangeType = 'fix' | 'improvement' | 'new'

export interface Timeline2Entry {
  id: string
  items: string[]
  type: Timeline2ChangeType
}

export interface Timeline2Release {
  date: string
  entries: Timeline2Entry[]
  id: string
  version: string
}

export interface Timeline2Labels {
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
  title: string
  types: Record<Timeline2ChangeType, string>
}

export interface Timeline2Props {
  className?: string
  error?: boolean
  labels?: Partial<Omit<Timeline2Labels, 'types'>> & {
    types?: Partial<Timeline2Labels['types']>
  }
  locale?: string
  onRetry?: () => void
  pending?: boolean
  releases: Timeline2Release[]
}
