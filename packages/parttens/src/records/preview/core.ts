import type { ReactNode } from 'react'

export interface RecordPreviewProps {
  actions?: ReactNode
  children?: ReactNode
  className?: string
  closeLabel: string
  description?: ReactNode
  finalFocus?: () => HTMLElement | null
  footer?: ReactNode
  onOpenChange: (open: boolean) => void
  open: boolean
  title: ReactNode
}

export interface RecordPreviewActionProps {
  children: ReactNode
  disabled?: boolean
  label: string
  onClick?: () => void
}
