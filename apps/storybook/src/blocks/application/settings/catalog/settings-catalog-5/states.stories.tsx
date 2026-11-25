import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type SettingsCatalog5Controls,
  settingsCatalog5ControlArgs,
} from './settings-catalog-5-controls.ts'
import { ComposedSettingsCatalog5 } from './settings-catalog-5-layouts.tsx'

const meta = {
  args: { ...settingsCatalog5ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings5/States',
} satisfies Meta<
  SettingsCatalog5Controls & {
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
