import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword1 } from '@tc96/blocks/application/auth/forgot-password-1'
import { fn } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'

const meta = {
  args: {
    destination: 'ana@acme.com',
    loginHref: '/login',
    logo: authLogo,
    onResend: fn(),
    onSubmit: fn(),
  },
  component: ForgotPassword1,
  parameters: {
    docs: { story: { iframeHeight: '640px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/ForgotPassword1/API Reference',
} satisfies Meta<typeof ForgotPassword1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
