import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings13 } from '@tc96/blocks/application/settings/settings-13'
import { fn } from 'storybook/test'
import { settings13Data } from '../fixtures/settings-13.ts'

const meta = {
  args: {
    allowCustomReason: settings13Data.allowCustomReason,
    archivedReasons: settings13Data.archivedReasons,
    onAllowCustomReasonChange: fn(),
    onCreate: fn(),
    onReasonAction: fn(),
    onRequireReasonChange: fn(),
    reasons: settings13Data.reasons,
    requireReason: settings13Data.requireReason,
  },
  component: Settings13,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings13/API Reference',
} satisfies Meta<typeof Settings13>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
