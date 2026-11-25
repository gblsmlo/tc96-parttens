import type { Meta, StoryObj } from '@storybook/react-vite'
import { otpControlArgs } from './otp-1-controls.ts'
import { ComposedOtp } from './otp-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Otp1/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EmailCode: Story = {
  render: () => <ComposedOtp {...otpControlArgs} />,
}

export const ResendWaiting: Story = {
  render: () => <ComposedOtp {...otpControlArgs} resendIn={30} />,
}

export const ExpiredCode: Story = {
  render: () => (
    <ComposedOtp
      {...otpControlArgs}
      codeError="O código está incorreto ou expirou."
    />
  ),
}

export const VerificationFailed: Story = {
  render: () => (
    <ComposedOtp
      {...otpControlArgs}
      error="Não foi possível verificar o código. Tente novamente."
    />
  ),
}

export const Verifying: Story = {
  render: () => <ComposedOtp {...otpControlArgs} pending />,
}
