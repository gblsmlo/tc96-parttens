import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsAccount2Controls,
  settingsAccount2ControlArgs,
} from './settings-account-2-controls.ts'
import { ComposedSettingsAccount2 } from './settings-account-2-layouts.tsx'

const meta = {
  args: { ...settingsAccount2ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsAccount2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Account/Settings2/States',
} satisfies Meta<
  SettingsAccount2Controls & {
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
  args: { emptyInvoices: true },
}
