import type { Meta, StoryObj } from '@storybook/react-vite'
import { login3ControlArgs } from './login-3-controls.ts'
import { ComposedLogin3 } from './login-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login3/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignInWithTestimonial: Story = {
  render: () => <ComposedLogin3 {...login3ControlArgs} />,
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin3
      {...login3ControlArgs}
      error="E-mail ou senha incorretos."
    />
  ),
}

export const SigningIn: Story = {
  render: () => <ComposedLogin3 {...login3ControlArgs} pending />,
}
