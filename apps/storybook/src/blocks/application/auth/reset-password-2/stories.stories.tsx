import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ResetPassword2Controls,
  resetPassword2ControlArgs,
  resetPassword2ControlArgTypes,
} from './reset-password-2-controls.ts'
import { ComposedResetPassword2 } from './reset-password-2-layouts.tsx'

const meta = {
  args: resetPassword2ControlArgs,
  argTypes: resetPassword2ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['error', 'expiresIn', 'fieldError', 'pending', 'timer'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedResetPassword2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword2/Stories',
} satisfies Meta<ResetPassword2Controls>

export default meta

type Story = StoryObj<ResetPassword2Controls>

export const Default: Story = {}

export const Expired: Story = {
  args: { expiresIn: 0 },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível redefinir a senha. Tente novamente.' },
  name: 'Error',
}

export const FieldError: Story = {
  args: { fieldError: 'Escolha uma senha diferente da anterior.' },
}

export const Pending: Story = {
  args: { pending: true },
}
