import type { Meta, StoryObj } from '@storybook/react-vite'
import { MagicLink6 } from '@tc96/ui/blocks/application/auth/magic-link-6'
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
  component: MagicLink6,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <MagicLink6
      {...args}
      signupHref="/signup"
      providers={authProviders}
      error={args.error || undefined}
    />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/MagicLink/MagicLink6/Playground',
} satisfies Meta<typeof MagicLink6>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
