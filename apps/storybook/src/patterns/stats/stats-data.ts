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

export type LeadsPeriod = 'month' | 'quarter' | 'week'

export const leadsPeriods = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This quarter', value: 'quarter' },
] as const

export const leadsByPeriod: Record<
  LeadsPeriod,
  { conversion: number; newLeads: number; returning: number; source: string }
> = {
  month: {
    conversion: 0.128,
    newLeads: 54,
    returning: 198,
    source: 'LinkedIn',
  },
  quarter: {
    conversion: 0.114,
    newLeads: 171,
    returning: 562,
    source: 'Google Ads',
  },
  week: { conversion: 0.142, newLeads: 13, returning: 49, source: 'Referral' },
}
