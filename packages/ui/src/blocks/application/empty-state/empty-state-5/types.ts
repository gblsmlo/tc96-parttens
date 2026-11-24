export interface EmptyState5Connector {
  connected?: boolean
  id: string
  name: string
}

export interface EmptyState5Labels {
  connect: string
  connected: string
  connectors: string
  description: string
  title: string
}

export interface EmptyState5Props {
  className?: string
  connectors: readonly EmptyState5Connector[]
  labels?: Partial<EmptyState5Labels>
  onConnect?: (id: string) => void
}
