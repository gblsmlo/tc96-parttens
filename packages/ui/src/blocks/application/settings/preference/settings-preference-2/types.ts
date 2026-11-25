import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsPreference2SettingOption {
  label: string
  value: string
}

export interface SettingsPreference2Values {
  emailNotifications: boolean
  fontSize: string
  language: string
}

export interface SettingsPreference2Options {
  fontSize: SettingsPreference2SettingOption[]
  language: SettingsPreference2SettingOption[]
}

export interface SettingsPreference2Labels extends SettingsLoadLabels {
  emailNotifications: string
  emailNotificationsDescription: string
  fontSize: string
  fontSizeDescription: string
  language: string
  languageDescription: string
  title: string
}

export interface SettingsPreference2Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<SettingsPreference2Labels>
  onValueChange?: <K extends keyof SettingsPreference2Values>(
    key: K,
    value: SettingsPreference2Values[K],
  ) => void
  options: SettingsPreference2Options
  values: SettingsPreference2Values
}
