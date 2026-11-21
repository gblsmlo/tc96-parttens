import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { otpFieldControlArgs } from './otp-field-controls.ts'
import { OTPFieldCanvas } from './otp-field-frame.tsx'
import {
  CodeCheckOTPField,
  ComposedOTPField,
  RecoveryCodeField,
  TwoFactorForm,
} from './otp-field-layouts.tsx'

const meta = {
  decorators: [OTPFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/OTPField/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EmailVerification: Story = {
  render: () => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      description="Enter the 6-digit code we sent to ana@example.com. It expires in 10 minutes."
      label="Confirm your email"
      separator
    />
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Confirm your email',
    })
    await expect(group).toHaveAccessibleDescription(
      'Enter the 6-digit code we sent to ana@example.com. It expires in 10 minutes.',
    )
    await expect(within(group).getAllByRole('textbox')).toHaveLength(6)
  },
}

export const TwoFactorSignIn: Story = {
  render: () => <TwoFactorForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Authentication code' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Verify' })).toBeVisible()
  },
}

export const WrongCode: Story = {
  render: () => <CodeCheckOTPField code="482913" initialValue="482910" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText(
        'That code is incorrect. Check the latest email and try again.',
      ),
    ).toBeVisible()
    for (const slot of canvas.getAllByRole('textbox')) {
      await expect(slot).toHaveAttribute('aria-invalid', 'true')
    }
  },
}

export const RecoveryCode: Story = {
  render: () => <RecoveryCodeField />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Recovery code',
    })
    await expect(within(group).getAllByRole('textbox')).toHaveLength(8)
    await expect(within(group).getByRole('separator')).toBeVisible()
  },
}

export const CardPin: Story = {
  render: () => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      description="Enter the PIN of the card ending in 4242 to confirm the transfer."
      label="Card PIN"
      length={4}
      mask
      size="lg"
    />
  ),
  play: async ({ canvasElement }) => {
    const slots = canvasElement.querySelectorAll(
      '[data-slot="otp-field-input"]',
    )
    await expect(slots).toHaveLength(4)
    for (const slot of slots) {
      await expect(slot).toHaveAttribute('type', 'password')
    }
  },
}
