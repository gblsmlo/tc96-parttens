import { priorityMeta, workflowStatusMeta } from '@tc96/ui/property-meta'
import type {
  RecordPreview2Catalog,
  RecordPreview2CatalogLabels,
} from './types'

export const defaultRecordPreview2CatalogLabels: RecordPreview2CatalogLabels = {
  priority: {
    high: 'High',
    low: 'Low',
    medium: 'Medium',
    urgent: 'Urgent',
  },
  status: {
    backlog: 'Backlog',
    done: 'Done',
    'in-progress': 'In progress',
    'in-review': 'In review',
    todo: 'To do',
  },
  tags: {
    civil: 'Civil',
    deadline: 'Deadline',
    labor: 'Labor',
    urgent: 'Urgent',
  },
  type: {
    filing: 'Filing',
    hearing: 'Hearing',
    petition: 'Petition',
    review: 'Review',
  },
}

const statusOrder = [
  'backlog',
  'todo',
  'in-progress',
  'in-review',
  'done',
] as const

const priorityOrder = ['urgent', 'high', 'medium', 'low'] as const

const typeOrder = ['filing', 'hearing', 'petition', 'review'] as const

const tagOrder = ['deadline', 'urgent', 'civil', 'labor'] as const

export function createRecordPreview2Catalog(
  labels?: {
    readonly [TKey in keyof RecordPreview2CatalogLabels]?: Partial<
      RecordPreview2CatalogLabels[TKey]
    >
  },
): RecordPreview2Catalog {
  const base = defaultRecordPreview2CatalogLabels
  const priority = { ...base.priority, ...labels?.priority }
  const status = { ...base.status, ...labels?.status }
  const tags = { ...base.tags, ...labels?.tags }
  const type = { ...base.type, ...labels?.type }

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
    tags: tagOrder.map((value) => ({ label: tags[value], value })),
    type: typeOrder.map((value) => ({ label: type[value], value })),
  }
}

export const defaultRecordPreview2Catalog = createRecordPreview2Catalog()
