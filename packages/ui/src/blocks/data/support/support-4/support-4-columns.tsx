import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { createDataTableRowDragColumn } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-row-drag-column'
import type { TableFormatter } from '../../shared/table/format'
import {
  ClauseCell,
  EnabledCell,
  MatchesCell,
  RankCell,
  RowActionsCell,
  RuleCell,
  ScopeCell,
} from './support-4-cells'
import type {
  Support4ColumnId,
  Support4Labels,
  Support4RowAction,
  Support4Rule,
} from './types'

export interface Support4ColumnsInput {
  formatter: TableFormatter
  labels: Support4Labels
  onEnabledChange?: (ruleId: string, enabled: boolean) => void
  onRowAction?: (actionId: string, ruleId: string) => void
  rowActions?: Support4RowAction[]
}

export function createSupport4Columns({
  formatter,
  labels,
  onEnabledChange,
  onRowAction,
  rowActions,
}: Readonly<Support4ColumnsInput>): DataTableColumnDef<Support4Rule>[] {
  const title = (id: Support4ColumnId) => labels.columns[id]

  const columns: DataTableColumnDef<Support4Rule>[] = [
    createDataTableRowDragColumn<Support4Rule>({
      getHandleLabel: (rule) => labels.dragHandle(rule.name),
      headerLabel: title('drag'),
    }),
    {
      cell: ({ row }) => (
        <RankCell position={row.index + 1} rule={row.original} />
      ),
      enableResizing: false,
      header: title('rank'),
      id: 'rank',
      meta: { label: title('rank') },
      size: 56,
    },
    {
      accessorFn: (rule) => `${rule.name} ${rule.description}`,
      cell: ({ row }) => <RuleCell rule={row.original} />,
      enableHiding: false,
      header: title('rule'),
      id: 'rule',
      meta: { label: title('rule') },
      size: 280,
    },
    {
      accessorFn: (rule) => rule.scope.label,
      cell: ({ row }) => (
        <ScopeCell ariaLabel={title('scope')} rule={row.original} />
      ),
      header: title('scope'),
      id: 'scope',
      meta: { label: title('scope') },
      size: 130,
    },
    {
      accessorFn: (rule) => rule.condition,
      cell: ({ row }) => <ClauseCell kind="condition" rule={row.original} />,
      header: title('condition'),
      id: 'condition',
      meta: { label: title('condition') },
      size: 200,
    },
    {
      accessorFn: (rule) => rule.effect,
      cell: ({ row }) => <ClauseCell kind="effect" rule={row.original} />,
      header: title('effect'),
      id: 'effect',
      meta: { label: title('effect') },
      size: 200,
    },
    {
      accessorFn: (rule) => rule.matches,
      cell: ({ row }) => (
        <MatchesCell
          formatter={formatter}
          labels={labels}
          rule={row.original}
        />
      ),
      header: title('matches'),
      id: 'matches',
      meta: { label: title('matches') },
      size: 150,
    },
    {
      accessorFn: (rule) => rule.enabled,
      cell: ({ row }) => (
        <EnabledCell
          labels={labels}
          onEnabledChange={onEnabledChange}
          rule={row.original}
        />
      ),
      header: title('enabled'),
      id: 'enabled',
      meta: { label: title('enabled') },
      size: 100,
    },
  ]

  if (onRowAction && rowActions?.length) {
    columns.push({
      cell: ({ row }) => (
        <RowActionsCell
          actions={rowActions}
          labels={labels}
          onRowAction={onRowAction}
          rule={row.original}
        />
      ),
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      header: () => <span className="sr-only">{title('actions')}</span>,
      id: 'actions',
      meta: { align: 'end', label: title('actions') },
      size: 56,
    })
  }

  return columns
}
