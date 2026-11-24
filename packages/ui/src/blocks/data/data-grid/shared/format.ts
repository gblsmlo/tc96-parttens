import { parseDateValue } from '@tc96/ui/helpers/date'
import { formatAmount } from '@tc96/ui/helpers/format'
import type { GridFormatProps } from './types'

export const defaultGridLocale = 'pt-BR'
export const defaultGridCurrency = 'BRL'

export function createTableFormatter({
  currency = defaultGridCurrency,
  locale = defaultGridLocale,
}: GridFormatProps = {}) {
  const number = (amount: number, fractionDigits = 0) =>
    formatAmount(amount, {
      locale,
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
      style: 'decimal',
    })

  const compact = (amount: number) =>
    formatAmount(amount, {
      locale,
      maximumFractionDigits: 1,
      notation: 'compact',
      style: 'decimal',
    })

  const money = (amount: number, fractionDigits = 0) =>
    formatAmount(amount, {
      currency,
      locale,
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
      style: 'currency',
    })

  const compactMoney = (amount: number) =>
    formatAmount(amount, {
      currency,
      locale,
      maximumFractionDigits: 1,
      notation: 'compact',
      style: 'currency',
    })

  const percent = (ratio: number, fractionDigits = 0) =>
    formatAmount(ratio, {
      locale,
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
      style: 'percent',
    })

  const delta = (ratio: number) =>
    formatAmount(ratio, {
      locale,
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      signDisplay: 'exceptZero',
      style: 'percent',
    })

  const date = (value: string, options?: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(
      locale,
      options ?? { day: 'numeric', month: 'short', year: 'numeric' },
    ).format(parseDateValue(value))

  const shortDate = (value: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
      .formatToParts(parseDateValue(value))
      .filter((part) => part.type !== 'literal')
      .map((part) => part.value.replace(/\.$/, ''))
      .join(' ')

  return {
    compact,
    compactMoney,
    date,
    delta,
    money,
    number,
    percent,
    shortDate,
  }
}

export type GridFormatter = ReturnType<typeof createTableFormatter>
