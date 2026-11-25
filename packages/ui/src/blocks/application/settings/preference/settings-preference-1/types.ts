import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsPreference1SettingOption {
  label: string
  value: string
}

export interface SettingsPreference1Values {
  displayNames: string
  fontSize: string
  theme: string
  underlineLinks: boolean
}

export interface SettingsPreference1Options {
  displayNames: SettingsPreference1SettingOption[]
  fontSize: SettingsPreference1SettingOption[]
  theme: SettingsPreference1SettingOption[]
}

export interface SettingsPreference1Labels extends SettingsLoadLabels {
  displayNames: string
  displayNamesDescription: string
  fontSize: string
  fontSizeDescription: string
  generalTitle: string
  interfaceTitle: string
  theme: string
  themeDescription: string
  underlineLinks: string
  underlineLinksDescription: string
}

export interface SettingsPreference1Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<SettingsPreference1Labels>
  onValueChange?: <K extends keyof SettingsPreference1Values>(
    key: K,
    value: SettingsPreference1Values[K],
  ) => void
  options: SettingsPreference1Options
  values: SettingsPreference1Values
}
