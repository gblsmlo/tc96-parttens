import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsWorkspace1Controls,
  settingsWorkspace1ControlArgs,
} from './settings-workspace-1-controls.ts'
import { ComposedSettingsWorkspace1 } from './settings-workspace-1-layouts.tsx'

const meta = {
  args: { ...settingsWorkspace1ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsWorkspace1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Workspace/Settings1/States',
} satisfies Meta<
  SettingsWorkspace1Controls & {
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
