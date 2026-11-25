import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard7 } from '@tc96/ui/blocks/application/dashboard/dashboard-7'
import { expect, fn, within } from 'storybook/test'
import {
  accountBalances,
  balances,
  cashFlow,
  cashFlowGrid,
  cashFlowTotals,
  clientMoney,
  dueSoon,
  emptyFinance,
  expenseByCategory,
  financePeriodOptions,
  incomeByCategory,
  indicators,
  receivables,
} from '../fixtures/dashboard-7.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'

const meta = {
  args: {
    accountBalances,
    balances,
    breadcrumbs: breadcrumbsFor('Analítico financeiro'),
    cashFlow,
    cashFlowGrid,
    cashFlowTotals,
    clientMoney,
    dueSoon,
    expenseByCategory,
    incomeByCategory,
    indicators,
    onPeriodChange: fn(),
    onRetry: fn(),
    period: 'year',
    periodOptions: financePeriodOptions,
    receivables,
    timeZone: 'America/Sao_Paulo',
  },
  component: Dashboard7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard7/States',
} satisfies Meta<typeof Dashboard7>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Fluxo de caixa' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando o analítico financeiro'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar o analítico'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: emptyFinance,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum lançamento no período'),
    ).toBeVisible()
  },
}
