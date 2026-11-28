import type { RecordGroup6Labels, RecordGroup6LabelsOverride } from './types'

export const defaultRecordGroup6Labels: RecordGroup6Labels = {
  empty: 'Nothing linked yet',
  title: 'Linked records',
}

export function resolveRecordGroup6Labels(
  labels?: RecordGroup6LabelsOverride,
): RecordGroup6Labels {
  return { ...defaultRecordGroup6Labels, ...labels }
}
