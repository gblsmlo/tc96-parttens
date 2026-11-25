import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inventory2 } from '@tc96/ui/blocks/data/inventory/inventory-2'
import { fn } from 'storybook/test'
import { products, rowActions } from '../fixtures/inventory-2.ts'

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
  component: Inventory2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Inventory/Inventory2/API Reference',
} satisfies Meta<typeof Inventory2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
