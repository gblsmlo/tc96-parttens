import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { StatefulOnboarding2 } from '../fixtures/onboarding-2.tsx'

const meta = {
  args: { onComplete: fn(), onFinish: fn(), onStepChange: fn() },
  component: StatefulOnboarding2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding2/States',
} satisfies Meta<typeof StatefulOnboarding2>

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
