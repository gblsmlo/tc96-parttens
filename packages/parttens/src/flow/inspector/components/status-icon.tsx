import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleNotchIcon,
  SkipForwardIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@tc96/utils'
import type { FlowRunStatus } from '../../canvas/core'
import { flowStatusIconClassName } from '../lib/variants'

const icons = {
  failed: XCircleIcon,
  idle: CircleDashedIcon,
  'not-run': CircleDashedIcon,
  running: CircleNotchIcon,
  skipped: SkipForwardIcon,
  success: CheckCircleIcon,
} as const

export function StatusIcon({ status }: Readonly<{ status: FlowRunStatus }>) {
  const Icon = icons[status]
  return (
    <Icon
      aria-hidden="true"
      className={cn('size-4 shrink-0', flowStatusIconClassName[status])}
      data-slot="flow-status-icon"
      data-status={status}
    />
  )
}
