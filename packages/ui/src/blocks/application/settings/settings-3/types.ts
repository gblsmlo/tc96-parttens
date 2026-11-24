import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings3SettingOption {
  label: string
  value: string
}

export interface Settings3Values {
  emailNotifications: boolean
  fontSize: string
  language: string
}

export interface Settings3Options {
  fontSize: Settings3SettingOption[]
  language: Settings3SettingOption[]
}

export interface Settings3Labels extends SettingsLoadLabels {
  emailNotifications: string
  emailNotificationsDescription: string
  fontSize: string
  fontSizeDescription: string
  language: string
  languageDescription: string
  title: string
}

export interface Settings3Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<Settings3Labels>
  onValueChange?: <K extends keyof Settings3Values>(
    key: K,
    value: Settings3Values[K],
  ) => void
  options: Settings3Options
  values: Settings3Values
}
