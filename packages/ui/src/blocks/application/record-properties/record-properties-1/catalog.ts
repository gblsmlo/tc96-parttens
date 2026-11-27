import { propertyDisplayIcons } from '@tc96/ui/patterns/properties/core'
import type {
  RecordProperties1Catalog,
  RecordProperties1CatalogLabels,
  RecordProperties1DefaultKey,
} from './types'

export const defaultRecordProperties1CatalogLabels: RecordProperties1CatalogLabels =
  {
    createdAt: 'Created',
    dueDate: 'Due date',
    owner: 'Owner',
    priority: 'Priority',
    status: 'Status',
    tags: 'Tags',
    type: 'Type',
  }

export function createRecordProperties1Catalog(
  labels?: Partial<RecordProperties1CatalogLabels>,
): RecordProperties1Catalog<RecordProperties1DefaultKey> {
  const resolved = { ...defaultRecordProperties1CatalogLabels, ...labels }
  return {
    createdAt: {
      icon: propertyDisplayIcons.schedule,
      label: resolved.createdAt,
    },
    dueDate: { icon: propertyDisplayIcons.date, label: resolved.dueDate },
    owner: { icon: propertyDisplayIcons.person, label: resolved.owner },
    priority: { icon: propertyDisplayIcons.priority, label: resolved.priority },
    status: { icon: propertyDisplayIcons.status, label: resolved.status },
    tags: { icon: propertyDisplayIcons.tags, label: resolved.tags },
    type: { icon: propertyDisplayIcons.type, label: resolved.type },
  }
}

export const defaultRecordProperties1Catalog = createRecordProperties1Catalog()
