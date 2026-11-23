import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { login2ControlArgs } from './login-2-controls.ts'
import { ComposedLogin2 } from './login-2-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login2/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => <ComposedLogin2 {...login2ControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Entrar' })).toBeVisible()
  },
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin2
      {...login2ControlArgs}
      error="E-mail ou senha incorretos."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'E-mail ou senha incorretos.',
    )
  },
}

export const UnknownEmail: Story = {
  render: () => (
    <ComposedLogin2
      {...login2ControlArgs}
      emailError="Este e-mail não está cadastrado."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Este e-mail não está cadastrado.'),
    ).toBeVisible()
  },
}

export const WrongPassword: Story = {
  render: () => (
    <ComposedLogin2
      {...login2ControlArgs}
      passwordError="A senha está incorreta."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('A senha está incorreta.'),
    ).toBeVisible()
  },
}

export const SigningIn: Story = {
  render: () => <ComposedLogin2 {...login2ControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: /^Entrar/ }),
    ).toBeDisabled()
  },
}
