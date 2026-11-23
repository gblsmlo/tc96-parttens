import type { Meta, StoryObj } from '@storybook/react-vite'
import { resetPasswordControlArgs } from './reset-password-1-controls.ts'
import { ComposedResetPassword1 } from './reset-password-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ResetPassword1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Minimal: Story = {
  render: () => (
    <ComposedResetPassword1
      {...resetPasswordControlArgs}
      loginHref={false}
      logo={false}
    />
  ),
}

export const WithoutLogo: Story = {
  render: () => (
    <ComposedResetPassword1 {...resetPasswordControlArgs} logo={false} />
  ),
}

export const WithoutLoginLink: Story = {
  render: () => (
    <ComposedResetPassword1 {...resetPasswordControlArgs} loginHref={false} />
  ),
}

export const NarrowedSuggestions: Story = {
  render: () => (
    <ComposedResetPassword1
      {...resetPasswordControlArgs}
      passwordSuggestions={['number', 'symbol']}
    />
  ),
}

export const WithoutSuggestions: Story = {
  render: () => (
    <ComposedResetPassword1
      {...resetPasswordControlArgs}
      passwordSuggestions={[]}
    />
  ),
}
