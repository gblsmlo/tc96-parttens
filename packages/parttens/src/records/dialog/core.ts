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
