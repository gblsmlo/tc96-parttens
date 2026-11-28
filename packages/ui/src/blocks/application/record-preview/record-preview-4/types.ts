import type {
  PropertyOption,
  SelectPropertyLabels,
  TagsPropertyLabels,
  TextPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export type RecordPreview4Person = PersonPropertyOption

export type RecordPreview4Justice = 'federal' | 'labor' | 'state'

export type RecordPreview4Instance =
  | 'first-degree'
  | 'other'
  | 'second-degree'
  | 'superior'
  | 'supreme'

export type RecordPreview4Phase =
  | 'appeal'
  | 'archiving'
  | 'awaiting-judgment'
  | 'conciliation-hearing'
  | 'funds-release'
  | 'initial-order'
  | 'interlocutory-appeal'
  | 'judgment-enforcement'
  | 'sanitation-order'
  | 'small-claims-appeal'
  | 'summons'
  | 'trial-hearing'

export type RecordPreview4CatalogKey =
  | 'instance'
  | 'justice'
  | 'phase'
  | 'smallClaims'

export type RecordPreview4Catalog = Readonly<
  Record<RecordPreview4CatalogKey, readonly PropertyOption[]>
>

export interface RecordPreview4CatalogLabels {
  instance: Record<RecordPreview4Instance, string>
  justice: Record<RecordPreview4Justice, string>
  phase: Record<RecordPreview4Phase, string>
  smallClaims: Record<'no' | 'yes', string>
}

export interface RecordPreview4Record {
  actionClass: string | null
  caseNumber: string | null
  claimAmountCents: number | null
  contractId: string | null
  courtDivision: string | null
  courtSlug: string | null
  courtVenue: string | null
  createdAt: string
  defendants: readonly string[]
  description?: string | null
  id: string
  instance: string | null
  justice: string | null
  phaseId: string | null
  plaintiffs: readonly string[]
  responsibleId: string | null
  smallClaims: boolean
  subject: string | null
  tagIds: readonly string[]
  title: string
  updatedAt: string
}

export type RecordPreview4Changes = Partial<
  Pick<
    RecordPreview4Record,
    | 'actionClass'
    | 'caseNumber'
    | 'contractId'
    | 'courtDivision'
    | 'courtSlug'
    | 'courtVenue'
    | 'instance'
    | 'justice'
    | 'phaseId'
    | 'responsibleId'
    | 'smallClaims'
    | 'subject'
    | 'tagIds'
  >
>

export type RecordPreview4Field =
  | 'actionClass'
  | 'caseNumber'
  | 'claimAmount'
  | 'contract'
  | 'court'
  | 'createdAt'
  | 'defendant'
  | 'division'
  | 'id'
  | 'instance'
  | 'justice'
  | 'phase'
  | 'plaintiff'
  | 'responsible'
  | 'smallClaims'
  | 'subject'
  | 'tags'
  | 'updatedAt'
  | 'venue'

export type RecordPreview4Group = 'lawsuit' | 'properties' | 'record'

export interface RecordPreview4Labels {
  caseNumberPlaceholder: string
  close: string
  copyId: string
  copyNumber: string
  expand: string
  fields: Record<RecordPreview4Field, string>
  groups: Record<RecordPreview4Group, string>
  noAction: string
  noAmount: string
  noContract: string
  noCourt: string
  noDivision: string
  noInstance: string
  noJustice: string
  noNumber: string
  noPhase: string
  noResponsible: string
  noSubject: string
  noVenue: string
  notInformed: string
  select: Partial<SelectPropertyLabels>
  tagPicker: Partial<TagsPropertyLabels>
  tagsPlaceholder: string
  text: Partial<TextPropertyLabels>
}

export type RecordPreview4LabelsOverride = Partial<
  Omit<RecordPreview4Labels, 'fields' | 'groups'>
> & {
  fields?: Partial<RecordPreview4Labels['fields']>
  groups?: Partial<RecordPreview4Labels['groups']>
}

export interface RecordPreview4Props {
  catalog?: RecordPreview4Catalog
  className?: string
  contracts: readonly PropertyOption[]
  courts: readonly PropertyOption[]
  currency?: string
  finalFocus?: () => HTMLElement | null
  labels?: RecordPreview4LabelsOverride
  locale?: string
  onExpand?: () => void
  onOpenChange: (open: boolean) => void
  onRecordChange: (changes: RecordPreview4Changes) => void
  open: boolean
  people: readonly RecordPreview4Person[]
  record: RecordPreview4Record
  tags: readonly PropertyOption[]
  timeZone?: string
}
