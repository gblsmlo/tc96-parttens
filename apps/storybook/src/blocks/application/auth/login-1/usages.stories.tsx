import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { loginControlArgs } from './login-1-controls.ts'
import { ComposedLogin } from './login-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login1/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => <ComposedLogin {...loginControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Criar conta' }),
    ).toBeVisible()
  },
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin {...loginControlArgs} error="E-mail ou senha incorretos." />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'E-mail ou senha incorretos.',
    )
  },
}

export const UnknownEmail: Story = {
  render: () => (
    <ComposedLogin
      {...loginControlArgs}
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
    <ComposedLogin
      {...loginControlArgs}
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
  render: () => <ComposedLogin {...loginControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Entrando…' }),
    ).toBeDisabled()
  },
}
