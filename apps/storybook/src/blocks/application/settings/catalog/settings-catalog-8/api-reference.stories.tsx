import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog8 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-8'
import { fn } from 'storybook/test'
import {
  settingsCatalog8Accounts,
  settingsCatalog8ArchivedAccounts,
  settingsCatalog8DefaultAccountId,
} from '../../fixtures/settings-catalog-8.ts'

const meta = {
  args: {
    accounts: settingsCatalog8Accounts,
    archivedAccounts: settingsCatalog8ArchivedAccounts,
    defaultAccountId: settingsCatalog8DefaultAccountId,
    onAccountAction: fn(),
    onCreate: fn(),
  },
  component: SettingsCatalog8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings8/API Reference',
} satisfies Meta<typeof SettingsCatalog8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
