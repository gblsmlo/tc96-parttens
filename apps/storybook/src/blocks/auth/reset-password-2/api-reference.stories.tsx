import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword2 } from '@tc96/blocks/auth/reset-password-2'
import { fn } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'

const meta = {
  args: {
    expiresIn: 581,
    loginHref: '/login',
    logo: authLogo,
    onRequestNewLink: fn(),
    onSubmit: fn(),
  },
  component: ResetPassword2,
  parameters: {
    docs: { story: { iframeHeight: '48rem', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Auth/ResetPassword2/API Reference',
} satisfies Meta<typeof ResetPassword2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
