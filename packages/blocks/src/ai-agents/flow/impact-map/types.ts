export type ImpactMapKind = 'initiative' | 'metric' | 'north-star'

export interface ImpactMapNode {
  id: string
  kind: ImpactMapKind
  owner?: string
  progress: number
  title: string
  valueText?: string
}

export interface ImpactMapLink {
  id: string
  source: string
  target: string
}

export interface ImpactMapLabels {
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  kinds: Record<ImpactMapKind, string>
  loading: string
  map: string
  owner: (name: string) => string
  progress: (title: string, value: number) => string
  retry: string
  title: string
}

export interface ImpactMapProps {
  className?: string
  error?: boolean
  labels?: Partial<ImpactMapLabels>
  links: ImpactMapLink[]
  nodes: ImpactMapNode[]
  onNodeSelect?: (id: string) => void
  onRetry?: () => void
  pending?: boolean
  selectedId?: string | null
}
