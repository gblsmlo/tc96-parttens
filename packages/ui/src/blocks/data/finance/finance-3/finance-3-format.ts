import { formatNumericDate } from '@tc96/ui/helpers/date'
import { formatAmount } from '@tc96/ui/helpers/format'
import type { Finance3Direction, Finance3FormatProps } from './types'

export const defaultFinance3Locale = 'pt-BR'
export const defaultFinance3Currency = 'BRL'

export interface Finance3Formatter {
  amount: (cents: number, direction?: Finance3Direction) => string
  day: (day: string) => string
  dayValue: (day: string) => string
}

const signedCents = (cents: number, direction: Finance3Direction) => {
  if (direction === 'in') return Math.abs(cents)
  if (direction === 'out') return -Math.abs(cents)
  return cents
}

export function createFinance3Formatter({
  currency = defaultFinance3Currency,
  locale = defaultFinance3Locale,
}: Finance3FormatProps): Finance3Formatter {
  const dayValue = (day: string) => `${day.slice(0, 10)}T12:00:00.000Z`
  return {
    amount: (cents, direction = 'none') =>
      formatAmount(signedCents(cents, direction) / 100, {
        currency,
        locale,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        signDisplay: direction === 'none' ? 'auto' : 'exceptZero',
        style: 'currency',
      }),
    day: (day) => formatNumericDate(new Date(dayValue(day)), locale, 'UTC'),
    dayValue,
  }
}

export const finance3SignDirection = (cents: number): Finance3Direction => {
  if (cents > 0) return 'in'
  if (cents < 0) return 'out'
  return 'none'
}
