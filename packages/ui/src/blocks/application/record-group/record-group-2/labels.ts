import type { RecordGroup2Labels, RecordGroup2LabelsOverride } from './types'

export const defaultRecordGroup2Labels: RecordGroup2Labels = {
  title: 'Actions',
}

export function resolveRecordGroup2Labels(
  labels?: RecordGroup2LabelsOverride,
): RecordGroup2Labels {
  return { ...defaultRecordGroup2Labels, ...labels }
}
