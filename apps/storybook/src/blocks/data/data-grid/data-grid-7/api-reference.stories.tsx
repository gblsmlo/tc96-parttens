import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid7 } from '@tc96/ui/blocks/data/data-grid/data-grid-7'
import { fn } from 'storybook/test'
import { rowActions, rules } from '../fixtures/data-grid-7.ts'

const meta = {
  args: {
    onEnabledChange: fn(),
    onResetOrder: fn(),
    onRowAction: fn(),
    onRuleMove: fn(),
    rowActions,
    rules,
  },
  component: DataGrid7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid7/API Reference',
} satisfies Meta<typeof DataGrid7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
