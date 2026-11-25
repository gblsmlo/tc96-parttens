import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog9 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-9'
import { fn } from 'storybook/test'
import {
  settingsCatalog9ArchivedCategories,
  settingsCatalog9Categories,
} from '../../fixtures/settings-catalog-9.ts'

const meta = {
  args: {
    archivedCategories: settingsCatalog9ArchivedCategories,
    categories: settingsCatalog9Categories,
    onCategoryAction: fn(),
    onCreate: fn(),
  },
  component: SettingsCatalog9,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings9/API Reference',
} satisfies Meta<typeof SettingsCatalog9>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
