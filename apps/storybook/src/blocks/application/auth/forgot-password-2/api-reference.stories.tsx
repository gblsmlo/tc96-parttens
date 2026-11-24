import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword2 } from '@tc96/blocks/application/auth/forgot-password-2'
import { fn } from 'storybook/test'

const meta = {
  args: { destination: 'ana@acme.com', onSubmit: fn() },
  component: ForgotPassword2,
  parameters: {
    docs: { story: { iframeHeight: '560px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/ForgotPassword/ForgotPassword2/API Reference',
} satisfies Meta<typeof ForgotPassword2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
