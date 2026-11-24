import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login4 } from '@tc96/blocks/auth/login-4'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '600px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Auth/Login/Login4/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => <Login4 onSubmit={ignore} />,
}

export const AnatomySent: Story = {
  render: () => (
    <Login4
      destination="ana@acme.com"
      onResend={ignore}
      onSubmit={ignore}
      sent
    />
  ),
}
