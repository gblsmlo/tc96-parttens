import type React from 'react'

export type PropertyIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

export type PropertyTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning'

export interface PropertyPreset<TValue extends string> {
  icon: PropertyIcon
  label: string
  tone: PropertyTone
  value: TValue
}

/**
 * Os tons vêm dos tokens de tema, não da paleta fixa: `--*-foreground` é `700`
 * no claro e `400` no escuro, enquanto um `text-*-500` literal ficava igual nos
 * dois e perdia contraste sobre o fundo claro.
 */
export const propertyToneClassName: Record<PropertyTone, string> = {
  danger: 'text-destructive-foreground',
  info: 'text-info-foreground',
  neutral: 'text-muted-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
}
