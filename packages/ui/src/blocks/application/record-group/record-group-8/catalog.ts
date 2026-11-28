import type {
  RecordGroup8Catalog,
  RecordGroup8CatalogLabels,
  RecordGroup8Interest,
  RecordGroup8Urgency,
} from './types'

export const defaultRecordGroup8CatalogLabels: RecordGroup8CatalogLabels = {
  interest: {
    banking: 'Banking review',
    family: 'Family',
    labor: 'Labor',
  },
  urgency: {
    high: 'High',
    low: 'Low',
    medium: 'Medium',
  },
}

const interestOrder: readonly RecordGroup8Interest[] = [
  'banking',
  'labor',
  'family',
]

const urgencyOrder: readonly RecordGroup8Urgency[] = ['high', 'medium', 'low']

export function createRecordGroup8Catalog(
  labels?: {
    readonly [TKey in keyof RecordGroup8CatalogLabels]?: Partial<
      RecordGroup8CatalogLabels[TKey]
    >
  },
): RecordGroup8Catalog {
  const base = defaultRecordGroup8CatalogLabels
  const interest = { ...base.interest, ...labels?.interest }
  const urgency = { ...base.urgency, ...labels?.urgency }

  return {
    interest: interestOrder.map((value) => ({
      label: interest[value],
      value,
    })),
    urgency: urgencyOrder.map((value) => ({ label: urgency[value], value })),
  }
}

export const defaultRecordGroup8Catalog = createRecordGroup8Catalog()
