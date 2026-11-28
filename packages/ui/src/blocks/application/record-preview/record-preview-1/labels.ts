import type {
  RecordPreview1Labels,
  RecordPreview1LabelsOverride,
} from './types'

export const defaultRecordPreview1Labels: RecordPreview1Labels = {
  close: 'Close',
  copyId: 'Copy ID',
  date: {},
  expand: 'Expand',
  fields: {
    assignee: 'Assignee',
    createdAt: 'Created',
    createdBy: 'Created by',
    due: 'Due date',
    id: 'ID',
    priority: 'Priority',
    schedule: 'Date',
    status: 'Status',
    tags: 'Tags',
    type: 'Type',
    updatedAt: 'Updated',
  },
  groups: {
    properties: 'Properties',
    record: 'Record',
    schedule: 'Schedule',
  },
  noAssignee: 'No assignee',
  noCreator: 'No author',
  schedule: {},
  select: {},
  tagPicker: {},
  tagsPlaceholder: 'Add a tag',
}

export function resolveRecordPreview1Labels(
  labels?: RecordPreview1LabelsOverride,
): RecordPreview1Labels {
  const base = defaultRecordPreview1Labels
  return {
    ...base,
    ...labels,
    fields: { ...base.fields, ...labels?.fields },
    groups: { ...base.groups, ...labels?.groups },
  }
}
