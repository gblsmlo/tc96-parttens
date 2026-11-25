import type {
  Inventory1Draft,
  Inventory1Drafts,
  Inventory1EditableField,
  Inventory1Product,
} from './types'

export interface Inventory1PriceFormat {
  format: (amount: number) => string
  parse: (text: string) => number | null
}

export function createPriceFormat(locale: string): Inventory1PriceFormat {
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

export function draftCount(drafts: Inventory1Drafts): number {
  return Object.values(drafts).reduce(
    (total, draft) => total + Object.keys(draft).length,
    0,
  )
}

export function applyDraft(
  drafts: Inventory1Drafts,
  product: Inventory1Product,
  field: Inventory1EditableField,
  value: number,
): Inventory1Drafts {
  const { [field]: _previous, ...rest } = drafts[product.id] ?? {}
  const draft: Inventory1Draft =
    value === product[field] ? rest : { ...rest, [field]: value }
  const { [product.id]: _row, ...others } = drafts
  return Object.keys(draft).length > 0
    ? { ...others, [product.id]: draft }
    : others
}
