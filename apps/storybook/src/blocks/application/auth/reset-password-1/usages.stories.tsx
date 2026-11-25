import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword1 } from '@tc96/ui/blocks/application/auth/reset-password-1'
import { fn } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onSubmit: fn(),
  },
  component: ResetPassword1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword/ResetPassword1/Usages',
} satisfies Meta<typeof ResetPassword1>

export default meta

type Story = StoryObj<typeof meta>

export const ResetFromEmailLink: Story = {}

export const ExpiredLink: Story = {
  args: { error: 'O link de redefinição expirou. Peça um novo link.' },
}

export const PasswordAlreadyUsed: Story = {
  args: {
    fieldErrors: { password: 'Escolha uma senha diferente da anterior.' },
  },
}

export const StricterPasswordPolicy: Story = {
  args: { passwordMinLength: 12, passwordSuggestions: ['number', 'symbol'] },
}
