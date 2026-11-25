import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword6 } from '@tc96/ui/blocks/application/auth/reset-password-6'
import { authLogo } from '../fixtures/auth-data'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword/ResetPassword6/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ResetPassword: Story = {
  render: () => (
    <ResetPassword6
      loginHref="/login"
      logo={authLogo}
      media={gradientMedia}
      onSubmit={ignore}
    />
  ),
}
