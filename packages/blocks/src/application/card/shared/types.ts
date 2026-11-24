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
