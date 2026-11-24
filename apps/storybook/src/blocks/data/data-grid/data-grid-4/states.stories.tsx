import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid4 } from '@tc96/ui/blocks/data/data-grid/data-grid-4'
import { expect, fn, within } from 'storybook/test'
import { products } from '../fixtures/data-grid-4.ts'

const meta = {
  args: { onRetry: fn(), products },
  component: DataGrid4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid4/States',
} satisfies Meta<typeof DataGrid4>

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
