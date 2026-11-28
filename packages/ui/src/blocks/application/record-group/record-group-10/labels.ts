import type { RecordGroup10Labels, RecordGroup10LabelsOverride } from './types'

export const defaultRecordGroup10Labels: RecordGroup10Labels = {
  title: 'Activity',
  viewAll: 'View all',
}

export function resolveRecordGroup10Labels(
  labels?: RecordGroup10LabelsOverride,
): RecordGroup10Labels {
  return { ...defaultRecordGroup10Labels, ...labels }
}
