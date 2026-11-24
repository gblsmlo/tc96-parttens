import {
  Timeline3,
  type Timeline3Step,
} from '@tc96/blocks/application/timeline/timeline-3'
import { useState } from 'react'
import { approvalSteps } from '../fixtures/timeline-3.ts'
import type { Timeline3Controls } from './timeline-3-controls.ts'

export interface ComposedTimeline3Props extends Timeline3Controls {
  onApprove?: (stepId: string) => void
  onReject?: (stepId: string) => void
  onRetry?: () => void
}

export const ComposedTimeline3 = ({
  empty,
  error,
  onApprove,
  onReject,
  onRetry,
  pending,
  title,
}: Readonly<ComposedTimeline3Props>) => {
  const [steps, setSteps] = useState<Timeline3Step[]>(approvalSteps)
  const current = steps.find((step) => step.status === 'pending')

  const decide = (
    stepId: string,
    status: Timeline3Step['status'],
    notify?: (stepId: string) => void,
  ) => {
    setSteps((previous) =>
      previous.map((step) => (step.id === stepId ? { ...step, status } : step)),
    )
    notify?.(stepId)
  }

  return (
    <Timeline3
      currentStepId={current?.id}
      error={error}
      labels={{ title }}
      onApprove={(stepId) => decide(stepId, 'approved', onApprove)}
      onReject={(stepId) => decide(stepId, 'rejected', onReject)}
      onRetry={onRetry}
      pending={pending}
      steps={empty ? [] : steps}
    />
  )
}
