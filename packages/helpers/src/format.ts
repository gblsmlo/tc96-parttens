/**
 * Options accepted by the amount formatters. They mirror the subset of
 * `Intl.NumberFormat` options the widgets need; `locale`, `currency` and
 * `style` have defaults, everything else is passed through untouched.
 */
export interface AmountFormatOptions {
  currency?: string
  locale?: string
  maximumFractionDigits?: number
  minimumFractionDigits?: number
  minimumIntegerDigits?: number
  notation?: 'compact' | 'standard'
  signDisplay?: 'always' | 'auto' | 'exceptZero' | 'never'
  style?: 'currency' | 'decimal' | 'percent'
}

/** An amount split at its decimal separator; see {@link splitAmountAtDecimal}. */
export interface AmountParts {
  fraction: string
  integer: string
}

/** Locale used when `AmountFormatOptions.locale` is omitted. */
export const defaultAmountLocale = 'en-US'
/** Currency used when `AmountFormatOptions.currency` is omitted. */
export const defaultAmountCurrency = 'USD'

const percentFractionDigits = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
}

/**
 * Creates the `Intl.NumberFormat` behind {@link formatAmount}. Percentages
 * get two fraction digits unless `maximumFractionDigits` is set, and the
 * currency is only forwarded for the `currency` style.
 *
 * @param options - Formatting options; defaults to US dollars in `en-US`.
 * @returns A reusable formatter for the resolved options.
 */
export function createAmountFormatter({
  currency = defaultAmountCurrency,
  locale = defaultAmountLocale,
  style = 'currency',
  ...options
}: AmountFormatOptions = {}): Intl.NumberFormat {
  const usesPercentDefaults =
    style === 'percent' && options.maximumFractionDigits === undefined

  return new Intl.NumberFormat(locale, {
    ...options,
    ...(style === 'currency' ? { currency } : {}),
    ...(usesPercentDefaults ? percentFractionDigits : {}),
    style,
  })
}

/**
 * Formats a number as currency, decimal or percent. Percentages follow the
 * `Intl` convention: `0.0934` becomes `9.34%`.
 *
 * @param value - The amount to format. Percentages are ratios, not points.
 * @param options - Formatting options; defaults to US dollars in `en-US`.
 * @returns The formatted amount for the locale.
 */
export function formatAmount(
  value: number,
  options?: AmountFormatOptions,
): string {
  return createAmountFormatter(options).format(value)
}

/** Concatenates the values of `Intl.NumberFormat` parts back into text. */
function joinParts(parts: readonly Intl.NumberFormatPart[]): string {
  return parts.map((part) => part.value).join('')
}

/**
 * Formats an amount and splits it at the decimal separator, so the fraction
 * (separator, digits and any trailing suffix such as `%`) can be rendered
 * with a lighter style than the integer part.
 *
 * @param value - The amount to format.
 * @param options - Formatting options; defaults to US dollars in `en-US`.
 * @returns The integer part and the fraction; the fraction is empty when the
 * formatted amount has no decimal separator.
 */
export function splitAmountAtDecimal(
  value: number,
  options?: AmountFormatOptions,
): AmountParts {
  const parts = createAmountFormatter(options).formatToParts(value)
  const decimalIndex = parts.findIndex((part) => part.type === 'decimal')

  if (decimalIndex === -1) return { fraction: '', integer: joinParts(parts) }

  return {
    fraction: joinParts(parts.slice(decimalIndex)),
    integer: joinParts(parts.slice(0, decimalIndex)),
  }
}
