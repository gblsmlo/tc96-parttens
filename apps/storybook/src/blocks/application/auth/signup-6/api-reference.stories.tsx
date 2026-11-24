import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup6 } from '@tc96/ui/blocks/application/auth/signup-6'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '760px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Register/Register6/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Signup6
      loginHref="/login"
      privacyHref="/privacy"
      termsHref="/terms"
      providers={authProviders}
      logo={authLogo}
      media={gradientMedia}
      onSubmit={ignore}
    />
  ),
}
