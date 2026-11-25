import type { Revenue3Account } from './types'

export interface Revenue3RegionSummary {
  arr: number
  nextRenewal: string | null
  nrr: number | null
}

export function summarizeRegion(
  accounts: readonly Revenue3Account[],
): Revenue3RegionSummary {
  let arr = 0
  let weighted = 0
  let nextRenewal: string | null = null
  for (const account of accounts) {
    arr += account.arr
    weighted += account.arr * account.nrr
    if (nextRenewal === null || account.renewal < nextRenewal)
      nextRenewal = account.renewal
  }
  return { arr, nextRenewal, nrr: arr > 0 ? weighted / arr : null }
}

export function sortByRegion<
  TAccount extends Pick<Revenue3Account, 'regionId'>,
>(accounts: readonly TAccount[], regionIds: readonly string[]): TAccount[] {
  const order = new Map(regionIds.map((id, index) => [id, index]))
  const rank = (account: TAccount) =>
    order.get(account.regionId) ?? regionIds.length
  return [...accounts].sort((a, b) => rank(a) - rank(b))
}
