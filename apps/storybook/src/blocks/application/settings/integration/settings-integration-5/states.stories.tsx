import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsIntegration5Controls,
  settingsIntegration5ControlArgs,
} from './settings-integration-5-controls.ts'
import { ComposedSettingsIntegration5 } from './settings-integration-5-layouts.tsx'

const meta = {
  args: { ...settingsIntegration5ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings5/States',
} satisfies Meta<
  SettingsIntegration5Controls & {
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
