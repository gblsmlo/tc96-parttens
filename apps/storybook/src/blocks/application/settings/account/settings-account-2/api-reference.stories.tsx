import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsAccount2 } from '@tc96/ui/blocks/application/settings/account/settings-account-2'
import { fn } from 'storybook/test'
import {
  settingsAccount2Invoices,
  settingsAccount2Plan,
  settingsAccount2Usage,
} from '../../fixtures/settings-account-2.ts'

const meta = {
  args: {
    invoices: settingsAccount2Invoices,
    onChangePlan: fn(),
    onDownload: fn(),
    plan: settingsAccount2Plan,
    usage: settingsAccount2Usage,
  },
  component: SettingsAccount2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Account/Settings2/API Reference',
} satisfies Meta<typeof SettingsAccount2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
