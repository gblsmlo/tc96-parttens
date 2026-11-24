export interface ListLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface ListLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}
