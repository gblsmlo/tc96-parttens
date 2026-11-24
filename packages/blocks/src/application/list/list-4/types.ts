export interface List4Integration {
  connected?: boolean
  description: string
  id: string
  name: string
}

export interface List4Labels {
  connect: string
  connectTo: (name: string) => string
  connected: string
  emptyDescription: string
  emptyTitle: string
  title: string
}

export interface List4Props {
  className?: string
  integrations: readonly List4Integration[]
  labels?: Partial<List4Labels>
  onConnect?: (id: string) => void
}
