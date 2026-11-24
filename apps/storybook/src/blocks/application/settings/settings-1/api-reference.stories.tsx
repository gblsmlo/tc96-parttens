import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings1 } from '@tc96/blocks/application/settings/settings-1'
import { fn } from 'storybook/test'
import { settings1Account } from '../fixtures/settings-1.ts'

const meta = {
  args: {
    ...settings1Account,
    onDeleteAccount: fn(),
    onEmailSubmit: fn(),
    onFieldCommit: fn(),
    onSignOutEverywhere: fn(),
    onUploadAvatar: fn(),
  },
  component: Settings1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings1/API Reference',
} satisfies Meta<typeof Settings1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
