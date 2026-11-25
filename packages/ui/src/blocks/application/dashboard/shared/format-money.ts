import { formatAmount } from '@tc96/ui/helpers/format'
import { defaultDashboardCurrency, defaultDashboardLocale } from './format'
import type { DashboardFormatProps } from './types'

export function createMoneyFormatter({
  currency = defaultDashboardCurrency,
  locale = defaultDashboardLocale,
}: DashboardFormatProps = {}) {
  const cents = (amount: number) =>
    formatAmount(amount / 100, { currency, locale, style: 'currency' })

  const compactCents = (amount: number) =>
    formatAmount(amount / 100, {
      currency,
      locale,
      maximumFractionDigits: 1,
      notation: 'compact',
      style: 'currency',
    })

  const count = (amount: number) =>
    formatAmount(amount, {
      locale,
      maximumFractionDigits: 0,
      style: 'decimal',
    })

  const percent = (ratio: number) =>
    formatAmount(ratio, {
      locale,
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      style: 'percent',
    })

  return { cents, compactCents, count, percent }
}

export type MoneyFormatter = ReturnType<typeof createMoneyFormatter>
