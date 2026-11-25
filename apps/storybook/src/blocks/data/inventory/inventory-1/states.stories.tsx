import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inventory1 } from '@tc96/ui/blocks/data/inventory/inventory-1'
import { expect, fn, within } from 'storybook/test'
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid')).toBeVisible()
  },
}

export const Unsaved: Story = {
  args: {
    drafts: { 'prd-1042': { price: 94.9 }, 'prd-3381': { stock: 12 } },
    onDiscard: fn(),
    onDraftsChange: fn(),
    onSave: fn(),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('2 alterações não salvas'),
    ).toBeVisible()
  },
}

export const ServerErrors: Story = {
  args: {
    cellErrors: { 'prd-3502': { price: 'Preço abaixo do custo.' } },
    onDraftsChange: fn(),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Preço abaixo do custo.'),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando produtos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Inventário de produtos' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os produtos'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Inventário de produtos' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { products: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum produto para exibir.'),
    ).toBeVisible()
  },
}
