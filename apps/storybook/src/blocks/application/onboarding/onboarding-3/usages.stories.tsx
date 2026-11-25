import type { Meta, StoryObj } from '@storybook/react-vite'
import { Onboarding3 } from '@tc96/ui/blocks/application/onboarding/onboarding-3'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { useOnboardingForm } from '../fixtures/onboarding-demo.tsx'

const AccountSetup = () => {
  const { onContinue, steps } = useOnboardingForm()
  const [open, setOpen] = useState(true)
  const [step, setStep] = useState('profile')
  const [pending, setPending] = useState(false)
  const [completed, setCompleted] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        Configurar conta
      </Button>
      <Onboarding3
        completed={completed}
        onComplete={() => {
          setPending(true)
          setTimeout(() => {
            setPending(false)
            setCompleted(true)
          }, 300)
        }}
        onContinue={onContinue}
        onFinish={() => setOpen(false)}
        onOpenChange={setOpen}
        onSkip={() => setCompleted(true)}
        onStepChange={setStep}
        open={open}
        pending={pending}
        step={step}
        steps={steps}
      />
    </>
  )
}

const meta = {
  component: AccountSetup,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding3/Usages',
} satisfies Meta<typeof AccountSetup>

export default meta

type Story = StoryObj<typeof meta>

export const ValidationKeepsTheStep: Story = {}

export const CompleteSetup: Story = {}

export const SkipSetup: Story = {}
