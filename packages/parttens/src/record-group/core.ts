import type { useRender } from '@base-ui/react/use-render'
import type { ReactNode } from 'react'
import type { PropertyIcon } from '../properties/shared/property-catalog'

export type RecordGroupVariant = 'card' | 'inset' | 'plain'

export type RecordGroupRowAlign = 'between' | 'start'

export type RecordGroupActionsAlign = 'between' | 'start'

export interface RecordGroupProps {
  actions?: ReactNode
  actionsAlign?: RecordGroupActionsAlign
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

export interface RecordGroupItemProps {
  children?: ReactNode
  className?: string
  leading?: ReactNode
  title: ReactNode
}

export interface RecordGroupLinkProps extends useRender.ComponentProps<'a'> {
  leading?: ReactNode
  meta?: ReactNode
}

export interface RecordGroupSubgroupProps {
  children?: ReactNode
  className?: string
  defaultOpen?: boolean
  meta?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: ReactNode
}
