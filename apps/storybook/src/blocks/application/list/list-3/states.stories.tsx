import type { Meta, StoryObj } from '@storybook/react-vite'
import { List3 } from '@tc96/blocks/application/list/list-3'
import { expect, fn, within } from 'storybook/test'
import { transactions } from '../fixtures/list-3.ts'

const meta = {
  args: { onPeriodChange: fn(), period: 'month', transactions, onRetry: fn() },
  component: List3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List3/States',
} satisfies Meta<typeof List3>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Transações' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando transações'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar as transações',
      ),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { transactions: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma transação no período'),
    ).toBeVisible()
  },
}
