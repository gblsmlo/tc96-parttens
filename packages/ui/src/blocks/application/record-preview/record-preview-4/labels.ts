import type {
  RecordPreview4Labels,
  RecordPreview4LabelsOverride,
} from './types'

export const defaultRecordPreview4Labels: RecordPreview4Labels = {
  caseNumberPlaceholder: '0000000-00.0000.0.00.0000',
  close: 'Close details',
  copyId: 'Copy ID',
  copyNumber: 'Copy number',
  expand: 'Open full screen',
  fields: {
    actionClass: 'Action',
    caseNumber: 'Number',
    claimAmount: 'Claim amount',
    contract: 'Contract',
    court: 'Court',
    createdAt: 'Created',
    defendant: 'Defendant',
    division: 'Division',
    id: 'ID',
    instance: 'Instance',
    justice: 'Justice',
    phase: 'Phase',
    plaintiff: 'Plaintiff',
    responsible: 'Owner',
    smallClaims: 'Small claims',
    subject: 'Subject',
    tags: 'Tags',
    updatedAt: 'Updated',
    venue: 'Venue',
  },
  groups: {
    lawsuit: 'Lawsuit details',
    properties: 'Properties',
    record: 'Record',
  },
  noAction: 'No action',
  noAmount: 'No amount',
  noContract: 'No contract',
  noCourt: 'No court',
  noDivision: 'No division',
  noInstance: 'No instance',
  noJustice: 'No justice',
  noNumber: 'No number',
  noPhase: 'No phase',
  noResponsible: 'No owner',
  noSubject: 'No subject',
  noVenue: 'No venue',
  notInformed: 'Not informed',
  select: {},
  tagPicker: {},
  tagsPlaceholder: 'Add a tag',
  text: {},
}

export function resolveRecordPreview4Labels(
  labels?: RecordPreview4LabelsOverride,
): RecordPreview4Labels {
  const base = defaultRecordPreview4Labels
  return {
    ...base,
    ...labels,
    fields: { ...base.fields, ...labels?.fields },
    groups: { ...base.groups, ...labels?.groups },
  }
}
