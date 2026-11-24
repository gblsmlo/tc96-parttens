import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login5 } from '@tc96/ui/blocks/application/auth/login-5'
import { loginMethods } from './login-5-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '650px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Login/Login5/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login5 methods={loginMethods} onMethod={ignore} onSubmit={ignore} />
  ),
}

export const AnatomyEmail: Story = {
  render: () => (
    <Login5
      method="email"
      methods={loginMethods}
      onMethod={ignore}
      onMethodChange={ignore}
      onSubmit={ignore}
    />
  ),
}
