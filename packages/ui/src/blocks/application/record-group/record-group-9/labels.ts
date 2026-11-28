import type { RecordGroup9Labels, RecordGroup9LabelsOverride } from './types'

export const defaultRecordGroup9Labels: RecordGroup9Labels = {
  title: 'Indicators',
}

export function resolveRecordGroup9Labels(
  labels?: RecordGroup9LabelsOverride,
): RecordGroup9Labels {
  return { ...defaultRecordGroup9Labels, ...labels }
}
