import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup6 } from '@tc96/ui/blocks/application/auth/signup-6'
import { fn } from 'storybook/test'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const meta = {
  args: {
    error: '',
    logo: authLogo,
    media: gradientMedia,
    onSubmit: fn(),
    pending: false,
    showProviders: true,
  },
  argTypes: {
    error: { control: 'text' },
    logo: { control: false },
    media: { control: false },
    pending: { control: 'boolean' },
    showProviders: { control: 'boolean' },
  },
  component: Signup6,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <Signup6
      {...args}
      loginHref="/login"
      privacyHref="/privacy"
      termsHref="/terms"
      providers={authProviders}
      error={args.error || undefined}
    />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register6/Playground',
} satisfies Meta<typeof Signup6>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
