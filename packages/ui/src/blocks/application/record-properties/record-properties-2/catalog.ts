import type {
  RecordProperties2Catalog,
  RecordProperties2CatalogLabels,
  RecordProperties2DefaultKey,
} from './types'

export const defaultRecordProperties2CatalogLabels: RecordProperties2CatalogLabels =
  {
    createdAt: 'Created',
    dueDate: 'Due date',
    owner: 'Owner',
    priority: 'Priority',
    status: 'Status',
    tags: 'Tags',
    type: 'Type',
  }

export function createRecordProperties2Catalog(
  labels?: Partial<RecordProperties2CatalogLabels>,
): RecordProperties2Catalog<RecordProperties2DefaultKey> {
  const resolved = { ...defaultRecordProperties2CatalogLabels, ...labels }
  return {
    createdAt: { label: resolved.createdAt },
    dueDate: { label: resolved.dueDate },
    owner: { label: resolved.owner },
    priority: { label: resolved.priority },
    status: { label: resolved.status },
    tags: { label: resolved.tags },
    type: { label: resolved.type },
  }
}

export const defaultRecordProperties2Catalog = createRecordProperties2Catalog()
