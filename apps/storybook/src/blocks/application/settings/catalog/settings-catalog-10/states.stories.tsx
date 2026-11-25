import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsCatalog10Controls,
  settingsCatalog10ControlArgs,
} from './settings-catalog-10-controls.ts'
import { ComposedSettingsCatalog10 } from './settings-catalog-10-layouts.tsx'

const meta = {
  args: { ...settingsCatalog10ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings10/States',
} satisfies Meta<
  SettingsCatalog10Controls & {
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
