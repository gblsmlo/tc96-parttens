import type { ReactNode } from 'react'
import type { RecordsRenderLink, RecordsStatusRow } from '../shared/types'

export type LookupCreate1Step = 'origin' | 'details'

export type LookupIdentifierState =
  | 'incomplete'
  | 'checking'
  | 'available'
  | 'taken'

export interface LookupAlternative {
  description: string
  id: string
  title: string
}

export interface LookupExisting {
  description: ReactNode
  href: string
}

export interface LookupCreate1Labels {
  alternatives: string
  ancestor: string
  back: string
  cancel: string
  checking: string
  continue: string
  createWhileSearching: string
  identifier: string
  identifierDescription: string
  identifierPlaceholder: string
  incomplete: string
  openExisting: string
  retry: string
  sources: string
  sourcesFailed: string
  submit: string
  submitting: string
  taken: string
  title: string
  titleField: string
  titleRequired: string
}

export interface LookupCreate1Props {
  alternatives?: readonly LookupAlternative[]
  children?: ReactNode
  existing?: LookupExisting
  identifier: string
  identifierState: LookupIdentifierState
  labels?: Partial<LookupCreate1Labels>
  onAlternative?: (id: string) => void
  onIdentifierChange: (identifier: string) => void
  onOpenChange: (open: boolean) => void
  onRetry?: () => void
  onStepChange: (step: LookupCreate1Step) => void
  onSubmit: () => boolean | Promise<boolean>
  onTitleChange: (title: string) => void
  open: boolean
  pending?: boolean
  recordTitle: string
  renderLink?: RecordsRenderLink
  sources: readonly RecordsStatusRow[]
  step: LookupCreate1Step
}
