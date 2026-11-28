import { priorityMeta, workflowStatusMeta } from '@tc96/ui/property-meta'
import type {
  RecordPreview3Catalog,
  RecordPreview3CatalogLabels,
} from './types'

export const defaultRecordPreview3CatalogLabels: RecordPreview3CatalogLabels = {
  priority: {
    high: 'High',
    low: 'Low',
    medium: 'Medium',
    urgent: 'Urgent',
  },
  status: {
    canceled: 'Canceled',
    done: 'Done',
    'in-progress': 'In progress',
    todo: 'To do',
  },
}

const statusOrder = ['todo', 'in-progress', 'done', 'canceled'] as const

const priorityOrder = ['urgent', 'high', 'medium', 'low'] as const

export function createRecordPreview3Catalog(
  labels?: {
    readonly [TKey in keyof RecordPreview3CatalogLabels]?: Partial<
      RecordPreview3CatalogLabels[TKey]
    >
  },
): RecordPreview3Catalog {
  const base = defaultRecordPreview3CatalogLabels
  const priority = { ...base.priority, ...labels?.priority }
  const status = { ...base.status, ...labels?.status }

  return {
    priority: priorityOrder.map((value) => ({
      ...priorityMeta[value],
      label: priority[value],
      value,
    })),
    status: statusOrder.map((value) => ({
      ...workflowStatusMeta[value],
      label: status[value],
      value,
    })),
  }
}

export const defaultRecordPreview3Catalog = createRecordPreview3Catalog()
