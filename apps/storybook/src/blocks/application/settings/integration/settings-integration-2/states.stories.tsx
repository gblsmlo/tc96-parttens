import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsIntegration2Controls,
  settingsIntegration2ControlArgs,
} from './settings-integration-2-controls.ts'
import { ComposedSettingsIntegration2 } from './settings-integration-2-layouts.tsx'

const meta = {
  args: { ...settingsIntegration2ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings2/States',
} satisfies Meta<
  SettingsIntegration2Controls & {
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
