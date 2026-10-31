import { describe, expect, test } from 'bun:test'
import { getCountries } from 'react-phone-number-input/input-max'
import { type PhoneCountryCode, phoneCountries } from './countries'

describe('defaultCountry', () => {
  test('recusa em tempo de compilação um código que não é ISO 3166-1 alpha-2', () => {
    // @ts-expect-error — se `PhoneCountryCode` afrouxasse para `string`, o
    // typecheck passaria aqui e esta linha falharia por não haver erro.
    const invalid: PhoneCountryCode = 'BRA'

    expect(String(invalid)).toBe('BRA')
  })

  test('todo país aceito pela prop existe no catálogo, com nome, código e bandeira', () => {
    expect(phoneCountries).toHaveLength(getCountries().length)

    const incomplete = phoneCountries
      .filter(
        (country) => !country.name || !country.callingCode || !country.flag,
      )
      .map((country) => country.code)

    expect(incomplete).toEqual([])
  })
})
