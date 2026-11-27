import type { RecordProperties1Labels } from './types'

export const defaultRecordProperties1Labels: RecordProperties1Labels = {
  loadingValue: (label) => `Loading ${label}`,
}

export function resolveRecordProperties1Labels(
  labels?: Partial<RecordProperties1Labels>,
): RecordProperties1Labels {
  return { ...defaultRecordProperties1Labels, ...labels }
}
