import type { Meta, StoryObj } from '@storybook/react-vite'
import { Onboarding2 } from '@tc96/ui/blocks/application/onboarding/onboarding-2'
import { useState } from 'react'
import { useOnboardingForm } from '../fixtures/onboarding-demo.tsx'

const AccountSetup = () => {
  const { onContinue, steps } = useOnboardingForm()
  const [step, setStep] = useState('profile')
  const [pending, setPending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [finished, setFinished] = useState(false)

  if (finished) return <p className="text-sm">Bem-vindo ao Acme Studio.</p>

  return (
    <Onboarding2
      completed={completed}
      onComplete={() => {
        setPending(true)
        setTimeout(() => {
          setPending(false)
          setCompleted(true)
        }, 300)
      }}
      onContinue={onContinue}
      onFinish={() => setFinished(true)}
      onSkip={() => setCompleted(true)}
      onStepChange={setStep}
      pending={pending}
      step={step}
      steps={steps}
    />
  )
}

const meta = {
  component: AccountSetup,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding2/Usages',
} satisfies Meta<typeof AccountSetup>

export default meta

type Story = StoryObj<typeof meta>

export const ValidationKeepsTheStep: Story = {}

export const CompleteSetup: Story = {}

export const SkipSetup: Story = {}
