import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login3 } from '@tc96/blocks/auth/login-3'
import { testimonial } from './login-3-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '700px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Auth/Login/Login3/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login3
      aside={testimonial}
      error="E-mail ou senha incorretos."
      onSubmit={ignore}
    />
  ),
}
