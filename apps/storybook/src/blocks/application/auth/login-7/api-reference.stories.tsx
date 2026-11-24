import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login7 } from '@tc96/blocks/application/auth/login-7'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { footerLinks } from './login-7-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '700px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Login/Login7/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login7
      error="E-mail ou senha incorretos."
      forgotPasswordHref="/forgot-password"
      footerLinks={footerLinks}
      logo={authLogo}
      onSubmit={ignore}
      providers={authProviders}
      signupHref="/signup"
    />
  ),
}
