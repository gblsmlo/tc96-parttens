import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsCatalog3Controls,
  settingsCatalog3ControlArgs,
} from './settings-catalog-3-controls.ts'
import { ComposedSettingsCatalog3 } from './settings-catalog-3-layouts.tsx'

const meta = {
  args: { ...settingsCatalog3ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings3/States',
} satisfies Meta<
  SettingsCatalog3Controls & {
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
