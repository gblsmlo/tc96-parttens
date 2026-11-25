import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { StatefulOnboarding3 } from '../fixtures/onboarding-3.tsx'

const meta = {
  args: { onComplete: fn(), onFinish: fn(), onStepChange: fn() },
  component: StatefulOnboarding3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding3/States',
} satisfies Meta<typeof StatefulOnboarding3>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { error: 'Não foi possível salvar o seu perfil. Tente novamente.' },
}

export const Success: Story = {
  args: { completed: true },
}
