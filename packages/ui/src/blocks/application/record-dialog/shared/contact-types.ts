import type {
  EmailPropertyLabels,
  PhonePropertyLabels,
  TagsPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { ContactDocumentKind } from './contact-document'
import type { CreatablePropertyLabels } from './creatable-property'

export type ContactDialogStage = 'none' | 'qualified' | 'customer' | 'inactive'

export type ContactDialogTag =
  | 'decision-maker'
  | 'referral'
  | 'event'
  | 'newsletter'
  | 'vip'

export interface ContactDialogDocument {
  kind: ContactDocumentKind
  value: string
}

export interface ContactDialogValues {
  company: string
  description: string
  documents: readonly ContactDialogDocument[]
  emails: readonly string[]
  name: string
  phones: readonly string[]
  role: string
  stage: ContactDialogStage
  tags: readonly ContactDialogTag[]
}

export type ContactDialogLayout = 'inline' | 'rows'

export interface ContactDialogLabels {
  cancel: string
  company: CreatablePropertyLabels
  createMore: string
  description: string
  descriptionPlaceholder: string
  document: string
  documentPlaceholder: string
  email: EmailPropertyLabels
  more: string
  name: string
  namePlaceholder: string
  phone: PhonePropertyLabels
  role: CreatablePropertyLabels
  saveFailed: string
  stage: string
  submit: string
  submitting: string
  tags: TagsPropertyLabels
  tagsPlaceholder: string
  title: string
  titleAncestor: string
}

export interface ContactDialogProps {
  className?: string
  companies: readonly string[]
  documents?: readonly string[]
  labels?: Partial<ContactDialogLabels>
  layout: ContactDialogLayout
  onCreate: (values: ContactDialogValues) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  roles: readonly string[]
}
