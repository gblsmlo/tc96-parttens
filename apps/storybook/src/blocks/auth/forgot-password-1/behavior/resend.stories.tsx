import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword1 } from '@tc96/blocks/auth/forgot-password-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { authLogo } from '../../fixtures/auth-data'
import { resendButton, sentTitle } from '../forgot-password-1-play.ts'

const meta = {
  args: {
    destination: 'ana@acme.com',
    loginHref: '/login',
    logo: authLogo,
    onResend: fn(),
    onSubmit: fn(),
    sent: true,
  },
  component: ForgotPassword1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ForgotPassword/ForgotPassword1/Behavior',
} satisfies Meta<typeof ForgotPassword1>

export default meta

type Story = StoryObj<typeof meta>

export const ResendCallsTheHandler: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Não recebeu o e-mail?')).toBeVisible()
    const resend = resendButton(canvas)
    await expect(resend).toBeEnabled()
    await expect(resend).toHaveAttribute('type', 'button')
    await userEvent.click(resend)
    await expect(args.onResend).toHaveBeenCalledOnce()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ResendDisabledWhileCounting: Story = {
  args: { resendIn: 30 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = resendButton(canvas, 'Reenviar em 30s')
    await expect(resend).toBeDisabled()
    await expect(resend.closest('[aria-live]')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Reenviar e-mail' }),
    ).toBe(null)
    await userEvent.click(resend, { pointerEventsCheck: 0 })
    await expect(args.onResend).not.toHaveBeenCalled()
  },
}

export const ResendEnabledAtZero: Story = {
  args: { resendIn: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = resendButton(canvas)
    await expect(resend).toBeEnabled()
    await userEvent.click(resend)
    await expect(args.onResend).toHaveBeenCalledOnce()
  },
}

export const ResendOnlyWithHandler: Story = {
  args: { onResend: undefined, resendIn: 30 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.queryByText('Não recebeu o e-mail?')).toBeNull()
    await expect(canvas.queryByText('Reenviar em 30s')).toBeNull()
    await expect(canvas.queryByText('Reenviar e-mail')).toBeNull()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toBeVisible()
  },
}

export const PendingBlocksResend: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = resendButton(canvas)
    await expect(resend).toBeDisabled()
    await userEvent.click(resend, { pointerEventsCheck: 0 })
    await expect(args.onResend).not.toHaveBeenCalled()
  },
}
