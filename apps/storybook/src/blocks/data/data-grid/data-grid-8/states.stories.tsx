import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid8 } from '@tc96/ui/blocks/data/data-grid/data-grid-8'
import { expect, fn, within } from 'storybook/test'
import { dataGrid8TotalCount, transactions } from '../fixtures/data-grid-8.ts'

const meta = {
  args: {
    onRetry: fn(),
    totalCount: dataGrid8TotalCount,
    transactions,
  },
  component: DataGrid8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid8/States',
} satisfies Meta<typeof DataGrid8>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid')).toBeVisible()
  },
}

export const Selected: Story = {
  args: {
    onFlag: fn(),
    onRefund: fn(),
    selectedIds: transactions.slice(0, 2).map((transaction) => transaction.id),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('toolbar', {
        name: 'Ações das transações selecionadas',
      }),
    ).toHaveTextContent(/2 selecionadas · Total de/)
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando transações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('heading', { name: 'Transações' }),
    ).toBeVisible()
  },
}

export const LoadingMore: Story = {
  args: { hasMore: true, loadingMore: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid')).toHaveAttribute(
      'aria-busy',
      'true',
    )
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as transações'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Transações' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { totalCount: 0, transactions: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma transação para exibir.'),
    ).toBeVisible()
  },
}
