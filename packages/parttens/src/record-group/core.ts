import type { ReactNode } from 'react'
import type { PropertyIcon } from '../properties/shared/property-catalog'

export type RecordGroupVariant = 'card' | 'plain'

export type RecordGroupRowAlign = 'between' | 'start'

export interface RecordGroupProps {
  actions?: ReactNode
  children?: ReactNode
  className?: string
  defaultOpen?: boolean
  empty?: boolean
  footer?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: ReactNode
  variant?: RecordGroupVariant
}

export interface RecordGroupRowProps {
  align?: RecordGroupRowAlign
  children?: ReactNode
  className?: string
  label: ReactNode
  leading?: ReactNode
}

export interface RecordGroupActionProps {
  disabled?: boolean
  icon: PropertyIcon
  label: string
  onClick?: () => void
}
