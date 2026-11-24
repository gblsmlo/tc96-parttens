import type {
  Table4Draft,
  Table4Drafts,
  Table4EditableField,
  Table4Product,
} from './types'

export interface Table4PriceFormat {
  format: (amount: number) => string
  parse: (text: string) => number | null
}

export function createPriceFormat(locale: string): Table4PriceFormat {
  const decimal = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    useGrouping: false,
  })
  const separator =
    decimal.formatToParts(1.5).find((part) => part.type === 'decimal')?.value ??
    '.'
  return {
    format: (amount) => decimal.format(amount),
    parse: (text) => {
      const normalized = text.trim().replaceAll(separator, '.')
      if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null
      return Number(normalized)
    },
  }
}

export function parseStock(text: string): number | null {
  const normalized = text.trim()
  if (!/^-?\d+$/.test(normalized)) return null
  return Number(normalized)
}

export function draftCount(drafts: Table4Drafts): number {
  return Object.values(drafts).reduce(
    (total, draft) => total + Object.keys(draft).length,
    0,
  )
}

export function applyDraft(
  drafts: Table4Drafts,
  product: Table4Product,
  field: Table4EditableField,
  value: number,
): Table4Drafts {
  const { [field]: _previous, ...rest } = drafts[product.id] ?? {}
  const draft: Table4Draft =
    value === product[field] ? rest : { ...rest, [field]: value }
  const { [product.id]: _row, ...others } = drafts
  return Object.keys(draft).length > 0
    ? { ...others, [product.id]: draft }
    : others
}
