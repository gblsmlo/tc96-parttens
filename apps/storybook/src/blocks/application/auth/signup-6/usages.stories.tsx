import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup6 } from '@tc96/ui/blocks/application/auth/signup-6'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register6/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignUp: Story = {
  render: () => (
    <Signup6
      loginHref="/login"
      privacyHref="/privacy"
      providers={authProviders}
      termsHref="/terms"
      logo={authLogo}
      media={gradientMedia}
      onSubmit={ignore}
    />
  ),
}
