'use client'

import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { useMemo } from 'react'
import { DataCollectionTitleCell } from '../../shared/collection/data-collection-record-parts'
import { Finance3Amount } from './finance-3-fields'
import {
  createFinance3Formatter,
  defaultFinance3Locale,
  type Finance3Formatter,
} from './finance-3-format'
import { Finance3Frame } from './finance-3-frame'
import { Finance3Toolbar } from './finance-3-toolbar'
import type {
  Finance3ClientBalance,
  Finance3ClientMoneyProps,
  Finance3Labels,
} from './types'
import { useFinance3Table } from './use-finance-3-table'

const balanceId = (item: Finance3ClientBalance) => item.id
const balanceTitle = (item: Finance3ClientBalance) => item.name

function createFinance3ClientMoneyColumns(
  format: Finance3Formatter,
  labels: Finance3Labels,
): DataTableColumnDef<Finance3ClientBalance>[] {
  const { columns } = labels.clientMoney
  return [
    {
      accessorFn: (item) => item.name,
      cell: ({ row }) => <DataCollectionTitleCell title={row.original.name} />,
      header: columns.name,
      id: 'name',
      meta: { label: columns.name },
      size: 360,
    },
    {
      accessorFn: (item) => item.amount,
      cell: ({ row }) => (
        <Finance3Amount cents={row.original.amount} format={format} />
      ),
      header: columns.amount,
      id: 'amount',
      meta: { align: 'end', label: columns.amount },
      size: 180,
    },
  ]
}

export function Finance3ClientMoney({
  className,
  currency,
  error,
  labels,
  locale = defaultFinance3Locale,
  onOpen,
  onPageChange,
  onRetry,
  page,
  pageCount,
  pageSize,
  pending,
  records,
  total,
}: Readonly<
  Omit<Finance3ClientMoneyProps, 'labels'> & { labels: Finance3Labels }
>) {
  const format = useMemo(
    () => createFinance3Formatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createFinance3ClientMoneyColumns(format, labels),
    [format, labels],
  )
  const table = useFinance3Table<Finance3ClientBalance>({
    columns,
    getId: balanceId,
    records,
    selectable: false,
  })

  return (
    <Finance3Frame<Finance3ClientBalance>
      className={className}
      emptyMessage={labels.clientMoney.empty}
      error={error}
      getId={balanceId}
      getTitle={balanceTitle}
      labels={labels}
      onOpen={onOpen ? (item) => onOpen(item.id) : undefined}
      onPageChange={onPageChange}
      onRetry={onRetry}
      page={page}
      pageCount={pageCount}
      pageSize={pageSize}
      pending={pending}
      records={records}
      table={table}
      toolbar={(loading) => (
        <Finance3Toolbar
          labels={labels}
          loading={loading}
          variantLabels={labels.clientMoney}
        />
      )}
      total={total}
      variant="clientMoney"
      variantLabels={labels.clientMoney}
    />
  )
}
