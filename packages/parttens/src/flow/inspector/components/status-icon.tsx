import { cn } from '@tc96/utils'
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  Loader2Icon,
  SkipForwardIcon,
  XCircleIcon,
} from 'lucide-react'
import type { FlowRunStatus } from '../../canvas/core'
import { flowStatusIconClassName } from '../lib/variants'

const icons = {
  failed: XCircleIcon,
  idle: CircleDashedIcon,
  'not-run': CircleDashedIcon,
  running: Loader2Icon,
  skipped: SkipForwardIcon,
  success: CheckCircle2Icon,
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
