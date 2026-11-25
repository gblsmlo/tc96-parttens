import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsNotificationChannel1Controls,
  settingsNotificationChannel1ControlArgs,
  settingsNotificationChannel1ControlArgTypes,
} from './settings-notification-channel-1-controls.ts'
import { ComposedSettingsNotificationChannel1 } from './settings-notification-channel-1-layouts.tsx'

const meta = {
  args: settingsNotificationChannel1ControlArgs,
  argTypes: settingsNotificationChannel1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsNotificationChannel1 {...args} />,
  tags: ['!autodocs'],
  title:
    'Blocks/Application/Settings/Notification Channel/Settings1/Playground',
} satisfies Meta<SettingsNotificationChannel1Controls>

export default meta

type Story = StoryObj<SettingsNotificationChannel1Controls>

export const Playground: Story = {}
