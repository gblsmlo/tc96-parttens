import type { Meta, StoryObj } from '@storybook/react-vite'
import { login10ControlArgs } from './login-10-controls.ts'
import { ComposedLogin10 } from './login-10-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login10/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignInWithSocialProof: Story = {
  render: () => <ComposedLogin10 {...login10ControlArgs} />,
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin10
      {...login10ControlArgs}
      error="E-mail ou senha incorretos."
    />
  ),
}

export const SigningIn: Story = {
  render: () => <ComposedLogin10 {...login10ControlArgs} pending />,
}
