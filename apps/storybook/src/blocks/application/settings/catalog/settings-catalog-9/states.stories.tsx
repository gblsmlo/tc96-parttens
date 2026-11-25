import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsCatalog9Controls,
  settingsCatalog9ControlArgs,
} from './settings-catalog-9-controls.ts'
import { ComposedSettingsCatalog9 } from './settings-catalog-9-layouts.tsx'

const meta = {
  args: { ...settingsCatalog9ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings9/States',
} satisfies Meta<
  SettingsCatalog9Controls & {
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
