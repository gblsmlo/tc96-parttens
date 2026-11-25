import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsRolePermission1Controls,
  settingsRolePermission1ControlArgs,
} from './settings-role-permission-1-controls.ts'
import { ComposedSettingsRolePermission1 } from './settings-role-permission-1-layouts.tsx'

const meta = {
  args: { ...settingsRolePermission1ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsRolePermission1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Role Permission/Settings1/States',
} satisfies Meta<
  SettingsRolePermission1Controls & {
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
