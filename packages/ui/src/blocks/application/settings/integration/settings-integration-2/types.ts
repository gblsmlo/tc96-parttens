import type {
  SettingsAppLogoData,
  SettingsLoadLabels,
  SettingsLoadProps,
} from '../../shared/types'
export type SettingsIntegration2Status = 'connected' | 'disconnected' | 'error'

export interface SettingsIntegration2App {
  logo?: SettingsAppLogoData
  description: string
  id: string
  name: string
  status: SettingsIntegration2Status
}

export interface SettingsIntegration2Labels extends SettingsLoadLabels {
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

export interface SettingsIntegration2Props extends SettingsLoadProps {
  apps: SettingsIntegration2App[]
  className?: string
  labels?: Partial<SettingsIntegration2Labels>
  onConnect?: (appId: string) => void
  onDisconnect?: (appId: string) => void
}
