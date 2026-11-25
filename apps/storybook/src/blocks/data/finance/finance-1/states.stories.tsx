import type { Meta, StoryObj } from '@storybook/react-vite'
import { Finance1 } from '@tc96/ui/blocks/data/finance/finance-1'
import { expect, fn, within } from 'storybook/test'
import { finance1TotalCount, transactions } from '../fixtures/finance-1.ts'

const meta = {
  args: {
    onRetry: fn(),
    totalCount: finance1TotalCount,
    transactions,
  },
  component: Finance1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance1/States',
} satisfies Meta<typeof Finance1>

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
