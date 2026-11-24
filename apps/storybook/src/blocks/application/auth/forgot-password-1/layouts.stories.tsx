import type { Meta, StoryObj } from '@storybook/react-vite'
import { forgotPassword1ControlArgs } from './forgot-password-1-controls.ts'
import { ComposedForgotPassword1 } from './forgot-password-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ForgotPassword/ForgotPassword1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutLogo: Story = {
  render: () => (
    <ComposedForgotPassword1 {...forgotPassword1ControlArgs} logo={false} />
  ),
}

export const WithoutLoginLink: Story = {
  render: () => (
    <ComposedForgotPassword1
      {...forgotPassword1ControlArgs}
      loginHref={false}
    />
  ),
}

export const SentWithoutDestination: Story = {
  render: () => (
    <ComposedForgotPassword1
      {...forgotPassword1ControlArgs}
      destination=""
      sent
    />
  ),
}

export const SentWithoutResend: Story = {
  render: () => (
    <ComposedForgotPassword1
      {...forgotPassword1ControlArgs}
      resend={false}
      sent
    />
  ),
}

export const SentWithoutLoginLink: Story = {
  render: () => (
    <ComposedForgotPassword1
      {...forgotPassword1ControlArgs}
      loginHref={false}
      sent
    />
  ),
}
