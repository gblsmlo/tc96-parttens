import type {
  RecordPreview3Labels,
  RecordPreview3LabelsOverride,
} from './types'

export const defaultRecordPreview3Labels: RecordPreview3Labels = {
  close: 'Close',
  copyId: 'Copy ID',
  date: {},
  expand: 'Expand',
  fields: {
    assignees: 'Assignees',
    creator: 'Created by',
    due: 'Due',
    id: 'ID',
    kind: 'Project',
    priority: 'Priority',
    status: 'Status',
    tags: 'Tags',
    updated: 'Updated',
  },
  groups: {
    properties: 'Properties',
    record: 'Record',
  },
  noCreator: 'No author',
  noKind: 'No project',
  noPriority: 'No priority',
  peoplePicker: {},
  select: {},
  tagPicker: {},
  tagsPlaceholder: 'Add a tag',
  unassigned: 'Unassigned',
}

export function resolveRecordPreview3Labels(
  labels?: RecordPreview3LabelsOverride,
): RecordPreview3Labels {
  const base = defaultRecordPreview3Labels
  return {
    ...base,
    ...labels,
    fields: { ...base.fields, ...labels?.fields },
    groups: { ...base.groups, ...labels?.groups },
  }
}
