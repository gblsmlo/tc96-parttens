import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ForgotPassword2Controls,
  forgotPassword2ControlArgs,
  forgotPassword2ControlArgTypes,
} from './forgot-password-2-controls.ts'
import { ComposedForgotPassword2 } from './forgot-password-2-layouts.tsx'

const meta = {
  args: forgotPassword2ControlArgs,
  argTypes: forgotPassword2ControlArgTypes,
  parameters: {
    controls: { exclude: ['emailError', 'error', 'pending', 'sent'] },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedForgotPassword2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ForgotPassword/ForgotPassword2/Stories',
} satisfies Meta<ForgotPassword2Controls>

export default meta

type Story = StoryObj<ForgotPassword2Controls>

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
