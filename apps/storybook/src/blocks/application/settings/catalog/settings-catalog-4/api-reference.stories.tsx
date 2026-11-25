import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog4 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-4'
import { fn } from 'storybook/test'
import { phases, stages } from '../../fixtures/settings-catalog-4.ts'

const meta = {
  args: { onStageAction: fn(), onStageCreate: fn(), phases, stages },
  component: SettingsCatalog4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings4/API Reference',
} satisfies Meta<typeof SettingsCatalog4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
