import type { RecordGroup3Catalog, RecordGroup3CatalogLabels } from './types'

export const defaultRecordGroup3CatalogLabels: RecordGroup3CatalogLabels = {
  source: {
    google: 'Google',
    instagram: 'Instagram',
    referral: 'Referral',
  },
}

const sourceOrder = ['instagram', 'referral', 'google'] as const

export function createRecordGroup3Catalog(
  labels?: {
    readonly [TKey in keyof RecordGroup3CatalogLabels]?: Partial<
      RecordGroup3CatalogLabels[TKey]
    >
  },
): RecordGroup3Catalog {
  const source = {
    ...defaultRecordGroup3CatalogLabels.source,
    ...labels?.source,
  }

  return {
    source: sourceOrder.map((value) => ({ label: source[value], value })),
  }
}

export const defaultRecordGroup3Catalog = createRecordGroup3Catalog()
