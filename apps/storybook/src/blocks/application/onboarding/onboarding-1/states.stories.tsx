import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { StatefulOnboarding1 } from '../fixtures/onboarding-1.tsx'

const meta = {
  args: { onComplete: fn(), onFinish: fn(), onStepChange: fn() },
  component: StatefulOnboarding1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding1/States',
} satisfies Meta<typeof StatefulOnboarding1>

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
