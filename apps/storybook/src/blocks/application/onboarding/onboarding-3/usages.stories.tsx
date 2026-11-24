import type { Meta, StoryObj } from '@storybook/react-vite'
import { Onboarding3 } from '@tc96/blocks/application/onboarding/onboarding-3'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
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

export const ValidationKeepsTheStep: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await expect(await screen.findByText('Informe seu nome.')).toBeVisible()
    await expect(screen.getByText('Passo 1 de 3')).toBeVisible()
  },
}

export const CompleteSetup: Story = {
  play: async () => {
    await userEvent.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await userEvent.type(screen.getByLabelText('Cargo'), 'Gerente de produto')
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await userEvent.type(
      await screen.findByLabelText('Nome do espaço de trabalho'),
      'Acme Studio',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Concluir' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Começar' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const SkipSetup: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Pular' }))
    await expect(
      await screen.findByRole('heading', { name: 'Tudo pronto' }),
    ).toBeVisible()
  },
}
