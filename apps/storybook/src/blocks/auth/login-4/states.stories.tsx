import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login4Controls,
  login4ControlArgs,
  login4ControlArgTypes,
} from './login-4-controls.ts'
import { ComposedLogin4 } from './login-4-layouts.tsx'

const meta = {
  args: login4ControlArgs,
  argTypes: login4ControlArgTypes,
  parameters: {
    controls: {
      exclude: [
        'destination',
        'emailError',
        'error',
        'pending',
        'resend',
        'resendIn',
        'sent',
      ],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login4/States',
} satisfies Meta<Login4Controls>

export default meta

type Story = StoryObj<Login4Controls>

export const Default: Story = {}

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
}

export const Sent: Story = {
  args: { sent: true },
}

export const SentCountingDown: Story = {
  args: { resendIn: 30, sent: true },
}
