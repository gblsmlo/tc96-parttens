import type { Meta, StoryObj } from '@storybook/react-vite'
import { login2ControlArgs } from './login-2-controls.ts'
import { ComposedLogin2 } from './login-2-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login2/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => <ComposedLogin2 {...login2ControlArgs} />,
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin2
      {...login2ControlArgs}
      error="E-mail ou senha incorretos."
    />
  ),
}

export const UnknownEmail: Story = {
  render: () => (
    <ComposedLogin2
      {...login2ControlArgs}
      emailError="Este e-mail não está cadastrado."
    />
  ),
}

export const WrongPassword: Story = {
  render: () => (
    <ComposedLogin2
      {...login2ControlArgs}
      passwordError="A senha está incorreta."
    />
  ),
}

export const SigningIn: Story = {
  render: () => <ComposedLogin2 {...login2ControlArgs} pending />,
}
