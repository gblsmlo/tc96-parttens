import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword1 } from '@tc96/blocks/application/auth/reset-password-1'
import { fn } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onSubmit: fn(),
  },
  component: ResetPassword1,
  parameters: {
    docs: { story: { iframeHeight: '48rem', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/ResetPassword1/API Reference',
} satisfies Meta<typeof ResetPassword1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
