import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { signup3ControlArgs } from './signup-3-controls.ts'
import { ComposedSignup3 } from './signup-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register3/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TrialSignup: Story = {
  render: () => <ComposedSignup3 {...signup3ControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', {
        level: 1,
        name: 'O CRM que faz seu time vender mais',
      }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', {
        level: 2,
        name: 'Comece seu teste de 14 dias',
      }),
    ).toBeVisible()
  },
}

export const EmailAlreadyTaken: Story = {
  render: () => (
    <ComposedSignup3
      {...signup3ControlArgs}
      emailError="Este e-mail já tem uma conta."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Este e-mail já tem uma conta.'),
    ).toBeVisible()
  },
}

export const CreatingAccount: Story = {
  render: () => <ComposedSignup3 {...signup3ControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: /^Começar teste grátis/,
      }),
    ).toBeDisabled()
  },
}
