import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsCatalog8Controls,
  settingsCatalog8ControlArgs,
} from './settings-catalog-8-controls.ts'
import { ComposedSettingsCatalog8 } from './settings-catalog-8-layouts.tsx'

const meta = {
  args: { ...settingsCatalog8ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings8/States',
} satisfies Meta<
  SettingsCatalog8Controls & {
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
