import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsCatalog2Labels extends SettingsLoadLabels {
  description: string
  enable: string
  title: string
}

export interface SettingsCatalog2Props extends SettingsLoadProps {
  className?: string
  enabled?: boolean
  labels?: Partial<SettingsCatalog2Labels>
  onEnabledChange?: (enabled: boolean) => void
}
