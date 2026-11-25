import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsAccount1 } from '@tc96/ui/blocks/application/settings/account/settings-account-1'
import { fn } from 'storybook/test'
import { settingsAccount1Account } from '../../fixtures/settings-account-1.ts'

const meta = {
  args: {
    ...settingsAccount1Account,
    onDeleteAccount: fn(),
    onEmailSubmit: fn(),
    onFieldCommit: fn(),
    onSignOutEverywhere: fn(),
    onUploadAvatar: fn(),
  },
  component: SettingsAccount1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Account/Settings1/API Reference',
} satisfies Meta<typeof SettingsAccount1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
