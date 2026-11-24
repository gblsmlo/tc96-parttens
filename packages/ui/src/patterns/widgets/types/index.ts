export type TrendDirection = 'down' | 'flat' | 'up'

export interface WidgetPeriodOption<TPeriod extends string = string> {
  label: string
  value: TPeriod
}

/** Cor semântica do tema do consumidor. */
export type WidgetTone = 'destructive' | 'info' | 'success' | 'warning'
