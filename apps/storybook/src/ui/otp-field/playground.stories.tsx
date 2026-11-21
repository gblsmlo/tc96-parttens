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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedOTPField {...args} />,
  tags: ['!autodocs'],
  title: 'UI/OTPField/Playground',
} satisfies Meta<OTPFieldControls>

export default meta

type Story = StoryObj<OTPFieldControls>

export const Playground: Story = {}
