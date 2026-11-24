import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table4 } from '@tc96/ui/blocks/data/table/table-4'
import { fn } from 'storybook/test'
import { products, rowActions } from '../fixtures/table-4.ts'

const meta = {
  args: {
    drafts: { 'prd-1042': { price: 94.9 } },
    onAdd: fn(),
    onDiscard: fn(),
    onDraftsChange: fn(),
    onRowAction: fn(),
    onSave: fn(),
    onVisibleChange: fn(),
    products,
    rowActions,
  },
  component: Table4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table4/API Reference',
} satisfies Meta<typeof Table4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
