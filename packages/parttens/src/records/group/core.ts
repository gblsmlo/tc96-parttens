import type { useRender } from '@base-ui/react/use-render'
import type { ReactNode } from 'react'
import type { PropertyIcon } from '../../properties/shared/property-catalog'

export type RecordGroupVariant = 'card' | 'inset' | 'plain'

export type RecordGroupRowAlign = 'between' | 'start'

export type RecordGroupActionsAlign = 'between' | 'start'

export interface RecordGroupProps {
  actions?: ReactNode
  actionsAlign?: RecordGroupActionsAlign
  chevron?: 'start' | 'end'
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

export interface RecordGroupDividerProps {
  className?: string
}

export interface RecordGroupFilterOption {
  label: ReactNode
  value: string
}

export interface RecordGroupFilterSection {
  label: ReactNode
  onChange: (value: string[]) => void
  options: readonly RecordGroupFilterOption[]
  value: readonly string[]
}

export interface RecordGroupFilterProps {
  filterLabel?: ReactNode
  filterOptions?: readonly RecordGroupFilterOption[]
  filterValue?: readonly string[]
  label: string
  onFilterChange?: (value: string[]) => void
  onSortChange?: (value: string) => void
  sections?: readonly RecordGroupFilterSection[]
  sortLabel?: ReactNode
  sortOptions?: readonly RecordGroupFilterOption[]
  sortValue?: string
}

export interface RecordGroupItemProps {
  children?: ReactNode
  className?: string
  interactive?: boolean
  leading?: ReactNode
  title: ReactNode
}

export interface RecordGroupLinkProps extends useRender.ComponentProps<'a'> {
  leading?: ReactNode
  meta?: ReactNode
}

export interface RecordStatusBadgeProps {
  children: ReactNode
  className?: string
  color?: string
}

export interface RecordGroupSubgroupProps {
  chevron?: 'start' | 'end'
  children?: ReactNode
  className?: string
  collapsible?: boolean
  count?: ReactNode
  defaultOpen?: boolean
  meta?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: ReactNode
}

export type RecordGroupMetricsColumns = 1 | 2

export interface RecordGroupMetricsProps {
  children?: ReactNode
  className?: string
  columns?: RecordGroupMetricsColumns
}

export interface RecordGroupMetricProps {
  className?: string
  icon?: ReactNode
  label: ReactNode
  progress?: number
  target?: ReactNode
  value: ReactNode
}
