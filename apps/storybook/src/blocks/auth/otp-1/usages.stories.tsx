import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { otpControlArgs } from './otp-1-controls.ts'
import { ComposedOtp } from './otp-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Otp1/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EmailCode: Story = {
  render: () => <ComposedOtp {...otpControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Verifique seu código' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Enviamos um código de 6 dígitos para ana@acme.com.'),
    ).toBeVisible()
  },
}

export const ResendWaiting: Story = {
  render: () => <ComposedOtp {...otpControlArgs} resendIn={30} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Reenviar em 30s' }),
    ).toBeDisabled()
  },
}

export const ExpiredCode: Story = {
  render: () => (
    <ComposedOtp
      {...otpControlArgs}
      codeError="O código está incorreto ou expirou."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('O código está incorreto ou expirou.'),
    ).toBeVisible()
  },
}

export const VerificationFailed: Story = {
  render: () => (
    <ComposedOtp
      {...otpControlArgs}
      error="Não foi possível verificar o código. Tente novamente."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Não foi possível verificar o código. Tente novamente.',
    )
  },
}

export const Verifying: Story = {
  render: () => <ComposedOtp {...otpControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Verificando…' }),
    ).toBeDisabled()
  },
}
