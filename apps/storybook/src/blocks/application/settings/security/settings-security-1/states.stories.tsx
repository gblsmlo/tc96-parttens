import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsSecurity1Controls,
  settingsSecurity1ControlArgs,
} from './settings-security-1-controls.ts'
import { ComposedSettingsSecurity1 } from './settings-security-1-layouts.tsx'

const meta = {
  args: { ...settingsSecurity1ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsSecurity1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Security/Settings1/States',
} satisfies Meta<
  SettingsSecurity1Controls & {
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
