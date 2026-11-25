import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog10 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-10'
import { fn } from 'storybook/test'
import {
  settingsCatalog10ArchivedCostCenters,
  settingsCatalog10CostCenters,
} from '../../fixtures/settings-catalog-10.ts'

const meta = {
  args: {
    archivedCostCenters: settingsCatalog10ArchivedCostCenters,
    costCenters: settingsCatalog10CostCenters,
    onCostCenterAction: fn(),
    onCreate: fn(),
  },
  component: SettingsCatalog10,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings10/API Reference',
} satisfies Meta<typeof SettingsCatalog10>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
