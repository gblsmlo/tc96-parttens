import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog7 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-7'
import { fn } from 'storybook/test'
import { settingsCatalog7Data } from '../../fixtures/settings-catalog-7.ts'

const meta = {
  args: {
    allowCustomReason: settingsCatalog7Data.allowCustomReason,
    archivedReasons: settingsCatalog7Data.archivedReasons,
    onAllowCustomReasonChange: fn(),
    onCreate: fn(),
    onReasonAction: fn(),
    onRequireReasonChange: fn(),
    reasons: settingsCatalog7Data.reasons,
    requireReason: settingsCatalog7Data.requireReason,
  },
  component: SettingsCatalog7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings7/API Reference',
} satisfies Meta<typeof SettingsCatalog7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
