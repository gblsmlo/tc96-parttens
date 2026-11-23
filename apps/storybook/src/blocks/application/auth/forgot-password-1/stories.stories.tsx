import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ForgotPassword1Controls,
  forgotPassword1ControlArgs,
  forgotPassword1ControlArgTypes,
} from './forgot-password-1-controls.ts'
import { ComposedForgotPassword1 } from './forgot-password-1-layouts.tsx'

const meta = {
  args: forgotPassword1ControlArgs,
  argTypes: forgotPassword1ControlArgTypes,
  parameters: {
    controls: { exclude: ['emailError', 'error', 'pending', 'sent'] },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedForgotPassword1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ForgotPassword1/Stories',
} satisfies Meta<ForgotPassword1Controls>

export default meta

type Story = StoryObj<ForgotPassword1Controls>

export const Default: Story = {}

export const Sent: Story = {
  args: { sent: true },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
  name: 'Error',
}

export const FieldError: Story = {
  args: { emailError: 'Este e-mail não está cadastrado.' },
}

export const Pending: Story = {
  args: { pending: true },
}
