import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsPreference3Controls,
  settingsPreference3ControlArgs,
} from './settings-preference-3-controls.ts'
import { ComposedSettingsPreference3 } from './settings-preference-3-layouts.tsx'

const meta = {
  args: { ...settingsPreference3ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsPreference3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Preference/Settings3/States',
} satisfies Meta<
  SettingsPreference3Controls & {
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
