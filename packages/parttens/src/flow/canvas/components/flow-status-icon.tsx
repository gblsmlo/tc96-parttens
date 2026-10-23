import { Spinner } from '@tc96/ui/spinner'
import type { ReactElement } from 'react'
import type { FlowRunStatus } from '../core'
import { flowStatusIcons } from '../lib/steps'

export function FlowStatusIcon({
  status,
}: Readonly<{ status: FlowRunStatus }>): ReactElement {
  if (status === 'running')
    return <Spinner aria-hidden="true" className="size-3.5" />
  const Icon = flowStatusIcons[status]
  return <Icon aria-hidden="true" className="size-3.5 shrink-0" />
}
