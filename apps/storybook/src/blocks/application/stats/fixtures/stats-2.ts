export interface QuotaUsage {
  cost: number
  limit: number
  renewsAt: string
  used: number
}

export const quotaUsage: QuotaUsage = {
  cost: 289.9,
  limit: 1_000_000,
  renewsAt: '2026-12-15T12:00:00.000Z',
  used: 742_000,
}
