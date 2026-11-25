import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support4 } from '@tc96/ui/blocks/data/support/support-4'
import { fn } from 'storybook/test'
import { rowActions, rules } from '../fixtures/support-4.ts'

const meta = {
  args: {
    onEnabledChange: fn(),
    onResetOrder: fn(),
    onRowAction: fn(),
    onRuleMove: fn(),
    rowActions,
    rules,
  },
  component: Support4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Support/Support4/API Reference',
} satisfies Meta<typeof Support4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
