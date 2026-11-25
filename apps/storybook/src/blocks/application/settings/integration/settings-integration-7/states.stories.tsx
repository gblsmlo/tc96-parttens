import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsIntegration7Controls,
  settingsIntegration7ControlArgs,
} from './settings-integration-7-controls.ts'
import { ComposedSettingsIntegration7 } from './settings-integration-7-layouts.tsx'

const meta = {
  args: { ...settingsIntegration7ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings7/States',
} satisfies Meta<
  SettingsIntegration7Controls & {
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
