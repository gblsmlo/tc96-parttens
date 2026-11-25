import type {
  SettingsAppLogoData,
  SettingsLoadLabels,
  SettingsLoadProps,
} from '../../shared/types'

export type SettingsIntegration4Status = 'connected' | 'review'

export type SettingsIntegration4Action = 'sync' | 'manage' | 'disconnect'

export interface SettingsIntegration4App {
  logo?: SettingsAppLogoData
  description: string
  id: string
  name: string
  status: SettingsIntegration4Status
}

export interface SettingsIntegration4Section {
  apps: SettingsIntegration4App[]
  id: string
  title: string
}

export interface SettingsIntegration4Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  connected: string
  description: string
  disconnect: string
  emptyDescription: string
  emptyTitle: string
  manage: string
  newConnection: string
  review: string
  sync: string
  title: string
}

export interface SettingsIntegration4Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<SettingsIntegration4Labels>
  onAction?: (appId: string, action: SettingsIntegration4Action) => void
  onCreate?: () => void
  sections: SettingsIntegration4Section[]
}
