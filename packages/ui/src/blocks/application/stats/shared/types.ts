export interface StatsAction {
  destructive?: boolean
  id: string
  label: string
}

export interface StatsLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface StatsLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}
