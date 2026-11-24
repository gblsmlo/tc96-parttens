import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login2 } from '@tc96/blocks/application/auth/login-2'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '700px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Login/Login2/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login2 error="E-mail ou senha incorretos." onSubmit={ignore} />
  ),
}
