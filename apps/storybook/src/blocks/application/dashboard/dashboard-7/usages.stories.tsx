import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard7,
  type Dashboard7AccountBalance,
  type Dashboard7Balances,
  type Dashboard7CashFlowGrid,
  type Dashboard7CashFlowMonth,
  type Dashboard7CashFlowTotals,
  type Dashboard7Category,
  type Dashboard7CategoryKind,
  type Dashboard7ClientMoney,
  type Dashboard7Entry,
  type Dashboard7Indicators,
  type Dashboard7Receivables,
} from '@tc96/ui/blocks/application/dashboard/dashboard-7'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard7Handlers } from '../../../../mocks/dashboard-7.ts'
import {
  accountOptions,
  financePeriodOptions,
  initialAccount,
  initialFinancePeriod,
} from '../fixtures/dashboard-7.ts'
import { breadcrumbsFor, paginate } from '../fixtures/shared.ts'

interface FinanceData {
  accountBalances: Dashboard7AccountBalance[]
  balances?: Dashboard7Balances
  cashFlow: Dashboard7CashFlowMonth[]
  cashFlowGrid: Dashboard7CashFlowGrid
  cashFlowTotals?: Dashboard7CashFlowTotals
  clientMoney: Dashboard7ClientMoney[]
  dueSoon: Dashboard7Entry[]
  expenseByCategory: Dashboard7Category[]
  incomeByCategory: Dashboard7Category[]
  indicators: Dashboard7Indicators
  receivables?: Dashboard7Receivables
}

const FinanceDashboard = () => {
  const [period, setPeriod] = useState(initialFinancePeriod)
  const [account, setAccount] = useState(initialAccount)
  const [categoryKind, setCategoryKind] =
    useState<Dashboard7CategoryKind>('income')
  const [page, setPage] = useState(1)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<FinanceData>(
        `/dashboard/finance-analytics?period=${period}&account=${account}`,
      ),
    queryKey: ['dashboard', 'finance-analytics', period, account],
    retry: false,
  })
  const clients = paginate(data?.clientMoney ?? [], page, 3)

  return (
    <Dashboard7
      account={account}
      accountBalances={data?.accountBalances}
      accountOptions={accountOptions}
      balances={data?.balances}
      breadcrumbs={breadcrumbsFor('Analítico financeiro')}
      cashFlow={data?.cashFlow ?? []}
      cashFlowGrid={data?.cashFlowGrid}
      cashFlowTotals={data?.cashFlowTotals}
      categoryKind={categoryKind}
      clientMoney={clients.rows}
      clientMoneyPagination={clients.pagination}
      dueSoon={data?.dueSoon ?? []}
      error={isError}
      expenseByCategory={data?.expenseByCategory ?? []}
      incomeByCategory={data?.incomeByCategory ?? []}
      indicators={data?.indicators}
      onAccountChange={(next) => {
        setAccount(next)
        setPage(1)
      }}
      onCategoryKindChange={setCategoryKind}
      onClientMoneyPageChange={setPage}
      onPeriodChange={setPeriod}
      onRetry={() => refetch()}
      pending={isPending}
      period={period}
      periodOptions={financePeriodOptions}
      receivables={data?.receivables}
      timeZone="America/Sao_Paulo"
    />
  )
}

const meta = {
  component: FinanceDashboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Dashboard/Dashboard7/Usages',
} satisfies Meta<typeof FinanceDashboard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard7Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Honorários Silva')).toBeVisible()
    const group = canvas.getByRole('group', { name: 'Tipo de categoria' })
    await userEvent.click(
      within(group).getByRole('button', { name: 'Despesas' }),
    )
    await expect(
      await canvas.findByRole('img', { name: 'Despesa por categoria' }),
    ).toBeInTheDocument()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard7Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum lançamento no período'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard7Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar o analítico'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard7Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText(
        'Carregando o analítico financeiro',
      ),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
