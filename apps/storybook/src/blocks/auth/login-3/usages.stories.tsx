import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { login3ControlArgs } from './login-3-controls.ts'
import { ComposedLogin3 } from './login-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login3/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignInWithTestimonial: Story = {
  render: () => <ComposedLogin3 {...login3ControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Ana Souza, diretora de operações na Acme'),
    ).toBeVisible()
  },
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin3
      {...login3ControlArgs}
      error="E-mail ou senha incorretos."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'E-mail ou senha incorretos.',
    )
  },
}

export const SigningIn: Story = {
  render: () => <ComposedLogin3 {...login3ControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: /^Entrar/ }),
    ).toBeDisabled()
  },
}
