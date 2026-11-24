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
  parameters: {
    controls: {
      exclude: ['codeError', 'error', 'pending', 'resendIn'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedOtp {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Otp1/Stories',
} satisfies Meta<OtpControls>

export default meta

type Story = StoryObj<OtpControls>

export const Default: Story = {}

export const Pending: Story = {
  args: { pending: true },
}

export const ResendCountdown: Story = {
  args: { resendIn: 30 },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível verificar o código. Tente novamente.' },
}

export const CodeError: Story = {
  args: { codeError: 'O código está incorreto ou expirou.' },
}
