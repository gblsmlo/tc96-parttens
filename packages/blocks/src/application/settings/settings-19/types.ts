export interface Settings19Endpoint {
  enabled: boolean
  events: number
  failing?: boolean
  id: string
  lastDelivery: string
  url: string
}

export type Settings19Action = 'edit' | 'send-test' | 'delete'

export interface Settings19Labels {
  actions: (url: string) => string
  delete: string
  description: string
  edit: string
  emptyDescription: string
  emptyTitle: string
  enable: (url: string) => string
  eventCount: (count: number) => string
  failing: string
  failingDescription: (count: number) => string
  failingTitle: string
  lastDelivery: (value: string) => string
  newEndpoint: string
  sendTest: string
  title: string
}

export interface Settings19Props {
  className?: string
  endpoints: Settings19Endpoint[]
  labels?: Partial<Settings19Labels>
  onCreate?: () => void
  onEnabledChange?: (endpointId: string, enabled: boolean) => void
  onEndpointAction?: (endpointId: string, action: Settings19Action) => void
}
