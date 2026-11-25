import type { Meta, StoryObj } from '@storybook/react-vite'
import { loginControlArgs } from './login-1-controls.ts'
import { ComposedLogin } from './login-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login1/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => <ComposedLogin {...loginControlArgs} />,
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin {...loginControlArgs} error="E-mail ou senha incorretos." />
  ),
}

export const UnknownEmail: Story = {
  render: () => (
    <ComposedLogin
      {...loginControlArgs}
      emailError="Este e-mail não está cadastrado."
    />
  ),
}

export const WrongPassword: Story = {
  render: () => (
    <ComposedLogin
      {...loginControlArgs}
      passwordError="A senha está incorreta."
    />
  ),
}

export const SigningIn: Story = {
  render: () => <ComposedLogin {...loginControlArgs} pending />,
}
