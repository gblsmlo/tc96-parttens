import type { RecordGroup3Labels, RecordGroup3LabelsOverride } from './types'

export const defaultRecordGroup3Labels: RecordGroup3Labels = {
  copyCpf: 'Copy tax ID',
  date: {},
  fields: {
    birthDate: 'Birth date',
    cpf: 'Tax ID',
    occupation: 'Occupation',
    source: 'Source',
  },
  noOccupation: 'No occupation',
  select: {},
  text: {},
  title: 'More information',
}

export function resolveRecordGroup3Labels(
  labels?: RecordGroup3LabelsOverride,
): RecordGroup3Labels {
  const base = defaultRecordGroup3Labels
  return {
    ...base,
    ...labels,
    fields: { ...base.fields, ...labels?.fields },
  }
}
