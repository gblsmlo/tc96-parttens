import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog3 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-3'
import { fn } from 'storybook/test'
import { rules } from '../../fixtures/settings-catalog-3.ts'

const meta = {
  args: { onCreate: fn(), onRuleAction: fn(), rules },
  component: SettingsCatalog3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings3/API Reference',
} satisfies Meta<typeof SettingsCatalog3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
