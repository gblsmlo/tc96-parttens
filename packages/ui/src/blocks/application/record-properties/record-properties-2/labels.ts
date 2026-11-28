import type { RecordProperties2Labels } from './types'

export const defaultRecordProperties2Labels: RecordProperties2Labels = {
  loadingValue: (label) => `Loading ${label}`,
}

export function resolveRecordProperties2Labels(
  labels?: Partial<RecordProperties2Labels>,
): RecordProperties2Labels {
  return { ...defaultRecordProperties2Labels, ...labels }
}
