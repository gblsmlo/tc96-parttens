import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsCatalog2Controls,
  settingsCatalog2ControlArgs,
} from './settings-catalog-2-controls.ts'
import { ComposedSettingsCatalog2 } from './settings-catalog-2-layouts.tsx'

const meta = {
  args: { ...settingsCatalog2ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings2/States',
} satisfies Meta<
  SettingsCatalog2Controls & {
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
