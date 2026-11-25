import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog6 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-6'
import { fn } from 'storybook/test'
import { settingsCatalog6Data } from '../../fixtures/settings-catalog-6.ts'

const meta = {
  args: {
    blockStageChanges: settingsCatalog6Data.blockStageChanges,
    onBlockStageChangesChange: fn(),
    onCreate: fn(),
    onNextActionAction: fn(),
    onRequiredChange: fn(),
    stages: settingsCatalog6Data.stages,
  },
  component: SettingsCatalog6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings6/API Reference',
} satisfies Meta<typeof SettingsCatalog6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
