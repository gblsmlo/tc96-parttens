import type { FormEvent, ReactNode } from 'react'

export type RecordDialogSettlement = boolean | Promise<boolean>

export type RecordDialogSize = 'small' | 'default' | 'large'

export interface RecordDialogProps {
  actions?: ReactNode
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
  size?: RecordDialogSize
  stretchBody?: boolean
  submitDisabled?: boolean
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
  onDescriptionChange?: (description: string) => void
  onTitleChange: (title: string) => void
  stretch?: boolean
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

export type RecordConfirmDialogTone = 'default' | 'destructive'

export interface RecordConfirmDialogProps {
  cancelLabel: string
  children?: ReactNode
  className?: string
  confirmDisabled?: boolean
  confirmLabel: string
  confirmingLabel?: string
  description?: ReactNode
  errorMessage?: ReactNode
  onConfirm: () => RecordDialogSettlement
  onOpenChange: (open: boolean) => void
  open: boolean
  title: ReactNode
  tone?: RecordConfirmDialogTone
}
