export type Flow4Kind = 'initiative' | 'metric' | 'north-star'

export interface Flow4Node {
  id: string
  kind: Flow4Kind
  owner?: string
  progress: number
  title: string
  valueText?: string
}

export interface Flow4Link {
  id: string
  source: string
  target: string
}

export interface Flow4Labels {
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  kinds: Record<Flow4Kind, string>
  loading: string
  map: string
  owner: (name: string) => string
  progress: (title: string, value: number) => string
  retry: string
  title: string
}

export interface Flow4Props {
  className?: string
  error?: boolean
  labels?: Partial<Flow4Labels>
  links: Flow4Link[]
  nodes: Flow4Node[]
  onNodeSelect?: (id: string) => void
  onRetry?: () => void
  pending?: boolean
  selectedId?: string | null
}
