import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsCatalog4Controls,
  settingsCatalog4ControlArgs,
} from './settings-catalog-4-controls.ts'
import { ComposedSettingsCatalog4 } from './settings-catalog-4-layouts.tsx'

const meta = {
  args: { ...settingsCatalog4ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings4/States',
} satisfies Meta<
  SettingsCatalog4Controls & {
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
