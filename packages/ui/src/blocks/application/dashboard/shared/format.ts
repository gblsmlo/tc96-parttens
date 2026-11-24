import { formatAmount } from '@tc96/ui/helpers/format'
import type { DashboardFormatProps, DashboardValueFormat } from './types'

export const defaultDashboardLocale = 'pt-BR'
export const defaultDashboardCurrency = 'BRL'

export function createDashboardFormatter({
  currency = defaultDashboardCurrency,
  locale = defaultDashboardLocale,
}: DashboardFormatProps = {}) {
  const value = (amount: number, format: DashboardValueFormat = 'number') => {
    if (format === 'currency') {
      return formatAmount(amount, {
        currency,
        locale,
        maximumFractionDigits: 0,
        style: 'currency',
      })
    }
    if (format === 'percent') {
      return formatAmount(amount, {
        locale,
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
        style: 'percent',
      })
    }
    return formatAmount(amount, {
      locale,
      maximumFractionDigits: 1,
      style: 'decimal',
    })
  }

  const exactCurrency = (amount: number) =>
    formatAmount(amount, { currency, locale, style: 'currency' })

  const delta = (amount: number) =>
    formatAmount(amount, {
      locale,
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      signDisplay: 'exceptZero',
      style: 'percent',
    })

  return { currency: exactCurrency, delta, value }
}

export type DashboardFormatter = ReturnType<typeof createDashboardFormatter>
