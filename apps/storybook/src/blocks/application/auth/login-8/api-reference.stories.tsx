import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login8 } from '@tc96/blocks/application/auth/login-8'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { login8Media } from './login-8-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '600px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Login/Login8/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login8
      logo={authLogo}
      media={login8Media}
      onSubmit={ignore}
      providers={authProviders}
    />
  ),
}
