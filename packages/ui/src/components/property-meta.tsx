import {
  CellSignalHighIcon,
  CellSignalLowIcon,
  CellSignalMediumIcon,
  ChartPieSliceIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  CircleIcon,
  type IconWeight,
  MinusIcon,
  type Icon as PhosphorIcon,
  ProhibitIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import {
  type PropertyTone,
  propertyToneClassName,
} from '@tc96/ui/lib/property-tone'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'

export { type PropertyTone, propertyToneClassName }

export interface PropertyMeta {
  icon: PhosphorIcon
  tone: PropertyTone
  weight?: IconWeight
}

export type WorkflowStatus =
  | 'backlog'
  | 'blocked'
  | 'canceled'
  | 'done'
  | 'in-progress'
  | 'in-review'
  | 'todo'

export const workflowStatusMeta = {
  backlog: { icon: CircleDashedIcon, tone: 'neutral' },
  blocked: { icon: ProhibitIcon, tone: 'danger' },
  canceled: { icon: XCircleIcon, tone: 'neutral' },
  done: { icon: CheckCircleIcon, tone: 'complete', weight: 'fill' },
  'in-progress': { icon: CircleHalfIcon, tone: 'warning' },
  'in-review': { icon: ChartPieSliceIcon, tone: 'info' },
  todo: { icon: CircleIcon, tone: 'neutral' },
} as const satisfies Record<WorkflowStatus, PropertyMeta>

export type PriorityLevel = 'high' | 'low' | 'medium' | 'none' | 'urgent'

export const priorityMeta = {
  high: { icon: CellSignalHighIcon, tone: 'neutral', weight: 'fill' },
  low: { icon: CellSignalLowIcon, tone: 'neutral', weight: 'fill' },
  medium: { icon: CellSignalMediumIcon, tone: 'neutral', weight: 'fill' },
  none: { icon: MinusIcon, tone: 'neutral' },
  urgent: { icon: WarningCircleIcon, tone: 'danger', weight: 'fill' },
} as const satisfies Record<PriorityLevel, PropertyMeta>

export interface PropertyMetaIconProps {
  className?: string
  meta: PropertyMeta
}

export function PropertyMetaIcon({
  className,
  meta,
}: Readonly<PropertyMetaIconProps>): ReactElement {
  const { icon: Icon, tone, weight } = meta

  return (
    <Icon
      aria-hidden="true"
      className={cn(propertyToneClassName[tone], className)}
      data-slot="property-meta-icon"
      data-tone={tone}
      weight={weight}
    />
  )
}
