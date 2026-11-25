import type { Meta, StoryObj } from '@storybook/react-vite'
import { login7ControlArgs } from './login-7-controls.ts'
import { ComposedLogin7 } from './login-7-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login7/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => <ComposedLogin7 {...login7ControlArgs} />,
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin7
      {...login7ControlArgs}
      error="E-mail ou senha incorretos."
    />
  ),
}

export const SigningIn: Story = {
  render: () => <ComposedLogin7 {...login7ControlArgs} pending />,
}
