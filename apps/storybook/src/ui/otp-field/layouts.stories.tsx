import type { Meta, StoryObj } from '@storybook/react-vite'
import { otpFieldControlArgs } from './otp-field-controls.ts'
import { OTPFieldCanvas } from './otp-field-frame.tsx'
import { ComposedOTPField } from './otp-field-layouts.tsx'

const meta = {
  decorators: [OTPFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/OTPField/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithSeparator: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} separator />,
}

export const WithDescription: Story = {
  render: () => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      description="The code expires in 10 minutes."
    />
  ),
}

export const HiddenLabel: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} label="" />,
}

export const FourSlots: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} length={4} />,
}
