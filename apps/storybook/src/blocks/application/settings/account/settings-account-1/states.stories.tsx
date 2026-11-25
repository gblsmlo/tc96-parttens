import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsAccount1Controls,
  settingsAccount1ControlArgs,
} from './settings-account-1-controls.ts'
import { ComposedSettingsAccount1 } from './settings-account-1-layouts.tsx'

const meta = {
  args: { ...settingsAccount1ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsAccount1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Account/Settings1/States',
} satisfies Meta<
  SettingsAccount1Controls & {
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
