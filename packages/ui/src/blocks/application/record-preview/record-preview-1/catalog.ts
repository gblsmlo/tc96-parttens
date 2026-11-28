import { priorityMeta, workflowStatusMeta } from '@tc96/ui/property-meta'
import type {
  RecordPreview1Catalog,
  RecordPreview1CatalogLabels,
} from './types'

export const defaultRecordPreview1CatalogLabels: RecordPreview1CatalogLabels = {
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

export function createRecordPreview1Catalog(
  labels?: {
    readonly [TKey in keyof RecordPreview1CatalogLabels]?: Partial<
      RecordPreview1CatalogLabels[TKey]
    >
  },
): RecordPreview1Catalog {
  const base = defaultRecordPreview1CatalogLabels
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

export const defaultRecordPreview1Catalog = createRecordPreview1Catalog()
