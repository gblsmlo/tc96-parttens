import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsPreference1Controls,
  settingsPreference1ControlArgs,
} from './settings-preference-1-controls.ts'
import { ComposedSettingsPreference1 } from './settings-preference-1-layouts.tsx'

const meta = {
  args: { ...settingsPreference1ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsPreference1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Preference/Settings1/States',
} satisfies Meta<
  SettingsPreference1Controls & {
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
