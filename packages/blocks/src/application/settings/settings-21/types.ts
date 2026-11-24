export type Settings21Status = 'connected' | 'disconnected' | 'error'

export interface Settings21App {
  description: string
  id: string
  name: string
  status: Settings21Status
}

export interface Settings21Labels {
  connect: string
  connectAction: (name: string) => string
  connected: string
  description: string
  disconnect: string
  disconnectAction: (name: string) => string
  disconnected: string
  emptyDescription: string
  emptyTitle: string
  error: string
  reconnect: string
  reconnectAction: (name: string) => string
  title: string
}

export interface Settings21Props {
  apps: Settings21App[]
  className?: string
  labels?: Partial<Settings21Labels>
  onConnect?: (appId: string) => void
  onDisconnect?: (appId: string) => void
}
