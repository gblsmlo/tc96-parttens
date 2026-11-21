import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type OTPFieldControls,
  otpFieldControlArgs,
  otpFieldControlArgTypes,
} from './otp-field-controls.ts'
import { OTPFieldCanvas } from './otp-field-frame.tsx'
import { ComposedOTPField } from './otp-field-layouts.tsx'

const meta = {
  args: otpFieldControlArgs,
  argTypes: otpFieldControlArgTypes,
  decorators: [OTPFieldCanvas],
  parameters: {
    controls: { exclude: ['size', 'disabled', 'invalid'] },
    layout: 'centered',
  },
  render: (args) => <ComposedOTPField {...args} />,
  tags: ['!autodocs'],
  title: 'UI/OTPField/Stories',
} satisfies Meta<OTPFieldControls>

export default meta

type Story = StoryObj<OTPFieldControls>

export const Default: Story = {}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}
