import type {
  RecordGroup7Catalog,
  RecordGroup7CatalogLabels,
  RecordGroup7Method,
} from './types'

export const defaultRecordGroup7CatalogLabels: RecordGroup7CatalogLabels = {
  method: {
    boleto: 'Bank slip',
    card: 'Card',
    pix: 'Pix',
  },
}

const methodOrder: readonly RecordGroup7Method[] = ['boleto', 'pix', 'card']

export function createRecordGroup7Catalog(
  labels?: {
    readonly [TKey in keyof RecordGroup7CatalogLabels]?: Partial<
      RecordGroup7CatalogLabels[TKey]
    >
  },
): RecordGroup7Catalog {
  const base = defaultRecordGroup7CatalogLabels
  const method = { ...base.method, ...labels?.method }

  return {
    method: methodOrder.map((value) => ({ label: method[value], value })),
  }
}

export const defaultRecordGroup7Catalog = createRecordGroup7Catalog()
