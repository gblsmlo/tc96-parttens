import {
  Onboarding3,
  type Onboarding3Props,
} from '@tc96/blocks/application/onboarding/onboarding-3'
import { useState } from 'react'
import { simpleSteps } from './onboarding-demo.tsx'

export type StatefulOnboarding3Props = Partial<
  Omit<Onboarding3Props, 'step'>
> & { initialStep?: string }

export function StatefulOnboarding3({
  initialStep = 'profile',
  onOpenChange,
  onStepChange,
  open: openProp = true,
  steps = simpleSteps,
  ...props
}: Readonly<StatefulOnboarding3Props>) {
  const [step, setStep] = useState(initialStep)
  const [open, setOpen] = useState(openProp)

  return (
    <Onboarding3
      onFinish={() => undefined}
      {...props}
      onOpenChange={(next) => {
        setOpen(next)
        onOpenChange?.(next)
      }}
      onStepChange={(id) => {
        setStep(id)
        onStepChange?.(id)
      }}
      open={open}
      step={step}
      steps={steps}
    />
  )
}
