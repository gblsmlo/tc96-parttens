import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsPreference3Option {
  label: string
  value: string
}

export interface SettingsPreference3ThemeGroup {
  id: string
  label?: string
  options: SettingsPreference3Option[]
}

export interface SettingsPreference3Labels extends SettingsLoadLabels {
  mode: string
  modeDescription: string
  theme: string
  themeDescription: string
  title: string
}

export interface SettingsPreference3Props extends SettingsLoadProps {
  className?: string
  colorTheme: string
  labels?: Partial<SettingsPreference3Labels>
  mode: string
  modeOptions: SettingsPreference3Option[]
  onColorThemeChange?: (value: string) => void
  onModeChange?: (value: string) => void
  themeGroups: SettingsPreference3ThemeGroup[]
}
