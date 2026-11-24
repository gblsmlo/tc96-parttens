import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword6 } from '@tc96/ui/blocks/application/auth/reset-password-6'
import { fn } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const meta = {
  args: {
    error: '',
    logo: authLogo,
    media: gradientMedia,
    onSubmit: fn(),
    pending: false,
  },
  argTypes: {
    error: { control: 'text' },
    logo: { control: false },
    media: { control: false },
    pending: { control: 'boolean' },
  },
  component: ResetPassword6,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <ResetPassword6
      {...args}
      loginHref="/login"
      error={args.error || undefined}
    />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword/ResetPassword6/Playground',
} satisfies Meta<typeof ResetPassword6>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
