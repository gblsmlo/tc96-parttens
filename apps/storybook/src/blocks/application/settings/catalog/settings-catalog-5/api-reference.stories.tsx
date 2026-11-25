import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog5 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-5'
import { fn } from 'storybook/test'
import { settingsCatalog5Groups } from '../../fixtures/settings-catalog-5.ts'

const meta = {
  args: {
    groups: settingsCatalog5Groups,
    onCreate: fn(),
    onStatusAction: fn(),
  },
  component: SettingsCatalog5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings5/API Reference',
} satisfies Meta<typeof SettingsCatalog5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
