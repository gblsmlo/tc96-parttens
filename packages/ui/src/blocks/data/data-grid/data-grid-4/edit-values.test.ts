import { describe, expect, test } from 'bun:test'
import {
  applyDraft,
  createPriceFormat,
  draftCount,
  parseStock,
} from './edit-values'
import type { DataGrid4Product } from './types'

const product: DataGrid4Product = {
  category: 'Vestuário',
  id: 'p1',
  name: 'Camiseta',
  price: 28,
  sku: 'VES-1042',
  status: 'active',
  stock: 320,
  visible: true,
}

describe('createPriceFormat', () => {
  test('formats with the locale decimal separator and no grouping', () => {
    const format = createPriceFormat('pt-BR')
    expect(format.format(1234.5)).toBe('1234,50')
  })

  test('parses the locale separator and the dot', () => {
    const format = createPriceFormat('pt-BR')
    expect(format.parse('24,90')).toBe(24.9)
    expect(format.parse('24.90')).toBe(24.9)
    expect(format.parse('-3')).toBe(-3)
    expect(format.parse('abc')).toBeNull()
    expect(format.parse('')).toBeNull()
  })

  test('reads en-US decimals', () => {
    expect(createPriceFormat('en-US').parse('19.99')).toBe(19.99)
  })
})

describe('parseStock', () => {
  test('accepts integers only', () => {
    expect(parseStock(' 12 ')).toBe(12)
    expect(parseStock('-2')).toBe(-2)
    expect(parseStock('1,5')).toBeNull()
  })
})

describe('applyDraft', () => {
  test('adds a changed value and drops one equal to the product', () => {
    const edited = applyDraft({}, product, 'price', 30)
    expect(edited).toEqual({ p1: { price: 30 } })
    expect(draftCount(applyDraft(edited, product, 'stock', 10))).toBe(2)
    expect(applyDraft(edited, product, 'price', 28)).toEqual({})
  })
})
