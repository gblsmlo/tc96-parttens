import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog2 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-2'
import { fn } from 'storybook/test'

const meta = {
  args: { enabled: true, onEnabledChange: fn() },
  component: SettingsCatalog2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings2/API Reference',
} satisfies Meta<typeof SettingsCatalog2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
