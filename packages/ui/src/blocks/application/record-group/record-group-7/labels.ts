import type { RecordGroup7Labels, RecordGroup7LabelsOverride } from './types'

export const defaultRecordGroup7Labels: RecordGroup7Labels = {
  date: {},
  fields: {
    dueAt: 'Due',
    issuedAt: 'Issued',
    method: 'Method',
  },
  issue: 'Issue charge',
  issuedOn: (date) => `Issued on ${date}`,
  noMethod: 'No method',
  notIssued: 'Not issued',
  reissue: 'Issue second copy',
  select: {},
  title: 'Billing',
}

export function resolveRecordGroup7Labels(
  labels?: RecordGroup7LabelsOverride,
): RecordGroup7Labels {
  const base = defaultRecordGroup7Labels
  return {
    ...base,
    ...labels,
    fields: { ...base.fields, ...labels?.fields },
  }
}
