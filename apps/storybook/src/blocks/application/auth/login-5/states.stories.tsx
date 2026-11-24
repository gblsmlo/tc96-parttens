import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login5Controls,
  login5ControlArgs,
  login5ControlArgTypes,
} from './login-5-controls.ts'
import { ComposedLogin5 } from './login-5-layouts.tsx'

const meta = {
  args: login5ControlArgs,
  argTypes: login5ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'method', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login5/States',
} satisfies Meta<Login5Controls>

export default meta

type Story = StoryObj<Login5Controls>

export const Default: Story = {}

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível entrar. Tente novamente.' },
}

export const EmailPending: Story = {
  args: { method: 'email', pending: true },
}

export const EmailError: Story = {
  args: { error: 'E-mail ou senha incorretos.', method: 'email' },
}
