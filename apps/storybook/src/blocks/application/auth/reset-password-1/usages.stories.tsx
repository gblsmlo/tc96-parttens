import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword1 } from '@tc96/blocks/application/auth/reset-password-1'
import { expect, fn, within } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import {
  confirmField,
  feedback,
  passwordField,
} from './reset-password-1-play.ts'

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

export const ResetFromEmailLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Redefinir senha' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toBeVisible()
  },
}

export const ExpiredLink: Story = {
  args: { error: 'O link de redefinição expirou. Peça um novo link.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'O link de redefinição expirou. Peça um novo link.',
    )
  },
}

export const PasswordAlreadyUsed: Story = {
  args: {
    fieldErrors: { password: 'Escolha uma senha diferente da anterior.' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(confirmField(canvas)).not.toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await expect(
      canvas.getByText('Escolha uma senha diferente da anterior.'),
    ).toBeVisible()
  },
}

export const StricterPasswordPolicy: Story = {
  args: { passwordMinLength: 12, passwordSuggestions: ['number', 'symbol'] },
  play: async ({ canvasElement }) => {
    await expect(feedback(canvasElement).getByText('número')).toBeVisible()
    await expect(feedback(canvasElement).getByText('símbolo')).toBeVisible()
  },
}
