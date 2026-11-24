import { StatefulOnboarding2 } from '../fixtures/onboarding-2.tsx'
import type { Onboarding2Controls } from './onboarding-2-controls.ts'

interface ComposedOnboarding2Props extends Onboarding2Controls {
  onComplete?: () => void
  onFinish?: () => void
  onSkip?: (stepId: string) => void
  onStepChange?: (id: string) => void
}

export const ComposedOnboarding2 = ({
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
}: Readonly<ComposedOnboarding2Props>) => (
  <StatefulOnboarding2
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
