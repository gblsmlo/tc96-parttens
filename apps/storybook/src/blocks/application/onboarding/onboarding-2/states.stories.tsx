import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen } from 'storybook/test'
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

export const Default: Story = {
  play: async () => {
    await expect(screen.getByText('Passo 1 de 3')).toBeVisible()
    await expect(
      screen.getByRole('button', { name: /Continuar/ }),
    ).toBeEnabled()
  },
}

export const Pending: Story = {
  args: { pending: true },
  play: async () => {
    await expect(
      screen.getByRole('button', { name: /Continuar/ }),
    ).toBeDisabled()
  },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { error: 'Não foi possível salvar o seu perfil. Tente novamente.' },
  play: async () => {
    await expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível salvar o seu perfil.',
    )
  },
}

export const Success: Story = {
  args: { completed: true },
  play: async () => {
    await expect(
      screen.getByRole('heading', { name: 'Tudo pronto' }),
    ).toBeVisible()
    await expect(screen.getByRole('button', { name: 'Começar' })).toBeVisible()
  },
}
