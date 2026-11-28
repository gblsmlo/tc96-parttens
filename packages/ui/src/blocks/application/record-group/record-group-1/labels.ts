import type { RecordGroup1Labels, RecordGroup1LabelsOverride } from './types'

export const defaultRecordGroup1Labels: RecordGroup1Labels = {
  addLabel: 'Add items',
  checklist: 'Task list',
  title: 'Tasks',
}

export function resolveRecordGroup1Labels(
  labels?: RecordGroup1LabelsOverride,
): RecordGroup1Labels {
  return { ...defaultRecordGroup1Labels, ...labels }
}
