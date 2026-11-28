import { propertyDisplayIcons } from '@tc96/ui/patterns/properties/core'
import type {
  RecordProperties3Catalog,
  RecordProperties3CatalogLabels,
  RecordProperties3DefaultKey,
} from './types'

export const defaultRecordProperties3CatalogLabels: RecordProperties3CatalogLabels =
  {
    createdAt: 'Created',
    dueDate: 'Due date',
    owner: 'Owner',
    priority: 'Priority',
    status: 'Status',
    tags: 'Tags',
    type: 'Type',
  }

export function createRecordProperties3Catalog(
  labels?: Partial<RecordProperties3CatalogLabels>,
): RecordProperties3Catalog<RecordProperties3DefaultKey> {
  const resolved = { ...defaultRecordProperties3CatalogLabels, ...labels }
  return {
    createdAt: { label: resolved.createdAt },
    dueDate: { label: resolved.dueDate },
    owner: { label: resolved.owner },
    priority: { label: resolved.priority },
    status: { label: resolved.status },
    tags: { icon: propertyDisplayIcons.tags, label: resolved.tags },
    type: { icon: propertyDisplayIcons.type, label: resolved.type },
  }
}

export const defaultRecordProperties3Catalog = createRecordProperties3Catalog()
