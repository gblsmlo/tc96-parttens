import { describe, expect, test } from 'bun:test'
import {
  contactDocumentKind,
  formatContactDocument,
  parseContactDocument,
} from './contact-document'

describe('formatContactDocument', () => {
  test('formats a CPF until 11 digits', () => {
    expect(formatContactDocument('390')).toBe('390')
    expect(formatContactDocument('390533')).toBe('390.533')
    expect(formatContactDocument('39053344705')).toBe('390.533.447-05')
    expect(contactDocumentKind('390.533.447-05')).toBe('cpf')
  })

  test('switches to the CNPJ mask from the 12th digit', () => {
    expect(formatContactDocument('390533447051')).toBe('39.053.344/7051')
    expect(contactDocumentKind('390533447051')).toBe('cnpj')
    expect(formatContactDocument('04.252.011/0001-10')).toBe(
      '04.252.011/0001-10',
    )
    expect(contactDocumentKind('04252011000110')).toBe('cnpj')
  })

  test('drops extra digits and letters', () => {
    expect(formatContactDocument('04.252.011/0001-10999')).toBe(
      '04.252.011/0001-10',
    )
    expect(formatContactDocument('abc')).toBe('')
    expect(contactDocumentKind('')).toBeNull()
  })
})

describe('parseContactDocument', () => {
  test('accepts a complete CPF or CNPJ', () => {
    expect(parseContactDocument('39053344705')).toEqual({
      success: true,
      value: '390.533.447-05',
    })
    expect(parseContactDocument('04.252.011/0001-10')).toEqual({
      success: true,
      value: '04.252.011/0001-10',
    })
  })

  test('rejects a partial number', () => {
    expect(parseContactDocument('390.533')).toEqual({
      message: 'Informe um CPF ou um CNPJ completo.',
      success: false,
    })
  })
})
