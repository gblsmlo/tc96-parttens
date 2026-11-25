import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inventory1 } from '@tc96/ui/blocks/data/inventory/inventory-1'
import { fn } from 'storybook/test'
import { products } from '../fixtures/inventory-1.ts'

const meta = {
  args: { onRetry: fn(), products },
  component: Inventory1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Inventory/Inventory1/States',
} satisfies Meta<typeof Inventory1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Unsaved: Story = {
  args: {
    drafts: { 'prd-1042': { price: 94.9 }, 'prd-3381': { stock: 12 } },
    onDiscard: fn(),
    onDraftsChange: fn(),
    onSave: fn(),
  },
}

export const ServerErrors: Story = {
  args: {
    cellErrors: { 'prd-3502': { price: 'Preço abaixo do custo.' } },
    onDraftsChange: fn(),
  },
}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { products: [] },
}
