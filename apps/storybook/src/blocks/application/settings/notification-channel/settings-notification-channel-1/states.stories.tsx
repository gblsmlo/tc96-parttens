import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsNotificationChannel1Controls,
  settingsNotificationChannel1ControlArgs,
} from './settings-notification-channel-1-controls.ts'
import { ComposedSettingsNotificationChannel1 } from './settings-notification-channel-1-layouts.tsx'

const meta = {
  args: { ...settingsNotificationChannel1ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsNotificationChannel1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Notification Channel/Settings1/States',
} satisfies Meta<
  SettingsNotificationChannel1Controls & {
    error?: boolean
    onRetry: () => void
    pending?: boolean
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { empty: true },
}
