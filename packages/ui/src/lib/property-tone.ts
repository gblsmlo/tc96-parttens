export type PropertyTone =
  | 'danger'
  | 'info'
  | 'neutral'
  | 'purple'
  | 'success'
  | 'teal'
  | 'warning'

export const propertyToneClassName: Record<PropertyTone, string> = {
  danger: 'text-destructive-foreground',
  info: 'text-info-foreground',
  neutral: 'text-muted-foreground',
  purple: 'text-purple-foreground',
  success: 'text-success-foreground',
  teal: 'text-teal-foreground',
  warning: 'text-warning-foreground',
}
