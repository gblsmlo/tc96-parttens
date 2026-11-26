import type { FormEvent, ReactNode } from 'react'

export type RecordDialogSettlement = boolean | Promise<boolean>

export type RecordDialogSize = 'small' | 'default' | 'large'

export type RecordDialogBodyWidth = 'fill' | 'readable'

export interface RecordDialogProps {
  actions?: ReactNode
  bodyWidth?: RecordDialogBodyWidth
  cancelLabel?: string
  children?: ReactNode
  className?: string
  description?: ReactNode
  errorMessage?: ReactNode
  footerStart?: ReactNode
  keepOpenOnSuccess?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => RecordDialogSettlement
  open: boolean
  properties?: ReactNode
  size?: RecordDialogSize
  step?: string
  stretchBody?: boolean
  submitDisabled?: boolean
  submitHint?: ReactNode
  submitOnModEnter?: boolean
  submitLabel: string
  submittingLabel?: string
  title: ReactNode
  titleAncestor?: string
}

export interface RecordDialogHeadlineProps {
  description?: string
  descriptionLabel?: string
  descriptionName?: string
  descriptionPlaceholder?: string
  descriptionSize?: 'content' | 'stretch'
  onDescriptionChange?: (description: string) => void
  onTitleChange: (title: string) => void
  title: string
  titleLabel: string
  titleName?: string
  titlePlaceholder?: string
}

export interface RecordDialogCreateMoreProps {
  checked: boolean
  disabled?: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}
