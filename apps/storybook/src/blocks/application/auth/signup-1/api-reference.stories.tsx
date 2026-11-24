import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup1 } from '@tc96/ui/blocks/application/auth/signup-1'
import { authLogo, authProviders } from '../fixtures/auth-data'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '1120px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Register/Register1/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Signup1
      error="Não foi possível criar a conta. Tente novamente."
      loginHref="/login"
      logo={authLogo}
      onProviderSelect={ignore}
      onSubmit={ignore}
      privacyHref="/privacy"
      providers={authProviders}
      termsHref="/terms"
    />
  ),
}
