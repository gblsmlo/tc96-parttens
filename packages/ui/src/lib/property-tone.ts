export type PropertyTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning'

export const propertyToneClassName: Record<PropertyTone, string> = {
  danger: 'text-destructive-foreground',
  info: 'text-info-foreground',
  neutral: 'text-muted-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
}
