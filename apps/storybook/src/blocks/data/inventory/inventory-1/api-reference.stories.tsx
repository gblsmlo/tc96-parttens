import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inventory1 } from '@tc96/ui/blocks/data/inventory/inventory-1'
import { fn } from 'storybook/test'
import { products, rowActions } from '../fixtures/inventory-1.ts'

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
  component: Inventory1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Inventory/Inventory1/API Reference',
} satisfies Meta<typeof Inventory1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
