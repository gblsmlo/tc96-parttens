import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ResetPasswordControls,
  resetPasswordControlArgs,
  resetPasswordControlArgTypes,
} from './reset-password-1-controls.ts'
import { ComposedResetPassword1 } from './reset-password-1-layouts.tsx'

const meta = {
  args: resetPasswordControlArgs,
  argTypes: resetPasswordControlArgTypes,
  parameters: {
    controls: { exclude: ['error', 'fieldError', 'pending'] },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedResetPassword1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword/ResetPassword1/Stories',
} satisfies Meta<ResetPasswordControls>

export default meta

type Story = StoryObj<ResetPasswordControls>

export const Default: Story = {}

export const ErrorMessage: Story = {
  args: { error: 'O link de redefinição expirou. Peça um novo link.' },
  name: 'Error',
}

export const FieldError: Story = {
  args: { fieldError: 'Escolha uma senha diferente da anterior.' },
}

export const Pending: Story = {
  args: { pending: true },
}
