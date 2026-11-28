import type { RecordGroup5Labels, RecordGroup5LabelsOverride } from './types'

export const defaultRecordGroup5Labels: RecordGroup5Labels = {
  close: 'Close',
  draftSaved: (savedAt) => `Draft saved on ${savedAt}`,
  empty: {
    expectedTarget: 'No expected target',
    primaryObjective: 'No objective 1',
    secondaryObjective: 'No objective 2',
  },
  fieldOfVersion: (field, number) => `${field} of version ${number}`,
  fields: {
    expectedTarget: 'Expected target',
    primaryObjective: 'Objective 1',
    secondaryObjective: 'Objective 2',
  },
  publishedOn: (savedAt) => `Published on ${savedAt}`,
  select: {},
  title: 'Versions',
  version: (number) => `Version ${number}`,
}

export function resolveRecordGroup5Labels(
  labels?: RecordGroup5LabelsOverride,
): RecordGroup5Labels {
  const base = defaultRecordGroup5Labels
  return {
    ...base,
    ...labels,
    empty: { ...base.empty, ...labels?.empty },
    fields: { ...base.fields, ...labels?.fields },
  }
}
