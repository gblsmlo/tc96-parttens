import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings2SettingOption {
  label: string
  value: string
}

export interface Settings2Values {
  displayNames: string
  fontSize: string
  theme: string
  underlineLinks: boolean
}

export interface Settings2Options {
  displayNames: Settings2SettingOption[]
  fontSize: Settings2SettingOption[]
  theme: Settings2SettingOption[]
}

export interface Settings2Labels extends SettingsLoadLabels {
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

export interface Settings2Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<Settings2Labels>
  onValueChange?: <K extends keyof Settings2Values>(
    key: K,
    value: Settings2Values[K],
  ) => void
  options: Settings2Options
  values: Settings2Values
}
