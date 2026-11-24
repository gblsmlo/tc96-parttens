import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings14 } from '@tc96/ui/blocks/application/settings/settings-14'
import { fn } from 'storybook/test'
import {
  settings14Accounts,
  settings14ArchivedAccounts,
  settings14DefaultAccountId,
} from '../fixtures/settings-14.ts'

const meta = {
  args: {
    accounts: settings14Accounts,
    archivedAccounts: settings14ArchivedAccounts,
    defaultAccountId: settings14DefaultAccountId,
    onAccountAction: fn(),
    onCreate: fn(),
  },
  component: Settings14,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings14/API Reference',
} satisfies Meta<typeof Settings14>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
