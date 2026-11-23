import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type OtpControls,
  otpControlArgs,
  otpControlArgTypes,
} from './otp-1-controls.ts'
import { ComposedOtp } from './otp-1-layouts.tsx'

const meta = {
  args: otpControlArgs,
  argTypes: otpControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedOtp {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Otp1/Playground',
} satisfies Meta<OtpControls>

export default meta

type Story = StoryObj<OtpControls>

export const Playground: Story = {}
