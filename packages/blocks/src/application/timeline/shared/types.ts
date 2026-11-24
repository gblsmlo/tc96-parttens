export type TimelineTone =
  | 'error'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'success'
  | 'warning'

export interface TimelineBadgeData {
  label: string
  tone?: TimelineTone
}
