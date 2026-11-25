import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsIntegration8Controls,
  settingsIntegration8ControlArgs,
} from './settings-integration-8-controls.ts'
import { ComposedSettingsIntegration8 } from './settings-integration-8-layouts.tsx'

const meta = {
  args: { ...settingsIntegration8ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings8/States',
} satisfies Meta<
  SettingsIntegration8Controls & {
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
