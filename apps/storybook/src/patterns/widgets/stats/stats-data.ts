export type RecurringPeriod = 'arr' | 'mrr'
export type SystemHealth = 'critical' | 'degraded' | 'healthy'

export const wholeCurrency = { maximumFractionDigits: 0 }

export const activeUsers = [
  1980, 2045, 2010, 2120, 2090, 2160, 2105, 2240, 2210, 2295, 2330, 2350,
]

export const deviceRevenue = [
  { id: 'desktop', label: 'Desktop', value: 32450 },
  { id: 'mobile', label: 'Mobile', value: 12300 },
  { id: 'tablet', label: 'Tablet', value: 5250 },
]

export const recurringPeriods = [
  { label: 'MRR', value: 'mrr' },
  { label: 'ARR', value: 'arr' },
] as const

export const recurringLabels: Record<RecurringPeriod, string> = {
  arr: 'Annual recurring',
  mrr: 'Monthly recurring',
}
