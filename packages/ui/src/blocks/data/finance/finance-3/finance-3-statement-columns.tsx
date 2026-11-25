import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { DataCollectionTitleCell } from '../../shared/collection/data-collection-record-parts'
import { Finance3Amount, Finance3TextField } from './finance-3-fields'
import {
  type Finance3Formatter,
  finance3SignDirection,
} from './finance-3-format'
import type {
  Finance3Labels,
  Finance3StatementColumnId,
  Finance3StatementLine,
  Finance3StatementSummary,
} from './types'

export interface Finance3StatementContext {
  format: Finance3Formatter
  labels: Finance3Labels
  summary?: Finance3StatementSummary
}

export function finance3StatementKindLabel(
  labels: Finance3Labels,
  line: Finance3StatementLine,
): string {
  const statementLabels = labels.statement
  if (line.kind === 'settlement' && line.amount > 0)
    return statementLabels.inflow
  if (line.kind === 'settlement' && line.amount < 0)
    return statementLabels.outflow
  return statementLabels.kinds[line.kind]
}

export function createFinance3StatementColumns({
  format,
  labels,
  summary,
}: Finance3StatementContext): DataTableColumnDef<Finance3StatementLine>[] {
  const statementLabels = labels.statement
  const column = (id: Finance3StatementColumnId) => ({
    header: statementLabels.columns[id],
    id,
    meta: { label: statementLabels.columns[id] },
  })
  const text =
    (
      id: Finance3StatementColumnId,
      read: (line: Finance3StatementLine) => string | null,
    ) =>
    ({ row }: { row: { original: Finance3StatementLine } }) => (
      <Finance3TextField
        ariaLabel={statementLabels.columns[id]}
        fallback={labels.noValue}
        value={read(row.original)}
      />
    )

  return [
    {
      ...column('day'),
      accessorFn: (line) => line.day,
      cell: ({ row }) => (
        <span className="tabular-nums">{format.day(row.original.day)}</span>
      ),
      size: 120,
    },
    {
      ...column('description'),
      accessorFn: (line) => line.description,
      cell: ({ row }) => (
        <DataCollectionTitleCell title={row.original.description} />
      ),
      size: 300,
    },
    {
      ...column('kind'),
      accessorFn: (line) => line.kind,
      cell: text('kind', (line) => finance3StatementKindLabel(labels, line)),
      size: 190,
    },
    {
      ...column('counterpartAccount'),
      accessorFn: (line) => line.counterpartAccount,
      cell: text('counterpartAccount', (line) => line.counterpartAccount),
      size: 170,
    },
    {
      ...column('category'),
      accessorFn: (line) => line.category,
      cell: text('category', (line) => line.category),
      size: 170,
    },
    {
      ...column('reason'),
      accessorFn: (line) => line.reason,
      cell: text('reason', (line) => line.reason),
      size: 200,
    },
    {
      ...column('amount'),
      accessorFn: (line) => line.amount,
      cell: ({ row }) => (
        <Finance3Amount
          cents={row.original.amount}
          direction={
            row.original.kind === 'opening'
              ? 'none'
              : finance3SignDirection(row.original.amount)
          }
          format={format}
        />
      ),
      meta: { align: 'end', label: statementLabels.columns.amount },
      size: 150,
    },
    {
      ...column('balance'),
      accessorFn: (line) => line.balance,
      cell: ({ row }) => (
        <Finance3Amount cents={row.original.balance} format={format} />
      ),
      footer: summary
        ? () => (
            <span
              className="flex items-center justify-end gap-1.5"
              data-slot="finance-3-closing-balance"
            >
              <span className="font-normal text-muted-foreground">
                {statementLabels.closingBalance}
              </span>
              <Finance3Amount cents={summary.closingBalance} format={format} />
            </span>
          )
        : undefined,
      meta: { align: 'end', label: statementLabels.columns.balance },
      size: 220,
    },
  ]
}
