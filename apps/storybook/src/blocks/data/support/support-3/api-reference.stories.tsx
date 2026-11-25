import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support3 } from '@tc96/ui/blocks/data/support/support-3'
import { fn } from 'storybook/test'
import { rowActions, rules } from '../fixtures/support-3.ts'

const meta = {
  args: {
    onEnabledChange: fn(),
    onResetOrder: fn(),
    onRowAction: fn(),
    onRuleMove: fn(),
    rowActions,
    rules,
  },
  component: Support3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Support/Support3/API Reference',
} satisfies Meta<typeof Support3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
