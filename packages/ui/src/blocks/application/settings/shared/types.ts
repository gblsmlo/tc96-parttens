export interface SettingsRowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface SettingsOption {
  label: string
  value: string
}

export interface SettingsLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface SettingsLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}

export interface SettingsAppLogoData {
  svg: string
  title?: string
}
