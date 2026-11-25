import { Flow3, type Flow3Props } from '@tc96/ui/blocks/application/flow/flow-3'
import { connections, steps } from '../fixtures/flow-3.ts'
import type { Flow3Controls } from './flow-3-controls.ts'

interface ComposedFlow3Props extends Flow3Controls {
  onApprove?: Flow3Props['onApprove']
  onReject?: Flow3Props['onReject']
  onReplay?: Flow3Props['onReplay']
  onRetry?: Flow3Props['onRetry']
}

export const ComposedFlow3 = ({
  approvals,
  empty,
  error,
  onApprove,
  onReject,
  onReplay,
  onRetry,
  pending,
  replay,
  title,
  waiting,
}: Readonly<ComposedFlow3Props>) => (
  <Flow3
    connections={empty ? [] : connections}
    error={error}
    labels={{ title }}
    onApprove={approvals ? onApprove : undefined}
    onReject={approvals ? onReject : undefined}
    onReplay={replay ? onReplay : undefined}
    onRetry={onRetry}
    pending={pending}
    steps={
      empty
        ? []
        : steps.map((step) =>
            !waiting && step.status === 'waiting-approval'
              ? { ...step, status: 'pending' }
              : step,
          )
    }
  />
)
