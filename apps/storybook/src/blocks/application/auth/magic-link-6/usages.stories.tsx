import type { Meta, StoryObj } from '@storybook/react-vite'
import { MagicLink6 } from '@tc96/ui/blocks/application/auth/magic-link-6'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/MagicLink/MagicLink6/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignInWithLink: Story = {
  render: () => (
    <MagicLink6
      signupHref="/signup"
      providers={authProviders}
      logo={authLogo}
      media={gradientMedia}
      onSubmit={ignore}
    />
  ),
}
