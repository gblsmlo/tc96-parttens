import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsIntegration3Controls,
  settingsIntegration3ControlArgs,
} from './settings-integration-3-controls.ts'
import { ComposedSettingsIntegration3 } from './settings-integration-3-layouts.tsx'

const meta = {
  args: { ...settingsIntegration3ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings3/States',
} satisfies Meta<
  SettingsIntegration3Controls & {
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
