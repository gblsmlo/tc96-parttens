import type {
  SettingsAppLogoData,
  SettingsLoadLabels,
  SettingsLoadProps,
} from '../../shared/types'

export interface SettingsIntegration6App {
  logo?: SettingsAppLogoData
  connected: boolean
  description: string
  enabled: boolean
  id: string
  name: string
}

export interface SettingsIntegration6Labels extends SettingsLoadLabels {
  connect: string
  connectAction: (name: string) => string
  description: string
  disconnect: string
  disconnectAction: (name: string) => string
  emptyDescription: string
  emptyTitle: string
  enableAction: (name: string) => string
  title: string
}

export interface SettingsIntegration6Props extends SettingsLoadProps {
  apps: SettingsIntegration6App[]
  className?: string
  labels?: Partial<SettingsIntegration6Labels>
  onConnect?: (appId: string) => void
  onDisconnect?: (appId: string) => void
  onEnabledChange?: (appId: string, enabled: boolean) => void
}
