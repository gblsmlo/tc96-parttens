import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsNotificationChannel1 } from '@tc96/ui/blocks/application/settings/notification-channel/settings-notification-channel-1'
import { fn } from 'storybook/test'
import {
  settingsNotificationChannel1Categories,
  settingsNotificationChannel1Channels,
  settingsNotificationChannel1Matrix,
} from '../../fixtures/settings-notification-channel-1.ts'

const meta = {
  args: {
    categories: settingsNotificationChannel1Categories,
    channels: settingsNotificationChannel1Channels,
    matrix: settingsNotificationChannel1Matrix,
    onChange: fn(),
  },
  component: SettingsNotificationChannel1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title:
    'Blocks/Application/Settings/Notification Channel/Settings1/API Reference',
} satisfies Meta<typeof SettingsNotificationChannel1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
