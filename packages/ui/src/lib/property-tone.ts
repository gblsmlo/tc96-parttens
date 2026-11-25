export type PropertyTone =
  | 'complete'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'success'
  | 'warning'

export const propertyToneClassName: Record<PropertyTone, string> = {
  complete: 'text-complete-foreground',
  danger: 'text-destructive-foreground',
  info: 'text-info-foreground',
  neutral: 'text-muted-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
}
