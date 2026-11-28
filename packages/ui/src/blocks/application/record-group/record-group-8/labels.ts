import type { RecordGroup8Labels, RecordGroup8LabelsOverride } from './types'

export const defaultRecordGroup8Labels: RecordGroup8Labels = {
  fields: {
    interest: 'Interest',
    urgency: 'Urgency',
  },
  noInterest: 'No interest',
  noUrgency: 'No urgency',
  select: {},
  title: 'Stage',
}

export function resolveRecordGroup8Labels(
  labels?: RecordGroup8LabelsOverride,
): RecordGroup8Labels {
  const base = defaultRecordGroup8Labels
  return {
    ...base,
    ...labels,
    fields: { ...base.fields, ...labels?.fields },
  }
}
