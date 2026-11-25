import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsWorkspace2Controls,
  settingsWorkspace2ControlArgs,
} from './settings-workspace-2-controls.ts'
import { ComposedSettingsWorkspace2 } from './settings-workspace-2-layouts.tsx'

const meta = {
  args: { ...settingsWorkspace2ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsWorkspace2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Workspace/Settings2/States',
} satisfies Meta<
  SettingsWorkspace2Controls & {
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
