import type { Meta, StoryObj } from '@storybook/react-vite'
import { otpControlArgs } from './otp-1-controls.ts'
import { ComposedOtp } from './otp-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Otp1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Minimal: Story = {
  render: () => (
    <ComposedOtp
      {...otpControlArgs}
      destination=""
      logo={false}
      resend={false}
    />
  ),
}

export const WithoutDestination: Story = {
  render: () => <ComposedOtp {...otpControlArgs} destination="" />,
}

export const WithoutResend: Story = {
  render: () => <ComposedOtp {...otpControlArgs} resend={false} />,
}

export const FourDigits: Story = {
  render: () => <ComposedOtp {...otpControlArgs} length={4} />,
}
