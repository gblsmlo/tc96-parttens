import type {
  RecordGroup6Catalog,
  RecordGroup6CatalogLabels,
  RecordGroup6StatusTone,
} from './types'

export const defaultRecordGroup6CatalogLabels: RecordGroup6CatalogLabels = {
  status: {
    overdue: 'Overdue',
    paid: 'Paid',
    scheduled: 'Scheduled',
  },
}

const statusTones = {
  overdue: 'danger',
  paid: 'success',
  scheduled: 'warning',
} as const satisfies Record<
  keyof RecordGroup6CatalogLabels['status'],
  RecordGroup6StatusTone
>

export function createRecordGroup6Catalog(labels?: {
  readonly status?: Partial<RecordGroup6CatalogLabels['status']>
}): RecordGroup6Catalog {
  const status = {
    ...defaultRecordGroup6CatalogLabels.status,
    ...labels?.status,
  }

  return {
    status: {
      overdue: { label: status.overdue, tone: statusTones.overdue },
      paid: { label: status.paid, tone: statusTones.paid },
      scheduled: { label: status.scheduled, tone: statusTones.scheduled },
    },
  }
}

export const defaultRecordGroup6Catalog = createRecordGroup6Catalog()
