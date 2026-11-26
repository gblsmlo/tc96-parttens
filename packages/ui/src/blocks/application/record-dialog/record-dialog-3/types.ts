import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export type RecordDialog3Stage = 'new' | 'contacted' | 'qualified'

export type RecordDialog3Source =
  | 'referral'
  | 'website'
  | 'ads'
  | 'event'
  | 'outbound'

export type RecordDialog3NextAction =
  | 'call'
  | 'email'
  | 'meeting'
  | 'proposal'
  | 'follow-up'

export type RecordDialog3Person = PersonPropertyOption

export interface RecordDialog3Values {
  description: string
  nextAction: RecordDialog3NextAction | null
  ownerId: string | null
  source: RecordDialog3Source | null
  stage: RecordDialog3Stage
  title: string
}

export interface RecordDialog3Labels {
  addNextAction: string
  addSource: string
  cancel: string
  createMore: string
  description: string
  descriptionPlaceholder: string
  nextAction: string
  nextActionCall: string
  nextActionEmail: string
  nextActionFollowUp: string
  nextActionMeeting: string
  nextActionProposal: string
  noOwner: string
  owner: string
  saveFailed: string
  source: string
  sourceAds: string
  sourceEvent: string
  sourceOutbound: string
  sourceReferral: string
  sourceWebsite: string
  stage: string
  stageContacted: string
  stageNew: string
  stageQualified: string
  submit: string
  submitting: string
  title: string
  titleAncestor: string
  titlePlaceholder: string
  titleText: string
}

export interface RecordDialog3Props {
  className?: string
  labels?: Partial<RecordDialog3Labels>
  nextActionOptions?: readonly PropertyOption[]
  onCreate: (values: RecordDialog3Values) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  people: readonly RecordDialog3Person[]
  sourceOptions?: readonly PropertyOption[]
  stageOptions?: readonly PropertyOption[]
}
