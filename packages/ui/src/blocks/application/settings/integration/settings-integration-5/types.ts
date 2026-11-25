import type {
  SettingsAppLogoData,
  SettingsLoadLabels,
  SettingsLoadProps,
} from '../../shared/types'

export interface SettingsIntegration5Channel {
  description?: string
  enabled: boolean
  id: string
  label: string
}

export interface SettingsIntegration5App {
  logo?: SettingsAppLogoData
  channels?: SettingsIntegration5Channel[]
  connected: boolean
  description: string
  id: string
  name: string
}

export interface SettingsIntegration5Labels extends SettingsLoadLabels {
  channelAction: (appName: string, channelLabel: string) => string
  connect: string
  connectAction: (name: string) => string
  description: string
  disconnect: string
  disconnectAction: (name: string) => string
  emptyDescription: string
  emptyTitle: string
  title: string
}

export interface SettingsIntegration5Props extends SettingsLoadProps {
  apps: SettingsIntegration5App[]
  className?: string
  labels?: Partial<SettingsIntegration5Labels>
  onChannelChange?: (appId: string, channelId: string, enabled: boolean) => void
  onConnect?: (appId: string) => void
  onDisconnect?: (appId: string) => void
}
