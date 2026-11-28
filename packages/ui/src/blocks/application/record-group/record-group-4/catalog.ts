import type {
  RecordGroup4Catalog,
  RecordGroup4CatalogLabels,
  RecordGroup4Objective,
  RecordGroup4Target,
} from './types'

export const defaultRecordGroup4CatalogLabels: RecordGroup4CatalogLabels = {
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

const objectiveOrder: readonly RecordGroup4Objective[] = [
  'new-appointments',
  'practice-area',
  'referrals',
]

const targetOrder: readonly RecordGroup4Target[] = [
  'booked-appointment',
  'whatsapp-conversation',
]

export function createRecordGroup4Catalog(
  labels?: {
    readonly [TKey in keyof RecordGroup4CatalogLabels]?: Partial<
      RecordGroup4CatalogLabels[TKey]
    >
  },
): RecordGroup4Catalog {
  const base = defaultRecordGroup4CatalogLabels
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

export const defaultRecordGroup4Catalog = createRecordGroup4Catalog()
