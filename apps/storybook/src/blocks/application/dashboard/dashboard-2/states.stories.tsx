import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard2 } from '@tc96/ui/blocks/application/dashboard/dashboard-2'
import { expect, fn, within } from 'storybook/test'
import {
  channels,
  initialSort,
  kpis,
  orders,
  sales,
} from '../fixtures/dashboard-2.ts'
import { breadcrumbsFor, periodOptions } from '../fixtures/shared.ts'

const meta = {
  args: {
    breadcrumbs: breadcrumbsFor('Receita do varejo'),
    channels,
    kpis,
    onExport: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
    onSortChange: fn(),
    orders,
    period: '7d',
    periodOptions,
    sales,
    sort: initialSort,
  },
  component: Dashboard2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard2/States',
} satisfies Meta<typeof Dashboard2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Pedidos recentes' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando receita do varejo'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar as vendas'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { kpis: [], orders: [], sales: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma venda registrada'),
    ).toBeVisible()
  },
}
