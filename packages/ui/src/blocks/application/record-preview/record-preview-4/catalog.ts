import type {
  RecordPreview4Catalog,
  RecordPreview4CatalogLabels,
} from './types'

export const defaultRecordPreview4CatalogLabels: RecordPreview4CatalogLabels = {
  instance: {
    'first-degree': 'First degree',
    other: 'Other',
    'second-degree': 'Second degree',
    superior: 'Superior court',
    supreme: 'Supreme court',
  },
  justice: {
    federal: 'Federal',
    labor: 'Labor',
    state: 'State',
  },
  phase: {
    appeal: 'Appeal',
    archiving: 'Archiving',
    'awaiting-judgment': 'Awaiting judgment',
    'conciliation-hearing': 'Conciliation hearing',
    'funds-release': 'Release of funds',
    'initial-order': 'Initial order',
    'interlocutory-appeal': 'Interlocutory appeal',
    'judgment-enforcement': 'Judgment enforcement',
    'sanitation-order': 'Case management order',
    'small-claims-appeal': 'Small claims appeal',
    summons: 'Summons',
    'trial-hearing': 'Trial hearing',
  },
  smallClaims: {
    no: 'No',
    yes: 'Yes',
  },
}

const instanceOrder = [
  'first-degree',
  'second-degree',
  'superior',
  'supreme',
  'other',
] as const

const justiceOrder = ['state', 'labor', 'federal'] as const

const phaseOrder = [
  'initial-order',
  'summons',
  'conciliation-hearing',
  'trial-hearing',
  'sanitation-order',
  'awaiting-judgment',
  'judgment-enforcement',
  'funds-release',
  'archiving',
  'interlocutory-appeal',
  'appeal',
  'small-claims-appeal',
] as const

const smallClaimsOrder = ['yes', 'no'] as const

export function createRecordPreview4Catalog(
  labels?: {
    readonly [TKey in keyof RecordPreview4CatalogLabels]?: Partial<
      RecordPreview4CatalogLabels[TKey]
    >
  },
): RecordPreview4Catalog {
  const base = defaultRecordPreview4CatalogLabels
  const instance = { ...base.instance, ...labels?.instance }
  const justice = { ...base.justice, ...labels?.justice }
  const phase = { ...base.phase, ...labels?.phase }
  const smallClaims = { ...base.smallClaims, ...labels?.smallClaims }

  return {
    instance: instanceOrder.map((value) => ({ label: instance[value], value })),
    justice: justiceOrder.map((value) => ({ label: justice[value], value })),
    phase: phaseOrder.map((value) => ({ label: phase[value], value })),
    smallClaims: smallClaimsOrder.map((value) => ({
      label: smallClaims[value],
      value,
    })),
  }
}

export const defaultRecordPreview4Catalog = createRecordPreview4Catalog()
