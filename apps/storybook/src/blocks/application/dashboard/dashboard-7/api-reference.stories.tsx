import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard7 } from '@tc96/ui/blocks/application/dashboard/dashboard-7'
import { fn } from 'storybook/test'
import {
  accountBalances,
  accountOptions,
  balances,
  cashFlow,
  cashFlowGrid,
  cashFlowTotals,
  clientMoney,
  dueSoon,
  expenseByCategory,
  financePeriodOptions,
  incomeByCategory,
  indicators,
  receivables,
} from '../fixtures/dashboard-7.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'

const meta = {
  args: {
    account: 'all',
    accountBalances,
    accountOptions,
    balances,
    breadcrumbs: breadcrumbsFor('Analítico financeiro'),
    cashFlow,
    cashFlowGrid,
    cashFlowTotals,
    categoryKind: 'income',
    clientMoney: clientMoney.slice(0, 3),
    clientMoneyPagination: { page: 1, pageCount: 2 },
    dueSoon,
    expenseByCategory,
    incomeByCategory,
    indicators,
    onAccountChange: fn(),
    onCategoryKindChange: fn(),
    onCellSelect: fn(),
    onClientMoneyPageChange: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
    period: 'year',
    periodOptions: financePeriodOptions,
    receivables,
    timeZone: 'America/Sao_Paulo',
  },
  component: Dashboard7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Dashboard/Dashboard7/API Reference',
} satisfies Meta<typeof Dashboard7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
