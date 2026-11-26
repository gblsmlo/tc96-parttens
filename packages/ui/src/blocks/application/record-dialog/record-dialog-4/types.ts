import type {
  EmailPropertyLabels,
  PhonePropertyLabels,
  PropertyOption,
  TagsPropertyLabels,
  TextPropertyLabels,
} from '@tc96/ui/patterns/properties/core'

export type RecordDialog4Stage = 'none' | 'qualified' | 'customer' | 'inactive'

export type RecordDialog4DocumentType = 'cpf' | 'cnpj'

export type RecordDialog4Tag =
  | 'decision-maker'
  | 'referral'
  | 'event'
  | 'newsletter'
  | 'vip'

export type RecordDialog4OptionalProperty =
  | 'stage'
  | 'tags'
  | 'company'
  | 'role'

export interface RecordDialog4Values {
  company: string
  description: string
  document?: string
  documentType?: RecordDialog4DocumentType
  emails: string[]
  name: string
  phones: string[]
  role: string
  stage: RecordDialog4Stage
  tags: RecordDialog4Tag[]
}

export interface RecordDialog4CreatableLabels {
  create: (draft: string) => string
  createEmpty: string
  empty: string
  list: string
  search: string
  searchPlaceholder: string
}

export interface RecordDialog4Labels {
  cancel: string
  company: string
  companyLabels: RecordDialog4CreatableLabels
  createMore: string
  description: string
  descriptionPlaceholder: string
  document: string
  documentTypeCnpj: string
  documentTypeCpf: string
  documentTypeLabel: string
  email: string
  emailLabels: EmailPropertyLabels
  emailPlaceholder: string
  morePropertiesLabel: string
  name: string
  namePlaceholder: string
  phone: string
  phoneLabels: PhonePropertyLabels
  phonePlaceholder: string
  role: string
  roleLabels: RecordDialog4CreatableLabels
  saveFailed: string
  stage: string
  stageCustomer: string
  stageInactive: string
  stageNone: string
  stageQualified: string
  submit: string
  submitting: string
  tagPlaceholder: string
  tags: string
  tagsLabels: TagsPropertyLabels
  text: Partial<TextPropertyLabels>
  titleAncestor: string
  titleText: string
}

export interface RecordDialog4Props {
  className?: string
  companies: readonly string[]
  documentTypeOptions?: readonly PropertyOption[]
  labels?: Partial<RecordDialog4Labels>
  onCreate: (values: RecordDialog4Values) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  roles: readonly string[]
  stageOptions?: readonly PropertyOption[]
  tagOptions?: readonly PropertyOption<RecordDialog4Tag>[]
}
