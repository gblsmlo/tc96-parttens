import type {
  RecordGroup5Catalog,
  RecordGroup5CatalogLabels,
  RecordGroup5Objective,
  RecordGroup5Target,
} from './types'

export const defaultRecordGroup5CatalogLabels: RecordGroup5CatalogLabels = {
  objective: {
    'new-appointments': 'Generate new appointments',
    'practice-area': 'Promote the practice area',
    referrals: 'Strengthen referrals',
  },
  status: {
    draft: 'Draft',
    published: 'Published',
  },
  target: {
    'booked-appointment': 'Booked appointment',
    'whatsapp-conversation': 'WhatsApp conversation',
  },
}

const objectiveOrder: readonly RecordGroup5Objective[] = [
  'new-appointments',
  'practice-area',
  'referrals',
]

const targetOrder: readonly RecordGroup5Target[] = [
  'booked-appointment',
  'whatsapp-conversation',
]

export function createRecordGroup5Catalog(
  labels?: {
    readonly [TKey in keyof RecordGroup5CatalogLabels]?: Partial<
      RecordGroup5CatalogLabels[TKey]
    >
  },
): RecordGroup5Catalog {
  const base = defaultRecordGroup5CatalogLabels
  const objective = { ...base.objective, ...labels?.objective }
  const status = { ...base.status, ...labels?.status }
  const target = { ...base.target, ...labels?.target }

  return {
    objective: objectiveOrder.map((value) => ({
      label: objective[value],
      value,
    })),
    status: {
      draft: { color: 'var(--warning-foreground)', label: status.draft },
      published: {
        color: 'var(--success-foreground)',
        label: status.published,
      },
    },
    target: targetOrder.map((value) => ({ label: target[value], value })),
  }
}

export const defaultRecordGroup5Catalog = createRecordGroup5Catalog()
