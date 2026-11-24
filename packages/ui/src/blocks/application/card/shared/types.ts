export type CardBadgeTone =
  | 'error'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'success'
  | 'warning'

export interface CardBadgeData {
  label: string
  tone?: CardBadgeTone
}

export interface CardLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface CardLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}

export interface CardMenuAction {
  id: string
  label: string
}
