import type {
  SettingsAppLogoData,
  SettingsLoadLabels,
  SettingsLoadProps,
} from '../../shared/types'

export type SettingsIntegration7Status = 'available' | 'connected' | 'preview'

export interface SettingsIntegration7App {
  logo?: SettingsAppLogoData
  actionLabel: string
  description: string
  id: string
  name: string
  status: SettingsIntegration7Status
}

export interface SettingsIntegration7Labels extends SettingsLoadLabels {
  action: (name: string, actionLabel: string) => string
  available: string
  build: string
  connected: string
  description: string
  emptyDescription: string
  emptyTitle: string
  preview: string
  title: string
}

export interface SettingsIntegration7Props extends SettingsLoadProps {
  apps: SettingsIntegration7App[]
  className?: string
  labels?: Partial<SettingsIntegration7Labels>
  onAction?: (appId: string) => void
  onBuild?: () => void
}
