import type React from 'react'

export type PropertyIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

export type PropertyTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning'

export interface PropertyPreset<TValue extends string> {
  icon: PropertyIcon
  label: string
  tone: PropertyTone
  value: TValue
}

export const propertyToneClassName: Record<PropertyTone, string> = {
  danger: 'text-destructive-foreground',
  info: 'text-info-foreground',
  neutral: 'text-muted-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
}
