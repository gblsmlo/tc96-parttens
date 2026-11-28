import type { RecordProperties3Labels } from './types'

export const defaultRecordProperties3Labels: RecordProperties3Labels = {
  loadingValue: (label) => `Loading ${label}`,
}

export function resolveRecordProperties3Labels(
  labels?: Partial<RecordProperties3Labels>,
): RecordProperties3Labels {
  return { ...defaultRecordProperties3Labels, ...labels }
}
