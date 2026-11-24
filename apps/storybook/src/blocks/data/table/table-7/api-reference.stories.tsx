import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table7 } from '@tc96/ui/blocks/data/table/table-7'
import { fn } from 'storybook/test'
import { rowActions, rules } from '../fixtures/table-7.ts'

const meta = {
  args: {
    onEnabledChange: fn(),
    onResetOrder: fn(),
    onRowAction: fn(),
    onRuleMove: fn(),
    rowActions,
    rules,
  },
  component: Table7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table7/API Reference',
} satisfies Meta<typeof Table7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
