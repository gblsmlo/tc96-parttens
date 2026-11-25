import type { Meta, StoryObj } from '@storybook/react-vite'
import { login4ControlArgs } from './login-4-controls.ts'
import { ComposedLogin4 } from './login-4-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login4/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const RequestLink: Story = {
  render: () => <ComposedLogin4 {...login4ControlArgs} />,
}

export const LinkSent: Story = {
  render: () => <ComposedLogin4 {...login4ControlArgs} sent />,
}

export const ResendCountdown: Story = {
  render: () => <ComposedLogin4 {...login4ControlArgs} resendIn={30} sent />,
}
