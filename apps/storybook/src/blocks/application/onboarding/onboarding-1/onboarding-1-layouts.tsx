import { StatefulOnboarding1 } from '../fixtures/onboarding-1.tsx'
import type { Onboarding1Controls } from './onboarding-1-controls.ts'

interface ComposedOnboarding1Props extends Onboarding1Controls {
  onComplete?: () => void
  onFinish?: () => void
  onSkip?: (stepId: string) => void
  onStepChange?: (id: string) => void
}

export const ComposedOnboarding1 = ({
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
}: Readonly<ComposedOnboarding1Props>) => (
  <StatefulOnboarding1
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
