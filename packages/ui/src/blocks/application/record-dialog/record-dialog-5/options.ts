import {
  CellSignalHighIcon,
  CellSignalLowIcon,
  CellSignalMediumIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  CircleIcon,
  MinusIcon,
  RadioButtonIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { RecordDialog5Labels } from './types'

export function createRecordDialog5StatusOptions(
  labels: RecordDialog5Labels,
): readonly PropertyOption[] {
  return [
    {
      icon: CircleIcon,
      label: labels.statusBacklog,
      tone: 'neutral',
      value: 'backlog',
    },
    {
      icon: CircleDashedIcon,
      label: labels.statusPlanned,
      tone: 'neutral',
      value: 'planned',
    },
    {
      icon: RadioButtonIcon,
      label: labels.statusInProgress,
      tone: 'warning',
      value: 'in-progress',
    },
    {
      icon: CheckCircleIcon,
      label: labels.statusCompleted,
      tone: 'success',
      value: 'completed',
    },
    {
      icon: XCircleIcon,
      label: labels.statusCanceled,
      tone: 'danger',
      value: 'canceled',
    },
  ]
}

export function createRecordDialog5PriorityOptions(
  labels: RecordDialog5Labels,
): readonly PropertyOption[] {
  return [
    {
      icon: MinusIcon,
      label: labels.priorityNone,
      tone: 'neutral',
      value: 'none',
    },
    {
      icon: WarningIcon,
      label: labels.priorityUrgent,
      tone: 'danger',
      value: 'urgent',
    },
    {
      icon: CellSignalHighIcon,
      label: labels.priorityHigh,
      tone: 'warning',
      value: 'high',
    },
    {
      icon: CellSignalMediumIcon,
      label: labels.priorityMedium,
      tone: 'info',
      value: 'medium',
    },
    {
      icon: CellSignalLowIcon,
      label: labels.priorityLow,
      tone: 'neutral',
      value: 'low',
    },
  ]
}
