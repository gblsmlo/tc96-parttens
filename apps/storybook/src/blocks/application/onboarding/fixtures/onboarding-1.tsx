import {
  Onboarding1,
  type Onboarding1Props,
} from '@tc96/blocks/application/onboarding/onboarding-1'
import { useState } from 'react'
import { simpleSteps } from './onboarding-demo.tsx'

export type StatefulOnboarding1Props = Partial<
  Omit<Onboarding1Props, 'step'>
> & { initialStep?: string }

export function StatefulOnboarding1({
  initialStep = 'profile',
  onStepChange,
  steps = simpleSteps,
  ...props
}: Readonly<StatefulOnboarding1Props>) {
  const [step, setStep] = useState(initialStep)

  return (
    <Onboarding1
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
