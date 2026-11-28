import type { RecordGroup11Labels, RecordGroup11LabelsOverride } from './types'

export const defaultRecordGroup11Labels: RecordGroup11Labels = {
  create: 'New note',
  emptyPreview: 'This note has no content',
  justNow: 'now',
  title: 'Notes',
  untitled: 'Untitled note',
  viewAll: 'View all',
}

export function resolveRecordGroup11Labels(
  labels?: RecordGroup11LabelsOverride,
): RecordGroup11Labels {
  return { ...defaultRecordGroup11Labels, ...labels }
}
