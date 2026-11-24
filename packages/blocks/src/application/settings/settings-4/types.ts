export interface Settings4Option {
  label: string
  value: string
}

export interface Settings4ThemeGroup {
  id: string
  label?: string
  options: Settings4Option[]
}

export interface Settings4Labels {
  mode: string
  modeDescription: string
  theme: string
  themeDescription: string
  title: string
}

export interface Settings4Props {
  className?: string
  colorTheme: string
  labels?: Partial<Settings4Labels>
  mode: string
  modeOptions: Settings4Option[]
  onColorThemeChange?: (value: string) => void
  onModeChange?: (value: string) => void
  themeGroups: Settings4ThemeGroup[]
}
