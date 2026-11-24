import { StatefulOnboarding3 } from '../fixtures/onboarding-3.tsx'
import type { Onboarding3Controls } from './onboarding-3-controls.ts'

interface ComposedOnboarding3Props extends Onboarding3Controls {
  onComplete?: () => void
  onFinish?: () => void
  onSkip?: (stepId: string) => void
  onStepChange?: (id: string) => void
}

export const ComposedOnboarding3 = ({
  completed,
  error,
  next,
  onComplete,
  onFinish,
  onSkip,
  onStepChange,
  pending,
  skippable,
  step,
  successTitle,
}: Readonly<ComposedOnboarding3Props>) => (
  <StatefulOnboarding3
    completed={completed}
    error={error || undefined}
    initialStep={step}
    key={step}
    labels={{ next, successTitle }}
    onComplete={onComplete}
    onFinish={onFinish}
    onSkip={skippable ? onSkip : undefined}
    onStepChange={onStepChange}
    pending={pending}
  />
)
