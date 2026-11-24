import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings8Labels extends SettingsLoadLabels {
  description: string
  enable: string
  title: string
}

export interface Settings8Props extends SettingsLoadProps {
  className?: string
  enabled?: boolean
  labels?: Partial<Settings8Labels>
  onEnabledChange?: (enabled: boolean) => void
}
