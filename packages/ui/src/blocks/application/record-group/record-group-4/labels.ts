import type { RecordGroup4Labels, RecordGroup4LabelsOverride } from './types'

export const defaultRecordGroup4Labels: RecordGroup4Labels = {
  close: 'Close',
  draftSaved: (savedAt) => `Draft saved on ${savedAt}`,
  empty: {
    expectedTarget: 'No expected target',
    primaryObjective: 'No objective 1',
    secondaryObjective: 'No objective 2',
  },
  fields: {
    expectedTarget: 'Expected target',
    primaryObjective: 'Objective 1',
    secondaryObjective: 'Objective 2',
  },
  publish: 'Publish version',
  published: (number, savedAt) => `Version ${number} published on ${savedAt}`,
  saveDraft: 'Save draft',
  select: {},
  title: 'Brief',
  unsaved: 'Unsaved changes',
}

export function resolveRecordGroup4Labels(
  labels?: RecordGroup4LabelsOverride,
): RecordGroup4Labels {
  const base = defaultRecordGroup4Labels
  return {
    ...base,
    ...labels,
    empty: { ...base.empty, ...labels?.empty },
    fields: { ...base.fields, ...labels?.fields },
  }
}
