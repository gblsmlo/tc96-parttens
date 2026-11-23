import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login1 } from '@tc96/blocks/auth/login-1'
import { authLogo, authProviders } from '../fixtures/auth-data'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '900px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Auth/Login/Login1/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login1
      error="E-mail ou senha incorretos."
      forgotPasswordHref="/forgot-password"
      logo={authLogo}
      onProviderSelect={ignore}
      onSubmit={ignore}
      providers={authProviders}
      signupHref="/signup"
    />
  ),
}
