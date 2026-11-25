import {
  Dashboard7,
  type Dashboard7CategoryKind,
  type Dashboard7Props,
} from '@tc96/ui/blocks/application/dashboard/dashboard-7'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import {
  accountBalances,
  accountOptions,
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
  initialAccount,
  initialFinancePeriod,
  receivables,
} from '../fixtures/dashboard-7.ts'
import { breadcrumbsFor, paginate } from '../fixtures/shared.ts'
import type { Dashboard7Controls } from './dashboard-7-controls.ts'

export const dashboard7PageSize = 3

interface ComposedDashboard7Props extends Dashboard7Controls {
  onAccountChange?: Dashboard7Props['onAccountChange']
  onCategoryKindChange?: Dashboard7Props['onCategoryKindChange']
  onCellSelect?: Dashboard7Props['onCellSelect']
  onClientMoneyPageChange?: Dashboard7Props['onClientMoneyPageChange']
  onPeriodChange?: Dashboard7Props['onPeriodChange']
  onRetry?: Dashboard7Props['onRetry']
}

export const ComposedDashboard7 = ({
  cellDrillDown,
  empty,
  error,
  filters,
  onAccountChange,
  onCategoryKindChange,
  onCellSelect,
  onClientMoneyPageChange,
  onPeriodChange,
  onRetry,
  pending,
  title,
}: Readonly<ComposedDashboard7Props>) => {
  const [period, setPeriod] = useState(initialFinancePeriod)
  const [account, setAccount] = useState(initialAccount)
  const [categoryKind, setCategoryKind] =
    useState<Dashboard7CategoryKind>('income')
  const [page, setPage] = useState(1)
  const data = empty
    ? emptyFinance
    : {
        accountBalances,
        balances,
        cashFlow,
        cashFlowGrid,
        cashFlowTotals,
        clientMoney,
        dueSoon,
        expenseByCategory,
        incomeByCategory,
        indicators,
        receivables,
      }
  const clients = paginate(data.clientMoney, page, dashboard7PageSize)

  return (
    <Dashboard7
      {...data}
      account={account}
      accountOptions={accountOptions}
      breadcrumbs={breadcrumbsFor(title)}
      categoryKind={categoryKind}
      clientMoney={clients.rows}
      clientMoneyPagination={clients.pagination}
      error={error}
      labels={{ title }}
      onAccountChange={
        filters
          ? (next) => {
              setAccount(next)
              onAccountChange?.(next)
            }
          : undefined
      }
      onCategoryKindChange={
        filters
          ? (next) => {
              setCategoryKind(next)
              onCategoryKindChange?.(next)
            }
          : undefined
      }
      onCellSelect={
        cellDrillDown
          ? (rowId, month) => onCellSelect?.(rowId, month)
          : undefined
      }
      onClientMoneyPageChange={(next) => {
        setPage(next)
        onClientMoneyPageChange?.(next)
      }}
      onPeriodChange={(next) => {
        setPeriod(next)
        onPeriodChange?.(next)
      }}
      onRetry={onRetry}
      pending={pending}
      period={period}
      periodOptions={financePeriodOptions}
      renderLink={renderAnchor}
      timeZone="America/Sao_Paulo"
    />
  )
}
