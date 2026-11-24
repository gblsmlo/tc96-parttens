import {
  Onboarding2,
  type Onboarding2Props,
} from '@tc96/ui/blocks/application/onboarding/onboarding-2'
import { useState } from 'react'
import { simpleSteps } from './onboarding-demo.tsx'

export type StatefulOnboarding2Props = Partial<
  Omit<Onboarding2Props, 'step'>
> & { initialStep?: string }

export function StatefulOnboarding2({
  initialStep = 'profile',
  onStepChange,
  steps = simpleSteps,
  ...props
}: Readonly<StatefulOnboarding2Props>) {
  const [step, setStep] = useState(initialStep)

  return (
    <Onboarding2
      onFinish={() => undefined}
      {...props}
      onStepChange={(id) => {
        setStep(id)
        onStepChange?.(id)
      }}
      step={step}
      steps={steps}
    />
  )
}
