import {
  RunMonitor,
  type RunMonitorProps,
} from '@tc96/ui/blocks/ai-agents/flow/run-monitor'
import { connections, steps } from '../fixtures/run-monitor.ts'
import type { RunMonitorControls } from './run-monitor-controls.ts'

interface ComposedRunMonitorProps extends RunMonitorControls {
  onApprove?: RunMonitorProps['onApprove']
  onReject?: RunMonitorProps['onReject']
  onReplay?: RunMonitorProps['onReplay']
  onRetry?: RunMonitorProps['onRetry']
}

export const ComposedRunMonitor = ({
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
}: Readonly<ComposedRunMonitorProps>) => (
  <RunMonitor
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
