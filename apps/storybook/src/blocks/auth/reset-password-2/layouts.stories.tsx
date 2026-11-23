import type { Meta, StoryObj } from '@storybook/react-vite'
import { resetPassword2ControlArgs } from './reset-password-2-controls.ts'
import { ComposedResetPassword2 } from './reset-password-2-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ResetPassword2/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Minimal: Story = {
  render: () => (
    <ComposedResetPassword2
      {...resetPassword2ControlArgs}
      loginHref={false}
      logo={false}
      requestNewLink={false}
      timer={false}
    />
  ),
}

export const WithoutTimer: Story = {
  render: () => (
    <ComposedResetPassword2 {...resetPassword2ControlArgs} timer={false} />
  ),
}

export const WithoutLogo: Story = {
  render: () => (
    <ComposedResetPassword2 {...resetPassword2ControlArgs} logo={false} />
  ),
}

export const WithoutLoginLink: Story = {
  render: () => (
    <ComposedResetPassword2 {...resetPassword2ControlArgs} loginHref={false} />
  ),
}

export const WithoutSuggestions: Story = {
  render: () => (
    <ComposedResetPassword2
      {...resetPassword2ControlArgs}
      passwordSuggestions={[]}
    />
  ),
}

export const ExpiredWithoutRequestButton: Story = {
  render: () => (
    <ComposedResetPassword2
      {...resetPassword2ControlArgs}
      expiresIn={0}
      requestNewLink={false}
    />
  ),
}

export const ExpiredWithoutLoginLink: Story = {
  render: () => (
    <ComposedResetPassword2
      {...resetPassword2ControlArgs}
      expiresIn={0}
      loginHref={false}
    />
  ),
}
