import { describe, expect, test } from 'bun:test'
import {
  createAmountFormatter,
  defaultAmountCurrency,
  defaultAmountLocale,
  formatAmount,
  splitAmountAtDecimal,
} from './format'

const singleSpaces = (text: string) => text.replace(/\s/g, ' ')

describe('@helpers formatAmount', () => {
  test('formats currency in US dollars by default', () => {
    expect(defaultAmountLocale).toBe('en-US')
    expect(defaultAmountCurrency).toBe('USD')
    expect(formatAmount(115485.04)).toBe('$115,485.04')
    expect(formatAmount(0)).toBe('$0.00')
    expect(formatAmount(-1234.5)).toBe('-$1,234.50')
  })

  test('follows the locale and currency it receives', () => {
    expect(
      singleSpaces(formatAmount(1234.5, { currency: 'BRL', locale: 'pt-BR' })),
    ).toBe('R$ 1.234,50')
    expect(
      singleSpaces(formatAmount(1234.5, { currency: 'EUR', locale: 'de-DE' })),
    ).toBe('1.234,50 €')
  })

  test('shows percentages with two fraction digits unless told otherwise', () => {
    expect(formatAmount(0.0934, { style: 'percent' })).toBe('9.34%')
    expect(formatAmount(0.5, { style: 'percent' })).toBe('50.00%')
    expect(
      formatAmount(0.0934, { maximumFractionDigits: 0, style: 'percent' }),
    ).toBe('9%')
    expect(
      formatAmount(0.0934, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
        style: 'percent',
      }),
    ).toBe('9.3%')
  })

  test('pads integer digits and keeps the sign when asked', () => {
    expect(
      formatAmount(0.0934, { minimumIntegerDigits: 2, style: 'percent' }),
    ).toBe('09.34%')
    expect(formatAmount(500, { signDisplay: 'always' })).toBe('+$500.00')
    expect(
      formatAmount(0, { signDisplay: 'exceptZero', style: 'decimal' }),
    ).toBe('0')
  })

  test('formats plain decimals and compact notation', () => {
    expect(formatAmount(1234.567, { style: 'decimal' })).toBe('1,234.567')
    expect(formatAmount(48250.75, { notation: 'compact' })).toBe('$48K')
    expect(
      formatAmount(1500000, { notation: 'compact', style: 'decimal' }),
    ).toBe('1.5M')
  })
})

describe('@helpers createAmountFormatter', () => {
  test('resolves the options Intl receives', () => {
    const options = createAmountFormatter({
      currency: 'BRL',
      locale: 'pt-BR',
    }).resolvedOptions()
    expect(options.locale).toBe('pt-BR')
    expect(options.currency).toBe('BRL')
    expect(options.style).toBe('currency')
  })

  test('leaves the currency out of non-currency styles', () => {
    expect(
      createAmountFormatter({ style: 'decimal' }).resolvedOptions().currency,
    ).toBeUndefined()
  })
})

describe('@helpers splitAmountAtDecimal', () => {
  test('separates the integer part from the decimal part and its suffix', () => {
    expect(splitAmountAtDecimal(48250.75)).toEqual({
      fraction: '.75',
      integer: '$48,250',
    })
    expect(
      splitAmountAtDecimal(0.0934, {
        minimumIntegerDigits: 2,
        style: 'percent',
      }),
    ).toEqual({ fraction: '.34%', integer: '09' })
  })

  test('returns everything as integer when there is no decimal part', () => {
    expect(splitAmountAtDecimal(1234, { style: 'decimal' })).toEqual({
      fraction: '',
      integer: '1,234',
    })
    expect(
      splitAmountAtDecimal(0.5, { maximumFractionDigits: 0, style: 'percent' }),
    ).toEqual({ fraction: '', integer: '50%' })
  })

  test('respects the decimal separator of the locale', () => {
    const parts = splitAmountAtDecimal(1234.5, {
      currency: 'BRL',
      locale: 'pt-BR',
    })
    expect(parts.fraction).toBe(',50')
    expect(singleSpaces(parts.integer)).toBe('R$ 1.234')
  })
})
