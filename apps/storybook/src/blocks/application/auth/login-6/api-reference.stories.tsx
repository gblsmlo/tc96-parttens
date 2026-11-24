import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login6 } from '@tc96/ui/blocks/application/auth/login-6'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { gradientMedia } from './login-6-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '700px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Login/Login6/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login6
      error="E-mail ou senha incorretos."
      forgotPasswordHref="/forgot-password"
      media={gradientMedia}
      logo={authLogo}
      onSubmit={ignore}
      providers={authProviders}
      signupHref="/signup"
    />
  ),
}
